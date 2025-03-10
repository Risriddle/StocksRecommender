
// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Search, ArrowUpDown, Edit, RefreshCcw, ChevronLeft, TrendingUp, Info } from "lucide-react"
// import Link from "next/link"

// type Stock = {
//   _id: string
//   name: string
//   company: string
//   exchange: string
//   industry: string
//   category: string
//   current_price: number
//   status: string
//   country: string
//   currency: string
// }

// type StockIndicator = {
//   _id: string
//   stock_id: string
//   growth_rating: string
//   momentum_score: string
//   risk_score: string
//   value_rating: string
//   volume?: string
//   market_cap?: string
//   pe_ratio?: string
//   last_updated: Date
// }

// type StockReturns = {
//   oneDay?: number
//   oneWeek?: number
//   oneMonth?: number
//   threeMonths?: number
//   sixMonths?: number
//   oneYear?: number
//   ytd?: number
// }

// type StockWithDetails = Stock & {
//   indicators?: StockIndicator
//   returns?: StockReturns
//   date_recommended?: Date
// }

// export default function ManageStocks() {
//   const [stocks, setStocks] = useState<Stock[]>([])
//   const [loading, setLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [sortField, setSortField] = useState<string>("name")
//   const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
//   const [selectedStock, setSelectedStock] = useState<StockWithDetails | null>(null)
//   const [isEditing, setIsEditing] = useState(false)
//   const [updating, setUpdating] = useState(false)
//   const [message, setMessage] = useState<string | null>(null)
//   const [loadingStockDetails, setLoadingStockDetails] = useState(false)

//   useEffect(() => {
//     fetchStocks()
//   }, [])

//   const fetchStocks = async () => {
//     setLoading(true)
//     try {
//       const response = await fetch("/api/stocks")
//       const data = await response.json()

//       if (response.ok) {
//         setStocks(data || [])
//       } else {
//         console.error("Failed to fetch stocks:", data.message)
//       }
//     } catch (error) {
//       console.error("Error fetching stocks:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchStockDetails = async (stockId: string) => {
//     setLoadingStockDetails(true)
//     try {
//       const response = await fetch(`/api/stocks/stock-indicator?stock_id=${stockId}`)
//       const data = await response.json()

//       if (response.ok && data.success) {
//         return data.data
//       } else {
//         console.error("Failed to fetch stock details:", data.error)
//         return null
//       }
//     } catch (error) {
//       console.error("Error fetching stock details:", error)
//       return null
//     } finally {
//       setLoadingStockDetails(false)
//     }
//   }

//   const handleSort = (field: string) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === "asc" ? "desc" : "asc")
//     } else {
//       setSortField(field)
//       setSortDirection("asc")
//     }
//   }

//   const sortedStocks = [...stocks].sort((a, b) => {
//     let aValue: any = a[sortField as keyof Stock]
//     let bValue: any = b[sortField as keyof Stock]

//     if (typeof aValue === "string") {
//       aValue = aValue.toLowerCase()
//       bValue = bValue.toLowerCase()
//     }

//     if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
//     if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
//     return 0
//   })

//   const filteredStocks = sortedStocks.filter(
//     (stock) =>
//       stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       stock.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       stock.industry.toLowerCase().includes(searchTerm.toLowerCase()),
//   )

//   const handleEditStock = async (stock: Stock) => {
//     setMessage(null)

//     // Fetch detailed stock information including indicators and returns
//     const stockDetails = await fetchStockDetails(stock._id)

//     if (stockDetails) {
//       setSelectedStock(stockDetails)
//       setIsEditing(true)
//     } else {
//       setMessage("Failed to load stock details ❌")
//     }
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!selectedStock) return

//     const { name, value } = e.target
//     setSelectedStock({
//       ...selectedStock,
//       [name]: name === "current_price" ? Number.parseFloat(value) : value,
//     })
//   }

//   const handleSelectChange = (name: string, value: string) => {
//     if (!selectedStock) return

//     if (name.includes("indicators.")) {
//       const indicatorField = name.split(".")[1]
//       setSelectedStock({
//         ...selectedStock,
//         indicators: {
//           ...selectedStock.indicators,
//           [indicatorField]: value,
//         },
//       })
//     } else {
//       setSelectedStock({
//         ...selectedStock,
//         [name]: value,
//       })
//     }
//   }

//   const handleSaveStock = async () => {
//     if (!selectedStock) return

//     setUpdating(true)
//     setMessage(null)

