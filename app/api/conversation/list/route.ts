// app/api/conversations/route.ts
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import dbConnect from "@/config/db";
import Conversation from "@/models/Conversation";
import User from "@/models/User";
import "@/models/FormSubmission";

export async function GET(req: Request) {
  try {
    console.log("📩 Conversations API hit");
    const clerkUser = await currentUser();
    console.log("🔑 Clerk user:", clerkUser?.id);

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ clerkId: clerkUser.id });
    console.log("👤 Mongo user found:", user?._id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const submissionFilter = searchParams.get("submissionId") || null;
    console.log("📌 submission filter:", submissionFilter);

    const query: any = { user: user._id };
    if (submissionFilter) query.submission = submissionFilter;

    // fetch newest first (so our first-seen per submission is the latest)
    const raw = await Conversation.find(query)
      .select("_id user submission createdAt messages")
      .populate({
        path: "submission",
        select: "village block district farmSize soilType season cropType",
      })
      .sort({ createdAt: -1 })
      .lean();

    console.log("📦 raw conversations fetched:", raw.length);

    // keep only the first (latest) conversation per submission
    const seen = new Set<string>();
    const unique = [];
    for (const c of raw) {
      const subId =
        (c.submission?._id?.toString?.() || c.submission?.toString?.() || "null");
      if (seen.has(subId)) continue;
      seen.add(subId);

      const messageCount = Array.isArray(c.messages) ? c.messages.length : 0;
      const last = messageCount ? c.messages[messageCount - 1] : null;

      unique.push({
        _id: c._id,
        submission: c.submission || null,
        createdAt: c.createdAt,
        messageCount,
        lastMessage: last
          ? {
              role: last.role,
              content:
                last.content.slice(0, 120) +
                (last.content.length > 120 ? "…" : ""),
              createdAt: last.createdAt,
            }
          : null,
      });
    }

    console.log("✅ unique-by-submission:", unique.length);

    return NextResponse.json({
      success: true,
      conversations: unique,
      total: unique.length,
    });
  } catch (error: any) {
    console.error("❌ Fetch Conversations Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations", details: error.message },
      { status: 500 }
    );
  }
}
