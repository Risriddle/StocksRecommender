import { NextResponse,NextRequest } from "next/server";
import  dbConnect  from "@/lib/db/connect";
import { StockPriceHistory } from "@/lib/db/models/StockPriceHistory";
import { format } from "date-fns";

export async function GET(req:NextRequest) {
  try {
    await dbConnect(); // Ensure MongoDB is connected

    const url = new URL(req.url);
    const period = url.searchParams.get("period") || "1M";

    // Define the date range based on the selected period
    const endDate = new Date();
    let startDate = new Date();

    switch (period) {
      case "1W":
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "1M":
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case "3M":
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case "6M":
        startDate.setMonth(endDate.getMonth() - 6);
        break;
      case "1Y":
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate = new Date("2000-01-01"); // All-time data
    }

    // Fetch stock data within the date range
    const stocks = await StockPriceHistory.find({
      date: { $gte: startDate, $lte: endDate },
    }).populate("stock_id", "name");

    type StockEntry = {
        date: string;
        [key: string]: number | string; 
      };
      
      const formattedData = stocks.reduce<StockEntry[]>((acc, stock) => {
        const formattedDate = format(stock.date, "MMM dd");
      
        const existingEntry = acc.find((entry) => entry.date === formattedDate);
        if (existingEntry) {
          existingEntry[stock.stock_id.name] = stock.price;
        } else {
          acc.push({ date: formattedDate, [stock.stock_id.name]: stock.price });
        }
      
        return acc;
      }, []);
      
    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching stock price history:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