//     try {
//       const response = await fetch(`/api/stocks/${selectedStock._id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           stock: {
//             name: selectedStock.name,
//             company: selectedStock.company,
//             exchange: selectedStock.exchange,
//             industry: selectedStock.industry,
//             category: selectedStock.category,
//             current_price: selectedStock.current_price,
//             status: selectedStock.status,
//             country: selectedStock.country,
//             currency: selectedStock.currency,
//           },
//           indicators: selectedStock.indicators,
//         }),
//       })

//       const result = await response.json()

//       if (response.ok && result.success) {
//         setMessage("Stock updated successfully ✅")
//         setIsEditing(false)
//         fetchStocks() // Refresh the stocks list
//       } else {
//         setMessage(`Failed to update stock: ${result.message} ❌`)
//       }
//     } catch (error) {
//       console.error("Error updating stock:", error)
//       setMessage("An error occurred while updating the stock ❌")
//     } finally {
//       setUpdating(false)
//     }
//   }

//   const formatPercentage = (value: number | undefined) => {
//     if (value === undefined) return "N/A"
//     return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`
//   }

//   const getReturnColorClass = (value: number | undefined) => {
//     if (value === undefined) return ""
//     return value >= 0 ? "text-green-600" : "text-red-600"
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <Link href="/admin">
//             <Button variant="outline" size="icon">
//               <ChevronLeft className="h-4 w-4" />
//             </Button>
//           </Link>
//           <h1 className="text-3xl font-bold">Manage Stocks</h1>
//         </div>
//         <Button onClick={fetchStocks} disabled={loading}>
//           {loading ? <RefreshCcw className="h-4 w-4 animate-spin" /> : "Refresh"}
//         </Button>
//       </div>

//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <CardTitle>All Stocks</CardTitle>
//             <div className="relative w-64">
//               <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search stocks..."
//                 className="pl-8"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {loading ? (
//             <div className="flex justify-center py-8">
//               <RefreshCcw className="h-8 w-8 animate-spin text-muted-foreground" />
//             </div>
//           ) : (
//             <div className="rounded-md border">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead className="w-[50px]">Edit</TableHead>
//                     <TableHead onClick={() => handleSort("name")} className="cursor-pointer">
//                       Name {sortField === "name" && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
//                     </TableHead>
//                     <TableHead onClick={() => handleSort("company")} className="cursor-pointer">
//                       Company {sortField === "company" && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
//                     </TableHead>
//                     <TableHead onClick={() => handleSort("industry")} className="cursor-pointer">
//                       Industry {sortField === "industry" && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
//                     </TableHead>
//                     <TableHead onClick={() => handleSort("current_price")} className="cursor-pointer">
//                       Price {sortField === "current_price" && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
//                     </TableHead>
//                     <TableHead onClick={() => handleSort("status")} className="cursor-pointer">
//                       Status {sortField === "status" && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
//                     </TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredStocks.length > 0 ? (
//                     filteredStocks.map((stock) => (
//                       <TableRow key={stock._id}>
//                         <TableCell>
//                           <Button variant="ghost" size="icon" onClick={() => handleEditStock(stock)}>
//                             <Edit className="h-4 w-4" />
//                           </Button>
//                         </TableCell>
//                         <TableCell className="font-medium">{stock.name}</TableCell>
//                         <TableCell>{stock.company}</TableCell>
//                         <TableCell>{stock.industry}</TableCell>
//                         <TableCell>
//                           {stock.currency} {stock.current_price.toFixed(2)}
//                         </TableCell>
//                         <TableCell>
//                           <span
//                             className={`px-2 py-1 rounded-full text-xs font-medium ${
//                               stock.status === "BUY"
//                                 ? "bg-green-100 text-green-800"
//                                 : stock.status === "SELL"
//                                   ? "bg-red-100 text-red-800"
//                                   : stock.status === "HOLD"
//                                     ? "bg-blue-100 text-blue-800"
//                                     : stock.status === "MONITOR"
//                                       ? "bg-yellow-100 text-yellow-800"
//                                       : "bg-purple-100 text-purple-800"
//                             }`}
//                           >
//                             {stock.status}
//                           </span>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
//                         No stocks found
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       <Dialog open={isEditing} onOpenChange={(open) => !updating && setIsEditing(open)}>
//         <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Edit Stock: {selectedStock?.name}</DialogTitle>
//           </DialogHeader>

