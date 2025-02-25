


import axios from "axios";
import { StockIndicator } from "@/lib/db/models/StockIndicator";
import { Stock } from "@/lib/db/models/Stock";
import { Recommendation } from "@/lib/db/models/Recommendation";
import dbConnect from "@/lib/db/connect";
import { updateNewStock } from "./updateNewStock";

const API_BASE_URL = "http://13.126.252.191";

interface StockAPIResponse {
  ["P/E (TTM)"]?: string;
  ["EPS (TTM)"]?: string;
  ["Market Cap"]?: string;
  ["Average Volume"]?: string;
  ["Previous Close"]?: string;
  ["avg_price_target"]?: string;
  growth?: "A" | "B" | "C" | "D" | "F";
  momentum?: "A" | "B" | "C" | "D" | "F";
  value?: "A" | "B" | "C" | "D" | "F";
  ["lowest_price_target"]?: string;
  ["upside_to_avg_price_target"]?: string;
}

interface StockScores {
  growthScore: number;
  momentumScore: number;
  riskScore: number;
  valueScore: number;
}

interface StockRecommendation {
  rec: 'BUY' | 'HOLD' | 'SELL' | 'MONITOR' | 'TARGET';
  reason: string;
}

interface ProcessedStockData {
  scores: StockScores;
  recommendation: StockRecommendation;
}

const letterToScore = (letter: string | undefined): number => {
  const scores: { [key: string]: number } = { 'A': 4, 'B': 3, 'C': 2, 'D': 1, 'F': 0 };
  return letter ? (scores[letter.charAt(0)] || 0) : 0;
};

const calculateRiskScore = (data: StockAPIResponse): number => {
  let riskScore = 3; // Start with neutral risk

  try {
    // Higher P/E ratio indicates higher risk
    const peRatio = parseFloat(data['P/E (TTM)'] || '0');
    if (peRatio > 50) riskScore -= 1;
    if (peRatio > 100) riskScore -= 1;

    // Lower market cap indicates higher risk
    const marketCap = parseFloat((data['Market Cap'] || '0').replace('B', ''));
    if (marketCap < 1) riskScore -= 1;
    if (marketCap < 0.5) riskScore -= 1;

    // Lower volume indicates higher risk
    const volume = parseFloat((data['Average Volume'] || '0').replace('K', '')) * 1000;
    if (volume < 100000) riskScore -= 1;

  } catch (error) {
    console.error("Error calculating risk score:", error);
    return 1; // Return high risk if calculation fails
  }

  return Math.max(0, riskScore); // Ensure score doesn't go negative
};

const calculateScore = (stockData: StockAPIResponse): StockScores => {
  return {
    growthScore: letterToScore(stockData.growth),
    momentumScore: letterToScore(stockData.momentum),
    riskScore: calculateRiskScore(stockData),
    valueScore: letterToScore(stockData.value)
  };
};

const checkPriceTarget = (stockData: StockAPIResponse): boolean => {
  try {
    const currentPrice = parseFloat(stockData['Previous Close'] || '0');
    const targetPrice = parseFloat((stockData['avg_price_target'] || '0').replace('$', ''));
    return !isNaN(currentPrice) && !isNaN(targetPrice) && 
           Math.abs((currentPrice - targetPrice) / targetPrice) < 0.02; // Within 2% of target
  } catch (error) {
    console.error("Error checking price target:", error);
    return false;
  }
};

const determineRecommendation = (scores: StockScores, stockData: StockAPIResponse): StockRecommendation => {
  const { growthScore, momentumScore, riskScore, valueScore } = scores;

  // BUY criteria
  if (growthScore >= 3 && momentumScore >= 3 && riskScore >= 2) {
    return {
      rec: 'BUY',
      reason: 'High growth and momentum with acceptable risk profile'
    };
  }

  // SELL criteria
  if (momentumScore <= 1 && riskScore <= 1) {
    return {
      rec: 'SELL',
      reason: 'Negative momentum combined with high risk indicators'
    };
  }

  // MONITOR criteria
  if (growthScore >= 3 && valueScore >= 3 && momentumScore <= 2) {
    return {
      rec: 'MONITOR',
      reason: 'Strong fundamentals but weak momentum - watch for entry point'
    };
  }

  // TARGET criteria
  if (checkPriceTarget(stockData)) {
    return {
      rec: 'TARGET',
      reason: 'Stock has reached its average price target'
    };
  }

  // Default to HOLD
  return {
    rec: 'HOLD',
    reason: `Medium growth (${growthScore}/4) or elevated risk (${riskScore}/4)`
  };
};

const processStockData = (stockData: StockAPIResponse): ProcessedStockData => {
  const scores = calculateScore(stockData);
  const recommendation = determineRecommendation(scores, stockData);
  return { scores, recommendation };
};

export const updateStockData = async (): Promise<void> => {
  try {
    await dbConnect();
    const stocks = await Stock.find();

    for (const stock of stocks) {
      try {
        // Find stock indicator
        let stockIndicator = await StockIndicator.findOne({ stock_id: stock._id });
        
        if(stockIndicator==null){
          console.log("in update new stock condition--------------------------------------------------------------------")
          const res=await updateNewStock(stock._id)
          console.log(res,stock.name,"new stock recccccccccccccccccccccccccccccccccccccccccccccccccccc")
          continue
        }
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        if (stockIndicator?.last_updated && stockIndicator.last_updated > oneWeekAgo) {
          console.log(`Skipping ${stock.name}, last updated less than a week ago.`);
          continue;
        }

        // Fetch new stock data from API
        const response = await axios.get<StockAPIResponse>(`${API_BASE_URL}?stock=${stock.name}`,{timeout:30000});
        const stockData = response.data;
        
        // Process stock data
        const { scores, recommendation } = processStockData(stockData);

        // Update or insert StockIndicator
        stockIndicator = await StockIndicator.findOneAndUpdate(
          { stock_id: stock._id },
          { 
            ...scores, 
            last_updated: new Date(), 
            recommendation: recommendation.rec 
          },
          { upsert: true, new: true }
        );

        // Check if the latest recommendation is different before saving
        const latestRecommendation = await Recommendation.findOne({ stock_id: stock._id })
          .sort({ createdAt: -1 });

        if (!latestRecommendation || latestRecommendation.recommendation !== recommendation.rec) {
          await Recommendation.create({
            stock_id: stock._id,
            recommendation: recommendation.rec,
            reason: recommendation.reason,
          });
        }
console.log("updateeeeeestock data========================================0000000000000000000000000000000000000")
        // Update stock status
        await Stock.findByIdAndUpdate(stock._id, { status: recommendation.rec });

        console.log(`Updated: ${stock.name} -> ${recommendation.rec}`);
      } catch (apiError) {
        console.error(`Error processing stock ${stock.name}:`, apiError);
      }
    }
  } catch (error) {
    console.error("Error updating stocks:", error);
    throw error; // Re-throw to be handled by caller
  }
};