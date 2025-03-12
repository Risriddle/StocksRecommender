

import {
  ArrowDown,
  ArrowUp,
  Eye,
  BarChart3,
  Layers,
  AlertTriangle,
  Bookmark,
  Globe,
  Building,
  Tag,
  TrendingUp,
  TrendingDown,
  Activity,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import type { Stock } from "@/types/stock"

interface StockDetailsProps {
  stock: Stock | null
}

export default function StockDetails({ stock }: StockDetailsProps) {
  if (!stock) return null

  console.log(stock, "stock in stockdetailssssssssssssssssssssssssssssssssssss")
  const renderValue = (value: any, isPercentage = false, isPriceChange = false) => {
    if (value === undefined || value === null) return "N/A"

    if (isPercentage) {
      const num = typeof value === "string" ? Number.parseFloat(value) : value
      const isPositive = num >= 0
      return (
        <span className={`flex items-center ${isPositive ? "text-green-500" : "text-red-500"}`}>
          {isPositive ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
          {isPositive ? "+" : ""}
          {Math.abs(num).toFixed(2)}%
        </span>
      )
    }

    if (isPriceChange) {
      const num = typeof value === "string" ? Number.parseFloat(value) : value
      const isPositive = num >= 0
      return (
        <div className="flex flex-col">
          <span className={isPositive ? "text-green-500" : "text-red-500"}>
            {isPositive ? "+" : ""}
            {value}%
          </span>
          <span className="text-muted-foreground text-sm">
            ({isPositive ? "+" : ""}${Math.abs(num).toFixed(2)})
          </span>
        </div>
      )
    }

    return value
  }

  // Determine current price difference from recommended price
  const priceDifference =
    stock.current_price && stock.recommended_price
      ? ((stock.current_price - stock.recommended_price) / stock.recommended_price) * 100
      : null

  // Calculate days since recommendation
  const daysSinceRecommendation = stock.date_recommended
    ? Math.floor((new Date().getTime() - new Date(stock.date_recommended).getTime()) / (1000 * 3600 * 24))
    : null

  // Calculate rating scores for visual representation
  const getRatingScore = (rating: string | undefined) => {
    if (!rating) return 0
    const normalized = rating.toLowerCase()
    return normalized === "high" ? 80 : normalized === "medium" ? 50 : 20
  }

  const growthScore = getRatingScore(stock.indicators?.growth_rating)
  const momentumScore = getRatingScore(stock.indicators?.momentum_score)
  const valueScore = getRatingScore(stock.indicators?.value_rating)
  const riskScore = getRatingScore(stock.indicators?.risk_score)

  // Helper function to generate sample historical price data
  const generateHistoricalData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    return months.map((month, i) => {
      const basePrice = stock.current_price || 100
      const volatilityFactor = 0.05
      const trend = 0.1

      return {
        month,
        price: basePrice * (1 + (trend * i) / 5 + (Math.random() * 2 - 1) * volatilityFactor),
      }
    })
  }

  const historicalPriceData = generateHistoricalData()

  // Helper function to prepare recommendation history data
  const prepareRecommendationHistory = () => {
    const recommendations = []

    // Add past recommendations if available
    if (stock.last_4_weeks_recommendations && stock.last_4_weeks_recommendations.length > 0) {
      recommendations.push(
        ...stock.last_4_weeks_recommendations.map((rec) => ({
          date: new Date(rec.date_recommended),
          recommendation: rec.recommendation,
          reason: rec.reason,
        })),
      )
    }

    // Add latest recommendation if available and different from the last one
    if (stock.latestrecommendation) {
      const latestRec = {
        date: new Date(stock.latestrecommendation.date_recommended),
        recommendation: stock.latestrecommendation.recommendation,
        reason: stock.latestrecommendation.reason,
      }

      // Only add if it's different from the last one or if there are no previous recommendations
      if (
        recommendations.length === 0 ||
        recommendations[recommendations.length - 1].recommendation !== latestRec.recommendation
      ) {
        recommendations.push(latestRec)
      }
    }

    // Sort by date
    recommendations.sort((a, b) => a.date.getTime() - b.date.getTime())

    return recommendations
  }

  const recommendationHistory = prepareRecommendationHistory()

  return (
    <Card className="overflow-hidden border-t-4 border-purple-500">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <CardTitle className="text-xl font-bold">{stock.company}</CardTitle>
              <Badge variant="outline" className="ml-2">
                {stock.name}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center text-muted-foreground text-xs">
              {stock.exchange && (
                <span className="mr-3 flex items-center">
                  <Building className="h-3 w-3 mr-1" />
                  {stock.exchange}
                </span>
              )}
              {stock.category && (
                <span className="mr-3 flex items-center">
                  <Tag className="h-3 w-3 mr-1" />
                  {stock.category}
                </span>
              )}
              {stock.industry && (
                <span className="mr-3 flex items-center">
                  <Layers className="h-3 w-3 mr-1" />
                  {stock.industry}
                </span>
              )}
              {stock.country && (
                <span className="flex items-center">
                  <Globe className="h-3 w-3 mr-1" />
                  {stock.country}
                </span>
              )}
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold mb-1 text-green-500">${stock.current_price?.toFixed(2)}</div>
            <div
              className={`flex items-center justify-end ${
                (stock.returns?.returnSinceAdded || 0) >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {(stock.returns?.returnSinceAdded || 0) >= 0 ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              {Math.abs(stock.returns?.returnSinceAdded || 0)}%
              {daysSinceRecommendation && (
                <span className="text-muted-foreground text-xs ml-1">({daysSinceRecommendation} days)</span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0 pt-0 pb-0">
        <Tabs defaultValue="overview" className="w-full">
          <div className="px-4 pt-2 border-b">
            <TabsList className="grid grid-cols-4 mb-0">
              <TabsTrigger value="overview" className="text-xs">
                Overview
              </TabsTrigger>
              <TabsTrigger value="performance" className="text-xs">
                Performance
              </TabsTrigger>
              <TabsTrigger value="analysis" className="text-xs">
                Analysis
              </TabsTrigger>
              <TabsTrigger value="recommendation" className="text-xs">
                Recs
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="px-4 py-3 space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 rounded-lg border">
              {/* Volume */}
              <div className="flex flex-col items-center">
                <div className="text-xs uppercase font-semibold text-muted-foreground flex items-center">
                  <Activity className="h-3 w-3 mr-1" />
                  Volume
                </div>
                <div className="font-medium mt-1">{stock.indicators?.volume || "N/A"}</div>
              </div>

              {/* Market Cap */}
              <div className="flex flex-col items-center">
                <div className="text-xs uppercase font-semibold text-muted-foreground flex items-center">
                  Market Cap
                </div>
                <div className="font-medium mt-1">{stock.indicators?.market_cap || "N/A"}</div>
              </div>

              {/* P/E Ratio */}
              <div className="flex flex-col items-center">
                <div className="text-xs uppercase font-semibold text-muted-foreground flex items-center">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  P/E Ratio
                </div>
                <div className="font-medium mt-1">{stock.indicators?.pe_ratio || "N/A"}</div>
              </div>

              {/* Currency */}
              <div className="flex flex-col items-center">
                <div className="text-xs uppercase font-semibold text-muted-foreground flex items-center">
                  <Globe className="h-3 w-3 mr-1" />
                  Currency
                </div>
                <div className="font-medium mt-1">{stock.currency || "USD"}</div>
              </div>
            </div>

            {/* Recommendation Summary Card */}
            <div className="rounded-lg border p-3 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold flex items-center">
                  <Eye className="h-4 w-4 mr-2 text-blue-500" />
                  Recommendation Summary
                </h3>

                <Badge
                  variant={stock.status === "BUY" ? "default" : stock.status === "SELL" ? "destructive" : "secondary"}
                >
                  {stock.status || "N/A"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs uppercase font-semibold text-muted-foreground">Risk Rating</div>
                  <div
                    className={`inline-flex items-center mt-1 ${
                      stock.indicators?.risk_score?.toLowerCase() === "low"
                        ? "text-green-600"
                        : stock.indicators?.risk_score?.toLowerCase() === "medium"
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}
                  >
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {(stock.indicators?.risk_score || "N/A").toUpperCase()}
                  </div>
                </div>

                <div>
                  <div className="text-xs uppercase font-semibold text-muted-foreground">Recommended Price</div>
                  <div className="font-medium flex items-center">
                    ${stock.recommended_price?.toFixed(2) || "N/A"}
                    {priceDifference && (
                      <span className={`text-xs ml-2 ${priceDifference >= 0 ? "text-green-500" : "text-red-500"}`}>
                        ({priceDifference >= 0 ? "+" : ""}
                        {priceDifference.toFixed(2)}%)
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-xs uppercase font-semibold text-muted-foreground">Added to System</div>
                  <div className="font-medium">
                    {stock.added_date ? new Date(stock.added_date).toLocaleDateString() : "N/A"}
                  </div>
                </div>

                <div>
                  <div className="text-xs uppercase font-semibold text-muted-foreground">Status</div>
                  <div
                    className={`font-medium flex items-center ${
                      stock.status === "BUY"
                        ? "text-green-600"
                        : stock.status === "SELL"
                          ? "text-red-600"
                          : "text-yellow-600"
                    }`}
                  >
                    {stock.status === "BUY" ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : stock.status === "SELL" ? (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    ) : (
                      <Activity className="h-4 w-4 mr-1" />
                    )}
                    {stock.status || "N/A"}
                  </div>
                </div>
              </div>
            </div>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalPriceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, "Price"]} />
                  <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          {/* Performance Tab */}


          <TabsContent value="performance" className="px-4 py-3">
  <div className="space-y-3">
    <h3 className="text-sm font-semibold flex items-center">
      <BarChart3 className="h-4 w-4 mr-2 text-blue-500" />
      Key Returns
    </h3>
    <div className="space-y-3">
      {[
        { label: "Return Since Added", value: stock.returns?.returnSinceAdded },
        { label: "1 Week Return", value: stock.returns?.oneWeekReturn },
        { label: "1 Month Return", value: stock.returns?.oneMonthReturn },
        { label: "3 Month Return", value: stock.returns?.threeMonthReturn },
        { label: "YTD Return", value: stock.returns?.ytdReturn },
        { label: "1 Year Return", value: stock.returns?.oneYearReturn },
      ].map((item, idx) => (
        <div key={idx} className="relative p-2 rounded-lg border">
          <div className="flex justify-between mb-1">
            <span className="text-xs font-medium">{item.label}</span>
            <span className="text-xs font-semibold">{renderValue(item.value, true)}</span>
          </div>
          <Progress
            value={item.value ? Math.min(Math.max(item.value + 50, 0), 100) : 50}
            className={`h-2 ${(item.value || 0) >= 0 ? "bg-green-500" : "bg-red-500"}`}
          />
        </div>
      ))}
    </div>
    
    {/* Bar Chart Component */}
    <div className="p-3 rounded-lg border shadow-sm">
      <h3 className="text-sm font-semibold mb-3">Performance Comparison</h3>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={[
              { name: 'Since Added', value: stock.returns?.returnSinceAdded || 0 },
              { name: '1 Week', value: stock.returns?.oneWeekReturn || 0 },
              { name: '1 Month', value: stock.returns?.oneMonthReturn || 0 },
              { name: '3 Month', value: stock.returns?.threeMonthReturn || 0 },
              { name: 'YTD', value: stock.returns?.ytdReturn || 0 },
              { name: '1 Year', value: stock.returns?.oneYearReturn || 0 }
            ]} 
            margin={{ top: 5, right: 5, left: 5, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={60} 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={(value) => `${value}%`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const value = payload[0].value as number;
                  return (
                    <div className="bg-white p-2 border rounded shadow-sm text-xs">
                      <p className="font-medium">{`${payload[0].name}: ${value >= 0 ? '+' : ''}${value}%`}</p>
                    </div>
                  );
                }
                return null;
              }} 
            />
            <Bar 
              dataKey="value" 
              fill="#22c55e"
              className="fill-current text-green-500"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div className="p-3 rounded-lg border shadow-sm">
      <div className="mb-3">
        <h4 className="text-xs font-semibold mb-1">Total Return</h4>
        <div className="flex items-center justify-between">
          <div
            className={`text-xl font-bold ${
              (stock.returns?.returnSinceAdded || 0) >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {(stock.returns?.returnSinceAdded || 0) >= 0 ? "+" : ""}
            {stock.returns?.returnSinceAdded || 0}%
          </div>
          <Badge variant={(stock.returns?.returnSinceAdded || 0) >= 0 ? "default" : "destructive"}>
            {(stock.returns?.returnSinceAdded || 0) >= 0 ? "Profitable" : "Loss"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <div className="uppercase font-semibold text-muted-foreground">Best Period</div>
          <div className="font-medium text-green-600">
            {Object.entries(stock.returns || {})
              .filter(([key]) => key !== "returnSinceAdded")
              .reduce(
                (best, [key, value]) => (!best[1] || (value && value > best[1]) ? [key, value] : best),
                ["", null],
              )[0]
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())
              .replace("Return", "")}
          </div>
        </div>
        <div>
          <div className="uppercase font-semibold text-muted-foreground">Worst Period</div>
          <div className="font-medium text-red-600">
            {Object.entries(stock.returns || {})
              .filter(([key]) => key !== "returnSinceAdded")
              .reduce(
                (worst, [key, value]) => (!worst[1] || (value && value < worst[1]) ? [key, value] : worst),
                ["", null],
              )[0]
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())
              .replace("Return", "")}
          </div>
        </div>
      </div>
    </div>
  </div>
</TabsContent>
          {/* <TabsContent value="performance" className="px-4 py-3">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center">
                <BarChart3 className="h-4 w-4 mr-2 text-blue-500" />
                Key Returns
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Return Since Added", value: stock.returns?.returnSinceAdded },
                  { label: "1 Week Return", value: stock.returns?.oneWeekReturn },
                  { label: "1 Month Return", value: stock.returns?.oneMonthReturn },
                  { label: "3 Month Return", value: stock.returns?.threeMonthReturn },
                  { label: "YTD Return", value: stock.returns?.ytdReturn },
                  { label: "1 Year Return", value: stock.returns?.oneYearReturn },
                ].map((item, idx) => (
                  <div key={idx} className="relative p-2 rounded-lg border">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium">{item.label}</span>
                      <span className="text-xs font-semibold">{renderValue(item.value, true)}</span>
                    </div>
                    <Progress
                      value={item.value ? Math.min(Math.max(item.value + 50, 0), 100) : 50}
                      className={`h-2 ${(item.value || 0) >= 0 ? "bg-green-500" : "bg-red-500"}`}
                    />
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-lg border shadow-sm">
                <div className="mb-3">
                  <h4 className="text-xs font-semibold mb-1">Total Return</h4>
                  <div className="flex items-center justify-between">
                    <div
                      className={`text-xl font-bold ${
                        (stock.returns?.returnSinceAdded || 0) >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {(stock.returns?.returnSinceAdded || 0) >= 0 ? "+" : ""}
                      {stock.returns?.returnSinceAdded || 0}%
                    </div>
                    <Badge variant={(stock.returns?.returnSinceAdded || 0) >= 0 ? "default" : "destructive"}>
                      {(stock.returns?.returnSinceAdded || 0) >= 0 ? "Profitable" : "Loss"}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="uppercase font-semibold text-muted-foreground">Best Period</div>
                    <div className="font-medium text-green-600">
                      {Object.entries(stock.returns || {})
                        .filter(([key]) => key !== "returnSinceAdded")
                        .reduce(
                          (best, [key, value]) => (!best[1] || (value && value > best[1]) ? [key, value] : best),
                          ["", null],
                        )[0]
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())
                        .replace("Return", "")}
                    </div>
                  </div>
                  <div>
                    <div className="uppercase font-semibold text-muted-foreground">Worst Period</div>
                    <div className="font-medium text-red-600">
                      {Object.entries(stock.returns || {})
                        .filter(([key]) => key !== "returnSinceAdded")
                        .reduce(
                          (worst, [key, value]) => (!worst[1] || (value && value < worst[1]) ? [key, value] : worst),
                          ["", null],
                        )[0]
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())
                        .replace("Return", "")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent> */}

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="px-4 py-3">
            <h3 className="text-sm font-semibold mb-3 flex items-center">
              <Layers className="h-4 w-4 mr-2 text-blue-500" />
              Stock Analysis
            </h3>

            <div className="space-y-4">
              {/* Rating Summary Card */}
              <div className="p-3 rounded-lg border shadow-sm">
                <h4 className="text-xs font-semibold mb-2">Rating Summary</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${growthScore > 60 ? "bg-green-500" : growthScore > 30 ? "bg-yellow-500" : "bg-red-500"} mr-2`}></div>
                    <span className="text-xs">Growth: <span className="font-semibold">{stock.indicators?.growth_rating || "N/A"}</span></span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${momentumScore > 60 ? "bg-green-500" : momentumScore > 30 ? "bg-yellow-500" : "bg-red-500"} mr-2`}></div>
                    <span className="text-xs">Momentum: <span className="font-semibold">{stock.indicators?.momentum_score || "N/A"}</span></span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${valueScore > 60 ? "bg-green-500" : valueScore > 30 ? "bg-yellow-500" : "bg-red-500"} mr-2`}></div>
                    <span className="text-xs">Value: <span className="font-semibold">{stock.indicators?.value_rating || "N/A"}</span></span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${riskScore < 30 ? "bg-green-500" : riskScore < 60 ? "bg-yellow-500" : "bg-red-500"} mr-2`}></div>
                    <span className="text-xs">Risk: <span className="font-semibold">{stock.indicators?.risk_score || "N/A"}</span></span>
                  </div>
                </div>
              </div>
</div>
              {/* Radar Chart */}
              <div className="h-64 border rounded-lg p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={[
                      {
                        name: "Growth",
                        value: growthScore,
                        fill: growthScore > 60 ? "#10b981" : growthScore > 30 ? "#f59e0b" : "#ef4444",
                        description: stock.indicators?.growth_rating || "N/A"
                      },
                      {
                        name: "Momentum",
                        value: momentumScore,
                        fill: momentumScore > 60 ? "#10b981" : momentumScore > 30 ? "#f59e0b" : "#ef4444",
                        description: stock.indicators?.momentum_score || "N/A"
                      },
                      {
                        name: "Value",
                        value: valueScore,
                        fill: valueScore > 60 ? "#10b981" : valueScore > 30 ? "#f59e0b" : "#ef4444",
                        description: stock.indicators?.value_rating || "N/A"
                      },
                      {
                        name: "Risk",
                        value: 100 - riskScore, // Invert risk score for visualization (lower risk is better)
                        fill: riskScore < 30 ? "#10b981" : riskScore < 60 ? "#f59e0b" : "#ef4444",
                        description: stock.indicators?.risk_score || "N/A"
                      },
                    ]}
                    margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      tick={(props) => {
                        const { x, y, payload } = props;
                        const index = payload.index;
                        const data = [
                          {
                            name: "Growth",
                            icon: <TrendingUp className="h-4 w-4 mr-1" />,
                            description: stock.indicators?.growth_rating || "N/A"
                          },
                          {
                            name: "Momentum",
                            icon: <Activity className="h-4 w-4 mr-1" />,
                            description: stock.indicators?.momentum_score || "N/A"
                          },
                          {
                            name: "Value",
                            icon: <Tag className="h-4 w-4 mr-1" />,
                            description: stock.indicators?.value_rating || "N/A"
                          },
                          {
                            name: "Risk",
                            icon: <AlertTriangle className="h-4 w-4 mr-1" />,
                            description: stock.indicators?.risk_score || "N/A"
                          },
                        ];
                        
                        return (
                          <g transform={`translate(${x},${y})`}>
                            <foreignObject width="70" height="30" x="-75" y="-15">
                              <svg xmlns="http://www.w3.org/1999/xhtml" className="flex items-center">
                                {data[index].icon}
                                <div className="flex flex-col">
                                  <span className="text-xs font-medium">{data[index].name}</span>
                                  <span className="text-xs text-muted-foreground">{data[index].description}</span>
                                </div>
                              </svg>
                            </foreignObject>
                          </g>
                        );
                      }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background border rounded-md shadow-md p-2 text-xs">
                              <p className="font-semibold">{data.name}: {data.description}</p>
                              <p className="text-muted-foreground">Score: {data.name === "Risk" ? 100 - data.value : data.value}/100</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Detailed Indicators */}
              <div className="grid grid-cols-1 gap-3">
                {/* Growth & Momentum */}
                <div className="space-y-3 p-3 rounded-lg border shadow-sm">
                  <h4 className="text-xs font-semibold flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1 text-blue-500" />
                    Growth & Momentum
                  </h4>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium flex items-center">
                        Growth Rating
                        <span className="ml-1 text-muted-foreground">({stock.indicators?.growth_rating || "N/A"})</span>
                      </span>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div 
                            key={i}
                            className={`w-2 h-6 mx-0.5 rounded-sm ${
                              growthScore >= (i + 1) * 20 
                                ? growthScore > 60 
                                  ? "bg-green-500" 
                                  : growthScore > 30 
                                    ? "bg-yellow-500" 
                                    : "bg-red-500"
                                : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {growthScore > 60 
                        ? "Strong growth potential based on earnings and revenue trends" 
                        : growthScore > 30 
                          ? "Moderate growth indicators" 
                          : "Limited growth prospects"}
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium flex items-center">
                        Momentum Score
                        <span className="ml-1 text-muted-foreground">({stock.indicators?.momentum_score || "N/A"})</span>
                      </span>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div 
                            key={i}
                            className={`w-2 h-6 mx-0.5 rounded-sm ${
                              momentumScore >= (i + 1) * 20 
                                ? momentumScore > 60 
                                  ? "bg-green-500" 
                                  : momentumScore > 30 
                                    ? "bg-yellow-500" 
                                    : "bg-red-500"
                                : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {momentumScore > 60 
                        ? "Strong price momentum and positive technical indicators" 
                        : momentumScore > 30 
                          ? "Neutral momentum with mixed signals" 
                          : "Weak momentum with bearish technical indicators"}
                    </div>
                  </div>
                </div>

                {/* Value & Risk */}
                <div className="space-y-3 p-3 rounded-lg border shadow-sm">
                  <h4 className="text-xs font-semibold flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1 text-blue-500" />
                    Value & Risk
                  </h4>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium flex items-center">
                        Value Rating
                        <span className="ml-1 text-muted-foreground">({stock.indicators?.value_rating || "N/A"})</span>
                      </span>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div 
                            key={i}
                            className={`w-2 h-6 mx-0.5 rounded-sm ${
                              valueScore >= (i + 1) * 20 
                                ? valueScore > 60 
                                  ? "bg-green-500" 
                                  : valueScore > 30 
                                    ? "bg-yellow-500" 
                                    : "bg-red-500"
                                : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {valueScore > 60 
                        ? "Attractively valued relative to peers and historical averages" 
                        : valueScore > 30 
                          ? "Fairly valued with some potential" 
                          : "Overvalued compared to peers and historical metrics"}
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium flex items-center">
                        Risk Score
                        <span className="ml-1 text-muted-foreground">({stock.indicators?.risk_score || "N/A"})</span>
                      </span>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div 
                            key={i}
                            className={`w-2 h-6 mx-0.5 rounded-sm ${
                              riskScore >= (i + 1) * 20 
                                ? riskScore > 60 
                                  ? "bg-red-500" 
                                  : riskScore > 30 
                                    ? "bg-yellow-500" 
                                    : "bg-green-500"
                                : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {riskScore < 30 
                        ? "Low volatility and downside risk" 
                        : riskScore < 60 
                          ? "Moderate risk profile with some volatility" 
                          : "High risk with significant volatility and uncertainty"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Overall Analysis */}
              <div className="p-3 rounded-lg border shadow-sm">
                <h4 className="text-xs font-semibold mb-2 flex items-center">
                  <Eye className="h-3 w-3 mr-1 text-blue-500" />
                  Overall Analysis
                </h4>
                <p className="text-xs text-muted-foreground">
                  {(() => {
                    const avgScore = (growthScore + momentumScore + valueScore + (100 - riskScore)) / 4;
                    if (avgScore > 70) {
                      return "Strong overall profile with positive growth, momentum, and value metrics combined with manageable risk. Consider for long-term investment.";
                    } else if (avgScore > 50) {
                      return "Balanced profile with mixed indicators. Some positive aspects are offset by areas of concern. Consider for diversified portfolios.";
                    } else if (avgScore > 30) {
                      return "Cautious outlook with several concerning indicators. Monitor closely if holding or consider reducing exposure.";
                    } else {
                      return "Weak overall profile with significant concerns across multiple metrics. High risk relative to potential reward.";
                    }
                  })()}
                </p>
                
                <div className="mt-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium">Overall Score</span>
                    <span className="text-xs font-medium">
                      {Math.round((growthScore + momentumScore + valueScore + (100 - riskScore)) / 4)}/100
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        (growthScore + momentumScore + valueScore + (100 - riskScore)) / 4 > 70
                          ? "bg-green-500"
                          : (growthScore + momentumScore + valueScore + (100 - riskScore)) / 4 > 50
                            ? "bg-blue-500"
                            : (growthScore + momentumScore + valueScore + (100 - riskScore)) / 4 > 30
                              ? "bg-yellow-500"
                              : "bg-red-500"
                      }`}
                      style={{ width: `${(growthScore + momentumScore + valueScore + (100 - riskScore)) / 4}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Recommendation Tab */}
            <TabsContent value="recommendation" className="px-4 py-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold flex items-center">
                    <Bookmark className="h-4 w-4 mr-2 text-blue-500" />
                    Recommendation Details
                  </h3>

                  <Badge
                    variant={stock.status === "BUY" ? "default" : stock.status === "SELL" ? "destructive" : "secondary"}
                  >
                    {stock.status || "N/A"}
                  </Badge>
                </div>

                <div className="rounded-lg border p-3 shadow-sm">
                  <div className="mb-3">
                    <div className="text-xs uppercase font-semibold text-muted-foreground">Recommended Date</div>
                    <div className="font-medium">
                      {stock.date_recommended ? new Date(stock.date_recommended).toLocaleDateString() : "N/A"}
                      {daysSinceRecommendation && (
                        <span className="text-muted-foreground text-xs ml-2">({daysSinceRecommendation} days ago)</span>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-xs uppercase font-semibold text-muted-foreground">Recommended Price</div>
                    <div className="font-medium flex items-center">
                      ${stock.recommended_price?.toFixed(2) || "N/A"}
                      {priceDifference && (
                        <span className={`text-xs ml-2 ${priceDifference >= 0 ? "text-green-500" : "text-red-500"}`}>
                          Current: ${stock.current_price?.toFixed(2)} ({priceDifference >= 0 ? "+" : ""}
                          {priceDifference.toFixed(2)}%)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="uppercase font-semibold text-muted-foreground">Risk Rating</div>
                      <div
                        className={`font-medium ${
                          stock.indicators?.risk_score?.toLowerCase() === "low"
                            ? "text-green-600"
                            : stock.indicators?.risk_score?.toLowerCase() === "medium"
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {stock.indicators?.risk_score || "N/A"}
                      </div>
                    </div>
                    <div>
                      <div className="uppercase font-semibold text-muted-foreground">Return Since Added</div>
                      <div
                        className={`font-medium ${(stock.returns?.returnSinceAdded || 0) >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {stock.returns?.returnSinceAdded || 0}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Recommendation History Timeline */}
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-3">Recommendation History</h4>

                {recommendationHistory.length > 0 ? (
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                    {/* Timeline items */}
                    <div className="space-y-4">
                      {recommendationHistory.map((rec, index) => (
                        <div key={index} className="relative pl-10">
                          {/* Timeline dot */}
                          <div
                            className={`absolute left-0 top-1 h-6 w-6 rounded-full flex items-center justify-center
                            ${
                              rec.recommendation === "BUY"
                                ? "bg-green-100 text-green-600"
                                : rec.recommendation === "SELL"
                                  ? "bg-red-100 text-red-600"
                                  : "bg-yellow-100 text-yellow-600"
                            }`}
                          >
                            {rec.recommendation === "BUY" ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : rec.recommendation === "SELL" ? (
                              <TrendingDown className="h-3 w-3" />
                            ) : (
                              <Activity className="h-3 w-3" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="rounded-lg border p-3 shadow-sm">
                            <div className="flex justify-between items-start mb-1">
                              <Badge
                                variant={
                                  rec.recommendation === "BUY"
                                    ? "default"
                                    : rec.recommendation === "SELL"
                                      ? "destructive"
                                      : "secondary"
                                }
                              >
                                {rec.recommendation}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{rec.date.toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs">{rec.reason}</p>

                            {/* Direction arrow if not the first item */}
                            {index > 0 && recommendationHistory[index - 1].recommendation !== rec.recommendation && (
                              <div className="absolute left-3 top-3 -translate-x-1/2">
                                {recommendationHistory[index - 1].recommendation === "BUY" &&
                                  rec.recommendation === "HOLD" && (
                                    <ArrowDown className="h-3 w-3 text-yellow-500 rotate-45" />
                                  )}
                                {recommendationHistory[index - 1].recommendation === "BUY" &&
                                  rec.recommendation === "SELL" && <ArrowDown className="h-3 w-3 text-red-500" />}
                                {recommendationHistory[index - 1].recommendation === "HOLD" &&
                                  rec.recommendation === "BUY" && (
                                    <ArrowUp className="h-3 w-3 text-green-500 rotate-45" />
                                  )}
                                {recommendationHistory[index - 1].recommendation === "HOLD" &&
                                  rec.recommendation === "SELL" && (
                                    <ArrowDown className="h-3 w-3 text-red-500 rotate-45" />
                                  )}
                                {recommendationHistory[index - 1].recommendation === "SELL" &&
                                  rec.recommendation === "BUY" && <ArrowUp className="h-3 w-3 text-green-500" />}
                                {recommendationHistory[index - 1].recommendation === "SELL" &&
                                  rec.recommendation === "HOLD" && (
                                    <ArrowUp className="h-3 w-3 text-yellow-500 rotate-45" />
                                  )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4 border rounded-lg text-muted-foreground">
                    No recommendation history available
                  </div>
                )}
              </div>

              {/* Recommendation Movement Chart */}
              {recommendationHistory.length > 1 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-3">Recommendation Movement</h4>
                  <div className="h-48 border rounded-lg p-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={recommendationHistory.map((rec, index) => ({
                          date: rec.date.toLocaleDateString(),
                          value: rec.recommendation === "BUY" ? 3 : rec.recommendation === "HOLD" ? 2 : 1,
                          recommendation: rec.recommendation,
                        }))}
                        margin={{ top: 5, right: 20, bottom: 20, left: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis
                          domain={[0, 4]}
                          ticks={[1, 2, 3]}
                          tickFormatter={(value) => (value === 1 ? "SELL" : value === 2 ? "HOLD" : "BUY")}
                        />
                        <Tooltip
                          formatter={(value, name) => [
                            value === 1 ? "SELL" : value === 2 ? "HOLD" : "BUY",
                            "Recommendation",
                          ]}
                        />
                        <Line
                          type="stepAfter"
                          dataKey="value"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                          dot={(props) => {
                            const { cx, cy, payload } = props
                            const color =
                              payload.recommendation === "BUY"
                                ? "#10b981"
                                : payload.recommendation === "HOLD"
                                  ? "#f59e0b"
                                  : "#ef4444"

                            return <circle cx={cx} cy={cy} r={6} fill={color} stroke="none" />
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
    )
  
  }




