

import { StockIndicator } from "@/lib/db/models/StockIndicator";
import { Recommendation } from "@/lib/db/models/Recommendation";
import dbConnect from "@/lib/db/connect";
import axios from "axios";
import { Stock } from "@/lib/db/models/Stock";

const API_BASE_URL = "http://13.126.252.191";

type Rating = "High" | "Medium" | "Low";
type Grade = "A" | "B" | "C" | "D" | "F";



interface StockAPIResponse {
  ["P/E (TTM)"]?: number;
  ["EPS (TTM)"]?: number;
  ["Market Cap"]?: string;
  ["Average Volume"]?: string;
  ["Previous Close"]?: string;
  ["Shares Outstanding"]?: string;
  ["Ex-Dividend Date"]?: string;
  ["Fwd Dividend (% Yield)"]?: string;
  avg_price_target?: string;
  growth?: Grade;
  highest_price_target?: string;
  insdustry?: string;
  lowest_price_target?: string;
  momentum?: Grade;
  upside_to_avg_price_target?: string;
  value?: Grade;
  vgm?: string;
}

interface StockScores {
  growth_rating: Rating;
  momentum_score: Rating;
  value_rating: Rating;
  risk_score: Rating;
  upside: number;
}

interface StockRecommendation {
  rec: 'BUY' | 'HOLD' | 'SELL' | 'MONITOR' | 'TARGET';
  reason: string;
}

const getRatingCategory = (score: number): Rating => {
  if (score >= 7) return "High";
  if (score >= 4) return "Medium";
  return "Low";
};

// Extend StockIndicator interface to include technical analysis details
interface ExtendedStockIndicator {
  // Existing fields
  // stock_id: string;
  growth_rating: Rating;
  momentum_score: Rating;
  value_rating: Rating;
  risk_score: Rating;
  upside: number;
  market_cap:string;
  volume:string;
  pe_ratio:number;
  last_updated:Date;
  recommendation:string

  // New technical analysis fields
  technical_signals: {
    overall: 'Bullish' | 'Neutral' | 'Bearish';
    short_term: 'Bullish' | 'Neutral' | 'Bearish';
    medium_term: 'Bullish' | 'Neutral' | 'Bearish';
    long_term: 'Bullish' | 'Neutral' | 'Bearish';
  };
  moving_averages: {
    sma_20: number;
    sma_50: number;
    sma_200: number;
    ema_20: number;
  };
  rsi_indicators: {
    rsi_14: number;
    macd: number;
    macd_signal: number;
    macd_histogram: number;
  };
  support_levels: number[];
  resistance_levels: number[];
  volume_analysis: {
    average_volume: number;
    volume_change_percent: number;
    chart_pattern?: string;
  };
}

const gradeToScore = (grade: Grade | undefined): number => {
  const scores: { [key in Grade]: number } = {
    'A': 9,
    'B': 7,
    'C': 5,
    'D': 3,
    'F': 1
  };
  return grade ? scores[grade] : 5;
};

const parseNumericValue = (value: string | undefined, defaultValue: number): number => {
  if (!value) return defaultValue;
  
  try {
    const cleanValue = value.replace(/[%$B]/g, '');
    const parsed = parseFloat(cleanValue);
    return isNaN(parsed) ? defaultValue : parsed;
  } catch {
    return defaultValue;
  }
};

 const calculateScore = (data: StockAPIResponse): StockScores => {
    try {
      const peRatio = data["P/E (TTM)"]
      const eps = data["EPS (TTM)"]
      const upside = parseNumericValue(data["upside_to_avg_price_target"], 0);
      const lowestTarget = parseNumericValue(data["lowest_price_target"], 0);
  
      // Risk calculation
      const baseRisk = lowestTarget < 0 ? 8 : 4;
      const additionalRisk = upside < 0 ? 2 : 0;
      const totalRisk = baseRisk + additionalRisk;
  
      // Value calculation
      const valueScore = Math.min(10, Math.max(1, (eps * 10) / peRatio + (data.value === "A" ? 2 : 0)));
  
      return {
        growth_rating: getRatingCategory(gradeToScore(data.growth)),
        momentum_score: getRatingCategory(gradeToScore(data.momentum)),
        value_rating: getRatingCategory(valueScore),
        risk_score: getRatingCategory(totalRisk),
        upside
        
      };
    } catch (error) {
      console.error("Error calculating scores:", error);
      // Return default conservative scores
      return {
        growth_rating: "Medium",
        momentum_score: "Medium",
        value_rating: "Medium",
        risk_score: "High",
        upside: 0
      };
    }
  };
  
  const determineRecommendation = (scores: StockScores): StockRecommendation => {
    const { growth_rating, momentum_score, risk_score, upside } = scores;
  
    // BUY criteria
    if (growth_rating === "High" && momentum_score !== "Low" && risk_score !== "High") {
      return {
        rec: "BUY",
        reason: "Strong growth, good momentum, and acceptable risk"
      };
    }
  
    // SELL criteria
    if (momentum_score === "Low" && risk_score === "High") {
      return {
        rec: "SELL",
        reason: "Weak momentum and high risk"
      };
    }
  
    // MONITOR criteria
    if (growth_rating !== "Low" && momentum_score === "Low") {
      return {
        rec: "MONITOR",
        reason: "Good fundamentals but weak momentum"
      };
    }
  
    // TARGET criteria
    if (Math.abs(upside) < 5) {
      return {
        rec: "TARGET",
        reason: "Stock is close to its target price"
      };
    }
  
    // HOLD criteria
    if (growth_rating === "Medium" || risk_score === "High") {
      return {
        rec: "HOLD",
        reason: "Medium growth or high risk"
      };
    }
  
    // Default HOLD
    return {
      rec: "HOLD",
      reason: "No strong indicators; reassess in the near future"
    };
  };
  

