

import { StockPriceHistory } from "@/lib/db/models/StockPriceHistory";
import { Stock } from "@/lib/db/models/Stock";

async function calculateStockReturns(stockId: string) {
  try {
    // Fetch stock details
    const stock = await Stock.findById(stockId);
    if (!stock) throw new Error("Stock not found");

    // Fetch price history sorted by date
    const history = await StockPriceHistory.find({ stock_id: stockId }).sort({ date: 1 });
    if (history.length < 2) throw new Error("Not enough price data to calculate returns.");

    const latestPrice = history[history.length - 1].price;
    console.log(latestPrice,"latestpriec==================================================================")
    let initialPrice = history[0].price;
    let buyPrice = null;
    let sellPrice = null;

    // Find initial price closest to stock added date
    // Find the first price after or equal to the stock's added date
let addedDatePriceEntry = history.find(entry => new Date(entry.date) >= new Date(stock.added_date));

if (!addedDatePriceEntry) {
    // If no exact or later match, find the closest earlier price
    addedDatePriceEntry = history.reduce((closest, entry) => {
        const entryDate = new Date(entry.date);
        const closestDate = closest ? new Date(closest.date) : null;

        // Ensure it's before the added_date and closer than the previous closest
        if (entryDate <= new Date(stock.added_date) && (!closestDate || entryDate > closestDate)) {
            return entry;
        }

        return closest;
    }, null);
}

// If a closest price entry is found, set it as the initial price
if (addedDatePriceEntry) {
    initialPrice = addedDatePriceEntry.price;
}
console.log(initialPrice,"initial price in calculate returnsssssssssssss")

    // Find first buy and sell prices
    const firstBuy = await StockPriceHistory.findOne({ stock_id: stockId, status: "BUY" }).sort({ date: 1 });
    if (firstBuy) buyPrice = firstBuy.price;

    const firstSell = await StockPriceHistory.findOne({ stock_id: stockId, status: "SELL" }).sort({ date: 1 });
    if (firstSell) sellPrice = firstSell.price;

    // Function to calculate percentage return with a safeguard for division by zero
    const calculateReturn = (start: number, end: number) => {
      if (!start || start === 0) return null; // Avoid division by zero
      return ((end - start) / start) * 100;
    };

    // Helper function to get price from N days ago
    const getPriceDaysAgo = (days: number) => {
      const dateAgo = new Date();
      dateAgo.setDate(dateAgo.getDate() - days);
      
      // Find the closest price before or equal to the target date
      const priceEntry = [...history].reverse().find(entry => new Date(entry.date) <= dateAgo);
      return priceEntry ? priceEntry.price : null;
    };

    // Calculate returns for different periods
    const oneWeekPrice = getPriceDaysAgo(7);
    const oneMonthPrice = getPriceDaysAgo(30);
    const threeMonthPrice = getPriceDaysAgo(90);
    const sixMonthPrice = getPriceDaysAgo(180);

    return {
      oneWeekReturn: oneWeekPrice ? calculateReturn(oneWeekPrice, latestPrice)?.toFixed(2) : null,
      oneMonthReturn: oneMonthPrice ? calculateReturn(oneMonthPrice, latestPrice)?.toFixed(2) : null,
      threeMonthReturn: threeMonthPrice ? calculateReturn(threeMonthPrice, latestPrice)?.toFixed(2) : null,
      sixMonthReturn: sixMonthPrice ? calculateReturn(sixMonthPrice, latestPrice)?.toFixed(2) : null,
      returnSinceAdded: initialPrice ? calculateReturn(initialPrice, latestPrice)?.toFixed(2) : null,
      returnSinceBuy: buyPrice ? calculateReturn(buyPrice, latestPrice)?.toFixed(2) : null,
      realizedReturn: buyPrice && sellPrice ? calculateReturn(buyPrice, sellPrice)?.toFixed(2) : null,
    };
  } catch (error) {
    console.error("Error calculating stock returns:", error instanceof Error ? error.message : "unknown");
    return null;
  }
}


export default calculateStockReturns;
