import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, ArrowUpRight } from "lucide-react"

interface IndustryTrendProps {
  trend: {
    id: string
    industry: string
    trend: string
    aiInsight: string
    keyStocks: string[]
    growthForecast: number
    sentiment: number
  }
}

export function IndustryTrendCard({ trend }: IndustryTrendProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all border-blue-100 hover:border-blue-300">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold flex items-center">
            {trend.industry}
            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">10xStx</span>
          </h3>
          <Badge
            variant={trend.trend === "Bullish" ? "success" : trend.trend === "Bearish" ? "destructive" : "outline"}
          >
            {trend.trend}
          </Badge>
        </div>

        <p className="text-sm mb-3">{trend.aiInsight}</p>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-blue-50 rounded-lg p-2 text-center">
            <p className="text-xs text-slate-500">Growth Forecast</p>
            <p className="font-medium text-green-600 flex items-center justify-center">
              +{trend.growthForecast}% <ArrowUpRight className="h-3 w-3 ml-1" />
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-2 text-center">
            <p className="text-xs text-slate-500">Sentiment Score</p>
            <div className="flex items-center justify-center">
              <BarChart3 className="h-3 w-3 mr-1 text-blue-600" />
              <p className="font-medium text-black">{trend.sentiment}/100</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          <span className="text-xs text-slate-500 mr-1">Key Stocks:</span>
          {trend.keyStocks.map((stock, index) => (
            <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              {stock}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

