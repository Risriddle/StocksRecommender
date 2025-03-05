
"use server"


import { Portfolio } from "@/lib/db/models/Portfolio";
import { PortfolioStock } from "@/lib/db/models/PortfolioStock";
import dbConnect from "@/lib/db/connect";
import mongoose from "mongoose"; // Import mongoose for ObjectId




export async function getUserPortfolioStocks(userId: string): Promise<string[]> {
  try {
    await dbConnect();
    
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Step 1: Get all portfolio IDs for the user
    const userPortfolios = await Portfolio.find({ user_id: userObjectId }).select("_id").lean();

    if (!userPortfolios.length) return []; // No portfolios found

    const portfolioIds = userPortfolios.map((p) => p._id);

    // Step 2: Get all stock IDs from PortfolioStock for those portfolio IDs
    const stocks = await PortfolioStock.find({ portfolio_id: { $in: portfolioIds } })
      .select("stock_id")
      .lean();

    return stocks.map((s) => s.stock_id.toString()); // Convert ObjectIds to strings
  } catch (error) {
    console.error("Error fetching user portfolio stocks:", error);
    return [];
  }
}



