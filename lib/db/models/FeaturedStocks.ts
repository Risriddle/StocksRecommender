import mongoose from 'mongoose';
import {Stock} from "./Stock"

const FeaturedStockSchema = new mongoose.Schema({
    stock: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },
    aiScore: { type: Number, default: 0 },
    technicalSignal: { type: String, default: 'Neutral' },
    priceChange: { type: Number, default: 0 },
    changePercent: { type: Number, default: 0 },
    priceTrend: [{ type: Number, default: [] }],
    aiInsight: { type: String, default: '' },
    analystConsensus: {
      rating: { type: String, default: 'Neutral' },
      count: { type: Number, default: 0 }
    },
    undervalued:{type:Boolean},
    revenueGrowth: { type: Number, default: 0 },
    profitMargin: { type: Number, default: 0 },
    priceTarget: { type: Number, default: 0 },
    categories: [{ type: String, default: [] }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  
  export const FeaturedStocks = mongoose.models.FeaturedStock || mongoose.model('FeaturedStock', FeaturedStockSchema);
  