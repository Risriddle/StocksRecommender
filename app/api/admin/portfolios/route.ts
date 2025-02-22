import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import { Portfolio } from "@/lib/db/models/Portfolio";
import { User } from "@/lib/db/models/User";




export async function GET(req) {
    try {
        await dbConnect();

        // Get all admin user IDs
        const adminUsers = await User.find({ role: "admin" }, "_id");
        const adminUserIds = adminUsers.map(user => user._id);

        // Fetch portfolios where user_id is in the list of admin IDs
        const adminPortfolios = await Portfolio.find({ user_id: { $in: adminUserIds } });

        return NextResponse.json(adminPortfolios, { status: 200 });
    } catch (error) {
        console.error("Error fetching admin portfolios ❌", error);
        return NextResponse.json(
            { message: "Failed to fetch portfolios" },
            { status: 500 }
        );
    }
}







// Create a new portfolio
export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        console.log("Received Data:", body); 
        const { user_id,name, riskLevel, description } = body;
        // const { name,riskLevel,description } = await req.json();
        // console.log(name,riskLevel,description,"in create portfolio apiiiiiiiiiiiiiiiiiiiiii")
        if (!name) {
            return NextResponse.json({ message: "Portfolio name is required" }, { status: 400 });
        }
        const newPortfolio = new Portfolio({ 
            user_id,
            name, 
            riskLevel: riskLevel ?? "default", 
            description: description ?? "default" 
        });
        console.log("Portfolio before saving:", newPortfolio);
        await newPortfolio.save();
        return NextResponse.json({ success: true, portfolio: newPortfolio }, { status: 201 });
    } catch (error) {
        console.error("Error creating portfolio ❌", error);
        return NextResponse.json({ message: "Failed to create portfolio" }, { status: 500 });
    }
}




//update a portfolio
export async function PATCH(req: NextRequest) {
    try {
        await dbConnect();
        const { id, name,riskLevel,description} = await req.json();

        if (!id) {
            return NextResponse.json({ message: "Portfolio ID is required" }, { status: 400 });
        }

        const updatedPortfolio = await Portfolio.findByIdAndUpdate(
            id,
            { name ,riskLevel,description},
            { new: true, runValidators: true } 
        );

        if (!updatedPortfolio) {
            return NextResponse.json({ message: "Portfolio not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, portfolio: updatedPortfolio }, { status: 200 });
    } catch (error) {
        console.error("Error updating portfolio ❌", error);
        return NextResponse.json({ message: "Failed to update portfolio" }, { status: 500 });
    }
}


//delete portfolio
export async function DELETE(req: NextRequest) {
    try {
        await dbConnect();
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ message: "Portfolio ID is required" }, { status: 400 });
        }

        const deletedPortfolio = await Portfolio.findByIdAndDelete(id);

        if (!deletedPortfolio) {
            return NextResponse.json({ message: "Portfolio not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Portfolio deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting portfolio ❌", error);
        return NextResponse.json({ message: "Failed to delete portfolio" }, { status: 500 });
    }
}
