import { NextRequest, NextResponse } from "next/server";
import { FeaturedStocks } from "@/lib/db/models/FeaturedStocks";
import { Stock } from "@/lib/db/models/Stock";
import { StockIndicator } from "@/lib/db/models/StockIndicator";
import dbConnect from "@/lib/db/connect";


export async function GET(request: NextRequest) {
  await dbConnect();
  
  try {
    // Fetch featured stocks first
    const featuredStocks = await FeaturedStocks.find();

    // Manually fetch stock details and indicators for each featured stock
    const populatedStocks = await Promise.all(
      featuredStocks.map(async (featuredStock) => {
        const stockDetails = await Stock.findById(featuredStock.stock).select("name company current_price");
        const stockIndicators = await StockIndicator.findOne({ stock_id: featuredStock.stock })
        
        return {
          ...featuredStock.toObject(), // Convert Mongoose document to a plain object
          stockDetails: stockDetails || null, // Attach stock details or null if not found
          stockIndicators: stockIndicators || null, // Attach stock indicators or null if not found
        };
      })
    );

    console.log(populatedStocks, "in apiiiiiiiiiiiiiiiiiiiiii");

    return NextResponse.json({ success: true, data: populatedStocks });
  } catch (error) {
    console.error("Error fetching featured stocks:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch featured stocks" }, { status: 500 });
  }
}
