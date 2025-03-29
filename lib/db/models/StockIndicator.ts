
// import mongoose from "mongoose";

// const stockIndicatorSchema = new mongoose.Schema({
//   stock_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Stock",
//     required: true,
//   },
//   growth_rating: {
//     type: String,
//     enum: ["High", "Medium", "Low"],
//     required: true,
//   },
//   momentum_score: {
//     type: String,
//     enum: ["High", "Medium", "Low"],
//     required: true,
//   },
//   risk_score: {
//     type: String,
//     enum: ["High", "Medium", "Low"],
//     required: true,
//   },
//   value_rating: {
//     type: String,
//     enum: ["High", "Medium", "Low"],
//     required: true,
//   },
//   volume: {
//     type: Number,
//   },
//   market_cap: {
//     type: Number,
//   },
//   pe_ratio: {
//     type: Number,
//   },
//   technical_signals: {
//     type: [String], // Example: ["Bullish", "Bearish", "Oversold", "Overbought"]
//     default: [],
//   },
//   support_levels: {
//     type: [Number], // Stores multiple support levels
//     default: [],
//   },
//   resistance_levels: {
//     type: [Number], // Stores multiple resistance levels
//     default: [],
//   },
//   last_updated: {
//     type: Date,
//     default: Date.now,
//   },
// });

// export const StockIndicator =
//   mongoose.models?.StockIndicator || mongoose.model("StockIndicator", stockIndicatorSchema);











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
  upside: {
    type: Number,
    default: 0
  },
  volume: {
    type: String, // Keeping as string to match API response
  },
  market_cap: {
    type: String, // Keeping as string to match API response
  },
  pe_ratio: {
    type: Number,
  },
  technical_signals: {
    overall: {
      type: String,
      enum: ['Bullish', 'Neutral', 'Bearish'],
      default: 'Neutral'
    },
    short_term: {
      type: String,
      enum: ['Bullish', 'Neutral', 'Bearish'],
      default: 'Neutral'
    },
    medium_term: {
      type: String,
      enum: ['Bullish', 'Neutral', 'Bearish'],
      default: 'Neutral'
    },
    long_term: {
      type: String,
      enum: ['Bullish', 'Neutral', 'Bearish'],
      default: 'Neutral'
    }
  },
  moving_averages: {
    sma_20: {
      type: Number,
      default: 0
    },
    sma_50: {
      type: Number,
      default: 0
    },
    sma_200: {
      type: Number,
      default: 0
    },
    ema_20: {
      type: Number,
      default: 0
    }
  },
  rsi_indicators: {
    rsi_14: {
      type: Number,
      default: 50
    },
    macd: {
      type: Number,
      default: 0
    },
    macd_signal: {
      type: Number,
      default: 0
    },
    macd_histogram: {
      type: Number,
      default: 0
    }
  },
  support_levels: {
    type: [Number],
    default: []
  },
  resistance_levels: {
    type: [Number],
    default: []
  },
  volume_analysis: {
    average_volume: {
      type: Number,
      default: 0
    },
    volume_change_percent: {
      type: Number,
      default: 0
    },
    chart_pattern: {
      type: String,
      default: ''
    }
  },
  recommendation: {
    type: String,
    enum: ['BUY', 'SELL', 'HOLD', 'MONITOR', 'TARGET'],
    default: 'HOLD'
  },
  last_updated: {
    type: Date,
    default: Date.now,
  },
});

export const StockIndicator =
  mongoose.models?.StockIndicator || mongoose.model("StockIndicator", stockIndicatorSchema);