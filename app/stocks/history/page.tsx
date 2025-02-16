
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  const [selectedPeriod, setSelectedPeriod] = useState('1M');
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStockHistory = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/stocks/history?period=${selectedPeriod}`);
        if (!response.ok) throw new Error('Failed to fetch stock price history');
        const data = await response.json();
        setPriceHistory(data);
      } catch (err) {
        if(err instanceof Error){ setError(err.message);}
      else {
        setError("An unknown error occurred");
      }
      } finally {
        setLoading(false);
      }
    };

    fetchStockHistory();
  }, [selectedPeriod]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Stock Price History</h1>
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
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {priceHistory.length > 0 &&
                    Object.keys(priceHistory[0])
                      .filter((key) => key !== 'date')
                      .map((stock, index) => (
                        <Line
                          key={stock}
                          type="monotone"
                          dataKey={stock}
                          stroke={`hsl(var(--chart-${index + 1}))`}
                          strokeWidth={2}
                        />
                      ))}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
