import mongoose from "mongoose";

const returnsSchema = new mongoose.Schema({
  stock_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stock",
    required: true,
    unique: true, // Ensure one record per stock
  },
  latestPrice: {
    type: Number,
    required: true,
  },
  oneWeekReturn: Number,
  oneMonthReturn: Number,
  threeMonthReturn: Number,
  sixMonthReturn: Number,
  returnSinceAdded: Number,
  returnSinceBuy: Number,
  realizedReturn: Number,
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

export const Returns = mongoose.models?.Returns || mongoose.model("Returns", returnsSchema);
