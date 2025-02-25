import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect"; 
import { StockPriceHistory } from "@/lib/db/models/StockPriceHistory";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "1M";
    const stockId = searchParams.get("stockId"); // Get stock ID from query params

    if (!stockId) {
      return NextResponse.json({ error: "Stock ID is required" }, { status: 400 });
    }

    let startDate = new Date();
    switch (period) {
      case "1W": startDate.setDate(startDate.getDate() - 7); break;
      case "1M": startDate.setMonth(startDate.getMonth() - 1); break;
      case "3M": startDate.setMonth(startDate.getMonth() - 3); break;
      case "6M": startDate.setMonth(startDate.getMonth() - 6); break;
      case "1Y": startDate.setFullYear(startDate.getFullYear() - 1); break;
      case "ALL": startDate = new Date(0); break;
      default: return NextResponse.json({ error: "Invalid period" }, { status: 400 });
    }

    const priceHistory = await StockPriceHistory.find({
      stock_id: stockId, // Filter by stock_id
      date: { $gte: startDate },
    }).sort({ date: 1 });

    return NextResponse.json(priceHistory, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
