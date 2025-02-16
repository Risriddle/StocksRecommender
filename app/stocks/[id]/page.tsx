'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

// Dummy data for demonstration
const stockData = {
  id: 1,
  name: 'Apple Inc.',
  symbol: 'AAPL',
  currentPrice: 178.72,
  change: 2.45,
  status: 'BUY',
  industry: 'Technology',
  metrics: {
    growth: 8,
    momentum: 7,
    risk: 6,
    value: 7,
  },
  description: 'Leading technology company specializing in consumer electronics, software, and services.',
  analysis: {
    technical: 'Strong upward trend with solid support levels...',
    fundamental: 'Healthy balance sheet with growing revenue...',
    sentiment: 'Positive market sentiment with increasing institutional interest...',
  },
  history: [
    { date: '2024-03-20', price: 178.72, recommendation: 'BUY' },
    { date: '2024-03-13', price: 176.45, recommendation: 'BUY' },
    // Add more historical data
  ],
};

export default function StockDetails() {
  const params = useParams();
  const stockId = params.id;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{stockData.name}</h1>
          <p className="text-xl text-muted-foreground">{stockData.symbol}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">${stockData.currentPrice}</div>
          <div className={stockData.change > 0 ? 'text-green-500' : 'text-red-500'}>
            {stockData.change > 0 ? '+' : ''}{stockData.change}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Growth Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockData.metrics.growth}/10</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Momentum Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockData.metrics.momentum}/10</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockData.metrics.risk}/10</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Value Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockData.metrics.value}/10</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Company Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{stockData.description}</p>
              <div className="mt-6 flex gap-4">
                <Button>Add to Portfolio</Button>
                <Button variant="outline">Set Alert</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Technical Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{stockData.analysis.technical}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Fundamental Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{stockData.analysis.fundamental}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Market Sentiment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{stockData.analysis.sentiment}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Recommendation History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/50">
                    <tr>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Price</th>
                      <th className="px-6 py-3">Recommendation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockData.history.map((record, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-6 py-4">{record.date}</td>
                        <td className="px-6 py-4">${record.price}</td>
                        <td className="px-6 py-4">{record.recommendation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}