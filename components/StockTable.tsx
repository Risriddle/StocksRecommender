
// "use client"

// import { useState, useEffect } from "react"
// import { useSession } from "next-auth/react"
// import { ArrowUpIcon, ArrowDownIcon, ArrowUpDown, Eye, Loader2 } from "lucide-react"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
// import type { Stock } from "@/types/stock"
// import StockActionModal from "./StockActionModal"

// interface StockTableProps {
//   data: Stock[]
//   onSort: (key: keyof Stock) => void
//   onViewStock?: (stock: Stock) => void
//   selectedStockId?: string | null
//   visibleColumns?: Record<string, boolean>
// }

// export default function StockTable({
//   data,
//   onSort,
//   onViewStock,
//   selectedStockId,
//   visibleColumns = {},
// }: StockTableProps) {
//   const { data: session, status } = useSession()
//   const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
//   const [stocks, setStocks] = useState<Stock[]>(data)
//   const [stockDetails, setStockDetails] = useState<Stock>(null)
//   const [loadingStockId, setLoadingStockId] = useState<string | null>(null)
//   const userId = session?.user?.id

//   useEffect(() => {
//     setStocks(data)
//   }, [data])


//   console.log(data,"stocks in table")
//   const handleStockAction = (stock: Stock) => {
//     setSelectedStock(stock)
//   }

//   const handleViewStock = async (stock: Stock) => {
//     try {
//       setLoadingStockId(stock._id)
      
//       // Call the API to fetch detailed stock indicators
//       const response = await fetch(`/api/stocks/stock-indicator?stock_id=${stock._id}`)
//       console.log(response,"response of stock-indicator in stocktable")
//       if (!response.ok) {
//         throw new Error(`Failed to fetch stock details: ${response.statusText}`)
//       }
      
//       const detailedStock = await response.json()
//       console.log(detailedStock,"dddddddddddddddddddddddddddddddddddd")
      
//       setStockDetails(detailedStock.data)
    
//       // Once we have the detailed data, call the parent's onViewStock with the updated stock
//       if (onViewStock) {
//         onViewStock({ ...detailedStock.data })
       
//       }
//     } catch (error) {
//       console.error("Error fetching stock details:", error)
//     } finally {
//       setLoadingStockId(null)
//     }
//   }

//   const handleConfirmAction = async (portfolioId: string) => {
//     if (!selectedStock) return

//     try {
//       const response = await fetch(`/api/portfolios/${portfolioId}/stocks`, {
//         method: selectedStock.isPresent ? "DELETE" : "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ stock: selectedStock }),
//       })

//       if (response.ok) {
//         setStocks((prevStocks) =>
//           prevStocks.map((stock) =>
//             stock._id === selectedStock._id ? { ...stock, isPresent: !stock.isPresent } : stock,
//           ),
//         )
//         setSelectedStock(null)
//       }
//     } catch (error) {
//       console.error("Error updating portfolio:", error)
//     }
//   }

//   const renderPercentage = (value?: number | null) => {
//     if (value === undefined || value === null) return <span className="text-muted-foreground">N/A</span>
//     const color = value >= 0 ? "text-green-500" : "text-red-500"
//     return (
//       <span className={`flex items-center font-medium ${color}`}>
//         {value >= 0 ? <ArrowUpIcon className="mr-1 h-4 w-4" /> : <ArrowDownIcon className="mr-1 h-4 w-4" />}
//         {Math.abs(value)}%
//       </span>
//     )
//   }

//   const getStatusStyle = (status: string) => {
//     switch (status?.toUpperCase()) {
//       case "BUY":
//         return "bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm"
//       case "SELL":
//         return "bg-red-100 text-red-800 px-2 py-1 rounded-md text-sm"
//       case "HOLD":
//         return "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-sm"
//       case "TARGET":
//         return "bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
//       case "MONITOR":
//         return "bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-sm"
//       default:
//         return "bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm"
//     }
//   }

//   const getRiskStyle = (risk: string) => {
//     switch (risk?.toLowerCase()) {
//       case "low":
//         return "bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm"
//       case "medium":
//         return "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-sm"
//       case "high":
//         return "bg-red-100 text-red-800 px-2 py-1 rounded-md text-sm"
//       default:
//         return "bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm"
//     }
//   }

