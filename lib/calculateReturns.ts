import { StockPriceHistory } from "@/lib/db/models/StockPriceHistory";
import { Stock } from "@/lib/db/models/Stock";

async function calculateStockReturns(stockId:string) {
  try {
    // Fetch stock details
    const stock = await Stock.findById(stockId);
    if (!stock) throw new Error("Stock not found");

    // Fetch price history sorted by date
    const history = await StockPriceHistory.find({ stock_id: stockId }).sort({ date: 1 });
    if (history.length < 2) throw new Error("Not enough price data to calculate returns.");

    const latestPrice = history[history.length - 1].price;
    let initialPrice = history[0].price;
    let buyPrice = null;
    let sellPrice = null;
    
    // 1️⃣ **Since Added**
    const addedDatePriceEntry = history.find(entry => entry.date >= stock.added_date);
    if (addedDatePriceEntry) {
      initialPrice = addedDatePriceEntry.price;
    }

    // 2️⃣ **Since Buy**
    const firstBuy = await StockPriceHistory.findOne({ stock_id: stockId })
      .sort({ date: 1 })
      .where("status").equals("BUY");

    if (firstBuy) buyPrice = firstBuy.price;

    // 3️⃣ **Buy to Sell Duration**
    const firstSell = await StockPriceHistory.findOne({ stock_id: stockId })
      .sort({ date: 1 })
      .where("status").equals("SELL");

    if (firstSell) sellPrice = firstSell.price;

    // Calculate Returns
    const calculateReturn = (start:number, end:number) => ((end - start) / start) * 100;

    return {
      sinceAdded: initialPrice ? calculateReturn(initialPrice, latestPrice).toFixed(2) : null,
      sinceBuy: buyPrice ? calculateReturn(buyPrice, latestPrice).toFixed(2) : null,
      buyToSell: buyPrice && sellPrice ? calculateReturn(buyPrice, sellPrice).toFixed(2) : null,
    };
  } catch (error) {
    if(error instanceof Error){ console.error("Error calculating stock returns:", error.message);
    }
    console.error("Error calculating stock returns:", "unknown");
    return null;
  }
}

export default calculateStockReturns;
