import { NextRequest, NextResponse } from 'next/server';
import  dbConnect  from '@/lib/db/connect';
import { Stock } from '@/lib/db/models/Stock';
import axios from "axios";
import  {updateNewStock}  from "@/lib/updateNewStock"; 
import { StockPriceHistory } from "@/lib/db/models/StockPriceHistory";




export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    // const today = new Date().toISOString().split("T")[0]; 
    const stocks = await Stock.find({}); // Fetch all stocks
    
    return NextResponse.json(stocks, { status: 200 });

  } catch (error: any) {
    console.error("Error fetching stocks:", error);
    return NextResponse.json({ error: "Error fetching stocks" }, { status: 500 });
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
    

    // Fetch stock price from Alpha Vantage
    const response = await axios.get(`http://13.126.252.191/stock-info?stock=${symbol}`);


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
      
      const update=await updateNewStock(NewStock._id)
      if(update){
        return NextResponse.json({ success: true, stock: NewStock });
       }
      return NextResponse.json({ success: false},{status:500});
    }

   catch (error) {
    console.error("Error fetching stock data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}



