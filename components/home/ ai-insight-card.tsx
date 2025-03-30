import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, ArrowUpRight } from "lucide-react"

interface AIInsightProps {
  insight: {
    id: string
    title: string
    description: string
    stocks: string[]
    confidence: number
  }
}

export function AIInsightCard({ insight }: AIInsightProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all border-purple-100 hover:border-purple-300">
      <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Brain className="h-5 w-5 text-purple-600 mr-2" />
            <CardTitle className="text-lg text-black">{insight.title}</CardTitle>
          </div>
          <Badge variant="outline" className="bg-purple-100 text-purple-700 flex items-center">
            {insight.confidence}% <ArrowUpRight className="h-3 w-3 ml-1" />
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm mb-4">{insight.description}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="text-sm font-medium text-slate-500">Related Stocks:</span>
          {insight.stocks.map((stock, index) => (
            <Badge key={index} variant="secondary" className="flex items-center bg-blue-100 text-blue-700">
              <TrendingUp className="h-3 w-3 mr-1" />
              {stock}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