//           {loadingStockDetails ? (
//             <div className="flex justify-center py-8">
//               <RefreshCcw className="h-8 w-8 animate-spin text-muted-foreground" />
//               <span className="ml-2">Loading stock details...</span>
//             </div>
//           ) : selectedStock ? (
//             <Tabs defaultValue="basic" className="w-full">
//               <TabsList className="grid grid-cols-3 mb-4">
//                 <TabsTrigger value="basic">Basic Information</TabsTrigger>
//                 <TabsTrigger value="indicators">Indicators</TabsTrigger>
//                 <TabsTrigger value="performance">Performance</TabsTrigger>
//               </TabsList>

//               <TabsContent value="basic" className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="name">Stock Name</Label>
//                     <Input id="name" name="name" value={selectedStock.name} onChange={handleInputChange} />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="company">Company</Label>
//                     <Input id="company" name="company" value={selectedStock.company} onChange={handleInputChange} />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="exchange">Exchange</Label>
//                     <Input id="exchange" name="exchange" value={selectedStock.exchange} onChange={handleInputChange} />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="industry">Industry</Label>
//                     <Input id="industry" name="industry" value={selectedStock.industry} onChange={handleInputChange} />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="category">Category</Label>
//                     <Input id="category" name="category" value={selectedStock.category} onChange={handleInputChange} />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="current_price">Current Price</Label>
//                     <Input
//                       id="current_price"
//                       name="current_price"
//                       type="number"
//                       step="0.01"
//                       value={selectedStock.current_price}
//                       onChange={handleInputChange}
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="country">Country</Label>
//                     <Input id="country" name="country" value={selectedStock.country} onChange={handleInputChange} />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="currency">Currency</Label>
//                     <Input id="currency" name="currency" value={selectedStock.currency} onChange={handleInputChange} />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="status">Status</Label>
//                     <Select value={selectedStock.status} onValueChange={(value) => handleSelectChange("status", value)}>
//                       <SelectTrigger id="status">
//                         <SelectValue placeholder="Select status" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="BUY">BUY</SelectItem>
//                         <SelectItem value="HOLD">HOLD</SelectItem>
//                         <SelectItem value="SELL">SELL</SelectItem>
//                         <SelectItem value="MONITOR">MONITOR</SelectItem>
//                         <SelectItem value="TARGET">TARGET</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   {selectedStock.date_recommended && (
//                     <div className="space-y-2">
//                       <Label>Last Recommendation Date</Label>
//                       <div className="p-2 border rounded-md bg-muted">
//                         {new Date(selectedStock.date_recommended).toLocaleDateString()}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </TabsContent>

//               <TabsContent value="indicators" className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="growth_rating">Growth Rating</Label>
//                     <Select
//                       value={selectedStock.indicators?.growth_rating || ""}
//                       onValueChange={(value) => handleSelectChange("indicators.growth_rating", value)}
//                     >
//                       <SelectTrigger id="growth_rating">
//                         <SelectValue placeholder="Select rating" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="High">High</SelectItem>
//                         <SelectItem value="Medium">Medium</SelectItem>
//                         <SelectItem value="Low">Low</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="momentum_score">Momentum Score</Label>
//                     <Select
//                       value={selectedStock.indicators?.momentum_score || ""}
//                       onValueChange={(value) => handleSelectChange("indicators.momentum_score", value)}
//                     >
//                       <SelectTrigger id="momentum_score">
//                         <SelectValue placeholder="Select score" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="High">High</SelectItem>
//                         <SelectItem value="Medium">Medium</SelectItem>
//                         <SelectItem value="Low">Low</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="risk_score">Risk Score</Label>
//                     <Select
//                       value={selectedStock.indicators?.risk_score || ""}
//                       onValueChange={(value) => handleSelectChange("indicators.risk_score", value)}
//                     >
//                       <SelectTrigger id="risk_score">
//                         <SelectValue placeholder="Select score" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="High">High</SelectItem>
//                         <SelectItem value="Medium">Medium</SelectItem>
//                         <SelectItem value="Low">Low</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="value_rating">Value Rating</Label>
//                     <Select
//                       value={selectedStock.indicators?.value_rating || ""}
//                       onValueChange={(value) => handleSelectChange("indicators.value_rating", value)}
//                     >
//                       <SelectTrigger id="value_rating">
//                         <SelectValue placeholder="Select rating" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="High">High</SelectItem>
//                         <SelectItem value="Medium">Medium</SelectItem>
//                         <SelectItem value="Low">Low</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="volume">Volume</Label>
//                     <Input
//                       id="volume"
//                       name="indicators.volume"
//                       value={selectedStock.indicators?.volume || ""}
//                       onChange={(e) => handleSelectChange("indicators.volume", e.target.value)}
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="market_cap">Market Cap</Label>
//                     <Input
//                       id="market_cap"
//                       name="indicators.market_cap"
//                       value={selectedStock.indicators?.market_cap || ""}
//                       onChange={(e) => handleSelectChange("indicators.market_cap", e.target.value)}
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="pe_ratio">P/E Ratio</Label>
//                     <Input
//                       id="pe_ratio"
//                       name="indicators.pe_ratio"
//                       value={selectedStock.indicators?.pe_ratio || ""}
//                       onChange={(e) => handleSelectChange("indicators.pe_ratio", e.target.value)}
//                     />
//                   </div>

