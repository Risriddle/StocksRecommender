import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Brain, Users, Eye, Star, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { PriceTrend } from "@/components/price-trend"

interface FeaturedStockProps {
  stock: {
    id: string
    symbol: string
    stockDetails:{
      name: string
    current_price: number
    company:string
    }
    
    change: number
    changePercent: number
    sector: string
    aiScore: number
    aiInsight: string
    analystConsensus:{
      count:number;
      rating:string;
    }
    
    priceTarget: number
    
      revenueGrowth: number
      profitMargin: number
      debtToEquity: number
    
    technicalSignal: string
    undervalued: boolean
    categories: string[]
    priceTrend: number[]
  }
}

export function FeaturedStockCard({ stock }: FeaturedStockProps) {
  const upside = ((stock.priceTarget / stock.stockDetails.current_price - 1) * 100).toFixed(1)

  return (
    <Card className="overflow-hidden border-2 border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl flex items-center text-black">
                {stock.stockDetails.name}
                <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">10xStx</span>
              </CardTitle>
              <Badge
                variant={
                  stock.technicalSignal === "Bullish"
                    ? "success"
                    : stock.technicalSignal === "Bearish"
                      ? "destructive"
                      : "secondary"
                }
              >
                {stock.technicalSignal}
              </Badge>
            </div>
            <p className="text-sm text-slate-500">{stock.stockDetails.company}</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xl font-bold text-green-500">${stock.stockDetails.current_price.toFixed(2)}</span>
            <span className={`flex items-center text-sm ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}>
              {stock.change >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {stock.change >= 0 ? "+" : ""}
              {stock.changePercent.toFixed(2)}%
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="mb-4">
          <PriceTrend data={stock.priceTrend} height={60} positive={stock.change >= 0} />
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex items-center mb-1">
              <Brain className="h-4 w-4 text-purple-600 mr-1" />
              <span className="font-medium text-sm">AI Insight</span>
            </div>
            <p className="text-sm">{stock.aiInsight}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-500">AI Score</span>
                <span className="font-medium">{stock.aiScore}/100</span>
              </div>
              <Progress
                value={stock.aiScore}
                className="h-2 bg-slate-100"
                // indicatorClassName="bg-gradient-to-r from-blue-500 to-purple-500"
              />
            </div>
            <div>
              <div className="flex items-center mb-1">
                <Users className="h-4 w-4 text-blue-600 mr-1" />
                <span className="text-sm text-slate-500">Analyst Consensus</span>
              </div>
              <div className="flex items-center">
                <div className="flex mr-1">
                  {[
                    ...Array(
                      Math.floor(
                        stock.analystConsensus.rating === "Highly Positive"
                          ? 5
                          : stock.analystConsensus.rating === "Positive"
                            ? 4
                            : 3,
                      ),
                    ),
                  ].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm font-medium">
                  {stock.analystConsensus.rating} ({stock.analystConsensus.count})
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-blue-50 rounded-lg p-2">
              <p className="text-xs text-slate-500">Revenue Growth</p>
              <p className="font-medium text-green-600">+{stock.revenueGrowth}%</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-2">
              <p className="text-xs text-slate-500">Profit Margin</p>
              <p className="font-medium text-black">{stock.profitMargin}%</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-2">
              <p className="text-xs text-slate-500">Price Target</p>
              <p className="font-medium text-green-600 flex items-center justify-center">
                ${stock.priceTarget} <ArrowUpRight className="h-3 w-3 ml-1" />
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {stock.categories.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      {/* <CardFooter className="bg-gradient-to-r from-blue-50 to-indigo-50"> */}
      {/* <CardFooter className="bg-black">
        <div className="w-full flex gap-2">
          <Button variant="default" className="w-full bg-blue-600 hover:bg-blue-700">
            <Eye className="h-4 w-4 mr-2" /> View Analysis
          </Button>
          <Link href="/technical-analysis" className="w-full">
            <Button variant="outline" className="w-full">
              Technical Analysis
            </Button>
          </Link>
        </div>
      </CardFooter> */}
    </Card>
  )
}

