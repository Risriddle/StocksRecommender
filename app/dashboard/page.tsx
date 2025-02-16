
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PaymentModal from '@/components/PaymentModal';

const industries = ['Technology', 'Healthcare', 'Financial Services', 'Consumer Goods', 'Energy'];



type Stock = {
  _id: string;
  name: string;
  stock_id: string;
  category: string;
  current_price: number;
  indicators?: {
    growth_rating?: number;
    momentum_score?: number;
    risk_score?: number;
    value_rating?: number;
  };
  returns?: {
    sinceAdded?: number;
    sinceBuy?: number;
    buyToSell?: number;
  };
  status: string;
};

type Portfolio = {
  _id: string;
  name: string;
};





export default function StocksDashboard() {
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [search, setSearch] = useState('');
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
  const [selectedTab, setSelectedTab] = useState('all');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const { data: session } = useSession();
  const router = useRouter();
  const userRole = session?.user?.role;
  const userId = session?.user?.id;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStockIndicators();
    fetchPortfolios();
  }, []);

  useEffect(() => {
    filterStocks();
  }, [stocks, selectedIndustry, search, selectedTab]);

  



  const fetchStockIndicators = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/stocks/indicators');
      const data = await response.json();
      
      if (data.success) {
        const updatedStocks = await Promise.all(
          data.data.map(async (stock:Stock) => {
            const returnsResponse = await fetch(`/api/stocks/${stock._id}`);
            const returnsData = await returnsResponse.json();
  
            return { 
              ...stock, 
              returns: returnsData.success ? returnsData.data : null
            };
          })
        );
  
        setStocks(updatedStocks);
      }
    } catch (error) {
      console.error('Error fetching stock indicators:', error);
    }
    finally{
      setLoading(false)
    }
  };
  

  const fetchPortfolios = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/portfolios/users/${userId}`);
      const data = await response.json();
      setPortfolios(data || []);
    } catch (error) {
      console.error('Error loading portfolios:', error);
    }
    finally{
      setLoading(false)
    }
  };

 

  const filterStocks = () => {
    let filtered = stocks.filter(stock =>
      (selectedIndustry === 'all' || stock.category.toLowerCase() === selectedIndustry) &&
      (search === '' || stock.name.toLowerCase().includes(search.toLowerCase())) &&
      (selectedTab === 'all' || stock.status.toLowerCase() === selectedTab)
    );
    setFilteredStocks(filtered);
  };

  return (
    <div className="space-y-6 p-6 bg-black min-h-screen">
       {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      )}
      <PaymentModal isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} />

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">📈 Stocks Recommendation</h1>
        <div className="flex gap-4">
          {/* <Button onClick={() => router.push('/stocks/compare')}>Compare Stocks</Button> */}
          <Button onClick={() => router.push('/stocks/history')}>View Stocks History</Button>
          <Input
            placeholder="🔍 Search stocks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 border-gray-300 shadow-sm"
          />
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry.toLowerCase()}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4" onValueChange={setSelectedTab}>
        <TabsList className="flex space-x-4 bg-white p-2 rounded-lg shadow-sm">
          <TabsTrigger value="all">All Stocks</TabsTrigger>
          <TabsTrigger value="buy">Buy</TabsTrigger>
          <TabsTrigger value="sell">Sell</TabsTrigger>
          <TabsTrigger value="hold">Hold</TabsTrigger>
          <TabsTrigger value="monitor">Monitor</TabsTrigger>
          <TabsTrigger value="target">Target</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          <div className="overflow-x-auto bg-black rounded-lg shadow p-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="p-3 text-left">Stock</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Price ($)</th>
                  <th className="p-3 text-left">Growth Rating</th>
                  <th className="p-3 text-left">Momentum</th>
                  <th className="p-3 text-left">Risk</th>
                  <th className="p-3 text-left">Value Rating</th>
                  <th className="p-3 text-left">Returns</th>
                  {selectedTab === 'all' && <th className="p-3 text-left">Status</th>}
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStocks.map((stock) => (
                  <tr key={stock._id} className="border-t hover:bg-black-100">
                    <td className="p-3">{stock.name} ({stock.stock_id})</td>
                    <td className="p-3">{stock.category}</td>
                    <td
  className={`p-3 font-semibold ${
    stock.current_price >= 0 ? 'text-green-600' : 'text-red-600'
  }`}
>
  ${stock.current_price}
</td>

          
<td className="p-3">{stock.indicators?.growth_rating ?? "--"}/10</td>
<td className="p-3">{stock.indicators?.momentum_score ?? "--"}/10</td>
<td className="p-3">{stock.indicators?.risk_score ?? "--"}/10</td>
<td className="p-3">{stock.indicators?.value_rating ?? "--"}/10</td>

                    <td className="p-3">
  {stock.returns ? (
    <>
      <p>📅 Since Added: {stock.returns.sinceAdded}%</p>
      {stock.status === "BUY" && <p>💰 Since Buy: {stock.returns.sinceBuy}%</p>}
      {stock.status === "SELL" && <p>🔄 Buy to Sell: {stock.returns.buyToSell}%</p>}
    </>
  ) : (
    "-"
  )}
</td>


                    {selectedTab === 'all' && <td className="p-3">{stock.status}</td>}
                    <td className="p-3">
                      {userRole === 'admin' ? (
                        <Button>Edit</Button>
                      ) : userRole === 'paid_user' ? (
                        <Button>Add to Portfolio</Button>
                      ) : (
                        <Button onClick={() => setIsPaymentOpen(true)}>Unlock Premium</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-black p-4 rounded-lg shadow mt-6">
        <h2 className="text-xl font-semibold mb-3">📂 My Portfolios</h2>
        {portfolios.length > 0 ? (
          portfolios.map((portfolio) => (
            <div key={portfolio._id} className="p-2 border-b">
              <p className="font-medium">{portfolio.name}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No portfolios available.</p>
        )}
      </div>
    </div>
  );
}