//                   {selectedStock.indicators?.last_updated && (
//                     <div className="space-y-2">
//                       <Label>Last Updated</Label>
//                       <div className="p-2 border rounded-md bg-muted">
//                         {new Date(selectedStock.indicators.last_updated).toLocaleDateString()}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </TabsContent>

//               <TabsContent value="performance" className="space-y-4">
//                 <div className="grid grid-cols-1 gap-4">
//                   <div className="border rounded-md p-4">
//                     <h3 className="text-lg font-medium mb-4 flex items-center">
//                       <TrendingUp className="mr-2 h-5 w-5" />
//                       Stock Returns
//                     </h3>

//                     {selectedStock.returns ? (
//                       <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                         <div className="border rounded-md p-3">
//                           <div className="text-sm text-muted-foreground">1 Day</div>
//                           <div className={`text-lg font-semibold ${getReturnColorClass(selectedStock.returns.oneDay)}`}>
//                             {formatPercentage(selectedStock.returns.oneDay)}
//                           </div>
//                         </div>

//                         <div className="border rounded-md p-3">
//                           <div className="text-sm text-muted-foreground">1 Week</div>
//                           <div
//                             className={`text-lg font-semibold ${getReturnColorClass(selectedStock.returns.oneWeek)}`}
//                           >
//                             {formatPercentage(selectedStock.returns.oneWeek)}
//                           </div>
//                         </div>

//                         <div className="border rounded-md p-3">
//                           <div className="text-sm text-muted-foreground">1 Month</div>
//                           <div
//                             className={`text-lg font-semibold ${getReturnColorClass(selectedStock.returns.oneMonth)}`}
//                           >
//                             {formatPercentage(selectedStock.returns.oneMonth)}
//                           </div>
//                         </div>

//                         <div className="border rounded-md p-3">
//                           <div className="text-sm text-muted-foreground">3 Months</div>
//                           <div
//                             className={`text-lg font-semibold ${getReturnColorClass(selectedStock.returns.threeMonths)}`}
//                           >
//                             {formatPercentage(selectedStock.returns.threeMonths)}
//                           </div>
//                         </div>

//                         <div className="border rounded-md p-3">
//                           <div className="text-sm text-muted-foreground">6 Months</div>
//                           <div
//                             className={`text-lg font-semibold ${getReturnColorClass(selectedStock.returns.sixMonths)}`}
//                           >
//                             {formatPercentage(selectedStock.returns.sixMonths)}
//                           </div>
//                         </div>

//                         <div className="border rounded-md p-3">
//                           <div className="text-sm text-muted-foreground">1 Year</div>
//                           <div
//                             className={`text-lg font-semibold ${getReturnColorClass(selectedStock.returns.oneYear)}`}
//                           >
//                             {formatPercentage(selectedStock.returns.oneYear)}
//                           </div>
//                         </div>

//                         <div className="border rounded-md p-3">
//                           <div className="text-sm text-muted-foreground">YTD</div>
//                           <div className={`text-lg font-semibold ${getReturnColorClass(selectedStock.returns.ytd)}`}>
//                             {formatPercentage(selectedStock.returns.ytd)}
//                           </div>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="text-center py-4 text-muted-foreground">No return data available</div>
//                     )}
//                   </div>

//                   <div className="bg-muted/50 rounded-md p-4 flex items-start">
//                     <Info className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
//                     <div className="text-sm text-muted-foreground">
//                       Performance data is read-only and calculated based on historical price data. This information is
//                       updated automatically and cannot be manually edited.
//                     </div>
//                   </div>
//                 </div>
//               </TabsContent>
//             </Tabs>
//           ) : (
//             <div className="text-center py-8 text-muted-foreground">Failed to load stock details</div>
//           )}

