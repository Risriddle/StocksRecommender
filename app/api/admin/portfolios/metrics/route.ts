
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import { Portfolio } from "@/lib/db/models/Portfolio";
import { PortfolioStock } from "@/lib/db/models/PortfolioStock";
import { Stock } from "@/lib/db/models/Stock";
import { User } from "@/lib/db/models/User";
import calculateStockReturns from "@/lib/calculateReturns";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        // Fetch portfolios without populating
        const portfolios = await Portfolio.find({}, "_id user_id name");

        // Fetch user roles separately
        const userIds = portfolios.map(portfolio => portfolio.user_id);
        const users = await User.find({ _id: { $in: userIds } }, "_id role");

        // Create a map of user roles for quick lookup
        const userRoleMap = new Map(users.map(user => [user._id.toString(), user.role]));

        // Filter only admin portfolios
        const adminPortfolios = portfolios.filter(portfolio => 
            userRoleMap.get(portfolio.user_id.toString()) === "admin"
        );

        // Extract admin portfolio IDs
        const portfolioIds = adminPortfolios.map(portfolio => portfolio._id);

        // Fetch portfolio stocks with complete information
        const portfolioStocks = await PortfolioStock.find(
            { portfolio_id: { $in: portfolioIds } }
        ).lean();

        // Fetch current stock details
        const stockIds = portfolioStocks.map(ps => ps.stock_id);
        const stocks = await Stock.find(
            { _id: { $in: stockIds } }
        ).lean();

        // Create a stock map for quick lookup
        const stockMap = new Map(stocks.map(stock => [
            stock._id.toString(), 
            { 
                name: stock.name,
                company: stock.company,
                currentPrice: stock.current_price,
                status: stock.status
            }
        ]));

        // Map portfolios with their stocks
        const portfolioMap = adminPortfolios.map(portfolio => {
            const portfolioStocksFiltered = portfolioStocks.filter(
                ps => ps.portfolio_id.toString() === portfolio._id.toString()
            );

            const stocksWithDetails = portfolioStocksFiltered.map(ps => {
                const stockDetails = stockMap.get(ps.stock_id.toString());
                return {
                    stock_id: ps.stock_id,
                    name: stockDetails?.name || "Unknown",
                    company: stockDetails?.company || "Unknown",
                    addedPrice: ps.added_price,
                    addedDate: ps.added_date,
                    currentPrice: stockDetails?.currentPrice || 0,
                    status: stockDetails?.status
                };
            });

            return {
                ...portfolio.toObject(),
                stocks: stocksWithDetails,
            };
        });

        // Function to calculate portfolio metrics
        const calculatePortfolioMetrics = async (portfolio) => {
            let totalInvested = 0;
            let totalCurrentValue = 0;
            let stockReturns = [];
            let weekReturns = [];
            let monthReturns = [];
            let threeMonthReturns = [];
            let sixMonthReturns = [];

            for (const stockEntry of portfolio.stocks) {
                const stockReturnsData = await calculateStockReturns(stockEntry.stock_id.toString());
                if (!stockReturnsData) continue;

                // Calculate invested amount based on added price
                const investedAmount = stockEntry.addedPrice;
                const currentValue = stockEntry.currentPrice;

                totalInvested += investedAmount;
                totalCurrentValue += currentValue;

                const individualReturn = ((currentValue - investedAmount) / investedAmount) * 100;

                stockReturns.push({
                    stockName: stockEntry.name,
                    company: stockEntry.company,
                    status: stockEntry.status,
                    investedAmount,
                    currentValue,
                    individualReturn: individualReturn.toFixed(2) + "%",
                    ...stockReturnsData
                });

                // Add returns to their respective arrays if they exist
                if (stockReturnsData.oneWeekReturn) weekReturns.push(parseFloat(stockReturnsData.oneWeekReturn));
                if (stockReturnsData.oneMonthReturn) monthReturns.push(parseFloat(stockReturnsData.oneMonthReturn));
                if (stockReturnsData.threeMonthReturn) threeMonthReturns.push(parseFloat(stockReturnsData.threeMonthReturn));
                if (stockReturnsData.sixMonthReturn) sixMonthReturns.push(parseFloat(stockReturnsData.sixMonthReturn));
            }

            // Calculate overall portfolio return
            const portfolioReturn = totalInvested > 0 
                ? ((totalCurrentValue - totalInvested) / totalInvested) * 100 
                : 0;

            // Helper function to calculate average returns
            const calculateAverage = (returns) => {
                if (returns.length === 0) return "N/A";
                const avg = returns.reduce((a, b) => a + b, 0) / returns.length;
                return avg.toFixed(2) + "%";
            };

            return {
                _id: portfolio._id,
                portfolioName: portfolio.name,
                totalInvested: totalInvested.toFixed(2),
                totalCurrentValue: totalCurrentValue.toFixed(2),
                portfolioReturn: portfolioReturn.toFixed(2) + "%",
                metrics: {
                    avgWeekReturn: calculateAverage(weekReturns),
                    avg1MonthReturn: calculateAverage(monthReturns),
                    avg3MonthReturn: calculateAverage(threeMonthReturns),
                    avg6MonthReturn: calculateAverage(sixMonthReturns)
                },
                stockReturns: stockReturns.sort((a, b) => {
                    // Sort by status priority: BUY > HOLD > MONITOR > SELL
                    const statusPriority = { BUY: 0, HOLD: 1, MONITOR: 2, SELL: 3 };
                    return statusPriority[a.status] - statusPriority[b.status];
                })
            };
        };

        const portfolioMetrics = await Promise.all(portfolioMap.map(calculatePortfolioMetrics));

        return NextResponse.json(portfolioMetrics, { status: 200 });
    } catch (error) {
        console.error("Error fetching admin portfolios ❌", error);
        return NextResponse.json(
            { message: "Failed to fetch portfolios", error: error instanceof Error ? error.message : "Unknown error" }, 
            { status: 500 }
        );
    }
}