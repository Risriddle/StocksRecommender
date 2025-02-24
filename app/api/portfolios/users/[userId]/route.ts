import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import {Portfolio} from "@/lib/db/models/Portfolio";
import { PortfolioStock } from "@/lib/db/models/PortfolioStock";
import {StockPriceHistory} from "@/lib/db/models/StockPriceHistory";


export async function GET(req: NextRequest, context: { params?: { userId?: string } }) {
    try {
        await dbConnect();
        const userId = context.params?.userId;

        console.log(userId, "User ID received");

        if (!userId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        // Fetch user's portfolios
        // const portfolios = await Portfolio.find({ user_id: userId }).populate({
        //     path: "user_id",
        //     select: "role",
        // });

        const portfolios = await Portfolio.find({ user_id: userId })

        if (!portfolios.length) {
            return NextResponse.json({ message: "No portfolios found" }, { status: 404 });
        }

        // console.log(portfolios, "User's Portfolios");

        // Fetch stock count & calculate returns for each portfolio
        const portfoliosWithDetails = await Promise.all(
            portfolios.map(async (portfolio) => {
                const stocks = await PortfolioStock.find({ portfolio_id: portfolio._id });

                let totalInvestment = 0;
                let totalWeightedReturn = 0;

                const stocksWithReturns = await Promise.all(
                    stocks.map(async (stock) => {
                        // Fetch latest stock price from StockPriceHistory
                        const latestPriceEntry = await StockPriceHistory.findOne({ stock_id: stock.stock_id })
                            .sort({ date: -1 }) // Get latest price
                            .select("price");

                        const initialPrice = await StockPriceHistory.findOne({ stock_id: stock.stock_id })
                            .sort({ date:1 }) // Get latest price
                            .select("price");


                        const current_price = latestPriceEntry?.price || stock.added_price; // If no data, assume no change
                        const initial_price=initialPrice?.price
                        const investment = stock.added_price * 1; // Assume 1 quantity per record
                        const profitOrLoss = (current_price - initial_price) * 1; // Profit/Loss per unit
                        const stockReturn = (profitOrLoss / investment) * 100; // Percentage return

                        totalInvestment += investment;
                        totalWeightedReturn += stockReturn * investment;

                        return {
                            ...stock.toObject(),
                            current_price,
                            stockReturn: stockReturn.toFixed(2),
                        };
                    })
                );

                // Calculate overall portfolio return (weighted average)
                const portfolioReturn = totalInvestment ? (totalWeightedReturn / totalInvestment) : 0;

                return {
                    ...portfolio.toObject(),
                    stockCount: stocks.length,
                    portfolioReturn: portfolioReturn.toFixed(2),
                    stocks: stocksWithReturns,
                };
            })
        );

        return NextResponse.json(portfoliosWithDetails, { status: 200 });

    } catch (error) {
        console.error("Error fetching portfolios ❌", error);
        return NextResponse.json({ message: "Failed to fetch portfolios" }, { status: 500 });
    }
}






export async function POST(req:NextRequest) {
  try {
    await dbConnect();
    const { user_id, name, riskLevel = 'medium', description = 'no description provided' } = await req.json();

    if (!user_id || !name.trim()) {
      return NextResponse.json({ success: false, message: 'User ID and portfolio name are required.' }, { status: 400 });
    }

    const newPortfolio = new Portfolio({
      user_id,
      name,
      riskLevel,
      description,
    });

    await newPortfolio.save();

    return NextResponse.json({ success: true, portfolio: newPortfolio }, { status: 201 });
  } catch (error) {
    console.error('Error creating portfolio:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}