//   // Helper to safely render cell content
//   const renderCellContent = (value: any) => {
//     if (value === undefined || value === null) {
//       return "N/A"
//     }
    
//     if (typeof value === 'object') {
//       return JSON.stringify(value)
//     }
    
//     return String(value)
//   }

//   const columnGroups = {
//     view: { label: "", key: "view", alwaysVisible: true },
//     stockInfo: { label: "Stock Info", key: "stock_info", alwaysVisible: true },
//     industry: { label: "Industry", key: "industry", alwaysVisible: true },
//     price: { label: "Current Price", key: "current_price" ,alwaysVisible: true},
//     exchange: { label: "Exchange", key: "exchange" ,alwaysVisible: true},
//     currency: { label: "Currency", key: "currency",alwaysVisible: true },
//     returnSinceRec: { label: "Return Since Rec.", key: "return_since_rec", alwaysVisible: true },
//     addedDate: { label: "Date Added", key: "added_date",alwaysVisible: true },
//     status: { label: "Rating", key: "status", alwaysVisible: true },
//     returns: { label: "Returns", key: "returns", alwaysVisible: true },
   
//     // Additional column groups that are hidden by default
//        country: { label: "Country", key: "country" ,alwaysVisible: false},
//     returnSinceAdded: { label: "Return Since Added", key: "return_since_added" ,alwaysVisible: false},
//     returnSinceBuy: { label: "Return Since Buy", key: "return_since_buy" ,alwaysVisible: false},
//     realizedReturn: { label: "Realized Return", key: "realized_return",alwaysVisible: false },
//     valueRating: { label: "Value", key: "value_rating" ,alwaysVisible: false},
//     growthRating: { label: "Growth", key: "growth_rating" ,alwaysVisible: false},
//     riskRating: { label: "Risk Rating", key: "risk_score" ,alwaysVisible: false},
//     dateRecommended: { label: "Recommended Date", key: "date_recommended" ,alwaysVisible: false},
//     category: { label: "Category", key: "category" ,alwaysVisible: false},
//     action: { label: "Action", key: "action" ,alwaysVisible: true},
//   }

//   // Filter column groups based on visibility settings
//   const filteredColumnGroups = Object.values(columnGroups).filter(
//     (col) => col.alwaysVisible || visibleColumns[col.key]
//   )
  
