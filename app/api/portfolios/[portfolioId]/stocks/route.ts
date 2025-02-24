
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import {PortfolioStock} from "@/lib/db/models/PortfolioStock";
import {Stock} from "@/lib/db/models/Stock";



export async function POST(req: NextRequest, context: { params?: { portfolioId?: string } }) {
    try {
        await dbConnect();
        const portfolioId = context.params?.portfolioId;
        console.log("Portfolio ID:", portfolioId);

        const { stock } = await req.json();
        console.log(stock._id, "stock id in add stockkkkkkkkkkkkkkkkkkk");

        if (!stock.name || !stock.current_price) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        if (!portfolioId) {
            return NextResponse.json({ message: "Invalid portfolio ID" }, { status: 400 });
        }

        const convertedPortfolioId = new mongoose.Types.ObjectId(portfolioId);
        const convertedStockId = new mongoose.Types.ObjectId(stock._id);

        // Check if stock is already in portfolio
        const existingStock = await PortfolioStock.findOne({
            portfolio_id: convertedPortfolioId,
            stock_id: convertedStockId
        });

        if (existingStock) {
            return NextResponse.json({ message: "Stock already exists in the portfolio" }, { status: 200 });
        }

        // Add new stock
        const newStock = new PortfolioStock({
            portfolio_id: convertedPortfolioId,
            stock_id: convertedStockId,
            name: stock.name,
            added_price: stock.current_price,
            added_date: new Date()
        });

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
           const { stock} = await req.json();
           const portfolioId  = context.params?.portfolioId;

           console.log("Portfolio ID:", portfolioId);
       
        console.log("Received Portfolio ID:", portfolioId, "Stock ID:", stock._id, "in delete stockkkkkkkkkkkkkkk");

        if (!portfolioId) {
            return NextResponse.json({ message: "Invalid portfolio ID" }, { status: 400 });
        }
        // const convertedPortfolioId = new mongoose.Types.ObjectId(portfolioId);
        // const convertedStockId = new mongoose.Types.ObjectId(stock._id);

        // console.log("Converted Portfolio ID:", convertedPortfolioId, "Converted Stock ID:", convertedStockId);

        // Check if the portfolio exists
        const portfolio = await PortfolioStock.findOne({ portfolio_id: portfolioId });
        console.log(portfolio, "=============================");
        if (!portfolio) {
            return NextResponse.json({ message: "Portfolio not found" }, { status: 404 });
        }

        // Delete the stock from the portfolio
        const deletedStock = await PortfolioStock.deleteOne({
            stock_id: stock._id,
            portfolio_id: portfolioId,
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
