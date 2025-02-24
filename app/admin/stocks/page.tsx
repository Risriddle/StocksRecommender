

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function StockManagement() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/stocks");
        const data = await response.json();
        setStocks(data);
      } catch (error) {
        console.error("Error fetching stocks:", error);
      } finally {
        setLoading(false);
      }
    };    

    fetchStocks();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    const handleSearch = async () => {
      try {
        const response = await fetch(`/api/stocks/search?q=${debouncedQuery}`);
        const data = await response.json();
        console.log(data,"adata from searchhhhhhhhhh")
        setSearchResults(data || []);
        console.log(searchResults,"search resultssssssssss")
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    handleSearch();
  }, [debouncedQuery]);

  const handleAddStock = async (stock: any) => {
    if (stocks.some((s) => s.name === stock.symbol)) {
      console.log("already added");
      return;
    }

    const symbol = stock.symbol;
    const exchange = stock.exchange;
    const industry = stock.industry;
    const category = stock.sector;

    try {
      setLoading(true);
      const response = await fetch("/api/stocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol,exchange,industry,category }),
      });

      const result = await response.json();
      console.log(result,"--------------------------------")
      if (result.success) {
        setStocks([...stocks, result.stock]);
      }
    } catch (error) {
      console.error("Error saving stock:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStock = async (stockId: string) => {
    try {
      setLoading(true);
      await fetch(`/api/stocks/${stockId}`, {
        method: "DELETE",
      });

      setStocks(stocks.filter((stock) => stock._id !== stockId));
    } catch (error) {
      console.error("Error deleting stock:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto mt-6 p-6 bg-gray-900 text-white rounded-lg shadow-lg relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      )}

      <h1 className="text-3xl font-bold text-center text-white-400">
        Stock Management
      </h1>
      <Button onClick={() => router.push("/admin")}>Back to Admin Panel</Button>

      {/* Search Section */}
      <div className="space-y-4">
        <Label htmlFor="search" className="text-lg font-semibold">
          Search Stock
        </Label>

        <Input
          id="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by company name or symbol..."
        />
        {searchResults.length > 0 && (
          <ul className="border p-2 bg-gray-800 shadow-md max-h-40 overflow-auto rounded-lg">
            {searchResults.map((stock) => (
              <li
                key={stock.symbol}
                className="p-2 cursor-pointer hover:bg-gray-700 rounded-lg"
                onClick={() => handleAddStock(stock)}
              >
                 ({stock.symbol}) {stock.longname}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Stocks Table */}
      <Card className="bg-gray-800 border border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white-300">
            Stocks List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-700 text-gray-300 text-sm uppercase">
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Exchange</th>
                  <th className="py-3 px-4 text-left">Industry</th>
                  <th className="py-3 px-4 text-left">Category</th>
                  <th className="py-3 px-4 text-left">Current Price</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock, index) => (
                  <tr
                    key={stock._id}
                    className={`border-b border-gray-700 ${
                      index % 2 === 0 ? "bg-gray-750" : "bg-gray-800"
                    }`}
                  >
                    <td className="py-3 px-4">{stock.name}</td>
                    <td className="py-3 px-4">{stock.exchange}</td>
                    <td className="py-3 px-4">{stock.industry}</td>
                    <td className="py-3 px-4">{stock.category}</td>
                    <td className="py-3 px-4 font-bold text-green-400">
                      ${stock.current_price}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 text-xs font-medium uppercase rounded-full bg-blue-500 text-white">
                        {stock.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                        onClick={() => handleDeleteStock(stock._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
