"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Zap,
  Brain,
  Eye,
  ArrowRight,
  Users,
  Lightbulb,
  AlertCircle,
  ChevronRight,
  Star,
  BarChart3,
  LineChart,
  Rocket,
  Target,
  Award,
} from "lucide-react";
import { FeaturedStockCard } from "@/components/featured-stock-card";
import { AIInsightCard } from "@/components/ ai-insight-card";
import { IndustryTrendCard } from "@/components/industry-trend-card";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { StockMetricCard } from "@/components/stock-metric-card";
import { PriceTrend } from "@/components/price-trend";
import { DisclaimerBanner } from "@/components/disclaimer-banner";

// Industry trends with AI-powered insights
const industryTrends = [
  {
    id: "1",
    industry: "Semiconductor",
    trend: "Bullish",
    aiInsight:
      "Supply chain analysis indicates 23% improvement in production capacity. Patent analysis shows acceleration in advanced node development.",
    keyStocks: ["NVDA", "AMD", "TSM"],
    growthForecast: 18.5,
    sentiment: 76,
  },
  {
    id: "2",
    industry: "Electric Vehicles",
    trend: "Bullish",
    aiInsight:
      "Alternative data shows 31% increase in charging station deployments. Consumer sentiment analysis indicates accelerating adoption curve.",
    keyStocks: ["TSLA", "F", "GM"],
    growthForecast: 27.3,
    sentiment: 82,
  },
  {
    id: "3",
    industry: "Cybersecurity",
    trend: "Bullish",
    aiInsight:
      "Threat intelligence data shows 42% increase in enterprise security spending. M&A analysis predicts consolidation in endpoint security segment.",
    keyStocks: ["CRWD", "PANW", "FTNT"],
    growthForecast: 22.7,
    sentiment: 79,
  },
];

// AI-powered insights
const aiInsights = [
  {
    id: "1",
    title: "Sentiment Analysis",
    description:
      "Natural language processing of earnings calls reveals positive shifts in management tone for small-cap tech stocks, preceding analyst upgrades by an average of 12 days.",
    stocks: ["TGI", "RENW", "CSMR"],
    confidence: 87,
  },
  {
    id: "2",
    title: "Supply Chain Intelligence",
    description:
      "Satellite imagery and shipping data indicate 18% improvement in semiconductor supply chains, with positive implications for automotive and consumer electronics sectors.",
    stocks: ["HLTHCO", "FINX"],
    confidence: 82,
  },
  {
    id: "3",
    title: "Alternative Data Analysis",
    description:
      "Credit card transaction data shows consumer spending resilience in premium brands despite inflation concerns, contradicting mainstream economic narratives.",
    stocks: ["CSMR", "FINX"],
    confidence: 79,
  },
];

