

'use client';

import { useState, useEffect } from 'react';

import { useRouter } from "next/navigation"
import { format } from 'date-fns';
import { ArrowLeft } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function StockHistory() {
  const router=useRouter();
  const [selectedStock, setSelectedStock] = useState("");
  const [selectedStockName, setSelectedStockName] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState('1M');
  const [stocks, setStocks] = useState([]);
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch('/api/stocks');
        if (!response.ok) throw new Error('Failed to fetch stocks');
        const data = await response.json();
        setStocks(data);
        if (data.length > 0) {
          setSelectedStock(data[0]._id);
          setSelectedStockName(`${data[0].name} (${data[0].company})`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      }
    };

    fetchStocks();
  }, []);

  useEffect(() => {
    if (!selectedStock) return;

    const fetchStockHistory = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/stocks/history?period=${selectedPeriod}&stockId=${selectedStock}`);
        if (!response.ok) throw new Error('Failed to fetch stock price history');
        const data = await response.json();
        setPriceHistory(data.map(entry => ({
          ...entry,
          date: format(new Date(entry.date), 'dd MMM yyyy'), // Format date
        })));
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchStockHistory();
  }, [selectedStock, selectedPeriod]);

  return (
    <div className="space-y-6">
       <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Stock Price History</h1>
      </div>

      <div className="flex gap-4">
        {/* Stock Selector */}
        <Select
          value={selectedStock}
          onValueChange={(value) => {
            setSelectedStock(value);
            const stock = stocks.find(stock => stock._id === value);
            setSelectedStockName(stock ? `${stock.name} (${stock.company})` : '');
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a stock" />
          </SelectTrigger>
          <SelectContent>
            {stocks.map((stock) => (
              <SelectItem key={stock._id} value={stock._id}>
                {stock.name} ({stock.company})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Period Selector */}
        <div className="flex gap-2">
          {['1W', '1M', '3M', '6M', '1Y', 'ALL'].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod(period)}
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Price Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            {loading ? (
              <p>Loading stock data...</p>
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {priceHistory.length > 0 && (
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="hsl(var(--chart-1))"
                        strokeWidth={2}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>

                {/* Selected Stock Name Display */}
                <div className="mt-4 text-center text-lg font-semibold">
                  Stock: {selectedStockName}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
