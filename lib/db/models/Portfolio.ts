import mongoose from "mongoose"

const portfolioSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  riskLevel:{
    type:String,
    default:"medium"
    
  },
  description:{
    type:String,
    default:"no description provided"
  },
   portfolioReturn:{
     type:Number,
     default:0
   },
  created_at: {
    type: Date,
    default: Date.now,
  },
})


export const Portfolio = mongoose.models?.Portfolio || mongoose.model("Portfolio", portfolioSchema)
