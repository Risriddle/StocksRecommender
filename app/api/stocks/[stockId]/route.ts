import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import calculateStockReturns from "@/lib/calculateReturns";

import { Stock } from '@/lib/db/models/Stock';
import { StockIndicator } from '@/lib/db/models/StockIndicator';
import { Recommendation } from '@/lib/db/models/Recommendation';


export async function GET(req: NextRequest, context: { params?: { stockId?: string } }) {
    try {
        await dbConnect();
        const  stockId  = context.params?.stockId;

        console.log(stockId, "Stock ID received");

        if (!stockId) {
            return NextResponse.json({ message: "Stock ID is required" }, { status: 400 });
        }

        const returns = await calculateStockReturns(stockId);
        console.log(returns,"returns in api/stock/stockId--------------------------------------------------")
        if (!returns) {
            return NextResponse.json({ message: "Returns data not found" }, { status: 404 });
        }

        console.log(returns, "Calculated stock returns");

        return NextResponse.json({ success: true, data: returns }, { status: 200 });
    } catch (error) {
        console.error("Error calculating stock returns ❌", error);
        return NextResponse.json({ message: "Failed to calculate stock returns" }, { status: 500 });
    }
}




// 📌 DELETE: Delete stock from MongoDB
export async function DELETE(req: NextRequest, context: { params?: { stockId?: string } }) {
    await dbConnect();
    const  stockId  = context.params?.stockId;

    console.log(stockId, "Stock ID received in deleteeeeeeeeeeeeeeeeeestock");

    if (!stockId) {
        return NextResponse.json({ message: "Stock ID is required" }, { status: 400 });
    }
    try {
      
        await StockIndicator.deleteMany({stock_id:stockId});
        await Recommendation.deleteMany({stock_id:stockId});
        await Stock.findByIdAndDelete(stockId);
       
       

        return NextResponse.json({ success: true, message: 'Stock deleted successfully' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}





export async function PUT(
    request: NextRequest,
    context: { params?: { stockId?: string } }
  ) {
    const stockId = context?.params.stockId;
  
   
    // if (!mongoose.Types.ObjectId.isValid(stockId)) {
    //   return NextResponse.json(
    //     { success: false, message: "Invalid stock ID format" },
    //     { status: 400 }
    //   );
    // }
  
    try {
      // Connect to database
      await dbConnect();
  
      // Parse request body
      const body = await request.json();
      const { stock, indicators } = body;
  
      if (!stock) {
        return NextResponse.json(
          { success: false, message: "Stock data is required" },
          { status: 400 }
        );
      }
  
      // Update stock information
      const updatedStock = await Stock.findByIdAndUpdate(
        stockId,
        {
          name: stock.name,
          company: stock.company,
          exchange: stock.exchange,
          industry: stock.industry,
          category: stock.category,
          current_price: stock.current_price,
          status: stock.status,
          country: stock.country,
          currency: stock.currency,
        },
        { new: true, runValidators: true }
      );
  
      if (!updatedStock) {
        return NextResponse.json(
          { success: false, message: "Stock not found" },
          { status: 404 }
        );
      }
  
      // If status has changed, create a new recommendation
      const originalStock = await Stock.findById(stockId);
      if (originalStock && originalStock.status !== stock.status) {
        await Recommendation.findOneAndUpdate({stock_id:stockId},
            {  recommendation: stock.status,
            reason: `Status updated from ${originalStock.status} to ${stock.status}`,
            date_recommended: new Date()},{ new: true, runValidators: true })
        // await Recommendation.create({
        //   stock_id: stockId,
        //   recommendation: stock.status,
        //   reason: `Status updated from ${originalStock.status} to ${stock.status}`,
        //   date_recommended: new Date(),
        // });
      }
  
      // Update or create stock indicators if provided
      let updatedIndicators = null;
      if (indicators) {
        // Check if indicators exist for this stock
        const existingIndicators = await StockIndicator.findOne({
          stock_id: stockId,
        });
  
        if (existingIndicators) {
          // Update existing indicators
          updatedIndicators = await StockIndicator.findOneAndUpdate(
            { stock_id: stockId },
            {
              growth_rating: indicators.growth_rating,
              momentum_score: indicators.momentum_score,
              risk_score: indicators.risk_score,
              value_rating: indicators.value_rating,
              volume: indicators.volume,
              market_cap: indicators.market_cap,
              pe_ratio: indicators.pe_ratio,
              last_updated: new Date(),
            },
            { new: true, runValidators: true }
          );
        } else {
          // Create new indicators
          updatedIndicators = await StockIndicator.create({
            stock_id: stockId,
            growth_rating: indicators.growth_rating || "Medium",
            momentum_score: indicators.momentum_score || "Medium",
            risk_score: indicators.risk_score || "Medium",
            value_rating: indicators.value_rating || "Medium",
            volume: indicators.volume,
            market_cap: indicators.market_cap,
            pe_ratio: indicators.pe_ratio,
            last_updated: new Date(),
          });
        }
      }
  
      return NextResponse.json({
        success: true,
        message: "Stock updated successfully",
        data: {
          stock: updatedStock,
          indicators: updatedIndicators,
        },
      });
    } catch (error: any) {
      console.error("Error updating stock:", error);
      
      // Handle validation errors
      if (error.name === "ValidationError") {
        const validationErrors = Object.values(error.errors).map(
          (err: any) => err.message
        );
        return NextResponse.json(
          {
            success: false,
            message: "Validation error",
            errors: validationErrors,
          },
          { status: 400 }
        );
      }
  
      return NextResponse.json(
        { success: false, message: error.message || "Failed to update stock" },
        { status: 500 }
      );
    }
  }
  