//   return (
//     <div className="rounded-lg border bg-card">
//       <ScrollArea className="h-[calc(100vh-20rem)] w-full">
//         <div className="min-w-[100%]">
//           <Table>
//             <TableHeader className="bg-muted/50 sticky top-0 z-10">
//               <TableRow>
//                 {filteredColumnGroups.map((column) => (
//                   <TableHead key={column.key} className="whitespace-nowrap bg-muted/50 py-4 text-base font-semibold">
//                     {column.key !== "view" ? (
//                       <Button
//                         variant="ghost"
//                         className="h-8 p-0 font-semibold hover:bg-transparent"
//                         onClick={() => onSort(column.key as keyof Stock)}
//                       >
//                         {column.label}
//                         <ArrowUpDown className="ml-1 h-4 w-4" />
//                       </Button>
//                     ) : (
//                       ""
//                     )}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//             {stocks.map((stock) => (
//                 <TableRow
//                   key={stock._id ?? "N/A"}
//                   className={`text-base transition-colors hover:bg-muted/50 ${selectedStockId === stock._id ? "bg-muted/50" : ""}`}
//                 >
//                   {filteredColumnGroups.map((column) => {
//                     switch (column.key) {
//                       case "view":
//                         return (
//                           <TableCell key={column.key} className="w-10">
//                             {onViewStock && (
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 onClick={() => handleViewStock(stock)}
//                                 className={`h-8 w-8 ${selectedStockId === stock._id ? "text-primary" : ""}`}
//                                 disabled={loadingStockId === stock._id}
//                               >
//                                 {loadingStockId === stock._id ? (
//                                   <Loader2 className="h-4 w-4 animate-spin" />
//                                 ) : (
//                                   <Eye className="h-4 w-4" />
//                                 )}
//                               </Button>
//                             )}
//                           </TableCell>
//                         )
//                       case "stock_info":
//                         return (
//                           <TableCell key={column.key} className="font-medium">
//                             <div className="flex flex-col">
//                               <span>{stock.company ?? "N/A"}</span>
//                               <span className="text-sm text-muted-foreground">{stock.name}</span>
//                               <span className="text-sm  text-green-500">{stock.current_price}</span>
//                             </div>
//                           </TableCell>
//                         )
//                       case "current_price":
//                         return (
//                           <TableCell key={column.key} className="font-semibold text-primary text-green-500">
//                             {stock.current_price?.toFixed(2) ?? "N/A"}
//                           </TableCell>
//                         )
//                       case "returns":
//                         // Handle the returns column separately
//                         return (
//                           <TableCell key={column.key}>
//                             <div className="space-y-1">
//                               <div className="flex items-center justify-between">
//                                 <span className="text-sm">1W:</span>
//                                 {stock.returns && typeof stock.returns.oneWeekReturn === 'number' ? 
//                                   renderPercentage(stock.returns.oneWeekReturn) : 
//                                   <span className="text-muted-foreground">N/A</span>}
//                               </div>
//                               <div className="flex items-center justify-between">
//                                 <span className="text-sm">1M:</span>
//                                 {stock.returns && typeof stock.returns.oneMonthReturn === 'number' ? 
//                                   renderPercentage(stock.returns.oneMonthReturn) : 
//                                   <span className="text-muted-foreground">N/A</span>}
//                               </div>
//                               <div className="flex items-center justify-between">
//                                 <span className="text-sm">3M:</span>
//                                 {stock.returns && typeof stock.returns.threeMonthReturn === 'number' ? 
//                                   renderPercentage(stock.returns.threeMonthReturn) : 
//                                   <span className="text-muted-foreground">N/A</span>}
//                               </div>
//                             </div>
//                           </TableCell>
//                         )
//                       case "return_since_rec":
//                         return (
//                           <TableCell key={column.key}>
//                             {typeof stock.returns?.returnSinceAdded === 'number' ? 
//                               renderPercentage(stock.returns?.returnSinceAdded) :
                               
//                               <span className="text-muted-foreground">N/A</span>}
//                           </TableCell>
//                         )
//                         case "return_since_added":
//                           return (
//                             <TableCell key={column.key}>
//                               {typeof stock.returns?.returnSinceAdded === 'number' ? 
//                                 renderPercentage(stock.returns?.returnSinceAdded) :
                                 
//                                 <span className="text-muted-foreground">N/A</span>}
//                             </TableCell>
//                           )
//                       case "status":
//                         return (
//                           <TableCell key={column.key}>
//                             <span className={getStatusStyle(stock.status)}>{stock.status ?? "N/A"}</span>
//                           </TableCell>
//                         )
//                       case "risk_score":
//                         return (
//                           <TableCell key={column.key}>
//                             <span className={getRiskStyle(stock.indicators?.risk_score)}>
//                               {stock.indicators?.risk_score ?? "N/A"}
//                             </span>
//                           </TableCell>
//                         )
//                         case "value_rating":
//                           return (
//                             <TableCell key={column.key}>
//                               <span className={getRiskStyle(stock.indicators?.value_rating)}>
//                                 {stock.indicators?.value_rating ?? "N/A"}
//                               </span>
//                             </TableCell>
//                           )
//                           case "growth_rating":
//                             return (
//                               <TableCell key={column.key}>
//                                 <span className={getRiskStyle(stock.indicators?.growth_rating)}>
//                                   {stock.indicators?.growth_rating ?? "N/A"}
//                                 </span>
//                               </TableCell>
//                             )
//                       case "date_recommended":
//                       case "added_date":
//                         return (
//                           <TableCell key={column.key}>
//                             {stock[column.key] ? new Date(stock[column.key]).toLocaleDateString("en-US") : "N/A"}
//                           </TableCell>
//                         )
//                       case "action":
//                         return (
//                           <TableCell key={column.key}>
//                             <Button
//                               size="sm"
//                               variant={stock.isPresent ? "destructive" : "default"}
//                               onClick={() => handleStockAction(stock)}
//                             >
//                               {stock.isPresent ? "Remove" : "Add"}
//                             </Button>
//                           </TableCell>
//                         )
//                       default:
//                         // For any other column, try to render it safely
//                         const value = column.key.includes('.') 
//                           ? column.key.split('.').reduce((obj, key) => obj?.[key], stock) 
//                           : stock[column.key as keyof Stock];
                        
