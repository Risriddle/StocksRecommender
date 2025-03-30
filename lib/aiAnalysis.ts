
import dbConnect from '@/lib/db/connect';
import { StockIndicator } from "@/lib/db/models/StockIndicator";
import { FeaturedStock } from "@/lib/db/models/FeaturedStocks";

// Dynamic Stock Scoring Function with weighted factors
async function calculateStockScore(stock: any, indicators: any, performance: any, priceData: any) {
  let score = 0;
  
  // Growth Rating - More granular scoring
  if (indicators.growth_rating === "High") score += 20;
  else if (indicators.growth_rating === "Medium") score += 10;
  else if (indicators.growth_rating === "Low") score += 5;
  
  // Momentum Score - More granular scoring
  if (indicators.momentum_score === "High") score += 15;
  else if (indicators.momentum_score === "Medium") score += 8;
  else if (indicators.momentum_score === "Low") score += 3;
  
  // Technical Signals - More options
  if (indicators.technical_signals?.overall === "Strongly Bullish") score += 25;
  else if (indicators.technical_signals?.overall === "Bullish") score += 15;
  else if (indicators.technical_signals?.overall === "Slightly Bullish") score += 5;
  else if (indicators.technical_signals?.overall === "Bearish" || 
           indicators.technical_signals?.overall === "Strongly Bearish") score -= 15;
  
  // RSI Score - More dynamic scoring
  if (indicators.rsi_indicators?.rsi_14) {
    const rsi = indicators.rsi_indicators.rsi_14;
    if (rsi > 50 && rsi < 70) score += 10; // Bullish but not overbought
    else if (rsi >= 70) score += 5; // Potentially overbought
    else if (rsi < 30) score -= 5; // Oversold
  }
  
  // Recent Performance - Heavily weight recent returns
  if (performance) {
    // One week return (high weight for recency)
    if (performance.oneWeekReturn > 5) score += 20;
    else if (performance.oneWeekReturn > 0) score += 10;
    else if (performance.oneWeekReturn < -5) score -= 15;
    
    // One month return
    if (performance.oneMonthReturn > 10) score += 15;
    else if (performance.oneMonthReturn > 0) score += 5;
    else if (performance.oneMonthReturn < -10) score -= 10;
    
    // Revenue growth
    if (performance.revenueGrowth > 20) score += 10;
    else if (performance.revenueGrowth > 10) score += 5;
    
    // Profit margin
    if (performance.profitMargin > 15) score += 10;
    else if (performance.profitMargin > 5) score += 5;
  }
  
  // Recent price trend (last 7 days)
  if (priceData.priceTrend && priceData.priceTrend.length >= 2) {
    const recentTrend = calculateRecentTrend(priceData.priceTrend);
    if (recentTrend > 3) score += 15; // Strong uptrend
    else if (recentTrend > 0) score += 5; // Mild uptrend
    else if (recentTrend < -3) score -= 10; // Strong downtrend
  }
  
  return score;
}

// Calculate recent price trend direction and strength
function calculateRecentTrend(priceTrend: number[]): number {
  // Need at least 2 points to calculate a trend
  if (!priceTrend || priceTrend.length < 2) return 0;
  
  // Count consecutive days up/down
  let trendScore = 0;
  for (let i = 1; i < priceTrend.length; i++) {
    if (priceTrend[i] > priceTrend[i-1]) {
      trendScore++; // Upward day
    } else if (priceTrend[i] < priceTrend[i-1]) {
      trendScore--; // Downward day
    }
  }
  
  return trendScore;
}

// Generate context-aware AI Insight
function generateAIInsight(stockData: any, indicators: any, performance: any): string {
  // Base insight components
  let insight = '';
  
  // Growth component
  if (indicators.growth_rating === "High") {
    insight += `Strong growth potential in ${stockData.industry}. `;
  } else if (indicators.growth_rating === "Medium") {
    insight += `Moderate growth outlook in ${stockData.industry}. `;
  }
  
  // Momentum component
  if (indicators.momentum_score === "High") {
    insight += `Shows significant market momentum. `;
  }
  
  // Technical signals
  if (indicators.technical_signals?.overall === "Bullish" || 
      indicators.technical_signals?.overall === "Strongly Bullish") {
    insight += `Technical indicators suggest bullish trend. `;
  }
  
  // Recent performance
  if (performance?.oneWeekReturn > 5) {
    insight += `Recent strong performance with ${performance.oneWeekReturn.toFixed(1)}% weekly return. `;
  }
  
  // Fundamentals if available
  if (performance?.profitMargin > 15) {
    insight += `Strong profit margins at ${performance.profitMargin.toFixed(1)}%. `;
  }
  
  // Fallback if no specific insights
  if (!insight) {
    return `Potential opportunity in ${stockData.industry} sector based on current market analysis.`;
  }
  
  return insight;
}

