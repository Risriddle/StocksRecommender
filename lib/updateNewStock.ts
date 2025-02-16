import { StockIndicator } from "@/lib/db/models/StockIndicator";
import { Recommendation } from "@/lib/db/models/Recommendation";
import dbConnect from "@/lib/db/connect"
import axios from 'axios'
import { Stock } from "@/lib/db/models/Stock";

const API_BASE_URL = "http://13.126.252.191";

interface StockAPIResponse {
  ["P/E (TTM)"]: string;
  ["EPS (TTM)"]: string;
  growth: "A" | "B" | "C";
  momentum: "A" | "B" | "C";
  ["lowest_price_target"]: string;
  value: "A" | "B" | "C";
  ["upside_to_avg_price_target"]: string;
}

// Recommendation logic
const determineRecommendation = ({
  growth_rating,
  momentum_score,
  risk_score,
}: {
  growth_rating: number;
  momentum_score: number;
  risk_score: number;
}) => {
  if (growth_rating >= 8 && momentum_score >= 7 && risk_score <= 5)
    return { rec: "BUY", reason: "Strong growth, good momentum, and low risk" };
  if (growth_rating >= 5 && risk_score >= 7)
    return { rec: "HOLD", reason: "Moderate growth but high risk" };
  if (momentum_score <= 4 && risk_score >= 8)
    return { rec: "SELL", reason: "Weak momentum and high risk" };
  if (growth_rating >= 6 && momentum_score <= 5)
    return { rec: "MONITOR", reason: "Decent growth but weak momentum" };
  return { rec: "TARGET", reason: "No strong indicators; reassess later" };
};



const calculateScore = (data: Partial<StockAPIResponse>) => {
    const peRatio = parseFloat(data["P/E (TTM)"] ?? "100") || 100;
    const eps = parseFloat(data["EPS (TTM)"] ?? "1") || 1;
    const upside = parseFloat(data["upside_to_avg_price_target"]?.replace("%", "") ?? "0") || 0;
    const risk = data["lowest_price_target"]?.includes("-") ? 8 : 4;
  
    return {
      value_rating: Math.min(10, Math.max(1, (eps * 10) / peRatio + (data.value === "A" ? 1 : 0))),
      growth_rating: data.growth === "A" ? 9 : data.growth === "B" ? 7 : 5,
      momentum_score: data.momentum === "A" ? 9 : data.momentum === "B" ? 7 : 5,
      risk_score: risk + (upside < 0 ? 2 : 0),
    };
  };
  
  export async function updateNewStock(stockId: string) {
    try {
      await dbConnect();
      
      const stock = await Stock.findById(stockId);
      if (!stock) throw new Error(`Stock with ID ${stockId} not found`);
  
      const stockIndicator = await StockIndicator.findOne({ stock_id: stockId });
  
      console.log(stockIndicator, "Existing Stock Indicator");
  
      // Fetch new stock data from API
    //   const response = await axios.get<StockAPIResponse>(`${API_BASE_URL}?stock=${stock.name}`);
    //   const stockData = response.data;
    //   console.log(stockData, "data from API");
      
   const stockData={
    'Average Volume': '483.11K',
    'EPS (TTM)': '1.21',
    'Ex-Dividend Date': '-',
    'Fwd Dividend (% Yield)': '-',
    'Market Cap': '2.64B',
    'P/E (TTM)': '53.80',
    'Previous Close': '63.18',
    'Shares Outstanding': '40.41M'
  } 
      // Calculate scores
      const scores = calculateScore(stockData);
      const { rec: recommendation, reason } = determineRecommendation(scores);
  
      // Update or insert StockIndicator
      await StockIndicator.findOneAndUpdate(
        { stock_id: stock._id },
        { ...scores, last_updated: new Date(), recommendation },
        { upsert: true, new: true }
      );
  
      // Store new recommendation
      await Recommendation.create({
        stock_id: stock._id,
        recommendation,
        reason,
      });
  
      // Update stock status
      await Stock.findByIdAndUpdate(stock._id, { status: recommendation });
  
      console.log(`Updated: ${stock.symbol} -> ${recommendation}`);
      return true
    } catch (error) {
      console.error("Error updating stocks:", error);
    }
  }
  