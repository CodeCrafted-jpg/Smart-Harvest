import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import connectDB from "@/config/db.js"
import User from "@/models/User"

export async function POST() {
  console.log("🔥 User API route hit at:", new Date().toISOString());
  
  try {
    // Step 1: Connect to database
    console.log("🔄 Step 1: Connecting to database...");
    await connectDB()
    console.log("✅ Step 1: Database connected");

    // Step 2: Get current user from Clerk
    console.log("🔄 Step 2: Getting current user from Clerk...");
    const clerkUser = await currentUser()
    
    if (!clerkUser) {
      console.log("❌ Step 2: No authenticated user found");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    
    console.log("✅ Step 2: Clerk user data:", {
      id: clerkUser.id,
      email: clerkUser.emailAddresses?.[0]?.emailAddress,
      emailCount: clerkUser.emailAddresses?.length,
      hasEmailAddresses: !!clerkUser.emailAddresses
    });

    // Step 3: Check current user count
    const beforeCount = await User.countDocuments();
    console.log("📊 Step 3: Users in DB before operation:", beforeCount);

    // Step 4: Check if user exists
    console.log("🔄 Step 4: Checking if user exists...");
    let existingUser = await User.findOne({ clerkId: clerkUser.id });
    
    if (existingUser) {
      console.log("✅ Step 4: User already exists:", {
        id: existingUser._id,
        clerkId: existingUser.clerkId,
        email: existingUser.email
      });
      
      return NextResponse.json({ 
        success: true,
        message: "User already exists",
        user: existingUser
      }, { status: 200 });
    }

    // Step 5: Create new user
    console.log("🔄 Step 5: Creating new user...");
    
    const userData = {
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses?.[0]?.emailAddress || null,
      conversations: [] // Match your schema
    };
    
    console.log("📝 Step 5: User data to save:", userData);

    // Validate data before saving
    if (!userData.clerkId) {
      throw new Error("ClerkId is required but missing");
    }

    try {
      const newUser = await User.create(userData);
      console.log("✅ Step 5: User created successfully:", {
        id: newUser._id,
        clerkId: newUser.clerkId,
        email: newUser.email,
        conversations: newUser.conversations
      });

      // Step 6: Verify creation
      const afterCount = await User.countDocuments();
      console.log("📊 Step 6: Users in DB after creation:", afterCount);
      
      const verifyUser = await User.findById(newUser._id);
      console.log("🔍 Step 6: Verification - can find created user:", !!verifyUser);

      return NextResponse.json({ 
        success: true,
        message: "User created successfully",
        user: newUser,
        dbCount: afterCount
      }, { status: 200 });

    } catch (createError) {
      console.error("❌ Step 5: Mongoose creation error:", {
        message: createError.message,
        code: createError.code,
        keyPattern: createError.keyPattern,
        keyValue: createError.keyValue
      });
      
      // Check if it's a duplicate key error
      if (createError.code === 11000) {
        console.log("🔄 Duplicate key error - checking if user was created by another request...");
        const existingUser = await User.findOne({ clerkId: clerkUser.id });
        if (existingUser) {
          return NextResponse.json({ 
            success: true,
            message: "User already exists (race condition)",
            user: existingUser
          }, { status: 200 });
        }
      }
      
      throw createError;
    }

  } catch (err) {
    console.error("❌ API Route Fatal Error:", {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    
    return NextResponse.json({ 
      error: "Server error",
      details: err.message 
    }, { status: 500 })
  }
}