import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import {Portfolio} from "@/lib/db/models/Portfolio";

export async function GET(req: NextRequest,{ params }: { params: { portfolioId: string } }) {
    try {
        await dbConnect();
        const { portfolioId } = await Promise.resolve(params); 

        console.log(portfolioId, "portfolio ID received");

        if (!portfolioId) {
            return NextResponse.json({ message: "portfolio ID is required" }, { status: 400 });
        }

        const portfolios = await Portfolio.find({ _id: portfolioId }).populate({
            path: "user_id",
            select: "role",
        });

        console.log(portfolios, "standarad  Portfolio by id");

        return NextResponse.json(portfolios, { status: 200 });
    } catch (error) {
        console.error("Error fetching portfolios ❌", error);
        return NextResponse.json({ message: "Failed to fetch portfolios" }, { status: 500 });
    }
}
