import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import dbConnect from "@/config/db";
import Conversation from "@/models/Conversation";
import User from "@/models/User";
import "@/models/FormSubmission"; // ⬅️ register schema before populate

export async function GET(req: Request) {
  try {
    console.log("📩 Conversations API hit");

    const clerkUser = await currentUser();
    console.log("🔑 Clerk user:", clerkUser?.id);
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("🔗 Connecting to MongoDB...");
    await dbConnect();

    const user = await User.findOne({ clerkId: clerkUser.id });
    console.log("👤 Mongo user found:", user?._id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("💬 Fetching conversations for user:", user._id);
    const conversations = await Conversation.find({ user: user._id })
      .populate({
        path: "submission",
        select:
          "village block district farmSize soilType season cropType",
      })
      .sort({ createdAt: -1 })
      .exec();

    console.log("✅ Conversations fetched:", conversations.length);

    return NextResponse.json({
      success: true,
      conversations,
      total: conversations.length,
    });
  } catch (error: any) {
    console.error("❌ Fetch Conversations Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch conversations",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
