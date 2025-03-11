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

        // Fetch all portfolios for the user in one query
        const portfolios = await Portfolio.find({ user_id: userId });
        
        if (!portfolios.length) {
            return NextResponse.json({ message: "No portfolios found" }, { status: 404 });
        }

        // Fetch all stocks related to these portfolios in one go
        const portfolioIds = portfolios.map((portfolio) => portfolio._id);
        const stocks = await PortfolioStock.find({ portfolio_id: { $in: portfolioIds } });

        if (!stocks.length) {
            return NextResponse.json({ message: "No stocks found for portfolios" }, { status: 404 });
        }

        

        const portfoliosWithDetails = portfolios.map((portfolio) => {
            const portfolioStocks = stocks.filter((stock) => stock.portfolio_id.equals(portfolio._id));

         

            return {
                ...portfolio.toObject(),
                stockCount: portfolioStocks.length,
                portfolioReturn: portfolio.portfolioReturn.toFixed(2), // Directly using the stored value
                
            };
        });

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






