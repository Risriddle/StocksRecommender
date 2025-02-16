

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";

export async function PUT(req: NextRequest, context: { params: { id?: string } }) {
    try {
        // ✅ Await the params correctly
        const { id } = await Promise.resolve(context.params); 
        console.log(id,"useriddddddddddddddddddddddddddddd")
        if (!id) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        const { role } = await req.json();
        if (!role) {
            return NextResponse.json({ message: "Role is required" }, { status: 400 });
        }

        await dbConnect();
        const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true });

        if (!updatedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User role updated successfully", user: updatedUser }, { status: 200 });
    } catch (error) {
        console.error("Error updating user role ❌", error);
        return NextResponse.json({ message: "Failed to update role" }, { status: 500 });
    }
}
