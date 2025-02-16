import { NextRequest, NextResponse } from 'next/server';
import  dbConnect  from '@/lib/db/connect';
import { Stock } from '@/lib/db/models/Stock';
import axios from "axios";
import  {updateNewStock}  from "@/lib/updateNewStock"; 
import { StockPriceHistory } from "@/lib/db/models/StockPriceHistory";
import { StockIndicator } from '@/lib/db/models/StockIndicator';
import { Recommendation } from '@/lib/db/models/Recommendation';



export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const today = new Date().toISOString().split("T")[0]; 
    const stocks = await Stock.find({}); // Fetch all stocks

    for (const stock of stocks) {
       
        const stockDate = new Date(stock.added_date).toISOString().split("T")[0]; // Extract only the date
        console.log(stockDate,today,"datessssssssssssssssss")
    //   const existingEntry = await StockPriceHistory.findOne({ stock_id: stock._id, date: today });
      if(stockDate===today)
      {
        continue;
      }
      
      // Fetch current stock price from API
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock.name}&apikey=${apiKey}`
      );

      const timeSeries = response.data["Time Series (Daily)"];
      if (!timeSeries || !timeSeries[today]) continue; // If data is missing, skip this stock

      const latestPrice = parseFloat(timeSeries[today]["4. close"]);
      if (!latestPrice) continue;

      // Update stock current price
      await Stock.findByIdAndUpdate(stock._id, { current_price: latestPrice });

      // Save today's price in StockPriceHistory
      const newEntry = new StockPriceHistory({
        stock_id: stock._id,
        date: today,
        price: latestPrice,
      });
      await newEntry.save();
    }

    // Fetch updated stocks after modifications
    const updatedStocks = await Stock.find({});
    return NextResponse.json(updatedStocks, { status: 200 });

  } catch (error: any) {
    console.error("Error fetching stocks:", error);
    return NextResponse.json({ error: "Error fetching stocks" }, { status: 500 });
  }
}




export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { symbol, exchange, industry, category } = await req.json()

    if (!symbol) {
      return NextResponse.json({ error: "symbol is required" }, { status: 400 });
    }
    
    const today = new Date().toISOString().split("T")[0]; 
    const stock = await Stock.findOne({name:symbol});
    if (stock) return NextResponse.json({ error: "Stock already added" }, { status: 404 });
    
    // Fetch stock price from Alpha Vantage
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`
    );




// console.log(response.data,"response from the apiiiiiiiiiiiiiiiiiiiiii")
const timeSeries = response.data["Time Series (Daily)"];



if (!timeSeries) return NextResponse.json({ error: "Failed to fetch stock price" }, { status: 500 });

    // Get the last 6 days' prices (including today)
    const dates = Object.keys(timeSeries).sort().reverse().slice(0, 6);
    
    // Extract today's price
    let latestPrice = parseFloat(timeSeries[today]?.["4. close"] || 0);

    if (!latestPrice) {
     latestPrice=parseFloat(timeSeries[dates[0]]?.["4. close"] || 0);
     
    }

    const newStock = {
        name: symbol,
        exchange: exchange,
        industry: industry || "N/A",
        category: category || "N/A",
        current_price: latestPrice || 0,
        status: "MONITOR",
      };
      
      const savenewStock = new Stock(newStock);
      await savenewStock.save();


const NewStock=await Stock.findOne({name:symbol})

    const priceHistory = dates
      .map(date => ({
        stock_id: NewStock._id,
        date,
        price: parseFloat(timeSeries[date]["4. close"]),
      }));



    
    // Save the last 5 days' prices in StockPriceHistory
    await StockPriceHistory.deleteMany({ stock_id: NewStock._id }); // Remove previous history
    await StockPriceHistory.insertMany(priceHistory);

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




// 📌 DELETE: Delete stock from MongoDB
export async function DELETE(req: NextRequest) {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Stock ID is required' }, { status: 400 });
        }

        await Stock.findByIdAndDelete(id);
        await StockIndicator.findOneAndDelete({stock_id:id});
        await Recommendation.findOneAndDelete({stock_id:id});
       

        return NextResponse.json({ success: true, message: 'Stock deleted successfully' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
