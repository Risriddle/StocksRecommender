import { NextResponse,NextRequest } from "next/server";
import dbConnect from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";

export async function GET() {
    try {
        await dbConnect();
        const users = await User.find({}, "id username email role created_at");
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error("Error fetching users ❌", error);
        return NextResponse.json({ message: "Failed to fetch users" }, { status: 500 });
    }
}


