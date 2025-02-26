import { NextRequest, NextResponse } from "next/server";
import { Stock } from "@/lib/db/models/Stock";
import { StockIndicator } from "@/lib/db/models/StockIndicator";
import { Recommendation } from "@/lib/db/models/Recommendation"; 
import dbConnect from "@/lib/db/connect";

import calculateStockReturns from "@/lib/calculateReturns";

type Recs={
  
    _id: string;
    stock_id: string;
    recommendation: string;
    reason: string;
    date_recommended: Date;
  
}
type Stock={
  _id:string;
}


export async function GET(req: NextRequest) {
  try {
    await dbConnect();
   
    const stocks = await Stock.find().lean();

    const stocksWithDetails = await Promise.all(
      stocks.map(async (stock:Stock) => {
        const indicator = await StockIndicator.findOne({ stock_id: stock._id }).lean();
        const latestRecommendation:Recs = await Recommendation.findOne({ stock_id: stock._id })
          .sort({ date_recommended: -1 }) // Get the most recent recommendation
          .lean();
        const returns = await calculateStockReturns(stock._id);
        console.log(latestRecommendation,"recssssssssssssss in stock/indicators api")
        return {
          ...stock,
          indicators: indicator || null,
          returns:returns,
          // recommendation: latestRecommendation?.recommendation || null,
          date_recommended: latestRecommendation?.date_recommended || null,
        };
      })
    );

    return NextResponse.json({ success: true, data: stocksWithDetails });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, error: "unknown" }, { status: 500 });
  }
}
