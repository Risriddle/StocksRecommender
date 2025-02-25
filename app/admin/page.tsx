
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, Briefcase, TrendingUp, RefreshCcw } from 'lucide-react';


export default function AdminDashboard() {
 
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [updatingPrice, setUpdatingPrice] = useState(false);
  const [messagePrice, setMessagePrice] = useState<string | null>(null);


  const [stats, setStats] = useState<{ totalUsers: string; activeStocks: string; portfolios: string } | null>(null);

  useEffect(() => {
      fetch("/api/admin")
          .then((res) => res.json())
          .then((data) => {
              console.log("Client: Received admin stats ✅", data);
              setStats(data);
              setLoading(false)
          })
          .catch((err) => console.error("Client: Error fetching stats ❌", err));
  }, []);



  const handleRunRecommendations = async () => {
    setUpdating(true);
    setMessage(null);

    try {
      const response = await fetch("/api/weeklyUpdate");
      const result = await response.json();
console.log(result,"---------------------------")
      if (response.ok) {
        setMessage("Stock recommendations updated successfully ✅");
       
      } else {
        setMessage("Failed to update recommendations ❌");
      }
    } catch (error) {
      console.error("Error running recommendations:", error);
      setMessage("An error occurred while updating ❌");
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
            <Link href="/admin/register">
              <Button className="w-full">Create Admin</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Stock Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Button className="w-full" onClick={handleRunRecommendations} disabled={updating}>
              {updating ? "Updating..." : "Manually Run Recommendations"}
              {updating && <RefreshCcw className="ml-2 h-4 w-4 animate-spin" />}
           </Button>
            {message && <p className="text-sm text-gray-600">{message}</p>}
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
      </div>
    </div>
  );
}

