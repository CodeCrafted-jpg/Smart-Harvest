import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import dbConnect from "@/config/db";
import Conversation from "@/models/Conversation";
import FormSubmission from "@/models/FormSubmission";
import User from "@/models/User";

// Cohere AI Integration
import { CohereClient } from 'cohere-ai';

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

export async function POST(req: Request) {
  console.log("💬 Conversation API hit");

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

    const { submissionId, message, conversationId } = await req.json();

    let conversation;

    if (conversationId) {
      // Continue existing conversation by conversationId
      conversation = await Conversation.findById(conversationId);
      if (!conversation || conversation.user.toString() !== user._id.toString()) {
        return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
      }
    } else if (submissionId) {
      // Try to find existing conversation by submissionId
      conversation = await Conversation.findOne({ 
        submission: submissionId, 
        user: user._id 
      });

      if (!conversation) {
        // Create new conversation linked to submission
        conversation = await Conversation.create({
          user: user._id,
          submission: submissionId,
          messages: []
        });

        console.log("✅ New conversation created:", conversation._id);

        // Update user's conversations array
        await User.findByIdAndUpdate(
          user._id,
          { $push: { conversations: conversation._id } },
          { new: true }
        );

        // Get form submission data for context
        const formData = await FormSubmission.findById(submissionId);
        if (!formData) {
          return NextResponse.json({ error: "Form submission not found" }, { status: 404 });
        }

        // Create initial AI message
        const initialPrompt = createInitialPrompt(formData);
        
        try {
          const initialResponse = await cohere.chat({
            message: initialPrompt,
            model: 'command-r-plus',
            temperature: 0.7,
            maxTokens: 500,
          });

          const initialMessage = {
            role: 'assistant',
            content: initialResponse.text,
            createdAt: new Date()
          };

          conversation.messages.push(initialMessage);
          await conversation.save();
        } catch (aiError) {
          console.error("AI Error:", aiError);
          const fallbackMessage = {
            role: 'assistant',
            content: createFallbackMessage(formData),
            createdAt: new Date()
          };
          conversation.messages.push(fallbackMessage);
          await conversation.save();
        }
      } else {
        console.log("📞 Found existing conversation:", conversation._id);
      }
    } else {
      return NextResponse.json({ error: "Either conversationId or submissionId is required" }, { status: 400 });
    }

    // Add user message if provided
    if (message) {
      const userMessage = {
        role: 'user',
        content: message,
        createdAt: new Date()
      };
      conversation.messages.push(userMessage);

      // Generate AI response
      try {
        const conversationHistory = conversation.messages.map(msg => ({
          role: msg.role === 'assistant' ? 'CHATBOT' : 'USER',
          message: msg.content
        }));

        const aiResponse = await cohere.chat({
          message: message,
          chatHistory: conversationHistory.slice(-10),
          model: 'command-r-plus',
          temperature: 0.7,
          maxTokens: 500,
          preamble: createAgriculturalPreamble()
        });

        const assistantMessage = {
          role: 'assistant',
          content: aiResponse.text,
          createdAt: new Date()
        };

        conversation.messages.push(assistantMessage);
      } catch (aiError) {
        console.error("AI Response Error:", aiError);
        const errorMessage = {
          role: 'assistant',
          content: "I apologize, but I'm having trouble processing your request right now. Please try again or rephrase your question about farming and agriculture.",
          createdAt: new Date()
        };
        conversation.messages.push(errorMessage);
      }

      await conversation.save();
    }

    return NextResponse.json({
      success: true,
      conversation: conversation,
      messages: conversation.messages,
      conversationId: conversation._id // Return the actual conversation ID
    });

  } catch (error) {
    console.error("Conversation API Error:", error);
    return NextResponse.json({ 
      error: "Failed to process conversation",
      details: error.message 
    }, { status: 500 });
  }
}

// GET endpoint - Updated to find by submissionId
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('id');
    const submissionId = searchParams.get('submissionId');

    if (!conversationId && !submissionId) {
      return NextResponse.json({ error: "Conversation ID or Submission ID required" }, { status: 400 });
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

    let conversation;

    if (conversationId) {
      // Find by conversation ID
      conversation = await Conversation.findById(conversationId)
        .populate('submission');
    } else if (submissionId) {
      // Find by submission ID
      conversation = await Conversation.findOne({ 
        submission: submissionId, 
        user: user._id 
      })
      .populate('submission');
    }

    if (!conversation || conversation.user.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      conversation,
      messages: conversation.messages,
      conversationId: conversation._id
    });

  } catch (error) {
    console.error("Get Conversation Error:", error);
    return NextResponse.json({ error: "Failed to retrieve conversation" }, { status: 500 });
  }
}

// Helper functions remain the same...
function createInitialPrompt(formData: any): string {
  return `Welcome! I'm Smart-Harvest AI, your agricultural companion for Jharkhand. I've reviewed your farm details and I'm ready to provide personalized recommendations.

Here's what I know about your farm:
- Location: ${formData.village}, ${formData.block}, ${formData.district}
- Farm Size: ${formData.farmSize} acres
- Soil Type: ${formData.soilType} with pH ${formData.soilPh}
- Nutrients: N-${formData.nitrogen}, P-${formData.phosphorus}, K-${formData.potassium} kg/ha
- Season: ${formData.season}
- Preferred Crops: ${formData.cropType}
- Experience Level: ${formData.farmingExperience}
- Budget: ${formData.budgetRange}
- Irrigation: ${formData.irrigationSource}

Based on this information, provide initial crop recommendations and farming advice specific to Jharkhand's climate and soil conditions.`;
}

function createFallbackMessage(formData: any): string {
  return `Namaste! Welcome to Smart-Harvest AI. I've reviewed your farm details from ${formData.village}, ${formData.district}. 

Based on your ${formData.soilType} soil with pH ${formData.soilPh} and your preference for ${formData.cropType}, I'm here to help you make the best farming decisions for the ${formData.season} season.

I can assist you with:
- Crop recommendations for your ${formData.farmSize} acre farm
- Soil nutrient management (your current N-P-K levels: ${formData.nitrogen}-${formData.phosphorus}-${formData.potassium})
- Pest and disease management
- Weather-based farming advice
- Local market insights

What specific farming question can I help you with today?`;
}

function createAgriculturalPreamble(): string {
  return `You are Smart-Harvest AI, an expert agricultural assistant specializing in farming practices in Jharkhand, India. You provide practical, science-based advice on:

- Crop selection and rotation
- Soil health and nutrient management
- Pest and disease control
- Weather-based farming decisions
- Irrigation and water management
- Organic and sustainable farming practices
- Local market conditions and crop economics

Always consider:
- Local climate conditions in Jharkhand
- Monsoon patterns and seasonal variations
- Soil types common in the region
- Traditional farming practices combined with modern techniques
- Budget constraints and practical implementation
- Sustainable and environmentally friendly approaches

Provide specific, actionable advice. Use simple language and include local context when possible. Always emphasize consulting with local agricultural experts for critical decisions.`;
}