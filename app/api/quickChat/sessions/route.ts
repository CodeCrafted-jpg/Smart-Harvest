// app/api/quick-chat/sessions/route.js
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import dbConnect from "@/config/db";
import QuickChat from "@/models/QuickChat";
import User from "@/models/User";

// GET - Retrieve user's quick chat sessions with pagination
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const active = searchParams.get('active') === 'true';

    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const query = { user: user._id };
    if (active) {
      query.isActive = true;
    }

    const skip = (page - 1) * limit;

    const sessions = await QuickChat.find(query)
      .select('sessionId title createdAt lastActivity isActive messages')
      .sort({ lastActivity: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await QuickChat.countDocuments(query);

    const sessionsWithMeta = sessions.map(session => ({
      sessionId: session.sessionId,
      title: session.title,
      createdAt: session.createdAt,
      lastActivity: session.lastActivity,
      isActive: session.isActive,
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
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error("Get Sessions Error:", error);
    return NextResponse.json({ 
      error: "Failed to retrieve sessions",
      details: error.message 
    }, { status: 500 });
  }
}

// PATCH - Update session (rename, archive, etc.)
export async function PATCH(req: Request) {
  try {
    const { sessionId, title, isActive } = await req.json();

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

    const updateData = {};
    if (title) updateData.title = title;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;

    const updatedSession = await QuickChat.findOneAndUpdate(
      { sessionId, user: user._id },
      updateData,
      { new: true, select: 'sessionId title isActive lastActivity' }
    );

    if (!updatedSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      session: updatedSession
    });

  } catch (error) {
    console.error("Update Session Error:", error);
    return NextResponse.json({ 
      error: "Failed to update session",
      details: error.message 
    }, { status: 500 });
  }
}

// DELETE - Bulk delete sessions
export async function DELETE(req: Request) {
  try {
    const { sessionIds } = await req.json();

    if (!sessionIds || !Array.isArray(sessionIds) || sessionIds.length === 0) {
      return NextResponse.json({ error: "Session IDs array required" }, { status: 400 });
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

    const result = await QuickChat.deleteMany({
      sessionId: { $in: sessionIds },
      user: user._id
    });

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} sessions`,
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error("Bulk Delete Sessions Error:", error);
    return NextResponse.json({ 
      error: "Failed to delete sessions",
      details: error.message 
    }, { status: 500 });
  }
}