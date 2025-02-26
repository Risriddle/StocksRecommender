

import { StockIndicator } from "@/lib/db/models/StockIndicator";
import { Recommendation } from "@/lib/db/models/Recommendation";
import dbConnect from "@/lib/db/connect";
import axios from "axios";
import { Stock } from "@/lib/db/models/Stock";

const API_BASE_URL = "http://13.126.252.191";

type Rating = "High" | "Medium" | "Low";
type Grade = "A" | "B" | "C" | "D" | "F";

interface StockAPIResponse {
  ["P/E (TTM)"]?: string;
  ["EPS (TTM)"]?: string;
  ["Market Cap"]?: string;
  ["Previous Close"]?: string;
  ["avg_price_target"]?: string;
  growth?: Grade;
  momentum?: Grade;
  value?: Grade;
  ["lowest_price_target"]?: string;
  ["upside_to_avg_price_target"]?: string;
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
    const peRatio = parseNumericValue(data["P/E (TTM)"], 100);
    const eps = parseNumericValue(data["EPS (TTM)"], 1);
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

export async function updateNewStock(stockId: string): Promise<boolean> {
  try {
    await dbConnect();

    const stock = await Stock.findById(stockId);
    if (!stock) {
      console.error(`Stock with ID ${stockId} not found`);
      return false;
    }

    let stockData: StockAPIResponse;
    try {
      const response = await axios.get<StockAPIResponse>(`${API_BASE_URL}?stock=${stock.name}`,{timeout:40000});
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
console.log(scores,recommendation,"in update new stock==============================================")
    try {
      // Update or insert StockIndicator
      await StockIndicator.findOneAndUpdate(
        { stock_id: stock._id },
        { 
          ...scores, 
          last_updated: new Date(), 
          recommendation: recommendation.rec 
        },
        { upsert: true, new: true }
      );

      // Store new recommendation
      await Recommendation.create({
        stock_id: stock._id,
        recommendation: recommendation.rec,
        reason: recommendation.reason,
      });

       

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