import { Schema, model, models } from "mongoose"

const QuickChatSchema = new Schema({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  sessionId: {
    type: String,
    required: true,
    unique: true,
    default: () => `quick_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  },
  title: {
    type: String,
    default: "Quick Chat Session"
  },
  messages: [
    {
      role: { 
        type: String, 
        enum: ["user", "assistant"], 
        required: true 
      },
      content: { 
        type: String, 
        required: true 
      },
      createdAt: { 
        type: Date, 
        default: Date.now 
      },
    },
  ],
  isActive: {
    type: Boolean,
    default: true
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
})

// Update lastActivity on every save
QuickChatSchema.pre('save', function(next) {
  this.lastActivity = new Date();
  next();
});

// Auto-generate title from first user message
QuickChatSchema.methods.generateTitle = function() {
  const firstUserMessage = this.messages.find(msg => msg.role === 'user');
  if (firstUserMessage) {
    const words = firstUserMessage.content.split(' ').slice(0, 6);
    this.title = words.join(' ') + (firstUserMessage.content.split(' ').length > 6 ? '...' : '');
  }
  return this.title;
};

// Index for better performance
QuickChatSchema.index({ user: 1, createdAt: -1 });
QuickChatSchema.index({ sessionId: 1 });
QuickChatSchema.index({ user: 1, isActive: 1 });

const QuickChat = models.QuickChat || model("QuickChat", QuickChatSchema)
export default QuickChat