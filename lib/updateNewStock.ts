// import { StockIndicator } from "@/lib/db/models/StockIndicator";
// import { Recommendation } from "@/lib/db/models/Recommendation";
// import dbConnect from "@/lib/db/connect"
// import axios from 'axios'
// import { Stock } from "@/lib/db/models/Stock";

// const API_BASE_URL = "http://13.126.252.191";

// interface StockAPIResponse {
//   ["P/E (TTM)"]: string;
//   ["EPS (TTM)"]: string;
//   growth: "A" | "B" | "C";
//   momentum: "A" | "B" | "C";
//   ["lowest_price_target"]: string;
//   value: "A" | "B" | "C";
//   ["upside_to_avg_price_target"]: string;
// }



// const getRatingCategory = (score: number): "High" | "Medium" | "Low" => {
//   if (score >= 7) return "High";
//   if (score >= 4) return "Medium";
//   return "Low";
// };


// const calculateScore = (data: Partial<StockAPIResponse>) => {
//   const peRatio = parseFloat(data["P/E (TTM)"] ?? "100") || 100;
//   const eps = parseFloat(data["EPS (TTM)"] ?? "1") || 1;
//   const upside = parseFloat(data["upside_to_avg_price_target"]?.replace("%", "") ?? "0") || 0;
//   const risk = (data["lowest_price_target"] ?? "0").includes("-") ? 8 : 4;


  
//   return {
//     growth_rating: getRatingCategory(data.growth === "A" ? 9 : data.growth === "B" ? 7 : 5),
//     momentum_score: getRatingCategory(data.momentum === "A" ? 9 : data.momentum === "B" ? 7 : 5),
//     value_rating: getRatingCategory(
//       Math.min(10, Math.max(1, (eps * 10) / peRatio + (data.value === "A" ? 1 : 0))) || 5
//     ),
    
//     risk_score: getRatingCategory(risk + (upside < 0 ? 2 : 0)),
//   };
  
// };



// // Recommendation logic
// const determineRecommendation = ({
//   growth_rating,
//   momentum_score,
//   risk_score,
//   upside,
// }: {
//   growth_rating: "High" | "Medium" | "Low";
//   momentum_score: "High" | "Medium" | "Low";
//   risk_score: "High" | "Medium" | "Low";
//   upside: number; // Represents the upside to the target price
// }) => {
//   // BUY → High Growth + Good Momentum + Acceptable Risk
//   if (growth_rating === "High" && momentum_score !== "Low" && risk_score !== "High") {
//     return { rec: "BUY", reason: "Strong growth, good momentum, and acceptable risk" };
//   }

//   // HOLD → Medium Growth or High Risk
//   if (growth_rating === "Medium" || risk_score === "High") {
//     return { rec: "HOLD", reason: "Medium growth or high risk" };
//   }

//   // SELL → Negative Momentum + High Risk
//   if (momentum_score === "Low" && risk_score === "High") {
//     return { rec: "SELL", reason: "Weak momentum and high risk" };
//   }

//   // MONITOR → Good fundamentals but weak momentum
//   if (growth_rating !== "Low" && momentum_score === "Low") {
//     return { rec: "MONITOR", reason: "Good fundamentals but weak momentum" };
//   }

//   // TARGET → Reaching a set price target (Upside % < Threshold, e.g., 5%)
//   if (upside < 5) {
//     return { rec: "TARGET", reason: "Stock is close to its target price" };
//   }

//   // Default fallback
//   return { rec: "HOLD", reason: "No strong indicators; reassess in the near future" };
// };


  
//   export async function updateNewStock(stockId: string) {
//     try {
//       await dbConnect();
      
//       const stock = await Stock.findById(stockId);
//       if (!stock) throw new Error(`Stock with ID ${stockId} not found`);
  
//       const stockIndicator = await StockIndicator.findOne({ stock_id: stockId });
  
//       console.log(stockIndicator, "Existing Stock Indicator");
  
//       // Fetch new stock data from API
//       const response = await axios.get<StockAPIResponse>(`${API_BASE_URL}?stock=${stock.name}`);
//       const stockData = response.data;
//       console.log(stockData, "data from API");
      
   
//       // Calculate scores
//       const scores = calculateScore(stockData);
//       const { rec: recommendation, reason } = determineRecommendation(scores);
  
//       // Update or insert StockIndicator
//       await StockIndicator.findOneAndUpdate(
//         { stock_id: stock._id },
//         { ...scores, last_updated: new Date(), recommendation },
//         { upsert: true, new: true }
//       );
  
//       // Store new recommendation
//       await Recommendation.create({
//         stock_id: stock._id,
//         recommendation,
//         reason,
//       });
  
//       // Update stock status
//       await Stock.findByIdAndUpdate(stock._id, { status: recommendation });
  
//       console.log(`Updated: ${stock.symbol} -> ${recommendation}`);
//       return true
//     } catch (error) {
//       console.error("Error updating stocks:", error);
//     }
//   }
  


