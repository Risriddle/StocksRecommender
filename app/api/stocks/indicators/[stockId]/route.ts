import { NextRequest, NextResponse } from "next/server";
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

export async function GET(req: NextRequest, { params }: { params: { stockId: string } }) {
  try {
    await dbConnect();
    const { stockId } = params;

    // Fetch stock indicators
    const indicator = await StockIndicator.findOne({ stock_id: stockId }).lean();
    
    // Fetch latest recommendation
    const latestRecommendation: Recs | null = await Recommendation.findOne({ stock_id: stockId })
      .sort({ date_recommended: -1 })
      .lean();

    // Fetch returns
    const returns = await calculateStockReturns(stockId);

    return NextResponse.json({
      success: true,
      data: {
        indicators: indicator || null,
        returns: returns,
        date_recommended: latestRecommendation?.date_recommended || null,
      },
    });
  } catch (error) {
    console.error("Error fetching stock indicators:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "unknown" },
      { status: 500 }
    );
  }
}
