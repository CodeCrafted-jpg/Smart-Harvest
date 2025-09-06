import { Schema, model, models } from "mongoose"

const FormSubmissionSchema = new Schema({
  // Reference to User document (not Clerk ID)
  user: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },

  // Location details
  district: { type: String, required: true },
  block: { type: String, required: true },
  village: { type: String, required: true },

  // Farm details
  farmSize: { type: Number, required: true },
  soilType: { type: String, required: true },
  soilPh: { type: Number, required: true },
  nitrogen: { type: Number, required: true },
  phosphorus: { type: Number, required: true },
  potassium: { type: Number, required: true },
  organicMatter: { type: Number, required: true },

  // Preferences
  season: { type: String, required: true },
  cropType: { type: String, required: true },
  farmingExperience: { type: String, required: true },
  budgetRange: { type: String, required: true },
  irrigationSource: { type: String, required: true },
  
  // Optional fields
  previousCrop: { type: String },
  specificRequirements: { type: String },

  // Contact
  contactNumber: { type: String, required: true },
  preferredLanguage: { type: String, required: true },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true // This automatically manages createdAt and updatedAt
})

const FormSubmission = models.FormSubmission || model("FormSubmission", FormSubmissionSchema)
export default FormSubmission