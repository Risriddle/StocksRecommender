import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import {Portfolio} from "@/lib/db/models/Portfolio";

export async function GET(req: NextRequest,{ params }: { params: { userId: string } }) {
    try {
        await dbConnect();
        const { userId } = await Promise.resolve(params); // ✅ Await params

        console.log(userId, "User ID received");

        if (!userId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        const portfolios = await Portfolio.find({ user_id: userId }).populate({
            path: "user_id",
            select: "role",
        });

        console.log(portfolios, "User's Portfolios");

        return NextResponse.json(portfolios, { status: 200 });
    } catch (error) {
        console.error("Error fetching portfolios ❌", error);
        return NextResponse.json({ message: "Failed to fetch portfolios" }, { status: 500 });
    }
}
