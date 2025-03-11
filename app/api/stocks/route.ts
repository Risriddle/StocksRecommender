import { NextRequest, NextResponse } from 'next/server';
import  dbConnect  from '@/lib/db/connect';
import { Stock } from '@/lib/db/models/Stock';
import axios from "axios";
import { StockPriceHistory } from "@/lib/db/models/StockPriceHistory";




// export async function GET(req: NextRequest) {
//   await dbConnect();

//   try {
    
//     const stocks = await Stock.find({}); 
    
//     return NextResponse.json(stocks, { status: 200 });

//   } catch (error: any) {
//     console.error("Error fetching stocks:", error);
//     return NextResponse.json({ error: "Error fetching stocks" }, { status: 500 });
//   }
// }


import { Returns } from "@/lib/db/models/Returns";

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    // Fetch all stocks and populate the associated returns
    const stocks = await Stock.find({})
      .lean(); // Converts Mongoose documents to plain JS objects for better performance

    // Fetch returns for each stock and merge data
    const stockData = await Promise.all(
      stocks.map(async (stock) => {
        const stockReturns = await Returns.findOne({ stock_id: stock._id }).lean();
        return {
          ...stock,
          returns: stockReturns || null, // Attach returns if found, otherwise null
        };
      })
    );

    return NextResponse.json(stockData, { status: 200 });

  } catch (error: any) {
    console.error("Error fetching stocks with returns:", error);
    return NextResponse.json({ error: "Error fetching stocks with returns" }, { status: 500 });
  }
}





export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { symbol,exchange,industry,category } = await req.json()

    if (!symbol) {
      return NextResponse.json({ error: "symbol is required" }, { status: 400 });
    }
    
    const today = new Date().toISOString().split("T")[0]; 
    const stock = await Stock.findOne({name:symbol});
    if (stock) return NextResponse.json({ error: "Stock already added" }, { status: 404 });
    

    // Fetch stock price 
    const response = await axios.get(`http://13.126.252.191/stock-info?stock=${symbol}`);
    console.log(response,"=====")
    if(response.data.currentStockPrice==="N/A")
    {
      return NextResponse.json({ success: false,message:"Stock Data not available"},{status:500});

    }

   const stockDetails=response.data
   console.log(stockDetails,"stock detailssssss on addd---------------------------")
   

    const newStock = {
        name: symbol,
        company:stockDetails.stockCompanyName,
        country:stockDetails.country,
        exchange: exchange,
        industry: industry || "N/A",
        category: category || "N/A",
        currency:stockDetails.currency,
        current_price:stockDetails.currentStockPrice || 0,
        status: "MONITOR",
      };
      
      const savenewStock = new Stock(newStock);
      await savenewStock.save();

      const NewStock=await Stock.findOne({name:symbol})

      const newEntry = new StockPriceHistory({
        stock_id: NewStock._id,
        date: Date.now(),
        price: stockDetails.currentStockPrice,
      });

     const his= await newEntry.save();
      console.log(his,"stock history saved---------------------------------------------------------------------")
      
      // const update=await updateNewStock(NewStock._id)
      // if(update){
      //   return NextResponse.json({ success: true, stock: NewStock });
      //  }
      return NextResponse.json({ success: true, stock: NewStock });
    }

   catch (error) {
    console.error("Error fetching stock data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}



