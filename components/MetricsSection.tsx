
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon, Loader2, ChevronDown, ChevronUp } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface PortfolioMetrics {
  _id: string
  portfolioName: string
  totalInvested: string
  totalCurrentValue: string
  portfolioReturn: string
  metrics: {
    avgWeekReturn: string
    avg1MonthReturn: string
    avg3MonthReturn: string
    avg6MonthReturn: string
  }
  stockReturns: Array<{
    stockName: string
    company: string
    status: string
    investedAmount: number
    currentValue: number
    returnSinceAdded: string
    oneWeekReturn: string | null
    oneMonthReturn: string | null
    threeMonthReturn: string | null
    sixMonthReturn: string | null
  }>
}

export default function MetricsSection() {
  const [portfolios, setPortfolios] = useState<PortfolioMetrics[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedPortfolios, setExpandedPortfolios] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchAdminPortfolios = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/admin/portfolios/metrics")
        const data = await response.json()
        console.log(data,"data in metricsssssssss")
        if (response.ok) {
          setPortfolios(data)
          setError(null)
        } else {
          setError(data.message || "Failed to fetch portfolio metrics")
        }
      } catch (error) {
        console.error("Error fetching admin portfolios:", error)
        setError("Failed to load portfolio metrics")
      } finally {
        setLoading(false)
      }
    }

    fetchAdminPortfolios()
  }, [])

  const formatMetricValue = (value: string | null) => {
    if (value === "N/A" || !value) return null
    return parseFloat(value.replace("%", ""))
  }

  const togglePortfolio = (portfolioId: string) => {
    setExpandedPortfolios(prev => ({
      ...prev,
      [portfolioId]: !prev[portfolioId]
    }))
  }

  const MetricCard = ({ label, value }: { label: string; value: string }) => {
    const numericValue = formatMetricValue(value)
    
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{label}</CardTitle>
          {numericValue !== null && (
            <div className={numericValue >= 0 ? "text-emerald-500" : "text-red-500"}>
              {numericValue >= 0 ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${numericValue !== null ? (numericValue >= 0 ? "text-emerald-500" : "text-red-500") : ""}`}>
            {value}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-8">
      {portfolios.map((portfolio) => (
        <div key={portfolio._id} className="space-y-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">{portfolio.portfolioName}</h2>
              <Button
              variant='outline'
                onClick={() => togglePortfolio(portfolio._id)}
                className="p-2 rounded-full transition-colors"
                aria-label={expandedPortfolios[portfolio._id] ? "Collapse details" : "Expand details"}
              >View Stocks
                {expandedPortfolios[portfolio._id] ? (
                  <ChevronUp className="h-6 w-6" />
                ) : (
                  <ChevronDown className="h-6 w-6" />
                )}
              </Button>
            </div>
            <div className="flex gap-4 text-muted-foreground">
              <span>Total Invested: ${portfolio.totalInvested}</span>
              <span>Current Value: ${portfolio.totalCurrentValue}</span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <MetricCard 
              label="Portfolio Return" 
              value={portfolio.portfolioReturn}
            />
            <MetricCard 
              label="Week Return" 
              value={portfolio.metrics.avgWeekReturn}
            />
            <MetricCard 
              label="1 Month Return" 
              value={portfolio.metrics.avg1MonthReturn}
            />
            <MetricCard 
              label="3 Month Return" 
              value={portfolio.metrics.avg3MonthReturn}
            />
            <MetricCard 
              label="6 Month Return" 
              value={portfolio.metrics.avg6MonthReturn}
            />
          </div>

          {expandedPortfolios[portfolio._id] && portfolio.stockReturns.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-gray-200 mt-4">
              <table className="w-full border-collapse">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left py-3 px-4">Stock</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-right py-3 px-4">Invested</th>
                    <th className="text-right py-3 px-4">Current Value</th>
                    <th className="text-right py-3 px-4">Return</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.stockReturns.map((stock, index) => (
                    <tr key={index} className="border-t border-gray-200 ">
                      <td className="py-3 px-4">
                        <div className="font-medium">{stock.company}</div>
                        <div className="text-sm text-muted-foreground">{stock.stockName}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${stock.status === 'BUY' ? 'bg-emerald-100 text-emerald-700' : 
                            stock.status === 'SELL' ? 'bg-red-100 text-red-700' :
                            stock.status === 'HOLD' ? 'bg-amber-100 text-amber-700' :
                            'bg-blue-100 text-blue-700'}`}>
                          {stock.status}
                        </span>
                      </td>
                      <td className="text-right py-3 px-4">${stock.investedAmount.toFixed(2)}</td>
                      <td className="text-right py-3 px-4">${stock.currentValue.toFixed(2)}</td>
                      <td className={`text-right py-3 px-4 ${parseFloat(stock.returnSinceAdded) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {stock.returnSinceAdded}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}