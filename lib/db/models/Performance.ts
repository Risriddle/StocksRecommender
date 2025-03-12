import mongoose from "mongoose";

const StockPerformanceSchema = new mongoose.Schema({
  stockId: { type: mongoose.Schema.Types.ObjectId, ref: "Stock", required: true },
  oneMonthReturn: { type: Number, required: true },
  threeMonthReturn: { type: Number, required: true },
  sixMonthReturn: { type: Number, required: true },
  oneYearReturn: { type: Number, required: true },
  rating: { type: String, enum: ["Buy", "Hold", "Sell","Target","Monitor"], required: true },
  industryType: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.StockPerformance || mongoose.model("StockPerformance", StockPerformanceSchema);
