import mongoose from "mongoose";


const stockIndicatorSchema = new mongoose.Schema({
  stock_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stock",
    required: true,
  },
  growth_rating: {
    type: String,
    enum: ["High", "Medium", "Low"],
    required: true,
  },
  momentum_score: {
    type: String,
    enum: ["High", "Medium", "Low"],
    required: true,
  },
  risk_score: {
    type: String,
    enum: ["High", "Medium", "Low"],
    required: true,
  },
  value_rating: {
    type: String,
    enum: ["High", "Medium", "Low"],
    required: true,
  },
  last_updated: {
    type: Date,
    default: Date.now,
  },
});

export const StockIndicator =
  mongoose.models?.StockIndicator || mongoose.model("StockIndicator", stockIndicatorSchema);
