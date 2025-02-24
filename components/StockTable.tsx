

"use client"

import { useState,useEffect } from "react"
import { useSession } from "next-auth/react"
import { ArrowUpIcon, ArrowDownIcon, ArrowUpDown } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import type { Stock } from "@/types/stock"
import StockActionModal from "./StockActionModal"



interface StockTableProps {
  data: Stock[]
  onSort: (key: keyof Stock) => void
}

export default function StockTable({ data, onSort }: StockTableProps) {
  const { data: session, status } = useSession()
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [stocks, setStocks] = useState<Stock[]>(data)
  const userId = session?.user?.id


  // Update stocks when data prop changes
  useEffect(() => {
    setStocks(data)
  }, [data])

  const handleStockAction = (stock: Stock) => {
    setSelectedStock(stock)
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
        // Update local state
        setStocks(prevStocks => 
          prevStocks.map(stock => 
            stock._id === selectedStock._id 
              ? { ...stock, isPresent: !stock.isPresent }
              : stock
          )
        )
        setSelectedStock(null)
      }
      
      setSelectedStock(null);
    } catch (error) {
      console.error("Error updating portfolio:", error)
    }
  }

  // Rest of your render functions...
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

  const getRiskStyle = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-sm'
      case 'high':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-md text-sm'
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm'
    }
  }

  return (

    <div className="rounded-md border">
      {/* ... rest of your table code ... */}
      <ScrollArea className="h-[calc(100vh-20rem)] w-full">
        <div className="min-w-[200%]"> {/* Force table to be wider than container */}
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10">
              <TableRow>
                {[
                  "Company",
                  "Exchange",
                  "Currency",
                  "Current Price",
                  "Country",
                  "Growth (1W)",
                  "Date Added",
                  "Return Since Added",
                  "Return Since Buy",
                  "Realized Return",
                  "Status",
                  "Value",
                  "Growth",
                  "1 Week Return",
                  "1 Month Return",
                  "3 Month Return",
                  "Risk Rating",
                  "Recommended Date",
                  "Industry",
                  "Category",
                  "Action",
                ].map((header) => (
                  <TableHead key={header} className="whitespace-nowrap bg-muted/50 py-4 text-base font-semibold">
                    <Button
                      variant="ghost"
                      className="h-8 p-0 font-semibold hover:bg-transparent"
                      onClick={() => onSort(header.toLowerCase().replace(/ /g, "") as keyof Stock)}
                    >
                      {header}
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </Button>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

      <TableBody>
        {stocks.map((stock) => (
          // Use stocks from local state instead of data prop
          <TableRow key={stock.name ?? "N/A"} className="text-base">
         
            <TableCell className="font-medium text-base">{stock.company ?? "N/A"}</TableCell>
                  <TableCell className="text-base">{stock.exchange ?? "N/A"}</TableCell>
                  <TableCell className="text-base">{stock.currency ?? "N/A"}</TableCell>
                  <TableCell className="font-semibold text-primary text-base text-green-400">
                    ${stock.current_price?.toFixed(2) ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-base">{stock.country ?? "N/A"}</TableCell>
                  <TableCell className="text-base">{renderPercentage(stock.returns?.growthLastWeek)}</TableCell>
                  <TableCell className="text-base">
                    {new Date(stock.added_date).toLocaleDateString("en-US")}
                  </TableCell>
                  <TableCell className="text-base">{renderPercentage(stock.returns?.returnSinceAdded)}</TableCell>
                  <TableCell className="text-base">{renderPercentage(stock.returns?.returnSinceBuy)}</TableCell>
                  <TableCell className="text-base">{renderPercentage(stock.returns?.realizedReturn)}</TableCell>
                  <TableCell className="text-base">
                       <span className={getStatusStyle(stock.status)}>
                      {stock.status ?? "N/A"}
                    </span>
                  </TableCell>
                  <TableCell className="text-base">{stock.indicators?.value_rating ?? "N/A"}</TableCell>
                  <TableCell className="text-base">{stock.indicators?.growth_rating ?? "N/A"}</TableCell>
                  <TableCell className="text-base">{renderPercentage(stock.returns?.oneWeekReturn)}</TableCell>
                  <TableCell className="text-base">{renderPercentage(stock.returns?.oneMonthReturn)}</TableCell>
                  <TableCell className="text-base">{renderPercentage(stock.returns?.threeMonthReturn)}</TableCell>
                  <TableCell className="text-base">
                        <span className={getRiskStyle(stock.indicators?.risk_score)}>
                      {stock.indicators?.risk_score ?? "N/A"}
                    </span>
                  </TableCell>
                  <TableCell className="text-base">
                    {new Date(stock.date_recommended).toLocaleDateString("en-US")}
                  </TableCell>
                  <TableCell className="text-base">{stock.industry ?? "N/A"}</TableCell>
                  <TableCell className="text-base">{stock.category ?? "N/A"}</TableCell>

            <TableCell className="text-base">
              <Button
                size="sm"
                variant={stock.isPresent ? "destructive" : "default"}
                onClick={() => handleStockAction(stock)}
              >
                {stock.isPresent ? "Remove" : "Add"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      {/* ... rest of your table code ... */}
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


