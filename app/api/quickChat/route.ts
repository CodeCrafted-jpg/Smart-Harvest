// app/api/quick-chat/route.js
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import dbConnect from "@/config/db";
import QuickChat from "@/models/QuickChat";
import User from "@/models/User";

// Cohere AI Integration
import { CohereClient } from 'cohere-ai';

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

export async function POST(req: Request) {
  console.log("⚡ Quick Chat API hit");

  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { message, sessionId } = await req.json();

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    let quickChat;

    if (sessionId) {
      // Continue existing chat
      quickChat = await QuickChat.findOne({ sessionId, user: user._id });
      if (!quickChat) {
        return NextResponse.json({ error: "Chat session not found" }, { status: 404 });
      }
    } else {
      // Create new chat session
      quickChat = await QuickChat.create({
        user: user._id,
        messages: []
      });

      console.log("✅ New quick chat created:", quickChat.sessionId);
    }

    // Add user message
    const userMessage = {
      role: 'user',
      content: message,
      createdAt: new Date()
    };
    quickChat.messages.push(userMessage);

    // Generate title from first message if it's the default
    if (quickChat.messages.filter((msg: { role: string; }) => msg.role === 'user').length === 1) {
      quickChat.generateTitle();
    }

    // Generate AI response
    try {
      const conversationHistory = quickChat.messages.slice(-10).map((msg: { role: string; content: any; }) => ({
        role: msg.role === 'assistant' ? 'CHATBOT' : 'USER',
        message: msg.content
      }));

      const aiResponse = await cohere.chat({
        message: message,
        chatHistory: conversationHistory,
        model: 'command-r-plus',
        temperature: 0.7,
        maxTokens: 600,
        preamble: createQuickChatPreamble()
      });

      const assistantMessage = {
        role: 'assistant',
        content: aiResponse.text,
        createdAt: new Date()
      };

      quickChat.messages.push(assistantMessage);
    } catch (aiError) {
      console.error("AI Response Error:", aiError);
      const errorMessage = {
        role: 'assistant',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again or rephrase your question about farming and agriculture.",
        createdAt: new Date()
      };
      quickChat.messages.push(errorMessage);
    }

    await quickChat.save();

    return NextResponse.json({
      success: true,
      sessionId: quickChat.sessionId,
      title: quickChat.title,
      messages: quickChat.messages,
      lastActivity: quickChat.lastActivity
    });

  } catch (error) {
    console.error("Quick Chat API Error:", error);
    return NextResponse.json({ 
      error: "Failed to process quick chat",
      details: error.message 
    }, { status: 500 });
  }
}

// GET endpoint to retrieve chat sessions
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');
    const listSessions = searchParams.get('list') === 'true';

    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (listSessions) {
      // Return list of all user's quick chat sessions
      const sessions = await QuickChat.find({ user: user._id })
        .select('sessionId title createdAt lastActivity messages')
        .sort({ lastActivity: -1 })
        .limit(50);

      const sessionsWithMeta = sessions.map(session => ({
        sessionId: session.sessionId,
        title: session.title,
        createdAt: session.createdAt,
        lastActivity: session.lastActivity,
        messageCount: session.messages.length,
        lastMessage: session.messages.length > 0 ? {
          role: session.messages[session.messages.length - 1].role,
          content: session.messages[session.messages.length - 1].content.substring(0, 100) + 
                  (session.messages[session.messages.length - 1].content.length > 100 ? '...' : ''),
          createdAt: session.messages[session.messages.length - 1].createdAt
        } : null
      }));

      return NextResponse.json({
        success: true,
        sessions: sessionsWithMeta,
        total: sessionsWithMeta.length
      });
    }

    if (sessionId) {
      // Return specific session
      const quickChat = await QuickChat.findOne({ sessionId, user: user._id });
      
      if (!quickChat) {
        return NextResponse.json({ error: "Chat session not found" }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        sessionId: quickChat.sessionId,
        title: quickChat.title,
        messages: quickChat.messages,
        createdAt: quickChat.createdAt,
        lastActivity: quickChat.lastActivity
      });
    }

    return NextResponse.json({ error: "Session ID or list parameter required" }, { status: 400 });

  } catch (error) {
    console.error("Get Quick Chat Error:", error);
    return NextResponse.json({ error: "Failed to retrieve chat" }, { status: 500 });
  }
}

// DELETE endpoint to delete a chat session
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const deletedChat = await QuickChat.findOneAndDelete({ 
      sessionId, 
      user: user._id 
    });

    if (!deletedChat) {
      return NextResponse.json({ error: "Chat session not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Chat session deleted successfully"
    });

  } catch (error) {
    console.error("Delete Quick Chat Error:", error);
    return NextResponse.json({ error: "Failed to delete chat" }, { status: 500 });
  }
}

function createQuickChatPreamble(): string {
  return `You are Smart-Harvest AI, a friendly and knowledgeable agricultural assistant specializing in farming practices in India, with particular expertise in Jharkhand region. You provide quick, helpful answers to farming questions.

Key characteristics:
- Friendly, conversational tone like ChatGPT
- Provide practical, actionable advice
- Focus on Indian farming conditions, especially Jharkhand
- Cover all aspects of agriculture: crops, soil, weather, pests, market prices, etc.
- Give specific recommendations when possible
- Always encourage consulting local agricultural experts for critical decisions
- Keep responses concise but informative
- Use simple language that farmers can understand
- Include traditional knowledge alongside modern techniques

Topics you excel at:
- Crop selection and rotation
- Soil health and nutrient management
- Pest and disease identification and control
- Weather-based farming advice
- Irrigation and water management
- Organic farming practices
- Market insights and crop economics
- Seasonal farming calendars
- Seed varieties and planting techniques
- Post-harvest processing and storage

Always be helpful, encouraging, and supportive of farmers' goals while providing accurate, science-based information.`;
}