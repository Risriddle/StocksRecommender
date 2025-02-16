import mongoose from "mongoose"

const stockPriceHistorySchema = new mongoose.Schema({
  stock_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stock",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
})

export const StockPriceHistory = mongoose.models?.StockPriceHistory || mongoose.model("StockPriceHistory", stockPriceHistorySchema)

