
"use client"

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

// Types
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
  returnSinceAdded?: number
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
  // State
  const [stocks, setStocks] = useState<Stock[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedStock, setSelectedStock] = useState<StockWithDetails | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isViewing, setIsViewing] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [loadingStockDetails, setLoadingStockDetails] = useState(false)

  // Fetch stocks on component mount
  useEffect(() => {
    fetchStocks()
  }, [])

  // API calls
  const fetchStocks = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/stocks")
      const data = await response.json()
      if (response.ok) setStocks(data || [])
      else console.error("Failed to fetch stocks:", data.message)
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
      return response.ok && data.success ? data.data : null
    } catch (error) {
      console.error("Error fetching stock details:", error)
      return null
    } finally {
      setLoadingStockDetails(false)
    }
  }

  // Handlers
  const handleSort = (field: string) => {
    setSortDirection(sortField === field && sortDirection === "asc" ? "desc" : "asc")
    setSortField(field)
  }

  const handleStockAction = async (stock: Stock, action: "edit" | "view") => {
    setMessage(null)
    const stockDetails = await fetchStockDetails(stock._id)
    
    if (stockDetails) {
      setSelectedStock(stockDetails)
      action === "edit" ? setIsEditing(true) : setIsViewing(true)
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
      setSelectedStock({ ...selectedStock, [name]: value })
    }
  }

  const handleSaveStock = async () => {
    if (!selectedStock) return
    setUpdating(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/stocks/${selectedStock._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
        fetchStocks()
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

  // Utility functions
  const formatPercentage = (value?: number) => 
    value === undefined ? "N/A" : `${value >= 0 ? "+" : ""}${value}%`

  const getReturnColorClass = (value?: number) =>
    value === undefined ? "" : value >= 0 ? "text-green-600" : "text-red-600"

  const getStatusClass = (status: string) => {
    const statusClasses = {
      BUY: "bg-green-100 text-green-800",
      SELL: "bg-red-100 text-red-800",
      HOLD: "bg-blue-100 text-blue-800",
      MONITOR: "bg-yellow-100 text-yellow-800",
      TARGET: "bg-purple-100 text-purple-800"
    }
    return statusClasses[status as keyof typeof statusClasses] || "bg-gray-100 text-gray-800"
  }

  // Derived state
  const filteredStocks = [...stocks]
    .sort((a, b) => {
      let aValue: any = a[sortField as keyof Stock]
      let bValue: any = b[sortField as keyof Stock]
      
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }
      
      return (aValue < bValue ? -1 : aValue > bValue ? 1 : 0) * (sortDirection === "asc" ? 1 : -1)
    })
    .filter(stock => 
      stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.industry.toLowerCase().includes(searchTerm.toLowerCase())
    )

  // UI Components
  const FormField = ({ label, name, value, type = "text", readOnly = false, options = [] }: 
    { label: string, name: string, value: any, type?: string, readOnly?: boolean, options?: string[] }) => {
    if (readOnly) {
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          <div className="p-2 border rounded-md bg-muted">
            {type === "status" ? (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(value || "")}`}>
                {value}
              </span>
            ) : value}
          </div>
        </div>
      )
    }

    if (options.length > 0) {
      return (
        <div className="space-y-2">
          <Label htmlFor={name}>{label}</Label>
          <Select value={value || ""} onValueChange={(value) => handleSelectChange(name, value)}>
            <SelectTrigger id={name}>
              <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )
    }

    return (
      <div className="space-y-2">
        <Label htmlFor={name}>{label}</Label>
        <Input
          id={name}
          name={name}
          value={value || ""}
          type={type}
          step={type === "number" ? "0.01" : undefined}
          onChange={handleInputChange}
        />
      </div>
    )
  }

  const ReturnCard = ({ label, value }: { label: string, value?: number }) => (
    <div className="border rounded-md p-3">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className={`text-lg font-semibold ${getReturnColorClass(value)}`}>
        {formatPercentage(value)}
      </div>
    </div>
  )

  const StockTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">Edit</TableHead>
          {["name", "company", "industry", "current_price", "status"].map(field => (
            <TableHead key={field} onClick={() => handleSort(field)} className="cursor-pointer">
              {field.charAt(0).toUpperCase() + field.slice(1).replace("_", " ")}
              {sortField === field && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredStocks.length > 0 ? (
          filteredStocks.map(stock => (
            <TableRow key={stock._id}>
              <TableCell>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => handleStockAction(stock, "view")} title="View">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleStockAction(stock, "edit")} title="Edit">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
              <TableCell className="font-medium">{stock.name}</TableCell>
              <TableCell>{stock.company}</TableCell>
              <TableCell>{stock.industry}</TableCell>
              <TableCell>{stock.currency} {stock.current_price.toFixed(2)}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(stock.status)}`}>
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
  )

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Stock List */}
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
              <StockTable />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
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
                  <FormField label="Stock Name" name="name" value={selectedStock.name} />
                  <FormField label="Company" name="company" value={selectedStock.company} />
                  <FormField label="Exchange" name="exchange" value={selectedStock.exchange} />
                  <FormField label="Industry" name="industry" value={selectedStock.industry} />
                  <FormField label="Category" name="category" value={selectedStock.category} />
                  <FormField label="Current Price" name="current_price" value={selectedStock.current_price} type="number" />
                  <FormField label="Country" name="country" value={selectedStock.country} />
                  <FormField label="Currency" name="currency" value={selectedStock.currency} />
                  <FormField 
                    label="Status" 
                    name="status" 
                    value={selectedStock.status}
                    options={["BUY", "HOLD", "SELL", "MONITOR", "TARGET"]} 
                  />
                  {selectedStock.date_recommended && (
                    <FormField 
                      label="Last Recommendation Date" 
                      name="date_recommended" 
                      value={new Date(selectedStock.date_recommended).toLocaleDateString()}
                      readOnly={true}
                    />
                  )}
                </div>
              </TabsContent>

              <TabsContent value="indicators" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField 
                    label="Growth Rating" 
                    name="indicators.growth_rating" 
                    value={selectedStock.indicators?.growth_rating} 
                    options={["High", "Medium", "Low"]}
                  />
                  <FormField 
                    label="Momentum Score" 
                    name="indicators.momentum_score" 
                    value={selectedStock.indicators?.momentum_score}
                    options={["High", "Medium", "Low"]}
                  />
                  <FormField 
                    label="Risk Score" 
                    name="indicators.risk_score" 
                    value={selectedStock.indicators?.risk_score}
                    options={["High", "Medium", "Low"]}
                  />
                  <FormField 
                    label="Value Rating" 
                    name="indicators.value_rating" 
                    value={selectedStock.indicators?.value_rating}
                    options={["High", "Medium", "Low"]}
                  />
                  <FormField label="Volume" name="indicators.volume" value={selectedStock.indicators?.volume} />
                  <FormField label="Market Cap" name="indicators.market_cap" value={selectedStock.indicators?.market_cap} />
                  <FormField label="P/E Ratio" name="indicators.pe_ratio" value={selectedStock.indicators?.pe_ratio} />
                  {selectedStock.indicators?.last_updated && (
                    <FormField 
                      label="Last Updated" 
                      name="indicators.last_updated" 
                      value={new Date(selectedStock.indicators.last_updated).toLocaleDateString()}
                      readOnly={true}
                    />
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
                        <ReturnCard label="Return Since Added" value={selectedStock.returns.returnSinceAdded} />
                        <ReturnCard label="1 Week" value={selectedStock.returns.oneWeekReturn} />
                        <ReturnCard label="1 Month" value={selectedStock.returns.oneMonthReturn} />
                        <ReturnCard label="3 Months" value={selectedStock.returns.threeMonthReturn} />
                        <ReturnCard label="1 Year" value={selectedStock.returns.oneYearReturn} />
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">No return data available</div>
                    )}
                  </div>
                  <div className="bg-muted/50 rounded-md p-4 flex items-start">
                    <Info className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                    <div className="text-sm text-muted-foreground">
                      Performance data is read-only and calculated based on historical price data.
                      This information is updated automatically and cannot be manually edited.
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

      {/* View Dialog */}
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
                  <FormField label="Stock Name" name="name" value={selectedStock.name} readOnly={true} />
                  <FormField label="Company" name="company" value={selectedStock.company} readOnly={true} />
                  <FormField label="Exchange" name="exchange" value={selectedStock.exchange} readOnly={true} />
                  <FormField label="Industry" name="industry" value={selectedStock.industry} readOnly={true} />
                  <FormField label="Category" name="category" value={selectedStock.category} readOnly={true} />
                  <FormField 
                    label="Current Price" 
                    name="current_price" 
                    value={`${selectedStock.currency} ${selectedStock.current_price.toFixed(2)}`} 
                    readOnly={true} 
                  />
                  <FormField label="Country" name="country" value={selectedStock.country} readOnly={true} />
                  <FormField label="Currency" name="currency" value={selectedStock.currency} readOnly={true} />
                  <FormField label="Status" name="status" value={selectedStock.status} readOnly={true} type="status" />
                  {selectedStock.date_recommended && (
                    <FormField 
                      label="Last Recommendation Date" 
                      name="date_recommended" 
                      value={new Date(selectedStock.date_recommended).toLocaleDateString()}
                      readOnly={true}
                    />
                  )}
                </div>
              </TabsContent>

              <TabsContent value="indicators" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField 
                    label="Growth Rating" 
                    name="growth_rating" 
                    value={selectedStock.indicators?.growth_rating || "N/A"} 
                    readOnly={true}
                  />
                  <FormField 
                    label="Momentum Score" 
                    name="momentum_score" 
                    value={selectedStock.indicators?.momentum_score || "N/A"}
                    readOnly={true}
                  />
                  <FormField 
                    label="Risk Score" 
                    name="risk_score" 
                    value={selectedStock.indicators?.risk_score || "N/A"}
                    readOnly={true}
                  />
                  <FormField 
                    label="Value Rating" 
                    name="value_rating" 
                    value={selectedStock.indicators?.value_rating || "N/A"}
                    readOnly={true}
                  />
                  <FormField 
                    label="Volume" 
                    name="volume" 
                    value={selectedStock.indicators?.volume || "N/A"} 
                    readOnly={true}
                  />
                  <FormField 
                    label="Market Cap" 
                    name="market_cap" 
                    value={selectedStock.indicators?.market_cap || "N/A"} 
                    readOnly={true}
                  />
                  <FormField 
                    label="P/E Ratio" 
                    name="pe_ratio" 
                    value={selectedStock.indicators?.pe_ratio || "N/A"} 
                    readOnly={true}
                  />
                  {selectedStock.indicators?.last_updated && (
                    <FormField 
                      label="Last Updated" 
                      name="last_updated" 
                      value={new Date(selectedStock.indicators.last_updated).toLocaleDateString()}
                      readOnly={true}
                    />
                  )}
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Stock Returns
                  </h3>
                  {selectedStock.returns ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <ReturnCard label="Return Since Added" value={selectedStock.returns.returnSinceAdded} />
                      <ReturnCard label="1 Week" value={selectedStock.returns.oneWeekReturn} />
                      <ReturnCard label="1 Month" value={selectedStock.returns.oneMonthReturn} />
                      <ReturnCard label="3 Months" value={selectedStock.returns.threeMonthReturn} />
                      <ReturnCard label="1 Year" value={selectedStock.returns.oneYearReturn} />
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">No return data available</div>
                  )}
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

















