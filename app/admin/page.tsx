
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, Briefcase, TrendingUp, RefreshCcw, AlertCircle } from 'lucide-react';
import { calculateFeaturedStocks } from '@/lib/aiAnalysis';

type OutdatedStock = {
  stockId: string;
  name: string;
  reason: string;
};

export default function AdminDashboard() {
 
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [updatingPrice, setUpdatingPrice] = useState(false);
  const [messagePrice, setMessagePrice] = useState<string | null>(null);
  const [outdatedStocks, setOutdatedStocks] = useState<OutdatedStock[]>([]);
  const [loadingStocks, setLoadingStocks] = useState(false);
  const [updatingStockId, setUpdatingStockId] = useState<string | null>(null);
  
  const [updatingFeaturedStocks, setUpdatingFeaturedStocks] = useState<string | null>(null);

  const [stats, setStats] = useState<{ totalUsers: string; activeStocks: string; portfolios: string } | null>(null);

  useEffect(() => {
      fetch("/api/admin")
          .then((res) => res.json())
          .then((data) => {
              console.log("Client: Received admin stats ✅", data);
              setStats(data);
              setLoading(false);
          })
          .catch((err) => console.error("Client: Error fetching stats ❌", err));
      
      // Fetch outdated stocks that need recommendation updates
      fetchOutdatedStocks();
  }, []);

  const fetchOutdatedStocks = async () => {
    setLoadingStocks(true);
    try {
      const response = await fetch("/api/admin/updates");
      const data = await response.json();
      if (response.ok && data.success) {
        setOutdatedStocks(data.outdatedStocks || []);
      } else {
        console.error("Failed to fetch outdated stocks:", data.message);
      }
    } catch (error) {
      console.error("Error fetching outdated stocks:", error);
    } finally {
      setLoadingStocks(false);
    }
  };

  const handleUpdateStock = async (stockId: string) => {
    setUpdatingStockId(stockId);
    
    try {
      const response = await fetch("/api/admin/updates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stockId }),
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // Remove the updated stock from the list
        setOutdatedStocks(prev => prev.filter(stock => stock.stockId !== stockId));
        setMessage(`Stock updated successfully ✅`);
      } else {
        setMessage(`Failed to update stock: ${result.message} ❌`);
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      setMessage("An error occurred while updating the stock ❌");
    } finally {
      setUpdatingStockId(null);
    }
  };

  const handleUpdateAllStocks = async () => {
    setUpdating(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/updates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updateAll: true }),
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setOutdatedStocks([]);
        setMessage(`${result.message} ✅`);
      } else {
        setMessage(`Failed to update stocks: ${result.message} ❌`);
      }
    } catch (error) {
      console.error("Error updating all stocks:", error);
      setMessage("An error occurred while updating all stocks ❌");
    } finally {
      setUpdating(false);
    }
  };

  

  const handleFetchStockPrice = async () => {
    setUpdatingPrice(true);
    setMessagePrice(null);

    try {
      const response = await fetch("/api/fetchDailyStockPrice");
      const result = await response.json();
      console.log(result,"---------------------------")
      if (response.ok) {
        setMessagePrice("Stock prices updated successfully ✅");
       
      } else {
        setMessagePrice("Failed to update stock prices ❌");
      }
    } catch (error) {
      console.error("Error fetching prices:", error);
      setMessagePrice("An error occurred while updating ❌");
    } finally {
      setUpdatingPrice(false);
    }
  };


  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Avoid rendering cards until data is available */}
      {loading ? (
        <p className="text-center text-muted-foreground">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Stocks</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeStocks ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Portfolios</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.portfolios ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outdated Stocks</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{outdatedStocks.length ?? 0}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link href="/admin/users">
              <Button className="w-full">Manage Users</Button>
            </Link>
            <Link href="/admin/portfolios">
              <Button className="w-full">Manage Portfolios</Button>
            </Link>
            <Link href="/admin/stocks">
              <Button className="w-full">Add Stocks</Button>
            </Link>
            <Link href="/admin/manage-stocks">
              <Button className="w-full">Manage Stocks</Button>
            </Link>
           
          
           
            <Link href="/admin/register">
              <Button className="w-full">Create Admin</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Stock Prices</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Button className="w-full" onClick={handleFetchStockPrice} disabled={updatingPrice}>
              {updatingPrice ? "Updating..." : "Manually Update Stock Prices"}
              {updatingPrice && <RefreshCcw className="ml-2 h-4 w-4 animate-spin" />}
           </Button>
            {messagePrice && <p className="text-sm text-gray-600">{messagePrice}</p>}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Stocks Needing Recommendation Updates</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingStocks ? (
              <p className="text-center text-muted-foreground">Loading stocks...</p>
            ) : outdatedStocks.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  {outdatedStocks.map((stock) => (
                    <div key={stock.stockId} className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{stock.name}</p>
                        <p className="text-sm text-muted-foreground">{stock.reason}</p>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => handleUpdateStock(stock.stockId)}
                        disabled={updatingStockId === stock.stockId}
                      >
                        {updatingStockId === stock.stockId ? (
                          <>Updating<RefreshCcw className="ml-2 h-3 w-3 animate-spin" /></>
                        ) : (
                          "Update"
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full mt-4" 
                  onClick={handleUpdateAllStocks} 
                  disabled={updating}
                >
                  {updating ? (
                    <>Updating All Stocks<RefreshCcw className="ml-2 h-4 w-4 animate-spin" /></>
                  ) : (
                    "Update All Stocks"
                  )}
                </Button>
                {message && <p className="text-sm text-center text-gray-600 mt-2">{message}</p>}
              </div>
            ) : (
              <div className="text-center p-6">
                <p className="text-muted-foreground">All stocks are up to date</p>
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={fetchOutdatedStocks}
                >
                  Refresh
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}