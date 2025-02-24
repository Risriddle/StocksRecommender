import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import { Stock } from "@/lib/db/models/Stock";
import { StockPriceHistory } from "@/lib/db/models/StockPriceHistory";
import axios from "axios";

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const today = new Date().toISOString().split("T")[0];

    // Fetch all stocks
    const stocks = await Stock.find({});

    for (const stock of stocks) {
      const stockDate = new Date(stock.added_date).toISOString().split("T")[0];

      // Skip stocks already updated today
      if (stockDate === today) continue;

      // Fetch stock price from external API
      const response = await axios.get(
        `http://13.126.252.191/stock-info?stock=${stock.name}`
      );
      const current_price = response.data.currentStockPrice;

      console.log(`Fetched price for ${stock.name}: ${current_price}`);

      // Update stock's current price
      await Stock.findByIdAndUpdate(stock._id, { current_price });

      // Check if today's price is already recorded
      const existingEntry = await StockPriceHistory.findOne({
        stock_id: stock._id,
        date: { $gte: new Date(today), $lt: new Date(today + "T23:59:59Z") },
      });

      if (!existingEntry) {
        // Save today's price in StockPriceHistory
        await StockPriceHistory.create({
          stock_id: stock._id,
          date: new Date(),
          price: current_price,
        });
      }
    }

    return NextResponse.json({ message: "Stock prices updated successfully" }, { status: 200 });

  } catch (error: any) {
    console.error("Error fetching stocks:", error.message);
    return NextResponse.json({ error: "Error fetching stocks" }, { status: 500 });
  }
}
