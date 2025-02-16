import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import {PortfolioStock} from "@/lib/db/models/PortfolioStock";
import {Stock} from "@/lib/db/models/Stock";




export async function GET(req: NextRequest,context: { params?: { portfolioId?: string } }) {
    try {
        await dbConnect();
        // const { portfolioId } = await Promise.resolve(params);
        const portfolioId  = context.params?.portfolioId;
    console.log("Portfolio ID:", portfolioId);

        console.log(portfolioId, "portfolio id in get stocks in a portfolio");

        // Fetch all stocks linked to this portfolio
        const portfolioStocks = await PortfolioStock.find({ portfolio_id: portfolioId });

        if (!portfolioStocks.length) {
            return NextResponse.json([], { status: 200 });
        }

        // Extract stock IDs
        const stockIds = portfolioStocks.map(stock => stock.stock_id);

        // Fetch stock details from Stock collection
        const stocks = await Stock.find({ _id: { $in: stockIds } });

        console.log(stocks, "stocks fetched from portfolioId");

        return NextResponse.json(stocks, { status: 200 });
    } catch (error) {
        console.error("Error fetching stocks ❌", error);
        return NextResponse.json({ message: "Failed to fetch stocks" }, { status: 500 });
    }
}

// Adding stocks to portfolio
export async function POST(req: NextRequest ,context: { params?: { portfolioId?: string } } ) {
    try {
        await dbConnect();
        const portfolioId  = context.params?.portfolioId;
  console.log("Portfolio ID:", portfolioId);

        const { name, price ,stockId} = await req.json();
        console.log(stockId,"stock id in add stockkkkkkkkkkkkkkkkkkk")
        if (!name || !price) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // const { portfolioId } = await Promise.resolve(context.params); // Ensuring params are awaited
        console.log(portfolioId,"portfolioid in add stockkkkkkkkkkkkk")
        // const addStock=new Stock({name,current_price:price,category,status,exchange,industry})
        
        const newStock = new PortfolioStock({ portfolio_id:portfolioId,stock_id: stockId,name:name,added_price: price, added_date: new Date() });
        await newStock.save();

        return NextResponse.json({ success: true, stock: newStock }, { status: 201 });
    } catch (error) {
        console.error("Error adding stock ❌", error);
        return NextResponse.json({ message: "Failed to add stock" }, { status: 500 });
    }
}


import mongoose from "mongoose";
export async function DELETE(req: NextRequest,context: { params?: { portfolioId?: string } }) {
    try {
        await dbConnect();
           const { stockId } = await req.json();
           const portfolioId  = context.params?.portfolioId;

           console.log("Portfolio ID:", portfolioId);
       
        console.log("Received Portfolio ID:", portfolioId, "Stock ID:", stockId, "in delete stockkkkkkkkkkkkkkk");

        if (!portfolioId) {
            return NextResponse.json({ message: "Invalid portfolio ID" }, { status: 400 });
        }
        const convertedPortfolioId = new mongoose.Types.ObjectId(portfolioId);
        const convertedStockId = new mongoose.Types.ObjectId(stockId);

        console.log("Converted Portfolio ID:", convertedPortfolioId, "Converted Stock ID:", convertedStockId);

        // Check if the portfolio exists
        const portfolio = await PortfolioStock.findOne({ portfolio_id: convertedPortfolioId });
        console.log(portfolio, "=============================");
        if (!portfolio) {
            return NextResponse.json({ message: "Portfolio not found" }, { status: 404 });
        }

        // Delete the stock from the portfolio
        const deletedStock = await PortfolioStock.deleteOne({
            stock_id: convertedStockId,
            portfolio_id: convertedPortfolioId,
        });

        console.log(deletedStock, "to be deleted stockkkkkkkkkkkkkkkkkkkkkkkkk");

        if (deletedStock.deletedCount === 0) {
            return NextResponse.json({ message: "Stock not found in portfolio" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Stock deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting stock ❌", error);
        return NextResponse.json({ message: "Failed to delete stock" }, { status: 500 });
    }
}
