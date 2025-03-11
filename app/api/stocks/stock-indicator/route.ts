import { NextRequest, NextResponse } from "next/server";
import { Stock } from "@/lib/db/models/Stock";
import { StockIndicator } from "@/lib/db/models/StockIndicator";
import { Recommendation } from "@/lib/db/models/Recommendation"; 
import dbConnect from "@/lib/db/connect";

import calculateStockReturns from "@/lib/calculateReturns";

type Recs = {
  _id: string;
  stock_id: string;
  recommendation: string;
  reason: string;
  date_recommended: Date;
};

type StockType = {
  _id: string;
};

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const stockId = searchParams.get("stock_id"); // Get stock_id from query params
    console.log(stockId,"stokc id in stock-indicator api------------------------------------------------")
    if (!stockId) {
      return NextResponse.json({ success: false, error: "stock_id is required" }, { status: 400 });
    }

    // Fetch the stock by ID
    const stock = await Stock.findById(stockId).lean();
    if (!stock) {
      return NextResponse.json({ success: false, error: "Stock not found" }, { status: 404 });
    }

    // Fetch stock indicator, recommendation, and returns
    const indicator = await StockIndicator.findOne({ stock_id: stockId }).lean();
    const latestRecommendation: Recs = await Recommendation.findOne({ stock_id: stockId })
      .sort({ date_recommended: -1 })
      .lean();
    const returns = await calculateStockReturns(stockId);
     console.log(returns,"in indicator apiiiiiiiiiiiiiii")
    // Return the stock with its details
    return NextResponse.json({
      success: true,
      data: {
        ...stock,
        indicators: indicator || null,
        returns: returns,
        date_recommended: latestRecommendation?.date_recommended || null,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, error: "Unknown error" }, { status: 500 });
  }
}
