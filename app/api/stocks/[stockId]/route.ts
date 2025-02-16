import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import calculateStockReturns from "@/lib/calculateReturns";

export async function GET(req: NextRequest, { params }: { params: { stockId: string } }) {
    try {
        await dbConnect();
        const { stockId } = await Promise.resolve(params);

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
