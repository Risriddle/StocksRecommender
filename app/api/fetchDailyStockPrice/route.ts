// import { NextRequest, NextResponse } from "next/server";
// import dbConnect from "@/lib/db/connect";
// import { Stock } from "@/lib/db/models/Stock";
// import { StockPriceHistory } from "@/lib/db/models/StockPriceHistory";
// import axios from "axios";

// export async function GET(req: NextRequest) {
//   await dbConnect();

//   try {
//     const today = new Date().toISOString().split("T")[0];

//     // Fetch all stocks
//     const stocks = await Stock.find({});

//     for (const stock of stocks) {
//       // Check if today's price is already recorded in StockPriceHistory
//       const existingEntry = await StockPriceHistory.findOne({
//         stock_id: stock._id,
//         date: { $gte: new Date(today), $lt: new Date(today + "T23:59:59Z") },
//       });

//       if (existingEntry) {
//         console.log(`Skipping ${stock.name}, already updated today.`);
//         continue; // Skip fetching price if already present
//       }

//       // Fetch stock price from external API
//       const response = await axios.get(
//         `http://13.126.252.191/stock-info?stock=${stock.name}`
//       );
//       const current_price = response.data.currentStockPrice;

//       console.log(`Fetched price for ${stock.name}: ${current_price}`);

//       // Update stock's current price
//       await Stock.findByIdAndUpdate(stock._id, { current_price });

//       // Save today's price in StockPriceHistory
//       await StockPriceHistory.create({
//         stock_id: stock._id,
//         date: new Date(),
//         price: current_price,
//       });
//     }

//     return NextResponse.json(
//       { message: "Stock prices updated successfully" },
//       { status: 200 }
//     );

//   } catch (error: any) {
//     console.error("Error fetching stocks:", error.message);
//     return NextResponse.json({ error: "Error fetching stocks" }, { status: 500 });
//   }
// }




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

    // Check if all stocks already have an entry for today
    const existingEntries = await StockPriceHistory.find({
      date: { $gte: new Date(today), $lt: new Date(today + "T23:59:59Z") },
    });

    if (existingEntries.length === stocks.length) {
      console.log("All stocks are already updated for today. Exiting.");
      return NextResponse.json(
        { message: "All stocks are already updated for today" },
        { status: 200 }
      );
    }

    // Process only stocks that don't have today's entry
    const stocksToUpdate = stocks.filter(
      (stock) => !existingEntries.some((entry) => entry.stock_id.equals(stock._id))
    );

    for (const stock of stocksToUpdate) {
      // Fetch stock price from external API
      const response = await axios.get(
        `http://13.126.252.191/stock-info?stock=${stock.name}`
      );
      const current_price = response.data.currentStockPrice;

      console.log(`Fetched price for ${stock.name}: ${current_price}`);

      // Update stock's current price
      await Stock.findByIdAndUpdate(stock._id, { current_price });

      // Save today's price in StockPriceHistory
      await StockPriceHistory.create({
        stock_id: stock._id,
        date: new Date(),
        price: current_price,
      });
    }

    return NextResponse.json(
      { message: "Stock prices updated successfully" },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error fetching stocks:", error.message);
    return NextResponse.json({ error: "Error fetching stocks" }, { status: 500 });
  }
}
