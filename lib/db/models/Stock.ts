import mongoose from "mongoose"

const stockSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  company:{
    type: String,
    required: true,
  },
  country:{
    type: String,
    required: true
  },
  exchange: {
    type: String,
    required: true,
  },
  currency:{
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  current_price: {
    type: Number,
    required: true,
  },
  added_date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["BUY", "HOLD", "SELL", "MONITOR", "TARGET"],
    required: true,
  },
  
})



export const Stock = mongoose.models?.Stock || mongoose.model("Stock", stockSchema)