//                         return (
//                           <TableCell key={column.key}>
//                             {renderCellContent(value)}
//                           </TableCell>
//                         )
//                     }
//                   })}
//                 </TableRow>
//             ))}
//             </TableBody>
//           </Table>
//         </div>
//         <ScrollBar orientation="horizontal" />
//       </ScrollArea>

//       {selectedStock && (
//         <StockActionModal
//           stock={selectedStock}
//           isPresent={selectedStock.isPresent}
//           onClose={() => setSelectedStock(null)}
//           onConfirm={handleConfirmAction}
//           userId={userId}
//           status={status}
//         />
//       )}
//     </div>
//   )
// }



"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { ArrowUpIcon, ArrowDownIcon, ArrowUpDown, Eye, Loader2, TrendingUp, TrendingDown, Activity, BarChart3, Info } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Stock } from "@/types/stock"
import StockActionModal from "./StockActionModal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const userId = session?.user?.id

  useEffect(() => {
    setStocks(data)
  }, [data])

  const handleStockAction = (stock: Stock) => {
    setSelectedStock(stock)
  }

  const handleViewStock = async (stock: Stock) => {
    try {
      setLoadingStockId(stock._id)
      
      // Call the API to fetch detailed stock indicators
      const response = await fetch(`/api/stocks/stock-indicator?stock_id=${stock._id}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch stock details: ${response.statusText}`)
      }
      
      const detailedStock = await response.json()
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
    if (value === undefined || value === null) return <span className="text-gray-400">N/A</span>
    const color = value >= 0 ? "text-emerald-400" : "text-rose-400"
    const bgColor = value >= 0 ? "bg-emerald-950/30" : "bg-rose-950/30"
    const Icon = value >= 0 ? TrendingUp : TrendingDown
    return (
      <div className={`flex items-center justify-center font-medium text-sm ${color} ${bgColor} rounded-md p-1`}>
        <Icon className="mr-1 h-3 w-3" />
        <span className="font-bold">{Math.abs(value).toFixed(2)}%</span>
      </div>
    )
  }

  const getStatusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
      case "BUY":
        return "bg-emerald-950/30 text-emerald-400 border-emerald-800"
      case "SELL":
        return "bg-rose-950/30 text-rose-400 border-rose-800"
      case "HOLD":
        return "bg-amber-950/30 text-amber-400 border-amber-800"
      case "TARGET":
        return "bg-violet-950/30 text-violet-400 border-violet-800"
      case "MONITOR":
        return "bg-purple-950/30 text-purple-400 border-purple-800"
      default:
        return "bg-gray-800/80 text-gray-300 border-gray-700"
    }
  }

  const getRiskStyle = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case "low":
        return "bg-emerald-950/30 text-emerald-400 border-emerald-800"
      case "medium":
        return "bg-amber-950/30 text-amber-400 border-amber-800"
      case "high":
        return "bg-rose-950/30 text-rose-400 border-rose-800"
      default:
        return "bg-gray-800/80 text-gray-300 border-gray-700"
    }
  }

  // Helper to safely render cell content
  const renderCellContent = (value: any) => {
    if (value === undefined || value === null) {
      return <span className="text-gray-400">N/A</span>
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value)
    }
    
    return String(value)
  }

  // All columns now visible by default
  const columnGroups = {
    view: { label: "", key: "view", alwaysVisible: true },
    stockInfo: { label: "Stock Info", key: "stock_info", alwaysVisible: true },
    industry: { label: "Industry", key: "industry", alwaysVisible: true },
    currency: { label: "Currency", key: "currency", alwaysVisible: true },
    price: { label: "Current Price", key: "current_price", alwaysVisible: true },
    exchange: { label: "Exchange", key: "exchange", alwaysVisible: true },
    country: { label: "Country", key: "country", alwaysVisible: true },
    category: { label: "Category", key: "category", alwaysVisible: true },
    returnSinceAdded: { label: "Return Since Added", key: "return_since_added", alwaysVisible: true },
    returnSinceBuy: { label: "Return Since Buy", key: "return_since_buy", alwaysVisible: false },
    realizedReturn: { label: "Realized Return", key: "realized_return", alwaysVisible: false },
    addedDate: { label: "Date Added", key: "added_date", alwaysVisible: true },
    dateRecommended: { label: "Recommended Date", key: "date_recommended", alwaysVisible: false },
    status: { label: "Rating", key: "status", alwaysVisible: true },
    valueRating: { label: "Value", key: "value_rating", alwaysVisible: false },
    growthRating: { label: "Growth", key: "growth_rating", alwaysVisible: false },
    riskRating: { label: "Risk Rating", key: "risk_score", alwaysVisible: false },
    returns: { label: "Returns", key: "returns", alwaysVisible: true },
    action: { label: "Action", key: "action", alwaysVisible: true },
  }

  // Show all columns or filter based on visibleColumns prop
  const showAllColumns = Object.keys(visibleColumns).length === 0
  const filteredColumnGroups = Object.values(columnGroups).filter(
    (col) => col.alwaysVisible || showAllColumns || visibleColumns[col.key]
  )

  
  const renderStockCards = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {stocks.map((stock) => (
          <Card 
            key={stock._id ?? "N/A"} 
            className={`bg-gray-900 border border-gray-800 hover:border-purple-800 transition-all ${
              selectedStockId === stock._id ? "ring-2 ring-purple-500" : ""
            }`} >
          
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-bold text-white">{stock.company ?? "N/A"}</CardTitle>
                  <p className="text-sm text-gray-400">{stock.name}</p>
                </div>
                <Badge 
                  className={getStatusStyle(stock.status)}
                >
                  {stock.status ?? "N/A"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-sm">Current Price</span>
                  <span className="text-xl font-bold text-emerald-400">{stock.current_price?.toFixed(2) ?? "N/A"}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-gray-400 text-sm">Return Since Added</span>
                  {typeof stock.returns?.returnSinceAdded === 'number' ? 
                    renderPercentage(stock.returns?.returnSinceAdded) :
                    <span className="text-gray-400">N/A</span>}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 bg-gray-800 p-3 rounded-lg">
                <div>
                  <div className="text-xs text-gray-400 mb-1">1W Return</div>
                  {stock.returns && typeof stock.returns.oneWeekReturn === 'number' ? 
                    renderPercentage(stock.returns.oneWeekReturn) : 
                    <span className="text-gray-400">N/A</span>}
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">1M Return</div>
                  {stock.returns && typeof stock.returns.oneMonthReturn === 'number' ? 
                    renderPercentage(stock.returns.oneMonthReturn) : 
                    <span className="text-gray-400">N/A</span>}
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">3M Return</div>
                  {stock.returns && typeof stock.returns.threeMonthReturn === 'number' ? 
                    renderPercentage(stock.returns.threeMonthReturn) : 
                    <span className="text-gray-400">N/A</span>}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">Category</span>
                  <span className="text-sm font-medium text-purple-400">
                    {stock.category ?? "N/A"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">Exchange</span>
                  <span className="text-sm font-medium text-amber-400">
                    {stock.exchange ?? "N/A"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">Country</span>
                  <span className="text-sm font-medium text-emerald-400">
                    {stock.country ?? "N/A"}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t border-gray-800">
                <Button
                  variant="outline"
                  className="text-white border-gray-700 hover:bg-purple-800"
                  size="sm"
                  onClick={() => handleViewStock(stock)}
                  disabled={loadingStockId === stock._id}
                >
                  {loadingStockId === stock._id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Eye className="h-4 w-4 mr-2" />
                  )}
                  Details
                </Button>
                <Button
                  size="sm"
                  className="text-sm"
                  variant={stock.isPresent ? "destructive" : "default"}
                  onClick={() => handleStockAction(stock)}
                >
                  {stock.isPresent ? "Remove" : "Add"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
  
  return (
    <Card className="rounded-xl border border-gray-800 bg-gray-950 shadow-xl">
      <CardHeader className="border-b border-gray-800 pb-3 pt-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold text-white">Stock Portfolio</CardTitle>
          <Tabs defaultValue="table" onValueChange={(val) => setViewMode(val as 'table' | 'cards')}>
            <TabsList className="bg-gray-800">
              <TabsTrigger value="table" className="data-[state=active]:bg-purple-800 data-[state=active]:text-white">
                <Activity className="h-4 w-4 mr-2" />
                Table View
              </TabsTrigger>
              <TabsTrigger value="cards" className="data-[state=active]:bg-purple-800 data-[state=active]:text-white">
                <BarChart3 className="h-4 w-4 mr-2" />
                Card View
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      


<CardContent className="p-0">
  {viewMode === 'table' ? (
    <ScrollArea className="h-[calc(100vh-16rem)] w-full">
      <div className="min-w-[100%]">
        <Table>
        <TableHeader className="bg-purple-900/80 sticky top-0 z-10">
                  <TableRow>
                    {filteredColumnGroups.map((column) => (
                      <TableHead 
                        key={column.key} 
                        className="whitespace-nowrap py-3 text-sm font-semibold border-b border-gray-800 text-gray-300"
                      >
                        {column.key !== "view" ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 p-0 font-semibold hover:bg-gray-800 text-gray-300 hover:text-purple-400"
                                  onClick={() => onSort(column.key as keyof Stock)}
                                >
                                  {column.label}
                                  <ArrowUpDown className="ml-1 h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p>{column.label}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
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
                      className={`text-sm border-b border-gray-800 transition-colors 
                        hover:bg-gray-900/60 ${selectedStockId === stock._id ? "bg-purple-950/20" : ""}`}
                    >
                      {filteredColumnGroups.map((column) => {
                        switch (column.key) {
                          case "view":
                            return (
                              <TableCell key={column.key} className="w-10 p-2">
                                {onViewStock && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleViewStock(stock)}
                                    className={`h-8 w-8 rounded-full ${selectedStockId === stock._id ? 
                                      "bg-purple-900/50 text-purple-400" : 
                                      "hover:bg-gray-800 hover:text-purple-400"}`}
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
                              <TableCell key={column.key} className="font-medium p-2">
                                <div className="flex flex-col space-y-1">
                                  <span className="text-base font-bold text-white">{stock.company ?? "N/A"}</span>
                                  <span className="text-xs text-gray-400">{stock.name}</span>
                                  <div className="mt-1 flex items-center gap-1">
                                    <span className="text-emerald-400 text-sm font-medium">
                                      {stock.current_price?.toFixed(2) ?? "N/A"}
                                    </span>
                                  </div>
                                </div>
                              </TableCell>
                            )
                          case "current_price":
                            return (
                              <TableCell key={column.key} className="p-2">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-emerald-400 text-sm font-bold">
                                    {stock.current_price?.toFixed(2) ?? "N/A"}
                                  </span>
                                </div>
                              </TableCell>
                            )
                          case "returns":
                            return (
                              <TableCell key={column.key} className="p-2">
                                <div className="space-y-1.5 bg-gray-900/60 rounded-lg p-2">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs text-gray-400">1W:</span>
                                    <div className="flex-1">
                                      {stock.returns && typeof stock.returns.oneWeekReturn === 'number' ? 
                                        renderPercentage(stock.returns.oneWeekReturn) : 
                                        <span className="text-gray-400 text-xs">N/A</span>}
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs text-gray-400">1M:</span>
                                    <div className="flex-1">
                                      {stock.returns && typeof stock.returns.oneMonthReturn === 'number' ? 
                                        renderPercentage(stock.returns.oneMonthReturn) : 
                                        <span className="text-gray-400 text-xs">N/A</span>}
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs text-gray-400">3M:</span>
                                    <div className="flex-1">
                                      {stock.returns && typeof stock.returns.threeMonthReturn === 'number' ? 
                                        renderPercentage(stock.returns.threeMonthReturn) : 
                                        <span className="text-gray-400 text-xs">N/A</span>}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                            )
                          
                          case "return_since_added":
                          case "return_since_buy":
                          case "realized_return":
                            // Handle all return types
                            const returnType = 
                                            column.key === "return_since_added" ? "returnSinceAdded" :
                                            column.key === "return_since_buy" ? "returnSinceBuy" : "realizedReturn";
                            
                            const returnValue = stock.returns?.[returnType];
                            
                            return (
                              <TableCell key={column.key} className="p-2">
                                <div className="flex justify-center">
                                  {typeof returnValue === 'number' ? 
                                    renderPercentage(returnValue) :
                                    <span className="text-gray-400 text-sm">N/A</span>}
                                </div>
                              </TableCell>
                            )
                          case "status":
                            return (
                              <TableCell key={column.key} className="p-2">
                                <Badge className={`${getStatusStyle(stock.status)} px-3 py-1`}>
                                  {stock.status ?? "N/A"}
                                </Badge>
                              </TableCell>
                            )
                          case "risk_score":
                          case "value_rating":
                          case "growth_rating":
                            const ratingKey = column.key === "risk_score" ? "risk_score" : 
                                          column.key === "value_rating" ? "value_rating" : "growth_rating";
                            return (
                              <TableCell key={column.key} className="p-2">
                                <Badge className={`${getRiskStyle(stock.indicators?.[ratingKey])} px-3 py-1`}>
                                  {stock.indicators?.[ratingKey] ?? "N/A"}
                                </Badge>
                              </TableCell>
                            )
                          case "date_recommended":
                          case "added_date":
                            return (
                              <TableCell key={column.key} className="p-2 text-base">
                                {stock[column.key] ? 
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-amber-200 text-xs">
                                      {new Date(stock[column.key]).toLocaleDateString("en-US")}
                                    </span>
                                  </div> : 
                                  <span className="text-gray-400">N/A</span>
                                }
                              </TableCell>
                            )
                          case "industry":
                            return (
                              <TableCell key={column.key} className="p-2 text-sm">
                                {stock[column.key] ? 
                                  <div className="flex items-center gap-1.5">
                                  
                                    <span className="text-purple-300 text-sm font-medium">
                                      {stock[column.key]}
                                    </span>
                                  </div> : 
                                  <span className="text-gray-400">N/A</span>
                                }
                              </TableCell>
                            )
                          case "exchange":
                            return (
                              <TableCell key={column.key} className="p-2 text-sm">
                                {stock[column.key] ? 
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-amber-300 text-sm font-medium">
                                      {stock[column.key]}
                                    </span>
                                  </div> : 
                                  <span className="text-gray-400">N/A</span>
                                }
                              </TableCell>
                            )
                          case "currency":
                            return (
                              <TableCell key={column.key} className="p-2 text-sm">
                                {stock[column.key] ? 
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-green-300 text-sm font-medium">
                                      {stock[column.key]}
                                    </span>
                                  </div> : 
                                  <span className="text-gray-400">N/A</span>
                                }
                              </TableCell>
                            )
                          case "country":
                            return (
                              <TableCell key={column.key} className="p-2 text-sm">
                                {stock[column.key] ? 
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-white text-sm font-medium">
                                      {stock[column.key]}
                                    </span>
                                  </div> : 
                                  <span className="text-gray-400">N/A</span>
                                }
                              </TableCell>
                            )
                          case "category":
                            return (
                              <TableCell key={column.key} className="p-2 text-sm">
                                {stock[column.key] ? 
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-white text-sm font-medium">
                                      {stock[column.key]}
                                    </span>
                                  </div> : 
                                  <span className="text-gray-400">N/A</span>
                                }
                              </TableCell>
                            )
                          case "action":
                            return (
                            
                              <TableCell key={column.key} className="p-2">
                              <Button
                                size="sm"
                                className={`text-sm px-4 py-2 h-9 ${
                                  stock.isPresent ? 
                                  "bg-rose-950/60 text-rose-300 hover:bg-rose-900 hover:text-rose-100" : 
                                  "bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900 hover:text-emerald-100"
                                }`}
                                variant="outline"
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
                              <TableCell key={column.key} className="p-2 text-sm">
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
        ) : (
          // Card view
          renderStockCards()
        )}

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
      </CardContent>
    </Card>
  )
}