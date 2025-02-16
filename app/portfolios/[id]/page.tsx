

"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";



interface Portfolio {
  name: string;
  description: string;
  riskLevel: string;
}

interface Stock {
  _id: string;
  name: string;
  exchange: string;
  industry: string;
  category: string;
  current_price: number;
  status: "BUY" | "HOLD" | "SELL" | "MONITOR";
}




export default function PortfolioDetails() {
  const { id: portfolioId } = useParams();
  const [portfolioData, setPortfolioData] = useState<Portfolio | null>(null);
  const [portfolioStocks, setPortfolioStocks] = useState<Stock[]>([]);
  const [stockReturns, setStockReturns] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>("");


  useEffect(() => {
    if (!portfolioId) return;

    const fetchPortfolioData = async () => {
      try {
        const response = await fetch(`/api/portfolios/${portfolioId}`);
        if (!response.ok) throw new Error("Failed to fetch portfolio data");
        const data = await response.json();
        setPortfolioData(data[0]);
      } catch (err) {
        if(err instanceof Error)
          {setError(err.message);}
        else{setError("unknown");}
        
      }
    };

    const fetchPortfolioStocks = async () => {
      try {
        const response = await fetch(`/api/admin/portfolios/${portfolioId}/stocks`);
        if (!response.ok) throw new Error("Failed to fetch portfolio stocks");
        const data = await response.json();
        setPortfolioStocks(data);

        // Fetch stock returns after fetching stocks
        fetchStockReturns(data);
      } catch (err) {
        if(err instanceof Error)
          {setError(err.message);}
        else{setError("unknown");}
        
      } finally {
        setLoading(false);
      }
    };

    const fetchStockReturns = async (stocks: Stock[]) => {
      try {
        const returnsData: Record<string, string> = {};
        await Promise.all(
          stocks.map(async (stock) => {
            const response = await fetch(`/api/stocks/${stock._id}`);
            if (response.ok) {
              const stockReturn = await response.json();
              console.log(stockReturn.data, "returns from api");

              // Ensure data exists before setting
              returnsData[stock._id] = stockReturn.data?.sinceAdded ?? "N/A";
            }
          })
        );
        

        // Ensure React detects the change
        setStockReturns({ ...returnsData });
      } catch (err) {
        console.error("Error fetching stock returns:", err);
      }
    };

    fetchPortfolioData();
    fetchPortfolioStocks();
  }, [portfolioId]);


  if (loading) return <p>Loading portfolio data...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="space-y-6 p-6 bg-black min-h-screen">
      <Card className="shadow-lg rounded-lg p-6 bg-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-black">{portfolioData?.name}</CardTitle>
          <p className="text-lg text-gray-600">{portfolioData?.description}</p>
          <p className="text-md text-gray-500">Risk Level: <span className="font-semibold">{portfolioData?.riskLevel}</span></p>
        </CardHeader>
      </Card>

      <Card className="shadow-lg rounded-lg p-6 bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-black">Portfolio Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-200">
                <TableHead>Stock Name</TableHead>
                <TableHead>Exchange</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Returns</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {portfolioStocks.length > 0 ? (
                portfolioStocks.map((stock) => (
                  <TableRow key={stock._id} className="hover:bg-gray-100">
                    <TableCell className="font-medium text-black">{stock.name}</TableCell>
                    <TableCell className="font-medium text-black">{stock.exchange}</TableCell>
                    <TableCell className="font-medium text-black">{stock.industry}</TableCell>
                    <TableCell className="font-medium text-black">{stock.category}</TableCell>
                    <TableCell className="font-semibold text-green-500">
                      ${stock.current_price.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 text-white text-sm rounded-md ${
                          stock.status === "BUY"
                            ? "bg-green-500"
                            : stock.status === "HOLD"
                            ? "bg-yellow-500"
                            : stock.status === "SELL"
                            ? "bg-red-500"
                            : stock.status === "MONITOR"
                            ? "bg-blue-500"
                            : "bg-gray-500"
                        }`}
                      >
                        {stock.status}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-black">
                      {stockReturns[stock._id] ?? "N/A"}%
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7}  className="text-center py-4 text-gray-500">
                    No stocks available in this portfolio.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
