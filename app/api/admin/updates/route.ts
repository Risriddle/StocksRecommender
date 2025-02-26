import { NextRequest, NextResponse } from "next/server";
import { StockIndicator } from "@/lib/db/models/StockIndicator";
import { Stock } from "@/lib/db/models/Stock";
import dbConnect from "@/lib/db/connect";
import { updateNewStock } from "@/lib/updateNewStock";

// Helper function to fetch outdated stocks
async function getOutdatedStocks() {
  await dbConnect();
  const stocks = await Stock.find();
  const outdatedStocks = [];

  for (const stock of stocks) {
    let stockIndicator = await StockIndicator.findOne({ stock_id: stock._id });

    if (!stockIndicator) {
      // Newly added stock with no indicator data
      outdatedStocks.push({ stockId: stock._id, name: stock.name, reason: "New stock, no data available" });
      continue;
    }

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    if (!stockIndicator.last_updated || stockIndicator.last_updated < oneWeekAgo) {
      // Stock needs updating (more than a week old)
      outdatedStocks.push({ stockId: stock._id, name: stock.name, reason: "Last updated over a week ago" });
    }
  }

  return outdatedStocks;
}

// GET API: Fetch stocks needing updates
export async function GET() {
  try {
    const outdatedStocks = await getOutdatedStocks();
    return NextResponse.json({ success: true, outdatedStocks });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error fetching stocks", error });
  }
}

// POST API: Update stocks
export async function POST(req: NextRequest) {
  try {
    const { stockId, updateAll } = await req.json();
    let stocksToUpdate = [];

    if (updateAll) {
      stocksToUpdate = await getOutdatedStocks(); // Get all outdated stocks
    } else if (stockId) {
      const stock = await Stock.findById(stockId);
      if (!stock) return NextResponse.json({ success: false, message: "Stock not found" });
      stocksToUpdate.push({ stockId: stock._id, name: stock.name });
    }

    if (stocksToUpdate.length === 0) {
      return NextResponse.json({ success: false, message: "No stocks to update" });
    }

    for (const stock of stocksToUpdate) {
      // Perform update logic here (you may call an update function)
      const update=await updateNewStock(stock.stockId)
      if(!update)
      {
        return NextResponse.json({ success: false, message: `Try again Later!` });
      }
      console.log(`Updating stock: ${stock.name},${update}`);
    //   await StockIndicator.findOneAndUpdate(
    //     { stock_id: stock.stockId },
    //     { last_updated: new Date() },
    //     { upsert: true }
    //   );
    }

    return NextResponse.json({ success: true, message: `Updated ${stocksToUpdate.length} stocks` });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error updating stocks", error });
  }
}
