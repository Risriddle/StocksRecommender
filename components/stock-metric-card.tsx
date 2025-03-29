import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface MetricProps {
  metric: {
    title: string
    value: string
    change: string
    description: string
  }
}

export function StockMetricCard({ metric }: MetricProps) {
  const isPositive = !metric.change.startsWith("-")

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all border-blue-100">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{metric.title}</h3>
          <div className={`flex items-center text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {isPositive ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
            {metric.change}
          </div>
        </div>
        <div className="mb-2">
          <span className="text-3xl font-bold">{metric.value}</span>
        </div>
        <p className="text-sm text-slate-500">{metric.description}</p>
      </CardContent>
    </Card>
  )
}