// Main Function to Calculate and Store Featured Stocks
export async function calculateFeaturedStocks() {
  try {
    await dbConnect();

    // Fetch stocks with comprehensive aggregation
    const potentialFeaturedStocks = await StockIndicator.aggregate([
      {
        $lookup: {
          from: "stocks",
          localField: "stock_id",
          foreignField: "_id",
          as: "stockDetails"
        }
      },
      { $unwind: "$stockDetails" },
      {
        $lookup: {
          from: "returns",
          localField: "stock_id",
          foreignField: "stock_id",
          as: "performanceDetails"
        }
      },
      { $unwind: { path: "$performanceDetails", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "stockpricehistories",
          localField: "stock_id",
          foreignField: "stock_id",
          as: "priceHistory"
        }
      },
      // Add sorting for recent data
      { $sort: { "priceHistory.date": -1 } },
      {
        $addFields: {
          priceTrend: { $slice: ["$priceHistory.price", -14] }, // Look at last 14 days
          priceChange: {
            $subtract: [
              { $arrayElemAt: ["$priceHistory.price", -1] },
              { $arrayElemAt: ["$priceHistory.price", 0] }
            ]
          },
          changePercent: {
            $multiply: [
              {
                $divide: [
                  {
                    $subtract: [
                      { $arrayElemAt: ["$priceHistory.price", -1] },
                      { $arrayElemAt: ["$priceHistory.price", 0] }
                    ]
                  },
                  { $max: [{ $arrayElemAt: ["$priceHistory.price", 0] }, 0.01] } // Prevent division by zero
                ]
              },
              100
            ]
          }
        }
      },
      // Filter out stocks with insufficient data
      {
        $match: {
          "priceTrend": { $exists: true, $ne: [] },
          "performanceDetails": { $exists: true }
        }
      }
    ]);

    // Process and score each stock
    const featuredStockPromises = potentialFeaturedStocks.map(async (stock) => {

      const latestPrice = stock.priceTrend?.[stock.priceTrend.length - 1] || 0;
      const earliestPrice = stock.priceTrend?.[0] || 0;
      
      // Explicitly calculate both change and changePercent
      stock.priceChange = latestPrice - earliestPrice;
  
          
    
      const priceData = {
        priceTrend: stock.priceTrend || [],
        // priceChange: stock.priceChange || 0,
        priceChange:stock.priceChange,
        changePercent: stock.changePercent || 0,
        
          
      };
      



      const aiScore = await calculateStockScore(
        stock.stockDetails, 
        stock, 
        stock.performanceDetails,
        priceData
      );

      // const latestPrice = stock.priceTrend?.[stock.priceTrend.length - 1] || 0;
     
      
      // Dynamic price target based on growth rate, not hardcoded 16%
      const growthMultiplier = stock.performanceDetails?.revenueGrowth > 15 ? 1.2 : 
                               stock.performanceDetails?.revenueGrowth > 5 ? 1.1 : 1.05;
      const priceTarget = latestPrice * growthMultiplier;
      
      // Dynamic undervalued calculation
      const undervalued = latestPrice < priceTarget * 0.85 && 
                         (stock.technical_signals?.overall === "Bullish" || 
                          stock.performanceDetails?.oneMonthReturn > 0);

      return {
        stock: stock.stockDetails._id,
        aiScore,
        technicalSignal: stock.technical_signals?.overall || 'Neutral',
        change: stock.priceChange,
        changePercent: stock.changePercent || 0,
        priceTrend: stock.priceTrend || [],
        aiInsight: generateAIInsight(stock.stockDetails, stock, stock.performanceDetails),
        analystConsensus: {
          rating: stock.performanceDetails?.analystRating || "Neutral",
          count: stock.performanceDetails?.analystCount || 0
        },
        revenueGrowth: stock.performanceDetails?.revenueGrowth || 0,
        profitMargin: stock.performanceDetails?.profitMargin || 0,
        priceTarget,
        undervalued,
        categories: [stock.stockDetails.industry, stock.stockDetails.category]
      };
    });

    // Resolve all featured stock calculations
    const processedFeaturedStocks = await Promise.all(featuredStockPromises);

    // Apply a more balanced sorting approach that considers recent performance
    const topFeaturedStocks = processedFeaturedStocks
      // First filter out stocks with negative recent returns unless they have exceptional other metrics
      .filter(stock => 
        stock.changePercent >= 0 || 
        stock.aiScore > 50 || // High overall score can overcome recent negative performance
        (stock.undervalued && stock.revenueGrowth > 10) // Undervalued with good growth can still be featured
      )
      // Sort by AI Score
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, 5); // Get top 5 instead of just 3 for more options

    // Clear existing featured stocks and insert new ones
    await FeaturedStock.deleteMany({});
    await FeaturedStock.insertMany(topFeaturedStocks.slice(0, 3)); // Still only store top 3

    console.log("Featured Stocks calculated and stored successfully!");
    return true;
  } catch (error) {
    console.error("Error in calculating featured stocks:", error);
    return false;
  }
}



