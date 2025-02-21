




"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Portfolio {
  name: string;
  description: string;
  riskLevel: string;
  totalReturns?: string;
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
        setPortfolioData(data.portfolio);
        setPortfolioData((prev) => (prev ? { ...prev, totalReturns: data.portfolioReturn } : prev));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    };

    const fetchPortfolioStocks = async () => {
      try {
        const response = await fetch(`/api/admin/portfolios/${portfolioId}/stocks`);
        if (!response.ok) throw new Error("Failed to fetch portfolio stocks");
        const data = await response.json();
        setPortfolioStocks(data);
        fetchStockReturns(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
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
              returnsData[stock._id] = stockReturn.data?.sinceAdded ?? "N/A";
            }
          })
        );
        setStockReturns({ ...returnsData });
      } catch (err) {
        console.error("Error fetching stock returns:", err);
      }
    };

  

    fetchPortfolioData();
    fetchPortfolioStocks();
  
  }, [portfolioId]);

  if (loading) return <p className="text-center text-gray-500">Loading portfolio data...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="space-y-6 p-6 bg-gray-100 min-h-screen">
      {/* Portfolio Overview */}
      <Card className="shadow-lg rounded-lg bg-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-800">Portfolio: {portfolioData?.name}</CardTitle>
          <p className="text-lg text-gray-600">{portfolioData?.description}</p>
          <p className="text-md text-gray-500">
            Risk Level: <span className="font-semibold">{portfolioData?.riskLevel}</span>
          </p>
          {portfolioData?.totalReturns && (
            <p className="text-md font-semibold text-green-600">
              Total Returns: {portfolioData.totalReturns}%
            </p>
          )}
        </CardHeader>
      </Card>

      {/* Portfolio Holdings */}
      <Card className="shadow-lg rounded-lg bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">Portfolio Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-gray-200">
                  <TableHead className="whitespace-nowrap px-4 py-2">Stock Name</TableHead>
                  <TableHead className="whitespace-nowrap px-4 py-2">Exchange</TableHead>
                  <TableHead className="whitespace-nowrap px-4 py-2">Industry</TableHead>
                  <TableHead className="whitespace-nowrap px-4 py-2">Category</TableHead>
                  <TableHead className="whitespace-nowrap px-4 py-2">Current Price</TableHead>
                  <TableHead className="whitespace-nowrap px-4 py-2">Status</TableHead>
                  <TableHead className="whitespace-nowrap px-4 py-2">Returns</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolioStocks.length > 0 ? (
                  portfolioStocks.map((stock) => (
                    <TableRow key={stock._id} className="hover:bg-gray-100">
                      <TableCell className="px-4 py-2 font-medium text-gray-800">{stock.name}</TableCell>
                      <TableCell className="px-4 py-2 text-gray-700">{stock.exchange}</TableCell>
                      <TableCell className="px-4 py-2 text-gray-700">{stock.industry}</TableCell>
                      <TableCell className="px-4 py-2 text-gray-700">{stock.category}</TableCell>
                      <TableCell className="px-4 py-2 font-semibold text-green-500">
                        ${stock.current_price.toFixed(2)}
                      </TableCell>
                      <TableCell className="px-4 py-2">
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
                      <TableCell className="px-4 py-2 font-medium text-gray-800">
                        {stockReturns[stock._id] ?? "N/A"}%
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                      No stocks available in this portfolio.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

