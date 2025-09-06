import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import FormSubmission from "@/models/FormSubmission";
import User from "@/models/User"; // Import your User model
import { currentUser } from "@clerk/nextjs/server"; // Use currentUser instead

export async function POST(req: Request) {
  console.log("📩 API /api/form hit");

  try {
    // Step 1: Get current user from Clerk
    console.log("🔄 Getting current user from Clerk...");
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      console.log("❌ No authenticated user found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    console.log("✅ Clerk user found:", clerkUser.id);

    // Step 2: Connect to database
    await dbConnect();
    console.log("✅ Database connected");

    // Step 3: Find or create user in your database
    let user = await User.findOne({ clerkId: clerkUser.id });
    
    if (!user) {
      console.log("🔄 Creating user in database...");
      user = await User.create({
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses?.[0]?.emailAddress,
        conversations: []
      });
      console.log("✅ User created:", user._id);
    } else {
      console.log("✅ Existing user found:", user._id);
    }

    // Step 4: Get form data
    const data = await req.json();
    console.log("📦 Incoming form data keys:", Object.keys(data));

    // Step 5: Create form submission with user ObjectId
    const newSubmission = await FormSubmission.create({
      ...data,
      user: user._id, // Use the MongoDB ObjectId, not Clerk ID
    });

    console.log("✅ Form submission saved:", newSubmission._id);

    return NextResponse.json({ 
      success: true, 
      submission: newSubmission,
      message: "Form submitted successfully"
    });

  } catch (err) {
    console.error("❌ Error in form API:", {
      message: err.message,
      stack: err.stack
    });
    
    return NextResponse.json({ 
      error: "Failed to save form",
      details: err.message 
    }, { status: 500 });
  }
}