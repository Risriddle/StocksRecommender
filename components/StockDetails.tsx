
import React from "react";
import { 
  ArrowDown, 
  ArrowUp, 
  Eye, 
  BarChart3, 
  Layers, 
  AlertTriangle, 
  Bookmark, 
  Globe, 
  DollarSign, 
  Building, 
  Tag,
  TrendingUp,
  TrendingDown,
  Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import type { Stock } from "@/types/stock";

interface StockDetailsProps {
  stock: Stock | null;
}

export default function StockDetails({ stock }: StockDetailsProps) {
  if (!stock) return null;

  const renderValue = (value: any, isPercentage = false, isPriceChange = false) => {
    if (value === undefined || value === null) return "N/A";

    if (isPercentage) {
      const num = typeof value === "string" ? Number.parseFloat(value) : value;
      const isPositive = num >= 0;
      return (
        <span className={`flex items-center ${isPositive ? "text-green-500" : "text-red-500"}`}>
          {isPositive ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
          {isPositive ? "+" : ""}
          {Math.abs(num).toFixed(2)}%
        </span>
      );
    }

    if (isPriceChange) {
      const num = typeof value === "string" ? Number.parseFloat(value) : value;
      const isPositive = num >= 0;
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
      );
    }

    return value;
  };

  // Determine current price difference from recommended price
  const priceDifference = stock.current_price && stock.recommended_price
    ? ((stock.current_price - stock.recommended_price) / stock.recommended_price) * 100
    : null;

  // Calculate days since recommendation
  const daysSinceRecommendation = stock.date_recommended
    ? Math.floor((new Date().getTime() - new Date(stock.date_recommended).getTime()) / (1000 * 3600 * 24))
    : null;

  // Calculate rating scores for visual representation
  const getRatingScore = (rating) => {
    if (!rating) return 0;
    const normalized = rating.toLowerCase();
    return normalized === "high" ? 80 : normalized === "medium" ? 50 : 20;
  };

  const growthScore = getRatingScore(stock.indicators?.growth_rating);
  const momentumScore = getRatingScore(stock.indicators?.momentum_score);
  const valueScore = getRatingScore(stock.indicators?.value_rating);
  const riskScore = getRatingScore(stock.indicators?.risk_score);

  return (
    <Card className="shadow-md border-white-200">
      <CardHeader className="pb-2 pt-6 px-6 bg-gradient-to-r bg-black text-white">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <CardTitle className="text-2xl font-bold">{stock.company}</CardTitle>
              <Badge variant="outline" className="ml-2 text-white border-white/30">{stock.name}</Badge>
            </div>
            
            <div className="flex flex-wrap items-center text-white/70 text-sm">
              <span className="mr-3 flex items-center">
                <Building className="h-3 w-3 mr-1" />
                {stock.exchange || "—"}
              </span>
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
            <div className="text-3xl font-bold mb-1 text-green-500">${stock.current_price?.toFixed(2)}</div>
            <div className={`flex items-center justify-end ${
              (stock.returns?.returnSinceAdded || 0) >= 0 ? "text-green-400" : "text-red-400"
            }`}>
              {(stock.returns?.returnSinceAdded || 0) >= 0 ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              {Math.abs(stock.returns?.returnSinceAdded || 0)}%
              {daysSinceRecommendation && (
                <span className="text-white/70 text-xs ml-1">
                  ({daysSinceRecommendation} days)
                </span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0 pt-0 pb-0">
        <Tabs defaultValue="overview" className="w-full">
          <div className="px-4 pt-2 border-b sticky top-0 bg-black z-10">
            <TabsList className="grid grid-cols-4 mb-0">
              <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
              <TabsTrigger value="performance" className="text-sm">Performance</TabsTrigger>
              <TabsTrigger value="analysis" className="text-sm">Analysis</TabsTrigger>
              <TabsTrigger value="recommendation" className="text-sm">Recs</TabsTrigger>
            </TabsList>
          </div>

        
           <TabsContent value="overview" className="px-6 py-4 space-y-4">
            
           
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-black rounded-lg border border-white-100">
  {/* Volume */}
  <div className="flex flex-col items-center">
    <div className="text-xs uppercase font-semibold text-white flex items-center">
      <Activity className="h-3 w-3 mr-1" />
      Volume
    </div>
    <div className="font-medium mt-1">{stock.indicators?.volume || "N/A"}</div>
  </div>

  {/* Market Cap */}
  <div className="flex flex-col items-center">
    <div className="text-xs uppercase font-semibold text-white flex items-center">
      Market Cap
    </div>
    <div className="font-medium mt-1">{stock.indicators?.market_cap || "N/A"}</div>
  </div>

  {/* P/E Ratio */}
  <div className="flex flex-col items-center">
    <div className="text-xs uppercase font-semibold text-white flex items-center">
      <BarChart3 className="h-3 w-3 mr-1" />
      P/E Ratio
    </div>
    <div className="font-medium mt-1">{stock.indicators?.pe_ratio || "N/A"}</div>
  </div>

  {/* Currency */}
  <div className="flex flex-col items-center">
    <div className="text-xs uppercase font-semibold text-white flex items-center">
      <Globe className="h-3 w-3 mr-1" />
      Currency
    </div>
    <div className="font-medium mt-1">{stock.currency || "USD"}</div>
  </div>
</div>





            {/* Recommendation Summary Card */}
            <div className="rounded-lg border p-4 bg-black shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center">
                  <Eye className="h-4 w-4 mr-2 text-blue-500" />
                  Recommendation Summary
                </h3>
                
                <Badge 
                  className={
                    stock.status === "BUY" ? "bg-green-100 text-green-800 hover:bg-green-200" :
                    stock.status === "SELL" ? "bg-red-100 text-red-800 hover:bg-red-200" :
                    "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                  }
                >
                  {stock.status || "N/A"}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs uppercase font-semibold text-white">Risk Rating</div>
                  <div className={`inline-flex items-center mt-1 ${
                    stock.indicators?.risk_score === "low" ? "text-green-600" :
                    stock.indicators?.risk_score === "medium" ? "text-yellow-600" : "text-red-600"
                  }`}>
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {(stock.indicators?.risk_score || "N/A").toUpperCase()}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs uppercase font-semibold text-white">Recommended Price</div>
                  <div className="font-medium flex items-center">
                    ${stock.recommended_price?.toFixed(2) || "N/A"}
                    {priceDifference && (
                      <span className={`text-xs ml-2 ${priceDifference >= 0 ? "text-green-500" : "text-red-500"}`}>
                        ({priceDifference >= 0 ? "+" : ""}{priceDifference.toFixed(2)}%)
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs uppercase font-semibold text-white">Added to System</div>
                  <div className="font-medium">
                    {stock.added_date ? new Date(stock.added_date).toLocaleDateString() : "N/A"}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs uppercase font-semibold text-white">Status</div>
                  <div className={`font-medium flex items-center ${
                    stock.status === "BUY" ? "text-green-600" :
                    stock.status === "SELL" ? "text-red-600" : "text-yellow-600"
                  }`}>
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
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center text-white">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
                  Key Returns
                </h3>
                <div className="space-y-5">
                  {[
                    { label: "Return Since Added", value: stock.returns?.returnSinceAdded },
                    { label: "1 Week Return", value: stock.returns?.oneWeekReturn },
                    { label: "1 Month Return", value: stock.returns?.oneMonthReturn },
                    { label: "3 Month Return", value: stock.returns?.threeMonthReturn },
                    { label: "YTD Return", value: stock.returns?.ytdReturn },
                    { label: "1 Year Return", value: stock.returns?.oneYearReturn }
                  ].map((item, idx) => (
                    <div key={idx} className="relative bg-black p-3 rounded-lg border border-white-100">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-white">{item.label}</span>
                        <span className="font-semibold">
                          {renderValue(item.value, true)}
                        </span>
                      </div>
                      <Progress 
                        value={item.value ? Math.min(Math.max(item.value + 50, 0), 100) : 50} 
                        className={`h-2 ${
                          (item.value || 0) >= 0 ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center text-white">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                  Performance Summary
                </h3>
                <div className="bg-black p-5 rounded-lg border shadow-sm">
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold mb-2 text-white">Total Return</h4>
                    <div className="flex items-center justify-between">
                      <div className={`text-3xl font-bold ${
                        (stock.returns?.returnSinceAdded || 0) >= 0 ? "text-green-500" : "text-red-500"
                      }`}>
                        {(stock.returns?.returnSinceAdded || 0) >= 0 ? "+" : ""}
                        {(stock.returns?.returnSinceAdded || 0)}%
                      </div>
                      <Badge 
                        className={
                          (stock.returns?.returnSinceAdded || 0) >= 0 
                            ? "bg-green-100 text-green-800 hover:bg-green-200" 
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }
                      >
                        {(stock.returns?.returnSinceAdded || 0) >= 0 ? "Profitable" : "Loss"}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs uppercase font-semibold text-white">Best Period</div>
                      <div className="font-medium text-green-600">
                        {Object.entries(stock.returns || {})
                          .filter(([key]) => key !== "returnSinceAdded")
                          .reduce((best, [key, value]) => 
                            !best[1] || (value && value > best[1]) ? [key, value] : best, 
                            ["", null])[0].replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).replace("Return", "")}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase font-semibold text-white">Worst Period</div>
                      <div className="font-medium text-red-600">
                        {Object.entries(stock.returns || {})
                          .filter(([key]) => key !== "returnSinceAdded")
                          .reduce((worst, [key, value]) => 
                            !worst[1] || (value && value < worst[1]) ? [key, value] : worst, 
                            ["", null])[0].replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).replace("Return", "")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="px-6 py-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
              <Layers className="h-5 w-5 mr-2 text-blue-500" />
              Stock Analysis
            </h3>
            
            <div className="space-y-6">
              {/* Ratings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 bg-black p-4 rounded-lg border shadow-sm">
                  <h4 className="text-sm font-semibold text-white">Growth & Momentum</h4>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Growth Rating</span>
                      <span className="text-sm text-muted-foreground">
                        {stock.indicators?.growth_rating || "N/A"}
                      </span>
                    </div>
                    <Progress 
                      value={growthScore} 
                      className={`h-2 ${
                        growthScore > 60 ? "bg-green-500" :
                        growthScore > 30 ? "bg-yellow-500" : "bg-red-500"
                      }`}
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Momentum Score</span>
                      <span className="text-sm text-muted-foreground">
                        {stock.indicators?.momentum_score || "N/A"}
                      </span>
                    </div>
                    <Progress 
                      value={momentumScore} 
                      className={`h-2 ${
                        momentumScore > 60 ? "bg-green-500" :
                        momentumScore > 30 ? "bg-yellow-500" : "bg-red-500"
                      }`}
                    />
                  </div>
                </div>
                
                <div className="space-y-4 bg-black p-4 rounded-lg border shadow-sm">
                  <h4 className="text-sm font-semibold text-white">Value & Risk</h4>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Value Rating</span>
                      <span className="text-sm text-muted-foreground">
                        {stock.indicators?.value_rating || "N/A"}
                      </span>
                    </div>
                    <Progress 
                      value={valueScore} 
                      className={`h-2 ${
                        valueScore > 60 ? "bg-green-500" :
                        valueScore > 30 ? "bg-yellow-500" : "bg-red-500"
                      }`}
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Risk Score</span>
                      <span className="text-sm text-muted-foreground">
                        {stock.indicators?.risk_score || "N/A"}
                      </span>
                    </div>
                    <Progress 
                      value={riskScore} 
                      className={`h-2 ${
                        stock.indicators?.risk_score === "low" ? "bg-green-500" :
                        stock.indicators?.risk_score === "medium" ? "bg-yellow-500" : "bg-red-500"
                      }`} 
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
             
            </div>
          </TabsContent>

          {/* Recommendation Tab */}
          <TabsContent value="recommendation" className="px-6 py-4">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center text-white">
                  <Bookmark className="h-5 w-5 mr-2 text-blue-500" />
                  Recommendation Details
                </h3>
                
                <Badge 
                  className={
                    stock.status === "BUY" ? "bg-green-100 text-green-800 hover:bg-green-200" :
                    stock.status === "SELL" ? "bg-red-100 text-red-800 hover:bg-red-200" :
                    "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                  }
                >
                  {stock.status || "N/A"}
                </Badge>
              </div>
              
              <div className="rounded-lg border p-5 bg-black shadow-sm">
                <div className="mb-4">
                  <div className="text-xs uppercase font-semibold text-white">Recommended Date</div>
                  <div className="font-medium">
                    {stock.date_recommended ? new Date(stock.date_recommended).toLocaleDateString() : "N/A"}
                    {daysSinceRecommendation && (
                      <span className="text-muted-foreground text-sm ml-2">
                        ({daysSinceRecommendation} days ago)
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-xs uppercase font-semibold text-white">Recommended Price</div>
                  <div className="font-medium flex items-center">
                    ${stock.recommended_price?.toFixed(2) || "N/A"}
                    {priceDifference && (
                      <span className={`text-sm ml-2 ${priceDifference >= 0 ? "text-green-500" : "text-red-500"}`}>
                        Current: ${stock.current_price?.toFixed(2)} ({priceDifference >= 0 ? "+" : ""}{priceDifference.toFixed(2)}%)
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                 
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}