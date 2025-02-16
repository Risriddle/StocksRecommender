import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import { Portfolio } from "@/lib/db/models/Portfolio";



// Get all standard portfolios
export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        // Fetch only portfolios where the user_id belongs to an admin
        const portfolios = await Portfolio.find()
            .populate({
                path: "user_id",
                select: "role", // Fetch only the role field for efficiency
            });
console.log(portfolios,"0000000000000000000000000000000")
        // Filter portfolios where the associated user is an admin
        const adminPortfolios = portfolios.filter(portfolio => portfolio.user_id?.role === "admin");
console.log(adminPortfolios,"9999999999999999999999999999999999")
        return NextResponse.json(adminPortfolios, { status: 200 });
    } catch (error) {
        console.error("Error fetching admin portfolios ❌", error);
        return NextResponse.json({ message: "Failed to fetch portfolios" }, { status: 500 });
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
