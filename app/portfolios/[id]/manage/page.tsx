



"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Search, Plus, Loader2, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import type { Stock } from "@/types/stock"

// interface Stock {
//   _id: string
//   stock_id: string;
//   name: string
//   company: string
//   currency:string;
//   exchange: string
//   industry: string
//   stockReturn: number
//   current_price: number
//   status: "BUY" | "HOLD" | "SELL" | "MONITOR"
//   isInPortfolio?: boolean
// }

interface Portfolio {
  _id: string
  name: string
  description: string
  riskLevel: string
}

interface Message {
  type: 'success' | 'error'
  text: string
}

export default function AddStockPage() {
  const { id } = useParams()
  const router = useRouter()

  const [stocks, setStocks] = useState<Stock[]>([])
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([])
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [industry, setIndustry] = useState("all")
  const [status, setStatus] = useState("all")
  const [loading, setLoading] = useState(true)
  const [actionInProgress, setActionInProgress] = useState<string | null>(null)
  const [message, setMessage] = useState<Message | null>(null)
  const [availableIndustries, setAvailableIndustries] = useState<string[]>([])
  const [portfolioReturn, setPortfolioReturn] = useState<string>("N/A")


  useEffect(() => {
    fetchPortfolioDetails()
  }, [])

  // New effect to extract unique industries from stocks
  useEffect(() => {
    const industries = Array.from(new Set(stocks.map(stock => stock.industry))).sort()
    setAvailableIndustries(industries)
  }, [stocks])

  const filterStocks = useCallback(() => {
    let filtered = [...stocks]

    if (searchQuery) {
      filtered = filtered.filter(
        (stock) =>
          stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stock.company.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (industry !== "all") {
      filtered = filtered.filter((stock) => stock.industry === industry)
    }

    if (status !== "all") {
      filtered = filtered.filter((stock) => stock.status === status)
    }

    setFilteredStocks(filtered)
  }, [stocks, searchQuery, industry, status])

  useEffect(() => {
    filterStocks()
  }, [filterStocks])

  const fetchPortfolioDetails = async () => {
    try {
      const response = await fetch(`/api/portfolios/${id}`)
      if (!response.ok) throw new Error("Failed to fetch portfolio")
      const data = await response.json()
      setPortfolio(data.portfolio)
      setPortfolioReturn(data.portfolioReturn || "N/A")
      const portfolioStocks = data.portfolioStocks
      console.log(portfolioStocks)

  
    const portfolioStockMap = new Map(
        portfolioStocks.map((s: Stock) => [s.stock_id])
      );
    

      const allStocksResponse = await fetch("/api/stocks")
      if (!allStocksResponse.ok) throw new Error("Failed to fetch stocks")
      const allStocksData = await allStocksResponse.json()
      
      const markedStocks = allStocksData.map((stock: Stock) => ({
        ...stock,
        isInPortfolio: portfolioStockMap.has(stock._id),
        // stockReturn: portfolioStockMap.get(stock._id) || "N/A",
      }))
      
      setStocks(markedStocks)
      setFilteredStocks(markedStocks)
    } catch (error) {
      console.error("Error:", error)
      setMessage({ type: 'error', text: 'Failed to load portfolio details' })
    } finally {
      setLoading(false)
    }
  }

  const handleStockAction = async (stock: Stock) => {
    setActionInProgress(stock._id)
    try {
      const response = await fetch(`/api/portfolios/${id}/stocks`, {
        method: stock.isInPortfolio ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock }),
      })

      if (!response.ok) throw new Error(stock.isInPortfolio ? "Failed to remove stock" : "Failed to add stock")

      setStocks(prevStocks =>
        prevStocks.map(s =>
          s._id === stock._id
            ? { ...s, isInPortfolio: !s.isInPortfolio }
            : s
        )
      )

      setMessage({
        type: 'success',
        text: `Stock ${stock.isInPortfolio ? 'removed from' : 'added to'} portfolio successfully`
      })

      setTimeout(() => setMessage(null), 3000)

    } catch (error) {
      console.error("Error:", error)
      setMessage({
        type: 'error',
        text: `Failed to ${stock.isInPortfolio ? 'remove' : 'add'} stock ${stock.isInPortfolio ? 'from' : 'to'} portfolio`
      })
    } finally {
      setActionInProgress(null)
    }
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

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {message && (
        <Alert variant={message.type === 'success' ? 'default' : 'destructive'} className="animate-in fade-in slide-in-from-top">
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="shrink-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Add / Remove Stocks from Portfolio</h1>
          <p className="text-muted-foreground">
            {portfolio?.name} - {portfolio?.riskLevel} Risk
          </p>
          <p className="mt-2 text-lg font-semibold">
            Portfolio Return: 
            <span className={+portfolioReturn >= 0 ? "text-green-500" : "text-red-500"}>
              {` ${portfolioReturn}%`}
            </span>
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Stocks</CardTitle>
          <CardDescription>Search and filter stocks to add to your portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search stocks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>

              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {availableIndustries.map((ind) => (
                    <SelectItem key={ind} value={ind}>
                      {ind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="BUY">Buy</SelectItem>
                  <SelectItem value="HOLD">Hold</SelectItem>
                  <SelectItem value="SELL">Sell</SelectItem>
                  <SelectItem value="MONITOR">Monitor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead className="hidden md:table-cell">Industry</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock Returns</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStocks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24">
                        No stocks found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStocks.map((stock) => (
                      <TableRow key={stock._id}>
                        <TableCell className="font-medium text-base">{stock.company}</TableCell>
                        <TableCell className="text-base">{stock.name}</TableCell>
                        <TableCell className="hidden md:table-cell text-base">{stock.industry}</TableCell>
                        <TableCell className="text-base">{stock.currency}</TableCell>
                        <TableCell className="text-base text-green-500">{stock.current_price.toFixed(2)}</TableCell>
                        <TableCell className="text-base">
                      <span className={stock.returns?.returnSinceAdded >= 0 ? "text-green-500" : "text-red-500"}>
                        {stock.returns?.returnSinceAdded }%
                      </span>
                    </TableCell>
                        <TableCell>
                          <Badge className={getStatusStyle(stock.status)}>{stock.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant={stock.isInPortfolio ? "destructive" : "default"}
                            onClick={() => handleStockAction(stock)}
                            disabled={actionInProgress === stock._id}
                          >
                            {actionInProgress === stock._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : stock.isInPortfolio ? (
                              <Trash2 className="h-4 w-4" />
                            ) : (
                              <Plus className="h-4 w-4" />
                            )}
                            <span className="ml-2">{stock.isInPortfolio ? 'Remove' : 'Add'}</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