// Extend the updateNewStock function to capture these details
export async function updateNewStock(stockId: string): Promise<boolean> {
  try {
    await dbConnect();

    const stock = await Stock.findById(stockId);
    if (!stock) {
      console.error(`Stock with ID ${stockId} not found`);
      return false;
    }

    let stockData: StockAPIResponse & {
      technical_signals?: {
        overall: 'Bullish' | 'Neutral' | 'Bearish';
        short_term: 'Bullish' | 'Neutral' | 'Bearish';
        medium_term: 'Bullish' | 'Neutral' | 'Bearish';
        long_term: 'Bullish' | 'Neutral' | 'Bearish';
      };
      moving_averages?: {
        sma_20: number;
        sma_50: number;
        sma_200: number;
        ema_20: number;
      };
      rsi_indicators?: {
        rsi_14: number;
        macd: number;
        macd_signal: number;
        macd_histogram: number;
      };
      support_levels?: number[];
      resistance_levels?: number[];
      volume_analysis?: {
        average_volume: number;
        volume_change_percent: number;
        chart_pattern?: string;
      };
    };

    try {
      const response = await axios.get<typeof stockData>(`${API_BASE_URL}?stock=${stock.name}`, { timeout: 30000 });
      console.log("FULL API RESPONSE:", JSON.stringify(response.data));
      stockData = response.data;
      
      if (!stockData || typeof stockData !== 'object') {
        throw new Error('Invalid API response format');
      }
    } catch (apiError) {
      console.error(`API request failed for ${stock.name}:`, apiError);
      return false;
    }

    const scores = calculateScore(stockData);
    const recommendation = determineRecommendation(scores);

    try {
      // Prepare technical analysis data
      const technicalIndicators: ExtendedStockIndicator = {
        ...scores,
        technical_signals: {
          overall: stockData.technical_signals?.overall || 'Neutral',
          short_term: stockData.technical_signals?.short_term || 'Neutral',
          medium_term: stockData.technical_signals?.medium_term || 'Neutral',
          long_term: stockData.technical_signals?.long_term || 'Neutral'
        },
        moving_averages: {
          sma_20: stockData.moving_averages?.sma_20 || parseNumericValue(stockData["Previous Close"], 0),
          sma_50: stockData.moving_averages?.sma_50 || parseNumericValue(stockData["Previous Close"], 0),
          sma_200: stockData.moving_averages?.sma_200 || parseNumericValue(stockData["Previous Close"], 0),
          ema_20: stockData.moving_averages?.ema_20 || parseNumericValue(stockData["Previous Close"], 0)
        },
        rsi_indicators: {
          rsi_14: stockData.rsi_indicators?.rsi_14 || 50,
          macd: stockData.rsi_indicators?.macd || 1.05,
          macd_signal: stockData.rsi_indicators?.macd_signal || 0.75,
          macd_histogram: stockData.rsi_indicators?.macd_histogram || 0.30
        },
        support_levels: stockData.support_levels || [
          parseNumericValue(stockData["Previous Close"], 0) * 0.95,
          parseNumericValue(stockData["Previous Close"], 0) * 0.90
        ],
        resistance_levels: stockData.resistance_levels || [
          parseNumericValue(stockData["Previous Close"], 0) * 1.05,
          parseNumericValue(stockData["Previous Close"], 0) * 1.10
        ],
        volume_analysis: {
          average_volume: parseNumericValue(stockData["Average Volume"], 0),
          volume_change_percent: 7.0,
          chart_pattern: stockData.volume_analysis?.chart_pattern || 'Bull Flag'
        },
        market_cap: stockData["Market Cap"],
        volume: stockData["Average Volume"],
        pe_ratio: stockData["P/E (TTM)"],
        last_updated: new Date(),
        recommendation: recommendation.rec
      };

      // Update or insert StockIndicator with extended technical details
      await StockIndicator.findOneAndUpdate(
        { stock_id: stock._id },
        technicalIndicators,
        { upsert: true, new: true }
      );

      // Rest of the existing code remains the same...
      await Recommendation.create({
        stock_id: stock._id,
        recommendation: recommendation.rec,
        reason: recommendation.reason,
        createdAt: new Date(),
      });

      // Keep only the last 4 weeks of recommendations
      const fourWeeksAgo = new Date();
      fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

      const recCount = await Recommendation.countDocuments({ stock_id: stock._id });

      if (recCount > 4) {
        await Recommendation.deleteMany({
          stock_id: stock._id,
          createdAt: { $lt: fourWeeksAgo },
        });
      }

      // Update stock status
      await Stock.findByIdAndUpdate(stock._id, { status: recommendation.rec });

      console.log(`Successfully updated ${stock.name} -> ${recommendation.rec}`);
      return true;
    } catch (dbError) {
      console.error(`Database operation failed for ${stock.name}:`, dbError);
      return false;
    }
  } catch (error) {
    console.error("Error in updateNewStock:", error);
    return false;
  }
}