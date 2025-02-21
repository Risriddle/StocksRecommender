import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import { Portfolio } from "@/lib/db/models/Portfolio";
import { PortfolioStock } from "@/lib/db/models/PortfolioStock";
import { Stock } from "@/lib/db/models/Stock"; // Assuming Stock model exists

export async function GET(req: NextRequest, context: { params?: { portfolioId?: string } }) {
    try {
        await dbConnect();
        const portfolioId = context.params?.portfolioId;

        console.log(portfolioId, "Portfolio ID received");

        if (!portfolioId) {
            return NextResponse.json({ message: "Portfolio ID is required" }, { status: 400 });
        }

        // Fetch portfolio details
        const portfolios = await Portfolio.find({ _id: portfolioId }).populate({
            path: "user_id",
            select: "role",
        });

        if (!portfolios.length) {
            return NextResponse.json({ message: "Portfolio not found" }, { status: 404 });
        }

        // Fetch stocks within the portfolio
        const portfolioStocks = await PortfolioStock.find({ portfolio_id: portfolioId });

        let totalReturn = 0;
        let validStockCount = 0;

        // Calculate returns for each stock
        for (const stock of portfolioStocks) {
            const stockData = await Stock.findById(stock.stock_id);
            if (stockData) {
                const initialPrice = stock.initial_price; // Assuming there's an initial price stored
                const currentPrice = stockData.current_price;

                if (initialPrice && currentPrice) {
                    const stockReturn = ((currentPrice - initialPrice) / initialPrice) * 100;
                    totalReturn += stockReturn;
                    validStockCount++;
                }
            }
        }

        // Calculate average return for the portfolio
        const portfolioReturn = validStockCount > 0 ? (totalReturn / validStockCount).toFixed(2) : "N/A";

        return NextResponse.json({ 
            portfolio: portfolios[0], 
            portfolioReturn 
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching portfolios ❌", error);
        return NextResponse.json({ message: "Failed to fetch portfolios" }, { status: 500 });
    }
}






export async function DELETE(req:NextRequest, context: { params?: { portfolioId?: string }}) {
  try {
    await dbConnect();
    const portfolioId  = context.params?.portfolioId;


    if (!portfolioId) {
      return NextResponse.json({ success: false, message: "Portfolio ID is required" }, { status: 400 });
    }

    // Delete the portfolio first
    const deletedPortfolio = await Portfolio.findByIdAndDelete(portfolioId);

    if (!deletedPortfolio) {
      return NextResponse.json({ success: false, message: "Portfolio not found" }, { status: 404 });
    }

    // Delete all associated stocks in PortfolioStock
    await PortfolioStock.deleteMany({ portfolio_id: portfolioId });

    return NextResponse.json({ success: true, message: "Portfolio and associated stocks deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting portfolio and stocks:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}




export async function PUT(req: NextRequest, context: { params?: { portfolioId?: string }}) {
    try {
        await dbConnect();
        const portfolioId  = context.params?.portfolioId;

        const {  user_id,name, riskLevel, description } = await req.json();
  console.log(user_id,riskLevel,name,description,"in PUT================================")
        if (!portfolioId) {
            return NextResponse.json({ success: false, message: "Portfolio ID is required" }, { status: 400 });
        }
  
        const updatedPortfolio = await Portfolio.findByIdAndUpdate(
            portfolioId,
            { name, riskLevel, description,user_id },
            { new: true, runValidators: true }
        );
  
        if (!updatedPortfolio) {
            return NextResponse.json({ success: false, message: "Portfolio not found" }, { status: 404 });
        }
  
        return NextResponse.json({ success: true, portfolio: updatedPortfolio }, { status: 200 });
    } catch (error) {
        console.error("Error updating portfolio:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
  }
  