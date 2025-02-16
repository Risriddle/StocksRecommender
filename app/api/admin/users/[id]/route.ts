
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";

export async function DELETE(req: NextRequest, context: { params: { id?: string } }) {
    try {
        const { id } = await Promise.resolve(context.params); 

        if (!id) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        await dbConnect();
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting user ❌", error);
        return NextResponse.json({ message: "Failed to delete user" }, { status: 500 });
    }
}

