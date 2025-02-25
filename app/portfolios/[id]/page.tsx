
"use client"

import { useParams,useRouter } from "next/navigation"
import { useState,useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUpIcon,ArrowLeft, ArrowDownIcon, LineChart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface Portfolio {
  name: string
  description: string
  riskLevel: string
  totalReturns?: string
}

interface Stock {
  _id: string
  name: string
  exchange: string
  currency:string
  industry: string
  category: string
  current_price: number
  status: "BUY" | "HOLD" | "SELL" | "MONITOR"
}

export default function PortfolioDetails() {
  const { id: portfolioId } = useParams()
  const router = useRouter()
  const [portfolioData, setPortfolioData] = useState<Portfolio | null>(null)
  const [portfolioStocks, setPortfolioStocks] = useState<Stock[]>([])
  const [stockReturns, setStockReturns] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>("")

  // ... (keep existing fetch functions)
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
              returnsData[stock._id] = stockReturn.data?.returnSinceAdded ?? "N/A";
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


  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-[250px]" />
            <Skeleton className="h-4 w-[400px] mt-2" />
            <div className="flex gap-4 mt-4">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[200px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive">Error Loading Portfolio</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

 

  const getStatusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'BUY':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm'
      case 'SELL':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-md text-sm'
      case 'HOLD':
        return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-sm'
      case 'TARGET':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm'
      case 'MONITOR':
        return 'bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-sm'
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm'
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-[1400px] mx-auto">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Portfolio
      </Button>
      {/* Portfolio Overview */}
      <Card className="transition-shadow duration-200 hover:shadow-lg">
        <CardHeader className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl md:text-3xl font-bold">{portfolioData?.name}</CardTitle>
              <CardDescription className="mt-2 text-base">{portfolioData?.description}</CardDescription>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <Badge variant="outline" className="text-base py-1 px-3">
                Risk Level: {portfolioData?.riskLevel}
              </Badge>
              {portfolioData?.totalReturns && (
                <div className="flex items-center gap-2 text-base font-medium">
                  <Badge
                    className={
                      Number(portfolioData.totalReturns) >= 0
                        ? "bg-emerald-500/15 text-green-500 hover:bg-emerald-500/25"
                        : "bg-red-500/15 text-red-700 hover:bg-red-500/25"
                    }
                  >
                    <span className="flex items-center gap-1 text-base">
                      {Number(portfolioData.totalReturns) >= 0 ? (
                        <ArrowUpIcon className="w-3 h-3" />
                      ) : (
                        <ArrowDownIcon className="w-3 h-3" />
                      )}
                      {portfolioData.totalReturns}%
                    </span>
                  </Badge>
                  <span className="text-muted-foreground text-base">Total Returns</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Portfolio Holdings */}
      <Card className="transition-shadow duration-200 hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-semibold flex items-center gap-2">
              <LineChart className="w-5 h-5 text-muted-foreground" />
              Portfolio Holdings
            </CardTitle>
            <CardDescription>{portfolioStocks.length} stocks in portfolio</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead>Stock Name</TableHead>
                  <TableHead className="hidden md:table-cell">Exchange</TableHead>
                  <TableHead className="hidden lg:table-cell">Industry</TableHead>
                  <TableHead className="hidden xl:table-cell">Category</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Current Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Returns</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolioStocks.length > 0 ? (
                  portfolioStocks.map((stock) => (
                    <TableRow key={stock._id} className="transition-colors hover:bg-muted/50">
                      <TableCell className="font-medium text-base">{stock.name}</TableCell>
                      <TableCell className="hidden md:table-cell text-base">{stock.exchange}</TableCell>
                      <TableCell className="hidden lg:table-cell text-base">{stock.industry}</TableCell>
                      <TableCell className="hidden xl:table-cell text-base">{stock.category}</TableCell>
                      <TableCell className="hidden xl:table-cell text-base">{stock.currency}</TableCell>
                      <TableCell className="font-medium text-green-400 text-base">{stock.current_price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusStyle(stock.status)}>{stock.status}</Badge>
                      </TableCell>
                      <TableCell>
                        {stockReturns[stock._id] ? (
                          <Badge
                            className={
                              Number(stockReturns[stock._id]) >= 0
                                ? "bg-emerald-500/15 text-green-500"
                                : "bg-red-500/15 text-red-700"
                            }
                          >
                            <span className="flex items-center gap-1 text-base">
                              {Number(stockReturns[stock._id]) >= 0 ? (
                                <ArrowUpIcon className="w-3 h-3" />
                              ) : (
                                <ArrowDownIcon className="w-3 h-3" />
                              )}
                              {stockReturns[stock._id]}%
                            </span>
                          </Badge>
                        ) : (
                          <Badge variant="outline">N/A</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
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
  )
}

