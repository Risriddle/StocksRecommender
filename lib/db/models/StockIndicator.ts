import mongoose from "mongoose"

const stockIndicatorSchema = new mongoose.Schema({
  stock_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stock",
    required: true,
  },
  growth_rating: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  momentum_score: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  risk_score: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  value_rating: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  last_updated: {
    type: Date,
    default: Date.now,
  },
})


export const StockIndicator = mongoose.models?.StockIndicator || mongoose.model("StockIndicator", stockIndicatorSchema)