// Performance metrics
const performanceMetrics = [
  {
    title: "AI Model Accuracy",
    value: "87%",
    change: "+4.2%",
    description: "Prediction accuracy over the last quarter",
  },
  {
    title: "Avg. Portfolio Growth",
    value: "23.5%",
    change: "+2.8%",
    description: "For tracked stocks in the last 12 months",
  },
  {
    title: "Insight Lead Time",
    value: "12 days",
    change: "-3 days",
    description: "Average time before mainstream coverage",
  },
  {
    title: "Data Points Analyzed",
    value: "1.2B",
    change: "+320M",
    description: "Weekly data processing volume",
  },
];

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userRole = session?.user?.role;
  const [featuredStocks, setFeaturedStocks] = useState([]);

  // Redirect authenticated users to the dashboard
  useEffect(() => {
    if (status === "authenticated") {
      if (userRole == "visitor") {
        router.replace("/dashboard");
      }
      if (userRole == "admin") {
        router.replace("/admin");
      }
    }
  }, [status, router, userRole]);

  const fetchFeaturedStocks = async () => {
    try {
      const res = await fetch("/api/featuredStocks");

      if (!res.ok) {
        throw new Error("Failed to fetch featured stocks");
      }

      const data = await res.json();
      console.log(data, "data from apiiiiiiiiiiiiii");
      if (data.success) {
        setFeaturedStocks(data.data); // Ensure setFeaturedStocks is defined in your component state
        console.log(data, "Featured stocks response");
      }
    } catch (error) {
      console.error("Error fetching featured stocks:", error);
    }
  };

  useEffect(() => {
    fetchFeaturedStocks();
  }, []);

  console.log(
    featuredStocks,
    "featuredddddddddddddd stocksssssssssssssssssssss"
  );

  return (
    
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-2">
      <DisclaimerBanner />
    </div>
      {/* <Button onClick={featured_Stocks}>getdata</Button> */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white py-20">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-purple-500/20 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center">
                <Rocket className="h-5 w-5 mr-2 text-yellow-300" />
                <span className="text-lg font-bold bg-gradient-to-r from-yellow-200 to-yellow-400 text-transparent bg-clip-text">
                  10xStx
                </span>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
              Discover{" "}
              <span className="bg-gradient-to-r from-yellow-200 to-yellow-400 text-transparent bg-clip-text">
                10x
              </span>{" "}
              Market Opportunities
            </h1>
            <p className="text-xl mb-4 text-blue-100">
              Leverage our advanced AI analysis to find valuable stocks beyond
              the headlines and potentially multiply your returns.
            </p>
            <p className="text-sm mb-6 bg-white/10 backdrop-blur-sm p-3 rounded-md border border-white/20">
              <strong>Disclaimer:</strong> All information provided is for
              informational purposes only and does not constitute investment
              advice. Our ratings are based on data analysis and should not be
              considered as buy or sell recommendations.
            </p>
            <div className="flex flex-wrap gap-4">
              {/* <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-bold">
                Explore Featured Stocks
              </Button> */}
              <Link href="/technical-analysis">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10 font-medium"
                >
                  Explore Featured Stocks{" "}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating cards */}
        <div className="hidden lg:block absolute right-10 top-1/2 -translate-y-1/2 w-72 transform rotate-6 z-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                  10x
                </div>
                <span className="ml-2 font-semibold text-blue-900">NVDA</span>
              </div>
              <span className="text-green-600 font-bold flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                +218%
              </span>
            </div>
            <PriceTrend
              data={[100, 120, 150, 180, 210, 250, 280, 318]}
              height={40}
              positive={true}
            />
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-4 transform -rotate-3">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs">
                  10x
                </div>
                <span className="ml-2 font-semibold text-blue-900">AI</span>
              </div>
              <span className="text-green-600 font-bold flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                +162%
              </span>
            </div>
            <PriceTrend
              data={[100, 110, 130, 125, 150, 170, 190, 262]}
              height={40}
              positive={true}
            />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white py-6 border-b border-blue-100 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                <Zap className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-500">Stocks Analyzed</p>
                <p className="text-xl font-bold text-slate-900">10,000+</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <Brain className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-500">AI Data Points</p>
                <p className="text-xl font-bold text-slate-900">250M+</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Users className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-500">Analyst Ratings</p>
                <p className="text-xl font-bold text-slate-900">5,200+</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <Lightbulb className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-500">Unique Insights</p>
                <p className="text-xl font-bold text-slate-900">1,800+</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-grow py-12">
        <div className="container mx-auto px-4">
          {/* Performance Metrics */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-2 text-black">
                10xStx Performance Metrics
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                Our AI-powered analysis consistently identifies high-potential
                stocks before they gain mainstream attention
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {performanceMetrics.map((metric, index) => (
                <StockMetricCard key={index} metric={metric} />
              ))}
            </div>
          </div>

          {/* Featured Opportunities */}
          <div className="mb-16">
            <div className="flex justify-between items-center mb-10">
              <div>
                <div className="flex items-center mb-2">
                  <Target className="h-5 w-5 text-blue-600 mr-2" />
                  <h2 className="text-3xl font-bold text-black">
                    Featured Opportunities
                  </h2>
                </div>
                <p className="text-slate-500">
                  Stocks with exceptional potential identified by our AI
                  analysis
                </p>
              </div>
              <Link href="/auth/signin">
                <Button
                  variant="outline"
                  className="flex items-center border-blue-200 text-white hover:bg-slate-400"
                >
                  View All Stocks <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(featuredStocks) ? (
                featuredStocks.map((stock) => (
                  <FeaturedStockCard
                    key={stock.stockDetails._id}
                    stock={stock}
                  />
                ))
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2">
              <div className="flex items-center mb-8">
                <Brain className="h-6 w-6 text-purple-600 mr-2" />
                <div>
                  <h2 className="text-3xl font-bold text-black">
                    AI-Powered Insights
                  </h2>
                  <p className="text-slate-500">
                    Unique perspectives derived from advanced data analysis
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                {aiInsights.map((insight) => (
                  <AIInsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center mb-8">
                <LineChart className="h-6 w-6 text-blue-600 mr-2" />
                <div>
                  <h2 className="text-3xl font-bold text-black">
                    Industry Trends
                  </h2>
                  <p className="text-slate-500">
                    Sectors showing promising growth signals
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {industryTrends.map((trend) => (
                  <IndustryTrendCard key={trend.id} trend={trend} />
                ))}
              </div>
            </div>
          </div>

          <div className="mb-16">
            <Tabs defaultValue="undervalued">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center">
                  <Award className="h-6 w-6 text-blue-600 mr-2" />
                  <div>
                    <h2 className="text-3xl font-bold text-black">
                      Stock Categories
                    </h2>
                    <p className="text-slate-500">
                      Filtered selections based on our proprietary analysis
                    </p>
                  </div>
                </div>
                <TabsList className="bg-blue-100">
                  <TabsTrigger
                    value="undervalued"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    Potentially Undervalued
                  </TabsTrigger>
                  <TabsTrigger
                    value="growth"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    High Growth
                  </TabsTrigger>
                  <TabsTrigger
                    value="momentum"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    Momentum
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="undervalued" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Array.isArray(featuredStocks) &&
                    featuredStocks
                      .filter((stock) => stock.undervalued)
                      .map((stock) => (
                        <Card
                          key={stock.id}
                          className="border-blue-100 hover:border-blue-300 hover:shadow-md transition-all"
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="flex items-center">
                                  {stock.symbol}
                                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                    10xStx
                                  </span>
                                </CardTitle>
                                <CardDescription className="truncate">
                                  {stock.name}
                                </CardDescription>
                              </div>
                              <Badge
                                variant={
                                  stock.technicalSignal === "Bullish"
                                    ? "success"
                                    : stock.technicalSignal === "Bearish"
                                    ? "destructive"
                                    : "default"
                                }
                              >
                                {stock.technicalSignal}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-2xl font-bold">
                                ${stock.price.toFixed(2)}
                              </span>
                              <span
                                className={`flex items-center ${
                                  stock.change >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {stock.change >= 0 ? (
                                  <TrendingUp className="h-4 w-4 mr-1" />
                                ) : (
                                  <TrendingDown className="h-4 w-4 mr-1" />
                                )}
                                {stock.change >= 0 ? "+" : ""}
                                {/* {stock.changePercent.toFixed(2)}% */}
                              </span>
                            </div>
                            <div className="mb-3">
                              <PriceTrend
                                data={stock.priceTrend}
                                height={40}
                                positive={stock.priceChange >= 0}
                              />
                            </div>
                            <div className="text-sm text-slate-500 mb-4">
                              <div className="flex justify-between">
                                <span>Target:</span>
                                <span className="font-medium">
                                  ${stock.priceTarget.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Upside:</span>
                                <span className="font-medium text-green-600">
                                  {(
                                    (stock.priceTarget / stock.price - 1) *
                                    100
                                  ).toFixed(2)}
                                  %
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {stock.categories.map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                          <CardFooter className="pt-0">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              <Eye className="h-4 w-4 mr-2" /> View Analysis
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                </div>
              </TabsContent>

              <TabsContent value="growth" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Array.isArray(featuredStocks) &&
                    featuredStocks
                      .filter((stock) => stock.revenueGrowth > 20)
                      .map((stock) => (
                        <Card
                          key={stock.id}
                          className="border-purple-100 hover:border-purple-300 hover:shadow-md transition-all"
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="flex items-center">
                                  {stock.symbol}
                                  <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                                    10xStx
                                  </span>
                                </CardTitle>
                                <CardDescription className="truncate">
                                  {stock.name}
                                </CardDescription>
                              </div>
                              <Badge
                                variant="success"
                                className="bg-purple-600"
                              >
                                Growth
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-2xl font-bold">
                                ${stock.price.toFixed(2)}
                              </span>
                              <span
                                className={`flex items-center ${
                                  stock.change >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {stock.change >= 0 ? (
                                  <TrendingUp className="h-4 w-4 mr-1" />
                                ) : (
                                  <TrendingDown className="h-4 w-4 mr-1" />
                                )}
                                {stock.change >= 0 ? "+" : ""}
                                {/* {stock.changePercent.toFixed(2)}% */}
                              </span>
                            </div>
                            <div className="mb-3">
                              <PriceTrend
                                data={stock.priceTrend}
                                height={40}
                                positive={stock.change >= 0}
                              />
                            </div>
                            <div className="text-sm text-slate-500 mb-4">
                              <div className="flex justify-between">
                                <span>Revenue Growth:</span>
                                <span className="font-medium text-green-600">
                                  +{stock.revenueGrowth}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Profit Margin:</span>
                                <span className="font-medium">
                                  {stock.profitMargin}%
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {/* {stock.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))} */}
                            </div>
                          </CardContent>
                          <CardFooter className="pt-0">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              <Eye className="h-4 w-4 mr-2" /> View Analysis
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                </div>
              </TabsContent>

              <TabsContent value="momentum" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Array.isArray(featuredStocks) &&
                    featuredStocks
                      // .filter((stock) => stock.technicalSignal === "Bullish" && stock.changePercent > 0)
                      .filter((stock) => stock.technicalSignal === "Bullish")
                      .map((stock) => (
                        <Card
                          key={stock.id}
                          className="border-blue-100 hover:border-blue-300 hover:shadow-md transition-all"
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="flex items-center">
                                  {stock.symbol}
                                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                    10xStx
                                  </span>
                                </CardTitle>
                                <CardDescription className="truncate">
                                  {stock.name}
                                </CardDescription>
                              </div>
                              <Badge variant="success" className="bg-blue-600">
                                Momentum
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-2xl font-bold">
                                ${stock.price.toFixed(2)}
                              </span>
                              <span
                                className={`flex items-center ${
                                  stock.change >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {stock.change >= 0 ? (
                                  <TrendingUp className="h-4 w-4 mr-1" />
                                ) : (
                                  <TrendingDown className="h-4 w-4 mr-1" />
                                )}
                                {stock.change >= 0 ? "+" : ""}
                                {/* {stock.changePercent.toFixed(2)}% */}
                              </span>
                            </div>
                            <div className="mb-3">
                              <PriceTrend
                                data={stock.priceTrend}
                                height={40}
                                positive={stock.change >= 0}
                              />
                            </div>
                            <div className="text-sm text-slate-500 mb-4">
                              <div className="flex justify-between">
                                <span>AI Score:</span>
                                <span className="font-medium">
                                  {stock.aiScore}/100
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Analyst Consensus:</span>
                                <span className="font-medium text-green-600">
                                  {stock.analystConsensus}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {/* {stock.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))} */}
                            </div>
                          </CardContent>
                          <CardFooter className="pt-0">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              <Eye className="h-4 w-4 mr-2" /> View Analysis
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm mr-3">
                      10x
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-black">
                        10xStx Weekly Stock Insights for Subscribers
                      </CardTitle>
                      <CardDescription>
                        Subscribe to receive curated portfolios and new stocks
                        to track every week
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm">
                      <Star className="h-10 w-10 text-blue-600 mb-2" />
                      <h3 className="text-lg font-bold mb-2 text-black">
                        Curated Portfolios
                      </h3>
                      <p className="text-sm text-slate-500">
                        Access to standard portfolios designed for different
                        investment styles and risk tolerances
                      </p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm">
                      <Lightbulb className="h-10 w-10 text-yellow-500 mb-2" />
                      <h3 className="text-lg font-bold mb-2 text-black">
                        Weekly Radar Updates
                      </h3>
                      <p className="text-sm text-slate-500">
                        Receive new stocks to track based on our proprietary AI
                        analysis and data insights
                      </p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm">
                      <BarChart3 className="h-10 w-10 text-green-600 mb-2" />
                      <h3 className="text-lg font-bold mb-2 text-black">
                        Advanced Analytics
                      </h3>
                      <p className="text-sm text-slate-500">
                        Detailed technical and fundamental analysis for all
                        stocks in your tracking portfolios
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Subscribe Now
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Get Exclusive 10xStx Insights
              </h2>
              <p className="text-lg mb-2">
                Join our community of investors to receive AI-powered stock
                insights, analysis, and stocks to track delivered to your inbox
                weekly.
              </p>
              <p className="text-sm text-blue-100 mb-6">
                Subscribers receive curated portfolios, new stocks to add to
                their radar, and detailed analysis based on our proprietary data
                models. All information is for educational purposes only and not
                investment advice.
              </p>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <NewsletterSignup />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
