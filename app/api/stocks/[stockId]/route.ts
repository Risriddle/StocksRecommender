import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import calculateStockReturns from "@/lib/calculateReturns";

import { Stock } from '@/lib/db/models/Stock';
import { StockIndicator } from '@/lib/db/models/StockIndicator';
import { Recommendation } from '@/lib/db/models/Recommendation';


export async function GET(req: NextRequest, context: { params?: { stockId?: string } }) {
    try {
        await dbConnect();
        const  stockId  = context.params?.stockId;

        console.log(stockId, "Stock ID received");

        if (!stockId) {
            return NextResponse.json({ message: "Stock ID is required" }, { status: 400 });
        }

        const returns = await calculateStockReturns(stockId);
          
        if (!returns) {
            return NextResponse.json({ message: "Returns data not found" }, { status: 404 });
        }

        console.log(returns, "Calculated stock returns");

        return NextResponse.json({ success: true, data: returns }, { status: 200 });
    } catch (error) {
        console.error("Error calculating stock returns ❌", error);
        return NextResponse.json({ message: "Failed to calculate stock returns" }, { status: 500 });
    }
}




// 📌 DELETE: Delete stock from MongoDB
export async function DELETE(req: NextRequest, context: { params?: { stockId?: string } }) {
    await dbConnect();
    const  stockId  = context.params?.stockId;

    console.log(stockId, "Stock ID received in deleteeeeeeeeeeeeeeeeeestock");

    if (!stockId) {
        return NextResponse.json({ message: "Stock ID is required" }, { status: 400 });
    }
    try {
      
     

        await Stock.findByIdAndDelete(stockId);
        await StockIndicator.findOneAndDelete({stock_id:stockId});
        await Recommendation.findOneAndDelete({stock_id:stockId});
       

        return NextResponse.json({ success: true, message: 'Stock deleted successfully' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
