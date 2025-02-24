

"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Briefcase, Shield, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

interface Portfolio {
  _id: string
  name: string
  description: string
  riskLevel: string
  stockCount?: number
  expectedReturn?: string
}

export default function StandardPortfoliosPage() {
  const [standardPortfolios, setStandardPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getStandardPortfolios()
  }, [])

  const getStandardPortfolios = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/portfolios")
      if (!response.ok) throw new Error("Failed to fetch portfolios")
      const data = await response.json()
      setStandardPortfolios(data || [])
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load portfolios")
      console.error("Error loading portfolios:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case "low":
        return "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25"
      case "medium":
        return "bg-amber-500/15 text-amber-700 hover:bg-amber-500/25"
      case "high":
        return "bg-red-500/15 text-red-700 hover:bg-red-500/25"
      default:
        return "bg-blue-500/15 text-blue-700 hover:bg-blue-500/25"
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="space-y-4 text-center">
          <Skeleton className="h-8 w-[300px] mx-auto" />
          <Skeleton className="h-4 w-[600px] mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border shadow-sm">
              <CardHeader>
                <Skeleton className="h-6 w-[150px]" />
                <Skeleton className="h-4 w-[100px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive">Error Loading Portfolios</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button onClick={() => getStandardPortfolios()}>Try Again</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
      {/* Header Section */}
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
          <Briefcase className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Standard Portfolios</h1>
        <p className="text-muted-foreground max-w-[600px] mx-auto">
          Choose from our carefully curated selection of investment portfolios designed to meet different risk appetites
          and financial goals.
        </p>
      </div>

      {standardPortfolios.length === 0 ? (
        <Card className="text-center p-8">
          <CardHeader>
            <CardTitle>No Portfolios Available</CardTitle>
            <CardDescription>Please check back later for our portfolio offerings.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {standardPortfolios.map((portfolio) => (
            <Card
              key={portfolio._id}
              className="group relative overflow-hidden border transition-all duration-200 hover:shadow-lg"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl font-semibold">{portfolio.name}</CardTitle>
                    <Badge className={getRiskBadgeColor(portfolio.riskLevel)}>{portfolio.riskLevel} Risk</Badge>
                  </div>
                  <Shield className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{portfolio.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  {portfolio.stockCount && (
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{portfolio.stockCount} Stocks</span>
                    </div>
                  )}
                  {portfolio.expectedReturn && (
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">~{portfolio.expectedReturn}% Return</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/portfolios/${portfolio._id}`} className="w-full">
                  <Button className="w-full group-hover:translate-x-1 transition-transform" variant="default">
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

