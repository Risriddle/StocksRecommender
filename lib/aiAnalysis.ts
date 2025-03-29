
import dbConnect from '@/lib/db/connect';
import { StockIndicator } from "@/lib/db/models/StockIndicator";
import { FeaturedStocks } from "@/lib/db/models/FeaturedStocks";

// Comprehensive Stock Scoring Function
async function calculateStockScore(stock: any, indicators: any, performance: any) {
  let score = 0;

  // Growth Rating Score
  if (indicators.growth_rating === "High") score += 30;
  
  // Momentum Score
  if (indicators.momentum_score === "High") score += 25;
  
  // Technical Signals Score
  if (indicators.technical_signals?.overall === "Bullish") score += 20;
  
  // RSI Score
  if (indicators.rsi_indicators?.rsi_14 >= 70) score += 15;
  
  // Performance Score
  if (performance?.oneWeekReturn >= 20) score += 10;

  return score;
}

// Generate AI Insight
function generateAIInsight(stockData: any): string {
  const insights = [
    `Promising opportunity in ${stockData.industry} sector`,
    `Strong market fundamentals with potential growth`,
    `Attractive investment based on current market analysis`
  ];

  if (stockData.growth_rating === "High") {
    return `Strong growth potential in ${stockData.industry} with significant market momentum.`;
  }

  return insights[Math.floor(Math.random() * insights.length)];
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
      {
        $addFields: {
          priceTrend: { $slice: ["$priceHistory.price", -8] },
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
                  { $arrayElemAt: ["$priceHistory.price", 0] }
                ]
              },
              100
            ]
          }
        }
      }
    ]);

    // Process and score each stock
    const featuredStockPromises = potentialFeaturedStocks.map(async (stock) => {
      const aiScore = await calculateStockScore(
        stock.stockDetails, 
        stock, 
        stock.performanceDetails
      );

      const latestPrice = stock.priceTrend?.[stock.priceTrend.length - 1] || 0;
      const priceTarget = latestPrice * 1.16;
      const undervalued = latestPrice < priceTarget * 0.80; // At least 20% below target price

      return {
        stock: stock.stockDetails._id,
        aiScore,
        technicalSignal: stock.technical_signals?.overall || 'Neutral',
        priceChange: stock.priceChange || 0,
        changePercent: stock.changePercent || 0,
        priceTrend: stock.priceTrend || [],
        aiInsight: generateAIInsight(stock.stockDetails),
        analystConsensus: {
          rating: "Positive",
          count: 15
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

    // Sort by AI Score and take top 3
    const topFeaturedStocks = processedFeaturedStocks
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, 3);

    // Clear existing featured stocks and insert new ones
    await FeaturedStocks.deleteMany({});
    await FeaturedStocks.insertMany(topFeaturedStocks);

    console.log("Featured Stocks calculated and stored successfully!");
    return topFeaturedStocks;
  } catch (error) {
    console.error("Error in calculating featured stocks:", error);
    return [];
  }
}
