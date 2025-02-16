import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import {Stock} from "@/lib/db/models/Stock";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("query");
       
        if (!query) {
            return NextResponse.json({ message: "Search query is required" }, { status: 400 });
        }

        const stocks = await Stock.find({ name: { $regex: query, $options: "i" } });
           if (!stocks){
            return NextResponse.json([] , { status: 200 });
        }
        return NextResponse.json({ stocks }, { status: 200 });
    } catch (error) {
        console.error("Error searching stocks ❌", error);
        return NextResponse.json({ message: "Failed to search stocks" }, { status: 500 });
    }
}
