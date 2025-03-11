

"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { ArrowUpIcon, ArrowDownIcon, ArrowUpDown, Eye, Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import type { Stock } from "@/types/stock"
import StockActionModal from "./StockActionModal"

interface StockTableProps {
  data: Stock[]
  onSort: (key: keyof Stock) => void
  onViewStock?: (stock: Stock) => void
  selectedStockId?: string | null
  visibleColumns?: Record<string, boolean>
}

export default function StockTable({
  data,
  onSort,
  onViewStock,
  selectedStockId,
  visibleColumns = {},
}: StockTableProps) {
  const { data: session, status } = useSession()
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [stocks, setStocks] = useState<Stock[]>(data)
  const [stockDetails, setStockDetails] = useState<Stock>(null)
  const [loadingStockId, setLoadingStockId] = useState<string | null>(null)
  const userId = session?.user?.id

  useEffect(() => {
    setStocks(data)
  }, [data])


  console.log(data,"stocks in table")
  const handleStockAction = (stock: Stock) => {
    setSelectedStock(stock)
  }

  const handleViewStock = async (stock: Stock) => {
    try {
      setLoadingStockId(stock._id)
      
      // Call the API to fetch detailed stock indicators
      const response = await fetch(`/api/stocks/stock-indicator?stock_id=${stock._id}`)
      console.log(response,"response of stock-indicator in stocktable")
      if (!response.ok) {
        throw new Error(`Failed to fetch stock details: ${response.statusText}`)
      }
      
      const detailedStock = await response.json()
      console.log(detailedStock,"dddddddddddddddddddddddddddddddddddd")
      
      setStockDetails(detailedStock.data)
    
      // Once we have the detailed data, call the parent's onViewStock with the updated stock
      if (onViewStock) {
        onViewStock({ ...detailedStock.data })
       
      }
    } catch (error) {
      console.error("Error fetching stock details:", error)
    } finally {
      setLoadingStockId(null)
    }
  }

  const handleConfirmAction = async (portfolioId: string) => {
    if (!selectedStock) return

    try {
      const response = await fetch(`/api/portfolios/${portfolioId}/stocks`, {
        method: selectedStock.isPresent ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: selectedStock }),
      })

      if (response.ok) {
        setStocks((prevStocks) =>
          prevStocks.map((stock) =>
            stock._id === selectedStock._id ? { ...stock, isPresent: !stock.isPresent } : stock,
          ),
        )
        setSelectedStock(null)
      }
    } catch (error) {
      console.error("Error updating portfolio:", error)
    }
  }

  const renderPercentage = (value?: number | null) => {
    if (value === undefined || value === null) return <span className="text-muted-foreground">N/A</span>
    const color = value >= 0 ? "text-green-500" : "text-red-500"
    return (
      <span className={`flex items-center font-medium ${color}`}>
        {value >= 0 ? <ArrowUpIcon className="mr-1 h-4 w-4" /> : <ArrowDownIcon className="mr-1 h-4 w-4" />}
        {Math.abs(value)}%
      </span>
    )
  }

  const getStatusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
      case "BUY":
        return "bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm"
      case "SELL":
        return "bg-red-100 text-red-800 px-2 py-1 rounded-md text-sm"
      case "HOLD":
        return "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-sm"
      case "TARGET":
        return "bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
      case "MONITOR":
        return "bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-sm"
      default:
        return "bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm"
    }
  }

  const getRiskStyle = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm"
      case "medium":
        return "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-sm"
      case "high":
        return "bg-red-100 text-red-800 px-2 py-1 rounded-md text-sm"
      default:
        return "bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm"
    }
  }

  // Helper to safely render cell content
  const renderCellContent = (value: any) => {
    if (value === undefined || value === null) {
      return "N/A"
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value)
    }
    
    return String(value)
  }

  const columnGroups = {
    view: { label: "", key: "view", alwaysVisible: true },
    stockInfo: { label: "Stock Info", key: "stock_info", alwaysVisible: true },
    industry: { label: "Industry", key: "industry", alwaysVisible: true },
    price: { label: "Current Price", key: "current_price" ,alwaysVisible: true},
    exchange: { label: "Exchange", key: "exchange" ,alwaysVisible: true},
    currency: { label: "Currency", key: "currency",alwaysVisible: true },
    returnSinceRec: { label: "Return Since Rec.", key: "return_since_rec", alwaysVisible: true },
    status: { label: "Status", key: "status", alwaysVisible: true },
    returns: { label: "Returns", key: "returns", alwaysVisible: true },
    // Additional column groups that are hidden by default
       country: { label: "Country", key: "country" ,alwaysVisible: false},
    addedDate: { label: "Date Added", key: "added_date",alwaysVisible: false },
    returnSinceAdded: { label: "Return Since Added", key: "return_since_added" ,alwaysVisible: false},
    returnSinceBuy: { label: "Return Since Buy", key: "return_since_buy" ,alwaysVisible: false},
    realizedReturn: { label: "Realized Return", key: "realized_return",alwaysVisible: false },
    valueRating: { label: "Value", key: "value_rating" ,alwaysVisible: false},
    growthRating: { label: "Growth", key: "growth_rating" ,alwaysVisible: false},
    riskRating: { label: "Risk Rating", key: "risk_score" ,alwaysVisible: false},
    dateRecommended: { label: "Recommended Date", key: "date_recommended" ,alwaysVisible: false},
    category: { label: "Category", key: "category" ,alwaysVisible: false},
    action: { label: "Action", key: "action" ,alwaysVisible: true},
  }

  // Filter column groups based on visibility settings
  const filteredColumnGroups = Object.values(columnGroups).filter(
    (col) => col.alwaysVisible || visibleColumns[col.key]
  )
  
  return (
    <div className="rounded-lg border bg-card">
      <ScrollArea className="h-[calc(100vh-20rem)] w-full">
        <div className="min-w-[100%]">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10">
              <TableRow>
                {filteredColumnGroups.map((column) => (
                  <TableHead key={column.key} className="whitespace-nowrap bg-muted/50 py-4 text-base font-semibold">
                    {column.key !== "view" ? (
                      <Button
                        variant="ghost"
                        className="h-8 p-0 font-semibold hover:bg-transparent"
                        onClick={() => onSort(column.key as keyof Stock)}
                      >
                        {column.label}
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </Button>
                    ) : (
                      ""
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
            {stocks.map((stock) => (
                <TableRow
                  key={stock._id ?? "N/A"}
                  className={`text-base transition-colors hover:bg-muted/50 ${selectedStockId === stock._id ? "bg-muted/50" : ""}`}
                >
                  {filteredColumnGroups.map((column) => {
                    switch (column.key) {
                      case "view":
                        return (
                          <TableCell key={column.key} className="w-10">
                            {onViewStock && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewStock(stock)}
                                className={`h-8 w-8 ${selectedStockId === stock._id ? "text-primary" : ""}`}
                                disabled={loadingStockId === stock._id}
                              >
                                {loadingStockId === stock._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                          </TableCell>
                        )
                      case "stock_info":
                        return (
                          <TableCell key={column.key} className="font-medium">
                            <div className="flex flex-col">
                              <span>{stock.company ?? "N/A"}</span>
                              <span className="text-sm text-muted-foreground">{stock.name}</span>
                              <span className="text-sm  text-green-500">{stock.current_price}</span>
                            </div>
                          </TableCell>
                        )
                      case "current_price":
                        return (
                          <TableCell key={column.key} className="font-semibold text-primary text-green-500">
                            {stock.current_price?.toFixed(2) ?? "N/A"}
                          </TableCell>
                        )
                      case "returns":
                        // Handle the returns column separately
                        return (
                          <TableCell key={column.key}>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm">1W:</span>
                                {stock.returns && typeof stock.returns.oneWeekReturn === 'number' ? 
                                  renderPercentage(stock.returns.oneWeekReturn) : 
                                  <span className="text-muted-foreground">N/A</span>}
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">1M:</span>
                                {stock.returns && typeof stock.returns.oneMonthReturn === 'number' ? 
                                  renderPercentage(stock.returns.oneMonthReturn) : 
                                  <span className="text-muted-foreground">N/A</span>}
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">3M:</span>
                                {stock.returns && typeof stock.returns.threeMonthReturn === 'number' ? 
                                  renderPercentage(stock.returns.threeMonthReturn) : 
                                  <span className="text-muted-foreground">N/A</span>}
                              </div>
                            </div>
                          </TableCell>
                        )
                      case "return_since_rec":
                        return (
                          <TableCell key={column.key}>
                            {typeof stock.returns?.returnSinceAdded === 'number' ? 
                              renderPercentage(stock.returns?.returnSinceAdded) :
                               
                              <span className="text-muted-foreground">N/A</span>}
                          </TableCell>
                        )
                        case "return_since_added":
                          return (
                            <TableCell key={column.key}>
                              {typeof stock.returns?.returnSinceAdded === 'number' ? 
                                renderPercentage(stock.returns?.returnSinceAdded) :
                                 
                                <span className="text-muted-foreground">N/A</span>}
                            </TableCell>
                          )
                      case "status":
                        return (
                          <TableCell key={column.key}>
                            <span className={getStatusStyle(stock.status)}>{stock.status ?? "N/A"}</span>
                          </TableCell>
                        )
                      case "risk_score":
                        return (
                          <TableCell key={column.key}>
                            <span className={getRiskStyle(stock.indicators?.risk_score)}>
                              {stock.indicators?.risk_score ?? "N/A"}
                            </span>
                          </TableCell>
                        )
                        case "value_rating":
                          return (
                            <TableCell key={column.key}>
                              <span className={getRiskStyle(stock.indicators?.value_rating)}>
                                {stock.indicators?.value_rating ?? "N/A"}
                              </span>
                            </TableCell>
                          )
                          case "growth_rating":
                            return (
                              <TableCell key={column.key}>
                                <span className={getRiskStyle(stock.indicators?.growth_rating)}>
                                  {stock.indicators?.growth_rating ?? "N/A"}
                                </span>
                              </TableCell>
                            )
                      case "date_recommended":
                      case "added_date":
                        return (
                          <TableCell key={column.key}>
                            {stock[column.key] ? new Date(stock[column.key]).toLocaleDateString("en-US") : "N/A"}
                          </TableCell>
                        )
                      case "action":
                        return (
                          <TableCell key={column.key}>
                            <Button
                              size="sm"
                              variant={stock.isPresent ? "destructive" : "default"}
                              onClick={() => handleStockAction(stock)}
                            >
                              {stock.isPresent ? "Remove" : "Add"}
                            </Button>
                          </TableCell>
                        )
                      default:
                        // For any other column, try to render it safely
                        const value = column.key.includes('.') 
                          ? column.key.split('.').reduce((obj, key) => obj?.[key], stock) 
                          : stock[column.key as keyof Stock];
                        
                        return (
                          <TableCell key={column.key}>
                            {renderCellContent(value)}
                          </TableCell>
                        )
                    }
                  })}
                </TableRow>
            ))}
            </TableBody>
          </Table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {selectedStock && (
        <StockActionModal
          stock={selectedStock}
          isPresent={selectedStock.isPresent}
          onClose={() => setSelectedStock(null)}
          onConfirm={handleConfirmAction}
          userId={userId}
          status={status}
        />
      )}
    </div>
  )
}