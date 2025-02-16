import { NextRequest, NextResponse } from 'next/server';
import { Stock } from '@/lib/db/models/Stock';
import { StockIndicator } from '@/lib/db/models/StockIndicator';
import dbConnect from '@/lib/db/connect';



export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const stocks = await Stock.find().lean();
    
    const stocksWithIndicators = await Promise.all(
      stocks.map(async (stock) => {
        const indicator = await StockIndicator.findOne({ stock_id: stock._id }).lean();
        return {
          ...stock,
          indicators: indicator || null,
        };
      })
    );

    return NextResponse.json({ success: true, data: stocksWithIndicators });
  } catch (error) {
    if(error instanceof Error){ return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
    return NextResponse.json({ success: false, error: "unknown" }, { status: 500 });
  }
}
