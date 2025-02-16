import mongoose from "mongoose"

const recommendationSchema = new mongoose.Schema({
  stock_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stock",
    required: true,
  },
  recommendation: {
    type: String,
    enum: ["BUY", "HOLD", "SELL", "MONITOR", "TARGET"],
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  date_recommended: {
    type: Date,
    default: Date.now,
  },
})



export const Recommendation = mongoose.models?.Recommendation || mongoose.model("Recommendation", recommendationSchema)