// import { StockIndicator } from "@/lib/db/models/StockIndicator";
// import { Recommendation } from "@/lib/db/models/Recommendation";
// import dbConnect from "@/lib/db/connect";
// import axios from "axios";
// import { Stock } from "@/lib/db/models/Stock";

// const API_BASE_URL = "http://13.126.252.191";

// interface StockAPIResponse {
//   ["P/E (TTM)"]: string;
//   ["EPS (TTM)"]: string;
//   growth: "A" | "B" | "C";
//   momentum: "A" | "B" | "C";
//   ["lowest_price_target"]: string;
//   value: "A" | "B" | "C";
//   ["upside_to_avg_price_target"]: string;
// }

// const getRatingCategory = (score: number): "High" | "Medium" | "Low" => {
//   if (score >= 7) return "High";
//   if (score >= 4) return "Medium";
//   return "Low";
// };

// const calculateScore = (data: Partial<StockAPIResponse>) => {
//   const peRatio = parseFloat(data["P/E (TTM)"] ?? "100") || 100;
//   const eps = parseFloat(data["EPS (TTM)"] ?? "1") || 1;
//   const upside = parseFloat(data["upside_to_avg_price_target"]?.replace("%", "") ?? "0") || 0;
//   const lowest_price_target = parseFloat(data["lowest_price_target"] ?? "0") || 0;

//   const risk = lowest_price_target < 0 ? 8 : 4; // If negative, assume high risk.

//   return {
//     growth_rating: getRatingCategory(data.growth === "A" ? 9 : data.growth === "B" ? 7 : 5),
//     momentum_score: getRatingCategory(data.momentum === "A" ? 9 : data.momentum === "B" ? 7 : 5),
//     value_rating: getRatingCategory(Math.min(10, Math.max(1, (eps * 10) / peRatio + (data.value === "A" ? 2 : 0)))),
//     risk_score: getRatingCategory(risk + (upside < 0 ? 2 : 0)),
//     upside,
//   };
// };

// // Recommendation logic
// const determineRecommendation = ({
//   growth_rating,
//   momentum_score,
//   risk_score,
//   upside,
// }: {
//   growth_rating: "High" | "Medium" | "Low";
//   momentum_score: "High" | "Medium" | "Low";
//   risk_score: "High" | "Medium" | "Low";
//   upside: number;
// }) => {
//   if (growth_rating === "High" && momentum_score !== "Low" && risk_score !== "High") {
//     return { rec: "BUY", reason: "Strong growth, good momentum, and acceptable risk" };
//   }
//   if (growth_rating === "Medium" || risk_score === "High") {
//     return { rec: "HOLD", reason: "Medium growth or high risk" };
//   }
//   if (momentum_score === "Low" && risk_score === "High") {
//     return { rec: "SELL", reason: "Weak momentum and high risk" };
//   }
//   if (growth_rating !== "Low" && momentum_score === "Low") {
//     return { rec: "MONITOR", reason: "Good fundamentals but weak momentum" };
//   }
//   if (upside < 5) {
//     return { rec: "TARGET", reason: "Stock is close to its target price" };
//   }

//   return { rec: "HOLD", reason: "No strong indicators; reassess in the near future" };
// };

// export async function updateNewStock(stockId: string) {
//   try {
//     await dbConnect();

//     const stock = await Stock.findById(stockId);
//     if (!stock) throw new Error(`Stock with ID ${stockId} not found`);

//     console.log(`Fetching stock data for: ${stock.name}`);

//     let stockData: StockAPIResponse | null = null;
//     try {
//       const response = await axios.get<StockAPIResponse>(`${API_BASE_URL}?stock=${stock.name}`);
//       stockData = response.data;
//       console.log("Received data from API:", stockData);
//     } catch (apiError) {
//       console.error("API request failed:", apiError);
//       return false;
//     }

//     // Validate the API response
//     if (!stockData) {
//       console.error("No valid stock data received.");
//       return false;
//     }

//     // Calculate scores
//     const scores = calculateScore(stockData);
//     const { rec: recommendation, reason } = determineRecommendation(scores);

//     // Update or insert StockIndicator
//     await StockIndicator.findOneAndUpdate(
//       { stock_id: stock._id },
//       { ...scores, last_updated: new Date(), recommendation },
//       { upsert: true, new: true }
//     );

//     // Store new recommendation
//     await Recommendation.create({
//       stock_id: stock._id,
//       recommendation,
//       reason,
//     });

//     // Update stock status
//     await Stock.findByIdAndUpdate(stock._id, { status: recommendation });

//     console.log(`Updated: ${stock.symbol} -> ${recommendation}`);
//     return true;
//   } catch (error) {
//     console.error("Error updating stocks:", error);
//     return false;
//   }
// }











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
      const response = await axios.get<StockAPIResponse>(`${API_BASE_URL}?stock=${stock.name}`);
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