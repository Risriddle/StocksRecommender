import mongoose from "mongoose"

const portfolioStockSchema = new mongoose.Schema({
  portfolio_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Portfolio",
    required: true,
  },
  stock_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stock",
    required: true,
  },
  name:{
    type:String
  },
  added_price: {
    type: Number,
    required: true,
  },
  added_date: {
    type: Date,
    default: Date.now,
  },
  returnSinceAdded:{
    type:Number,
    default:0
  }
})

export const PortfolioStock = mongoose.models?.PortfolioStock || mongoose.model("PortfolioStock", portfolioStockSchema)
