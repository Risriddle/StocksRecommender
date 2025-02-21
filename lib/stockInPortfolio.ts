
"use server"


import { Portfolio } from "@/lib/db/models/Portfolio";
import { PortfolioStock } from "@/lib/db/models/PortfolioStock";
import dbConnect from "@/lib/db/connect";
import mongoose from "mongoose"; // Import mongoose for ObjectId


export async function isStockInUserPortfolio(userId: string, stockId: string) {
  try {
    await dbConnect();
    console.log(userId, stockId, "user and stock id");
  
    // Convert userId and stockId to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const stockObjectId = new mongoose.Types.ObjectId(stockId);

    // Step 1: Find portfolios belonging to the user
    const userPortfolios = await Portfolio.find({ user_id: userObjectId }).lean();
    console.log(userPortfolios, "user portfolios");

    if (!userPortfolios.length) return false; // No portfolios found for this user

    // Step 2: Check if the stock is in any of those portfolios
    const stockInPortfolio = await PortfolioStock.findOne({
      stock_id: stockObjectId,
      portfolio_id: { $in: userPortfolios.map((p) => p._id) }, // Match any of the user's portfolios
    });

    return !!stockInPortfolio; // Returns true if stock is found, false otherwise
  } catch (error) {
    console.error("Error checking stock in portfolio:", error);
    return false; // Default to false if there's an error
  }
}
