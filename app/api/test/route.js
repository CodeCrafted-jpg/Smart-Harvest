import { NextResponse } from "next/server"
import connectDB from "@/config/db.js"
import User from "@/models/User"

export async function GET() {
  console.log("🧪 Testing database connection...");
  
  try {
    await connectDB();
    console.log("✅ Database connected");

    // Test: Count existing users
    const userCount = await User.countDocuments();
    console.log("📊 Current user count:", userCount);

    // Test: Create a dummy user
    const testUser = {
      clerkId: `test_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      firstName: "Test",
      lastName: "User"
    };

    console.log("🔄 Creating test user:", testUser);
    const createdUser = await User.create(testUser);
    console.log("✅ Test user created:", createdUser);

    // Test: Count users after creation
    const newUserCount = await User.countDocuments();
    console.log("📊 User count after test creation:", newUserCount);

    // Test: Find the created user
    const foundUser = await User.findOne({ clerkId: testUser.clerkId });
    console.log("🔍 Found test user:", !!foundUser);

    // Clean up: Delete the test user
    await User.deleteOne({ clerkId: testUser.clerkId });
    console.log("🧹 Test user deleted");

    const finalUserCount = await User.countDocuments();
    console.log("📊 Final user count:", finalUserCount);

    return NextResponse.json({
      success: true,
      initialCount: userCount,
      finalCount: finalUserCount,
      testPassed: true
    });

  } catch (error) {
    console.error("❌ Database test failed:", error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}