//           {message && (
//             <div className={`text-sm ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>{message}</div>
//           )}

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsEditing(false)} disabled={updating}>
//               Cancel
//             </Button>
//             <Button onClick={handleSaveStock} disabled={updating || !selectedStock}>
//               {updating ? (
//                 <>
//                   Saving
//                   <RefreshCcw className="ml-2 h-4 w-4 animate-spin" />
//                 </>
//               ) : (
//                 "Save Changes"
//               )}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }








"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Search, ArrowUpDown, Edit, RefreshCcw, ChevronLeft, TrendingUp, Info, Eye } from "lucide-react"
import Link from "next/link"

type Stock = {
  _id: string
  name: string
  company: string
  exchange: string
  industry: string
  category: string
  current_price: number
  status: string
  country: string
  currency: string
}

type StockIndicator = {
  _id: string
  stock_id: string
  growth_rating: string
  momentum_score: string
  risk_score: string
  value_rating: string
  volume?: string
  market_cap?: string
  pe_ratio?: string
  last_updated: Date
}

type StockReturns = {
  oneWeekReturn?: number
  oneMonthReturn?: number
  threeMonthReturn?: number
  oneYearReturn?: number
}

type StockWithDetails = Stock & {
  indicators?: StockIndicator
  returns?: StockReturns
  date_recommended?: Date
}

