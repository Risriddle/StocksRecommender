




import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import { Portfolio } from "@/lib/db/models/Portfolio";
import { PortfolioStock } from "@/lib/db/models/PortfolioStock";
import calculateStockReturns from "@/lib/calculateReturns";
import {Stock} from "@/lib/db/models/Stock"

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        // Fetch portfolios and populate user role
        const portfolios = await Portfolio.find()
            .populate({
                path: "user_id",
                select: "role",
            });

        const portfolioIds = portfolios.map(portfolio => portfolio._id);

        // Fetch stocks separately using PortfolioStock model
        const portfolioStocks = await PortfolioStock.find({ portfolio_id: { $in: portfolioIds } })
            .populate({
                path: "stock_id",
                select: "name",
            });

        // Map stocks to their respective portfolios
        const portfolioMap = portfolios.map(portfolio => {
            const stocks = portfolioStocks.filter(stock => stock.portfolio_id.equals(portfolio._id));
            return {
                ...portfolio.toObject(),
                stocks,
            };
        });

        // console.log(portfolioMap, "Fetched Admin Portfolios");

        // Filter only admin portfolios
        const adminPortfolios = portfolioMap.filter(portfolio => portfolio.user_id?.role === "admin");

        // console.log(adminPortfolios, "Admin Portfolios");

        // Function to calculate portfolio metrics
        const calculatePortfolioMetrics = async (portfolio) => {
            let totalInvested = 0;
            let totalCurrentValue = 0;
            let stockReturns = [];
            let weekReturns = [];
            let monthReturns = [];
            let threeMonthReturns = [];
            let returnSinceAdded = [];
            let returnSinceBuy = [];
            let requiredReturns = [];
        
            for (const stockEntry of portfolio.stocks) {
                console.log(stockEntry)
                const stock = stockEntry.stock_id;
                if (!stock) continue;
        
                const stockReturnsData = await calculateStockReturns(stock._id);
                if (!stockReturnsData) continue;
        
                // Assuming stockEntry.quantity represents how many units of stock are held
                // const stockPrice = stockReturnsData.current_price || 0; // Use currentPrice if available
                const stockData=await Stock.findById({_id:stock._id})
                const stockPrice=stockData.current_price

                console.log(stockData.name,stockPrice,"current stock priceeeeeeeeeeeeeeeeeeeee")
                const investedAmount = 1 * stockPrice; // Calculate investment based on price and quantity
        
                totalInvested += investedAmount;
        
                // Store individual stock returns
                stockReturns.push({
                    stockName: stock.name,
                    ...stockReturnsData,
                    investedAmount,
                });
        
                // Collect stock returns for averaging
                if (stockReturnsData.oneWeekReturn) weekReturns.push(parseFloat(stockReturnsData.oneWeekReturn));
                if (stockReturnsData.oneMonthReturn) monthReturns.push(parseFloat(stockReturnsData.oneMonthReturn));
                if (stockReturnsData.threeMonthReturn) threeMonthReturns.push(parseFloat(stockReturnsData.threeMonthReturn));
                if (stockReturnsData.returnSinceAdded) returnSinceAdded.push(parseFloat(stockReturnsData.returnSinceAdded));
                if (stockReturnsData.returnSinceBuy) returnSinceBuy.push(parseFloat(stockReturnsData.returnSinceBuy));
                if (stockEntry.requiredReturn) requiredReturns.push(stockEntry.requiredReturn);
        
                // Portfolio-level calculations
                if (stockReturnsData.returnSinceAdded) {
                    totalCurrentValue += investedAmount * (1 + parseFloat(stockReturnsData.returnSinceAdded) / 100);
                }
            }
        
            // Calculate total portfolio return
            const portfolioReturn = totalInvested > 0 ? ((totalCurrentValue - totalInvested) / totalInvested) * 100 : 0;
        
            // Function to calculate average safely
            const average = (arr) => (arr.length > 0 ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2) + "%" : "N/A");
        
            return {
                _id: portfolio._id,
                portfolioName: portfolio.name,
                totalInvested,
                totalCurrentValue,
                portfolioReturn: portfolioReturn.toFixed(2) + "%",
                avgWeekReturn: average(weekReturns),
                avg1MonthReturn: average(monthReturns),
                avg3MonthReturn: average(threeMonthReturns),
                avgReturnSinceAdded: average(returnSinceAdded),
                avgReturnSinceBuy: average(returnSinceBuy),
                avgRequiredReturn: average(requiredReturns),
                stockReturns,
            };
        };
        
        // Process each admin portfolio
        const portfolioMetrics = await Promise.all(adminPortfolios.map(calculatePortfolioMetrics));
// console.log(portfolioMetrics,"metrics========================")
        return NextResponse.json(portfolioMetrics, { status: 200 });
    } catch (error) {
        console.error("Error fetching admin portfolios ❌", error);
        return NextResponse.json({ message: "Failed to fetch portfolios" }, { status: 500 });
    }
}

