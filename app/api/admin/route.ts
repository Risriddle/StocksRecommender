
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { Stock } from "@/lib/db/models/Stock";
import { Portfolio } from "@/lib/db/models/Portfolio";

export async function GET(req: NextRequest) {
    try {
        console.log("API Route: getAdminStats function called");

        await dbConnect();
        console.log("Database connected ");

        const totalUsers = await User.countDocuments({ role: { $ne: "admin" } });
        const activeStocks = await Stock.countDocuments({});
        const portfolios = await Portfolio.countDocuments({});

        console.log("Counts retrieved ");

        return NextResponse.json({
            totalUsers: String(totalUsers),
            activeStocks: String(activeStocks),
            portfolios: String(portfolios),
        }, { status: 200 });

    } catch (error) {
        console.error("Error in API Route getAdminStats ", error);
        return NextResponse.json({ message: "Failed to fetch admin stats" }, { status: 500 });
    }
}

