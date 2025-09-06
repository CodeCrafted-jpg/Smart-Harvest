import { Schema, model, models } from "mongoose"

const ConversationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  submission: { type: Schema.Types.ObjectId, ref: "FormSubmission" }, // linked form submission

  messages: [
    {
      role: { type: String, enum: ["user", "assistant"], required: true },
      content: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],

  createdAt: { type: Date, default: Date.now },
})

const Conversation = models.Conversation || model("Conversation", ConversationSchema)
export default Conversation
