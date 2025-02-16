'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Dummy data for comparison
const stocks = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    metrics: {
      growth: 8,
      momentum: 7,
      risk: 6,
      value: 7,
      returns: 15.2,
    },
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    metrics: {
      growth: 7,
      momentum: 8,
      risk: 5,
      value: 6,
      returns: 12.8,
    },
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    metrics: {
      growth: 7,
      momentum: 6,
      risk: 5,
      value: 8,
      returns: 10.5,
    },
  },
];

export default function StockComparison() {
  const [selectedStocks, setSelectedStocks] = useState(['AAPL', 'MSFT']);

  const comparisonData = [
    {
      metric: 'Growth',
      ...Object.fromEntries(
        selectedStocks.map((symbol) => [
          symbol,
          stocks.find((s) => s.symbol === symbol)?.metrics.growth,
        ])
      ),
    },
    {
      metric: 'Momentum',
      ...Object.fromEntries(
        selectedStocks.map((symbol) => [
          symbol,
          stocks.find((s) => s.symbol === symbol)?.metrics.momentum,
        ])
      ),
    },
    {
      metric: 'Risk',
      ...Object.fromEntries(
        selectedStocks.map((symbol) => [
          symbol,
          stocks.find((s) => s.symbol === symbol)?.metrics.risk,
        ])
      ),
    },
    {
      metric: 'Value',
      ...Object.fromEntries(
        selectedStocks.map((symbol) => [
          symbol,
          stocks.find((s) => s.symbol === symbol)?.metrics.value,
        ])
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Stock Comparison</h1>
        <div className="flex gap-4">
          <Select
            value={selectedStocks[0]}
            onValueChange={(value) =>
              setSelectedStocks([value, selectedStocks[1]])
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select stock 1" />
            </SelectTrigger>
            <SelectContent>
              {stocks.map((stock) => (
                <SelectItem key={stock.symbol} value={stock.symbol}>
                  {stock.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedStocks[1]}
            onValueChange={(value) =>
              setSelectedStocks([selectedStocks[0], value])
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select stock 2" />
            </SelectTrigger>
            <SelectContent>
              {stocks.map((stock) => (
                <SelectItem key={stock.symbol} value={stock.symbol}>
                  {stock.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Metrics Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" />
                <YAxis />
                <Tooltip />
                <Legend />
                {selectedStocks.map((symbol, index) => (
                  <Bar
                    key={symbol}
                    dataKey={symbol}
                    fill={`hsl(var(--chart-${index + 1}))`}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}











// 'use client';

// import { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';

// export default function StockComparison() {
//   const [stocks, setStocks] = useState([]);
//   const [selectedStocks, setSelectedStocks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchStockIndicators = async () => {
//       try {
//         const response = await fetch('/api/stocks/indicators');
//         const data = await response.json();

//         if (data.success) {
//           const updatedStocks = await Promise.all(
//             data.data.map(async (stock) => {
//               const returnsResponse = await fetch(`/api/stocks/${stock._id}`);
//               const returnsData = await returnsResponse.json();

//               return {
//                 ...stock,
//                 returns: returnsData.success ? returnsData.data : null,
//               };
//             })
//           );

//           setStocks(updatedStocks);
//           setSelectedStocks(updatedStocks.slice(0, 2).map(stock => stock._id)); // Select first two stocks by default
//         }
//       } catch (error) {
//         console.error('Error fetching stock indicators:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStockIndicators();
//   }, []);

//   if (loading) {
//     return <p className="text-center text-xl">Loading stock data...</p>;
//   }

//   const comparisonData = [
//     {
//       metric: 'Growth',
//       ...Object.fromEntries(
//         selectedStocks.map((id) => [
//           id,
//           stocks.find((s) => s._id === id)?.growth_rating,
//         ])
//       ),
//     },
//     {
//       metric: 'Momentum',
//       ...Object.fromEntries(
//         selectedStocks.map((id) => [
//           id,
//           stocks.find((s) => s._id === id)?.momentum_score,
//         ])
//       ),
//     },
//     {
//       metric: 'Risk',
//       ...Object.fromEntries(
//         selectedStocks.map((id) => [
//           id,
//           stocks.find((s) => s._id === id)?.risk_score,
//         ])
//       ),
//     },
//     {
//       metric: 'Value',
//       ...Object.fromEntries(
//         selectedStocks.map((id) => [
//           id,
//           stocks.find((s) => s._id === id)?.value_rating,
//         ])
//       ),
//     },
//   ];

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold">Stock Comparison</h1>
//         <div className="flex gap-4">
//           {selectedStocks.map((selected, index) => (
//             <Select
//               key={index}
//               value={selected}
//               onValueChange={(value) =>
//                 setSelectedStocks((prev) => {
//                   const newSelection = [...prev];
//                   newSelection[index] = value;
//                   return newSelection;
//                 })
//               }
//             >
//               <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder={`Select stock ${index + 1}`} />
//               </SelectTrigger>
//               <SelectContent>
//                 {stocks.map((stock) => (
//                   <SelectItem key={stock._id} value={stock._id}>
//                     {stock.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           ))}
//         </div>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Metrics Comparison</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="h-[400px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={comparisonData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="metric" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 {selectedStocks.map((id, index) => (
//                   <Bar key={id} dataKey={id} fill={`hsl(var(--chart-${index + 1}))`} />
//                 ))}
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
