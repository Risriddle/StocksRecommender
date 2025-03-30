
import { StockPriceHistory } from "@/lib/db/models/StockPriceHistory";
import { Stock } from "@/lib/db/models/Stock";
import { Returns } from "@/lib/db/models/Returns";

async function calculateStockReturns(stockId: string) {
  try {
    // Check if the stock already has stored returns
    let storedReturns = await Returns.findOne({ stock_id: stockId });

    // Fetch price history sorted by date
    const history = await StockPriceHistory.find({ stock_id: stockId }).sort({ date: 1 });
    if (!history.length) throw new Error("No price history available.");

    const latestPrice = history[history.length - 1].price;

    // If stored returns exist and the latest price hasn't changed, return stored values
    if (storedReturns && storedReturns.latestPrice === latestPrice) {
      console.log("Returning cached returns from database.");
      return storedReturns;
    }

    let initialPrice = history[0].price;
    let buyPrice = null;
    let sellPrice = null;

    // Find first buy and sell prices
    const firstBuy = await StockPriceHistory.findOne({ stock_id: stockId, status: "BUY" }).sort({ date: 1 });
    if (firstBuy) buyPrice = firstBuy.price;

    const firstSell = await StockPriceHistory.findOne({ stock_id: stockId, status: "SELL" }).sort({ date: 1 });
    if (firstSell) sellPrice = firstSell.price;

    // Function to calculate percentage return
    const calculateReturn = (start, end) => {
      if (!start || start === 0) return null; // Avoid division by zero
      return ((end - start) / start) * 100;
    };

    // Helper function to get price from N days ago
    const getPriceDaysAgo = (days) => {
      const dateAgo = new Date();
      dateAgo.setDate(dateAgo.getDate() - days);
      const priceEntry = [...history].reverse().find(entry => new Date(entry.date) <= dateAgo);
      return priceEntry ? priceEntry.price : null;
    };

    // Calculate returns
    const oneWeekPrice = getPriceDaysAgo(7);
    const oneMonthPrice = getPriceDaysAgo(30);
    const threeMonthPrice = getPriceDaysAgo(90);
    const sixMonthPrice = getPriceDaysAgo(180);

    const newReturns = {
      stock_id: stockId,
      latestPrice,
      oneWeekReturn: oneWeekPrice ? calculateReturn(oneWeekPrice, latestPrice)?.toFixed(2) : null,
      oneMonthReturn: oneMonthPrice ? calculateReturn(oneMonthPrice, latestPrice)?.toFixed(2) : null,
      threeMonthReturn: threeMonthPrice ? calculateReturn(threeMonthPrice, latestPrice)?.toFixed(2) : null,
      sixMonthReturn: sixMonthPrice ? calculateReturn(sixMonthPrice, latestPrice)?.toFixed(2) : null,
      returnSinceAdded: initialPrice ? calculateReturn(initialPrice, latestPrice)?.toFixed(2) : null,
      returnSinceBuy: buyPrice ? calculateReturn(buyPrice, latestPrice)?.toFixed(2) : null,
      realizedReturn: buyPrice && sellPrice ? calculateReturn(buyPrice, sellPrice)?.toFixed(2) : null,
      lastUpdated: new Date(),
    };

    // Update or insert the return data into the database
    if (storedReturns) {
      await Returns.findOneAndUpdate({ stock_id: stockId }, newReturns);
    } else {
      await Returns.create(newReturns);
    }

    return newReturns;
  } catch (error) {
    console.error("Error calculating stock returns:", error.message);
    return null;
  }
}

export default calculateStockReturns;