export default function ManageStocks() {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedStock, setSelectedStock] = useState<StockWithDetails | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [loadingStockDetails, setLoadingStockDetails] = useState(false)
  const [isViewing, setIsViewing] = useState(false)

  useEffect(() => {
    fetchStocks()
  }, [])

  const fetchStocks = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/stocks")
      const data = await response.json()

      if (response.ok) {
        setStocks(data || [])
      } else {
        console.error("Failed to fetch stocks:", data.message)
      }
    } catch (error) {
      console.error("Error fetching stocks:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStockDetails = async (stockId: string) => {
    setLoadingStockDetails(true)
    try {
      const response = await fetch(`/api/stocks/stock-indicator?stock_id=${stockId}`)
      const data = await response.json()

      if (response.ok && data.success) {
        return data.data
      } else {
        console.error("Failed to fetch stock details:", data.error)
        return null
      }
    } catch (error) {
      console.error("Error fetching stock details:", error)
      return null
    } finally {
      setLoadingStockDetails(false)
    }
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedStocks = [...stocks].sort((a, b) => {
    let aValue: any = a[sortField as keyof Stock]
    let bValue: any = b[sortField as keyof Stock]

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const filteredStocks = sortedStocks.filter(
    (stock) =>
      stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.industry.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEditStock = async (stock: Stock) => {
    setMessage(null)
    
    // Fetch detailed stock information including indicators and returns
    const stockDetails = await fetchStockDetails(stock._id)

    if (stockDetails) {
      setSelectedStock(stockDetails)
      setIsEditing(true)
    } else {
      setMessage("Failed to load stock details ❌")
    }
  }

  const handleViewStock = async (stock: Stock) => {
    setMessage(null)

    // Fetch detailed stock information including indicators and returns
    const stockDetails = await fetchStockDetails(stock._id)

    if (stockDetails) {
      setSelectedStock(stockDetails)
      setIsViewing(true)
    } else {
      setMessage("Failed to load stock details ❌")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedStock) return

    const { name, value } = e.target
    setSelectedStock({
      ...selectedStock,
      [name]: name === "current_price" ? Number.parseFloat(value) : value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    if (!selectedStock) return

    if (name.includes("indicators.")) {
      const indicatorField = name.split(".")[1]
      setSelectedStock({
        ...selectedStock,
        indicators: {
          ...selectedStock.indicators,
          [indicatorField]: value,
        },
      })
    } else {
      setSelectedStock({
        ...selectedStock,
        [name]: value,
      })
    }
  }

  const handleSaveStock = async () => {
    if (!selectedStock) return

    setUpdating(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/stocks/${selectedStock._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stock: {
            name: selectedStock.name,
            company: selectedStock.company,
            exchange: selectedStock.exchange,
            industry: selectedStock.industry,
            category: selectedStock.category,
            current_price: selectedStock.current_price,
            status: selectedStock.status,
            country: selectedStock.country,
            currency: selectedStock.currency,
          },
          indicators: selectedStock.indicators,
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setMessage("Stock updated successfully ✅")
        setIsEditing(false)
        fetchStocks() // Refresh the stocks list
      } else {
        setMessage(`Failed to update stock: ${result.message} ❌`)
      }
    } catch (error) {
      console.error("Error updating stock:", error)
      setMessage("An error occurred while updating the stock ❌")
    } finally {
      setUpdating(false)
    }
  }

  const formatPercentage = (value: number | undefined) => {
    if (value === undefined) return "N/A"
    return `${value >= 0 ? "+" : ""}${value}%`
  }

  const getReturnColorClass = (value: number | undefined) => {
    if (value === undefined) return ""
    return value >= 0 ? "text-green-600" : "text-red-600"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/admin">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Manage Stocks</h1>
        </div>
        <Button onClick={fetchStocks} disabled={loading}>
          {loading ? <RefreshCcw className="h-4 w-4 animate-spin" /> : "Refresh"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Stocks</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stocks..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <RefreshCcw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Edit</TableHead>
                    <TableHead onClick={() => handleSort("name")} className="cursor-pointer">
                      Name {sortField === "name" && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                    </TableHead>
                    <TableHead onClick={() => handleSort("company")} className="cursor-pointer">
                      Company {sortField === "company" && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                    </TableHead>
                    <TableHead onClick={() => handleSort("industry")} className="cursor-pointer">
                      Industry {sortField === "industry" && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                    </TableHead>
                    <TableHead onClick={() => handleSort("current_price")} className="cursor-pointer">
                      Price {sortField === "current_price" && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                    </TableHead>
                    <TableHead onClick={() => handleSort("status")} className="cursor-pointer">
                      Status {sortField === "status" && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStocks.length > 0 ? (
                    filteredStocks.map((stock) => (
                      <TableRow key={stock._id}>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="icon" onClick={() => handleViewStock(stock)} title="View">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditStock(stock)} title="Edit">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{stock.name}</TableCell>
                        <TableCell>{stock.company}</TableCell>
                        <TableCell>{stock.industry}</TableCell>
                        <TableCell>
                          {stock.currency} {stock.current_price.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              stock.status === "BUY"
                                ? "bg-green-100 text-green-800"
                                : stock.status === "SELL"
                                  ? "bg-red-100 text-red-800"
                                  : stock.status === "HOLD"
                                    ? "bg-blue-100 text-blue-800"
                                    : stock.status === "MONITOR"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {stock.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No stocks found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditing} onOpenChange={(open) => !updating && setIsEditing(open)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Stock: {selectedStock?.name}</DialogTitle>
          </DialogHeader>

          {loadingStockDetails ? (
            <div className="flex justify-center py-8">
              <RefreshCcw className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2">Loading stock details...</span>
            </div>
          ) : selectedStock ? (
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="indicators">Indicators</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Stock Name</Label>
                    <Input id="name" name="name" value={selectedStock.name} onChange={handleInputChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" name="company" value={selectedStock.company} onChange={handleInputChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="exchange">Exchange</Label>
                    <Input id="exchange" name="exchange" value={selectedStock.exchange} onChange={handleInputChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input id="industry" name="industry" value={selectedStock.industry} onChange={handleInputChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" name="category" value={selectedStock.category} onChange={handleInputChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="current_price">Current Price</Label>
                    <Input
                      id="current_price"
                      name="current_price"
                      type="number"
                      step="0.01"
                      value={selectedStock.current_price}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" name="country" value={selectedStock.country} onChange={handleInputChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input id="currency" name="currency" value={selectedStock.currency} onChange={handleInputChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={selectedStock.status} onValueChange={(value) => handleSelectChange("status", value)}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BUY">BUY</SelectItem>
                        <SelectItem value="HOLD">HOLD</SelectItem>
                        <SelectItem value="SELL">SELL</SelectItem>
                        <SelectItem value="MONITOR">MONITOR</SelectItem>
                        <SelectItem value="TARGET">TARGET</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedStock.date_recommended && (
                    <div className="space-y-2">
                      <Label>Last Recommendation Date</Label>
                      <div className="p-2 border rounded-md bg-muted">
                        {new Date(selectedStock.date_recommended).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="indicators" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="growth_rating">Growth Rating</Label>
                    <Select
                      value={selectedStock.indicators?.growth_rating || ""}
                      onValueChange={(value) => handleSelectChange("indicators.growth_rating", value)}
                    >
                      <SelectTrigger id="growth_rating">
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="momentum_score">Momentum Score</Label>
                    <Select
                      value={selectedStock.indicators?.momentum_score || ""}
                      onValueChange={(value) => handleSelectChange("indicators.momentum_score", value)}
                    >
                      <SelectTrigger id="momentum_score">
                        <SelectValue placeholder="Select score" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="risk_score">Risk Score</Label>
                    <Select
                      value={selectedStock.indicators?.risk_score || ""}
                      onValueChange={(value) => handleSelectChange("indicators.risk_score", value)}
                    >
                      <SelectTrigger id="risk_score">
                        <SelectValue placeholder="Select score" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="value_rating">Value Rating</Label>
                    <Select
                      value={selectedStock.indicators?.value_rating || ""}
                      onValueChange={(value) => handleSelectChange("indicators.value_rating", value)}
                    >
                      <SelectTrigger id="value_rating">
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="volume">Volume</Label>
                    <Input
                      id="volume"
                      name="indicators.volume"
                      value={selectedStock.indicators?.volume || ""}
                      onChange={(e) => handleSelectChange("indicators.volume", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="market_cap">Market Cap</Label>
                    <Input
                      id="market_cap"
                      name="indicators.market_cap"
                      value={selectedStock.indicators?.market_cap || ""}
                      onChange={(e) => handleSelectChange("indicators.market_cap", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pe_ratio">P/E Ratio</Label>
                    <Input
                      id="pe_ratio"
                      name="indicators.pe_ratio"
                      value={selectedStock.indicators?.pe_ratio || ""}
                      onChange={(e) => handleSelectChange("indicators.pe_ratio", e.target.value)}
                    />
                  </div>

                  {selectedStock.indicators?.last_updated && (
                    <div className="space-y-2">
                      <Label>Last Updated</Label>
                      <div className="p-2 border rounded-md bg-muted">
                        {new Date(selectedStock.indicators.last_updated).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="border rounded-md p-4">
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5" />
                      Stock Returns
                    </h3>

                    {selectedStock.returns ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                       

                        <div className="border rounded-md p-3">
                          <div className="text-sm text-muted-foreground">1 Week</div>
                          <div
                            className={`text-lg font-semibold ${getReturnColorClass(selectedStock.returns.oneWeekReturn)}`}
                          >
                            {formatPercentage(selectedStock.returns.oneWeekReturn)}
                          </div>
                        </div>

                        <div className="border rounded-md p-3">
                          <div className="text-sm text-muted-foreground">1 Month</div>
                          <div
                            className={`text-lg font-semibold ${getReturnColorClass(selectedStock.returns.oneMonthReturn)}`}
                          >
                            {formatPercentage(selectedStock.returns.oneMonthReturn)}
                          </div>
                        </div>

                        <div className="border rounded-md p-3">
                          <div className="text-sm text-muted-foreground">3 Months</div>
                          <div
                            className={`text-lg font-semibold ${getReturnColorClass(selectedStock.returns.threeMonthReturn)}`}
                          >
                            {formatPercentage(selectedStock.returns.threeMonthReturn)}
                          </div>
                        </div>

                        

                        <div className="border rounded-md p-3">
                          <div className="text-sm text-muted-foreground">1 Year</div>
                          <div
                            className={`text-lg font-semibold ${getReturnColorClass(selectedStock.returns.oneYearReturn)}`}
                          >
                            {formatPercentage(selectedStock.returns.oneYearReturn)}
                          </div>
                        </div>

                       
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">No return data available</div>
                    )}
                  </div>

                  <div className="bg-muted/50 rounded-md p-4 flex items-start">
                    <Info className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                    <div className="text-sm text-muted-foreground">
                      Performance data is read-only and calculated based on historical price data. This information is
                      updated automatically and cannot be manually edited.
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-8 text-muted-foreground">Failed to load stock details</div>
          )}

          {message && (
            <div className={`text-sm ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>{message}</div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)} disabled={updating}>
              Cancel
            </Button>
            <Button onClick={handleSaveStock} disabled={updating || !selectedStock}>
              {updating ? (
                <>
                  Saving
                  <RefreshCcw className="ml-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewing} onOpenChange={(open) => setIsViewing(open)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Stock Details: {selectedStock?.name}</DialogTitle>
          </DialogHeader>

          {loadingStockDetails ? (
            <div className="flex justify-center py-8">
              <RefreshCcw className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2">Loading stock details...</span>
            </div>
          ) : selectedStock ? (
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="indicators">Indicators</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Stock Name</Label>
                    <div className="p-2 border rounded-md bg-muted">{selectedStock.name}</div>
                  </div>

                  <div className="space-y-2">
                    <Label>Company</Label>
                    <div className="p-2 border rounded-md bg-muted">{selectedStock.company}</div>
                  </div>

                  <div className="space-y-2">
                    <Label>Exchange</Label>
                    <div className="p-2 border rounded-md bg-muted">{selectedStock.exchange}</div>
                  </div>

                  <div className="space-y-2">
                    <Label>Industry</Label>
                    <div className="p-2 border rounded-md bg-muted">{selectedStock.industry}</div>
                  </div>

                  <div className="space-y-2">
                    <Label>Category</Label>
                    <div className="p-2 border rounded-md bg-muted">{selectedStock.category}</div>
                  </div>

                  <div className="space-y-2">
                    <Label>Current Price</Label>
                    <div className="p-2 border rounded-md bg-muted">
                      {selectedStock.currency} {selectedStock.current_price.toFixed(2)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Country</Label>
                    <div className="p-2 border rounded-md bg-muted">{selectedStock.country}</div>
                  </div>

                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <div className="p-2 border rounded-md bg-muted">{selectedStock.currency}</div>
                  </div>

                  <div className="space-y-2">
                    <Label>Status</Label>
                    <div className="p-2 border rounded-md bg-muted">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedStock.status === "BUY"
                            ? "bg-green-100 text-green-800"
                            : selectedStock.status === "SELL"
                              ? "bg-red-100 text-red-800"
                              : selectedStock.status === "HOLD"
                                ? "bg-blue-100 text-blue-800"
                                : selectedStock.status === "MONITOR"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {selectedStock.status}
                      </span>
                    </div>
                  </div>

                  {selectedStock.date_recommended && (
                    <div className="space-y-2">
                      <Label>Last Recommendation Date</Label>
                      <div className="p-2 border rounded-md bg-muted">
                        {new Date(selectedStock.date_recommended).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="indicators" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Growth Rating</Label>
                    <div className="p-2 border rounded-md bg-muted">
                      {selectedStock.indicators?.growth_rating || "N/A"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Momentum Score</Label>
                    <div className="p-2 border rounded-md bg-muted">
                      {selectedStock.indicators?.momentum_score || "N/A"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Risk Score</Label>
                    <div className="p-2 border rounded-md bg-muted">
                      {selectedStock.indicators?.risk_score || "N/A"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Value Rating</Label>
                    <div className="p-2 border rounded-md bg-muted">
                      {selectedStock.indicators?.value_rating || "N/A"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Volume</Label>
                    <div className="p-2 border rounded-md bg-muted">{selectedStock.indicators?.volume || "N/A"}</div>
                  </div>

                  <div className="space-y-2">
                    <Label>Market Cap</Label>
                    <div className="p-2 border rounded-md bg-muted">
                      {selectedStock.indicators?.market_cap || "N/A"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>P/E Ratio</Label>
                    <div className="p-2 border rounded-md bg-muted">{selectedStock.indicators?.pe_ratio || "N/A"}</div>
                  </div>

                  {selectedStock.indicators?.last_updated && (
                    <div className="space-y-2">
                      <Label>Last Updated</Label>
                      <div className="p-2 border rounded-md bg-muted">
                        {new Date(selectedStock.indicators.last_updated).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="border rounded-md p-4">
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5" />
                      Stock Returns
                    </h3>

                    {selectedStock.returns ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                       

                        <div className="border rounded-md p-3">
                          <div className="text-sm text-muted-foreground">1 Week</div>
                          <div
                            className={`text-lg font-semibold ${getReturnColorClass(selectedStock.returns.oneWeekReturn)}`}
                          >
                            {formatPercentage(selectedStock.returns.oneWeekReturn)}
                          </div>
                        </div>

                        <div className="border rounded-md p-3">
                          <div className="text-sm text-muted-foreground">1 Month</div>
                          <div
                            className={`text-lg font-semibold ${getReturnColorClass(selectedStock.returns.oneMonthReturn)}`}
                          >
                            {formatPercentage(selectedStock.returns.oneMonthReturn)}
                          </div>
                        </div>

                        <div className="border rounded-md p-3">
                          <div className="text-sm text-muted-foreground">3 Months</div>
                          <div
                            className={`text-lg font-semibold ${getReturnColorClass(selectedStock.returns.threeMonthReturn)}`}
                          >
                            {formatPercentage(selectedStock.returns.threeMonthReturn)}
                          </div>
                        </div>

                       

                        <div className="border rounded-md p-3">
                          <div className="text-sm text-muted-foreground">1 Year</div>
                          <div
                            className={`text-lg font-semibold ${getReturnColorClass(selectedStock.returns.oneYearReturn)}`}
                          >
                            {formatPercentage(selectedStock.returns.oneYearReturn)}
                          </div>
                        </div>

                        
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">No return data available</div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-8 text-muted-foreground">Failed to load stock details</div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsViewing(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

