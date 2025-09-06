import mongoose, { Schema, model, models } from "mongoose"

const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true }, // Clerk user ID
  email: { type: String }, // optional, if you want to save email
  conversations: [
    {
      type: Schema.Types.ObjectId,
      ref: "Conversation", // Reference to Conversation model
    },
  ],
  createdAt: { type: Date, default: Date.now },
})

const User = models.User || model("User", UserSchema)

export default User
