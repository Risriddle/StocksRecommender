import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import { Portfolio } from "@/lib/db/models/Portfolio";
import { PortfolioStock } from "@/lib/db/models/PortfolioStock";
import { Stock } from "@/lib/db/models/Stock"; // Assuming Stock model exists
import calculateStockReturns from "@/lib/calculateReturns";

// export async function GET(req: NextRequest, context: { params?: { portfolioId?: string } }) {
//     try {
//         await dbConnect();
//         const portfolioId = context.params?.portfolioId;

//         console.log(portfolioId, "Portfolio ID received");

//         if (!portfolioId) {
//             return NextResponse.json({ message: "Portfolio ID is required" }, { status: 400 });
//         }

//         // Fetch portfolio details
//         const portfolios = await Portfolio.find({ _id: portfolioId }).populate({
//             path: "user_id",
//             select: "role",
//         });

//         if (!portfolios.length) {
//             return NextResponse.json({ message: "Portfolio not found" }, { status: 404 });
//         }

//         // Fetch stocks within the portfolio
//         const portfolioStocks = await PortfolioStock.find({ portfolio_id: portfolioId });

//         let totalReturn = 0;
//         let validStockCount = 0;

//         // Calculate returns for each stock
//         for (const stock of portfolioStocks) {
//             const stockData = await Stock.findById(stock.stock_id);
//             if (stockData) {
               
//                     const cal =await calculateStockReturns(stock.stock_id)
//                     const stockReturn=cal.returnSinceAdded   
//                     totalReturn += stockReturn ? +stockReturn : 0;
//                     validStockCount++;
             
//             }
//         }

//         // Calculate average return for the portfolio
//         const portfolioReturn = validStockCount > 0 ? (totalReturn / validStockCount).toFixed(2) : "N/A";

//         return NextResponse.json({ 
//             portfolio: portfolios[0], 
//             portfolioStocks,
//             portfolioReturn 
//         }, { status: 200 });

//     } catch (error) {
//         console.error("Error fetching portfolios ❌", error);
//         return NextResponse.json({ message: "Failed to fetch portfolios" }, { status: 500 });
//     }
// }

export async function GET(req: NextRequest, context: { params?: { portfolioId?: string } }) {
    try {
        await dbConnect();
        const portfolioId = context.params?.portfolioId;

        console.log(portfolioId, "Portfolio ID received");

        if (!portfolioId) {
            return NextResponse.json({ message: "Portfolio ID is required" }, { status: 400 });
        }

        // Fetch portfolio details
        const portfolios = await Portfolio.find({ _id: portfolioId })

        if (!portfolios.length) {
            return NextResponse.json({ message: "Portfolio not found" }, { status: 404 });
        }

        // Fetch stocks within the portfolio
        const portfolioStocks = await PortfolioStock.find({ portfolio_id: portfolioId });

        let totalReturn = 0;
        let validStockCount = 0;

        // Fetch stock returns and attach to portfolioStocks
        const enrichedPortfolioStocks = await Promise.all(
            portfolioStocks.map(async (stock) => {
                const stockData = await Stock.findById(stock.stock_id);
                let stockReturn = null;

                if (stockData) {
                    const cal = await calculateStockReturns(stock.stock_id);
                    stockReturn = cal?.returnSinceAdded || 0;
                    totalReturn += stockReturn ? +stockReturn : 0;
                    validStockCount++;
                }
                console.log(stockReturn,"stock retun in api/portfolios/id.........................................................................................................................................................")
                return {
                    ...stock.toObject(),
                    stockReturn, // Add stockReturn to each stock object
                };
            })
        );

        // Calculate average return for the portfolio
        const portfolioReturn = validStockCount > 0 ? (totalReturn / validStockCount).toFixed(2) : "N/A";

        return NextResponse.json({ 
            portfolio: portfolios[0], 
            portfolioStocks: enrichedPortfolioStocks,  // Updated portfolioStocks with stockReturn
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
  