
"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Activity,
  BarChart3,
  Info,
  ChevronUp,
  ChevronDown,
  Zap,
  Sparkles,
} from "lucide-react";

export default function TechnicalAnalysisPage() {
  const [stockInfo, setStockInfo] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chartType, setChartType] = useState("area");

  useEffect(() => {
    async function fetchStockIndicators() {
      setIsLoading(true);
      try {
        const response = await fetch("/api/stocks/tech-analysis");
        const data = await response.json();
        setStockInfo(data.data || []);

        if (data.data && data.data.length > 0) {
          setSelectedStock(data.data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch stock indicators:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStockIndicators();
  }, []);

  // Data preparation functions
  const getPriceHistoryData = () => {
    if (!selectedStock?.priceTrend) return [];
    return selectedStock.priceTrend.map((price, index) => ({
      day: `Day ${index + 1}`,
      price: price,
    }));
  };

  const getMovingAveragesWithPriceData = () => {
    if (!selectedStock?.priceTrend) return [];

    const priceData = selectedStock.priceTrend;
    const recentPrice = priceData[priceData.length - 1];
    const { moving_averages } = selectedStock.stockIndicators;

    return [
      { name: "Price", value: recentPrice },
      { name: "SMA 20", value: moving_averages.sma_20 },
      { name: "SMA 50", value: moving_averages.sma_50 },
      { name: "SMA 200", value: moving_averages.sma_200 },
      { name: "EMA 20", value: moving_averages.ema_20 },
    ];
  };

  const getRsiChartData = () => {
    if (!selectedStock) return [];

    const { rsi_indicators } = selectedStock.stockIndicators;
    return [
      {
        name: "RSI 14",
        value: rsi_indicators.rsi_14,
        color:
          rsi_indicators.rsi_14 > 70
            ? "#ef4444"
            : rsi_indicators.rsi_14 < 30
            ? "#22c55e"
            : "#f59e0b",
      },
      {
        name: "MACD",
        value: rsi_indicators.macd,
        color: rsi_indicators.macd > 0 ? "#22c55e" : "#ef4444",
      },
      {
        name: "MACD Signal",
        value: rsi_indicators.macd_signal,
        color: rsi_indicators.macd_signal > 0 ? "#22c55e" : "#ef4444",
      },
      {
        name: "MACD Histogram",
        value: rsi_indicators.macd_histogram,
        color: rsi_indicators.macd_histogram > 0 ? "#22c55e" : "#ef4444",
      },
    ];
  };

  const getRadarData = () => {
    if (!selectedStock) return [];

    return [
      {
        subject: "Growth",
        value: parseInt(selectedStock.stockIndicators.growth_rating) || 0,
        fullMark: 100,
      },
      {
        subject: "Value",
        value: parseInt(selectedStock.stockIndicators.value_rating) || 0,
        fullMark: 100,
      },
      {
        subject: "Momentum",
        value: parseInt(selectedStock.stockIndicators.momentum_score) || 0,
        fullMark: 100,
      },
      {
        subject: "Quality",
        value: 100 - (parseInt(selectedStock.stockIndicators.risk_score) || 0),
        fullMark: 100,
      },
      {
        subject: "Vol. Trend",
        value:
          selectedStock.stockIndicators.volume_analysis.volume_change_percent >
          0
            ? Math.min(
                Math.abs(
                  selectedStock.stockIndicators.volume_analysis
                    .volume_change_percent
                ),
                100
              )
            : Math.min(40, 100),
        fullMark: 100,
      },
    ];
  };

  // Helper functions
  const getSignalColor = (signal) => {
    if (!signal) return "bg-gray-100 text-gray-800";

    if (
      signal.toLowerCase().includes("buy") ||
      signal.toLowerCase().includes("bullish")
    ) {
      return "bg-green-100 text-green-800";
    } else if (
      signal.toLowerCase().includes("sell") ||
      signal.toLowerCase().includes("bearish")
    ) {
      return "bg-red-100 text-red-800";
    } else {
      return "bg-yellow-100 text-yellow-800";
    }
  };

  const renderSignalBadge = (signal) => (
    <Badge className={getSignalColor(signal)}>
      {signal?.toLowerCase().includes("bullish") ||
      signal?.toLowerCase().includes("buy") ? (
        <ArrowUpRight className="mr-1 h-3 w-3" />
      ) : signal?.toLowerCase().includes("bearish") ||
        signal?.toLowerCase().includes("sell") ? (
        <ArrowDownRight className="mr-1 h-3 w-3" />
      ) : null}
      {signal || "N/A"}
    </Badge>
  );

  const calculateTrendDirection = () => {
    if (!selectedStock?.priceTrend || selectedStock.priceTrend.length < 2)
      return null;

    const trend = selectedStock.priceTrend;
    const latestPrice = trend[trend.length - 1];
    const previousPrice = trend[trend.length - 2];

    return {
      direction: latestPrice > previousPrice ? "up" : "down",
      percentage: Math.abs(
        ((latestPrice - previousPrice) / previousPrice) * 100
      ).toFixed(2),
    };
  };

  const trendDirection = calculateTrendDirection();
  const renderChart = () => {
    if (chartType === "area") {
      return (
        <AreaChart
          data={getPriceHistoryData()}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip contentStyle={{ borderRadius: "8px" }} />
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="price"
            stroke="#4f46e5"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorPrice)"
          />
        </AreaChart>
      );
    }

    if (chartType === "line") {
      return (
        <LineChart
          data={getPriceHistoryData()}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip contentStyle={{ borderRadius: "8px" }} />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#4f46e5"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      );
    }

    if (chartType === "bar") {
      return (
        <BarChart
          data={getPriceHistoryData()}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip contentStyle={{ borderRadius: "8px" }} />
          <Bar dataKey="price" fill="#4f46e5" />
        </BarChart>
      );
    }

    return null; // If no valid chartType is provided
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen pb-10">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg p-6 mb-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold flex items-center">
            <Activity className="mr-3 h-8 w-8" />
            Technical Stock Analysis
          </h1>
          <p className="text-blue-100 mt-2">
            Interactive technical indicators dashboard
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-md">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {/* Stock Selector */}
            <div className="grid grid-cols-1 gap-6 mb-6">
              <Card className="shadow-lg hover:shadow-xl transition-shadow border-0 rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-50 py-4">
                  <CardTitle className="flex items-center text-indigo-700">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Select Stock for Visualization
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 text-black">
                  <Select
                    onValueChange={(name) => {
                      const stock = stockInfo.find(
                        (indicator) => indicator.stockDetails.name === name
                      );
                      setSelectedStock(stock || null);
                    }}
                    value={selectedStock?.stockDetails.name}
                  >
                    <SelectTrigger className="w-full bg-slate-50 border border-slate-200">
                      <SelectValue placeholder="Select a Stock" />
                    </SelectTrigger>
                    <SelectContent>
                      {stockInfo.map((indicator) => (
                        <SelectItem
                          key={indicator.stockDetails._id}
                          value={indicator.stockDetails.name}
                        >
                          {indicator.stockDetails.name} -&quot;
                          {indicator.stockDetails.company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>

            {selectedStock && (
              <>
                {/* Interactive Price Chart */}
                <Card className="mb-6 shadow-lg hover:shadow-xl transition-shadow border-0 rounded-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-50 py-4 flex flex-row justify-between items-center">
                    <CardTitle className="flex items-center text-indigo-700">
                      <TrendingUp className="mr-2 h-5 w-5" />
                      {selectedStock.stockDetails.name} Price Chart
                    </CardTitle>
                    <div className="flex space-x-2">
                      <Badge
                        className={`cursor-pointer ${
                          chartType === "area"
                            ? "bg-indigo-600 hover:bg-indigo-700"
                            : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                        }`}
                        onClick={() => setChartType("area")}
                      >
                        Area
                      </Badge>
                      <Badge
                        className={`cursor-pointer ${
                          chartType === "line"
                            ? "bg-indigo-600 hover:bg-indigo-700"
                            : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                        }`}
                        onClick={() => setChartType("line")}
                      >
                        Line
                      </Badge>
                      <Badge
                        className={`cursor-pointer ${
                          chartType === "bar"
                            ? "bg-indigo-600 hover:bg-indigo-700"
                            : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                        }`}
                        onClick={() => setChartType("bar")}
                      >
                        Bar
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        {renderChart()}
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex justify-center">
                      {trendDirection && (
                        <Badge
                          className={`text-lg py-2 px-3 ${
                            trendDirection.direction === "up"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {trendDirection.direction === "up" ? (
                            <ArrowUpRight className="h-5 w-5 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-5 w-5 mr-1" />
                          )}
                          {trendDirection.percentage}%&quot;
                          {trendDirection.direction === "up"
                            ? "Increase"
                            : "Decrease"}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Visual Analysis Tabs */}
                <Tabs defaultValue="indicators" className="w-full">
                  <TabsList className="mb-6 w-full justify-start p-1 rounded-lg bg-slate-100/80 backdrop-blur-sm">
                    <TabsTrigger
                      value="indicators"
                      className="rounded-md data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                    >
                      Key Indicators
                    </TabsTrigger>
                    <TabsTrigger
                      value="radar"
                      className="rounded-md data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                    >
                      Stock Profile
                    </TabsTrigger>
                    <TabsTrigger
                      value="technicals"
                      className="rounded-md data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                    >
                      Technical Analysis
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="indicators">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card className="shadow-lg hover:shadow-xl transition-shadow border-0 rounded-xl overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-50 py-4">
                          <CardTitle className="text-indigo-700 flex items-center">
                            <Sparkles className="h-5 w-5 mr-2" />
                            Stock Info
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 bg-white text-black">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 border-l-4 border-indigo-500">
                              <span className="font-medium">Company:</span>
                              <span className="font-bold">
                                {selectedStock.stockDetails.company}
                              </span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 border-l-4 border-indigo-500">
                              <span className="font-medium">Market Cap:</span>
                              <span className="font-bold">
                                {selectedStock.stockIndicators.market_cap}
                              </span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 border-l-4 border-indigo-500">
                              <span className="font-medium">P/E Ratio:</span>
                              <span className="font-bold">
                                {selectedStock.stockIndicators.pe_ratio}
                              </span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 border-l-4 border-indigo-500">
                              <span className="font-medium">
                                Current Price:
                              </span>
                              <span className="font-bold text-green-600">
                                ${selectedStock.stockDetails.current_price}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="shadow-lg hover:shadow-xl transition-shadow border-0 rounded-xl overflow-hidden col-span-2">
                        <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-50 py-4">
                          <CardTitle className="text-indigo-700 flex items-center">
                            <Activity className="h-5 w-5 mr-2" />
                            Key Technical Signals
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6 bg-white text-black">
                          <div className="grid grid-cols-2 gap-4">
                            {[
                              "short_term",
                              "medium_term",
                              "long_term",
                              "overall",
                            ].map((term) => (
                              <div
                                key={term}
                                className="p-3 rounded-lg bg-slate-50 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                              >
                                <div className="font-medium text-gray-500 mb-2 capitalize text-sm">
                                  {term.replace("_", " ")}
                                </div>
                                <div className="text-xl flex items-center">
                                  {renderSignalBadge(
                                    selectedStock.stockIndicators
                                      .technical_signals[term]
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                              <h3 className="text-sm font-medium mb-3 flex items-center text-indigo-700">
                                <span className="inline-block w-3 h-3 rounded-full mr-2 bg-red-500"></span>
                                Resistance Levels
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {selectedStock.stockIndicators.resistance_levels.map(
                                  (level, index) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="bg-red-50 text-red-700 border-red-100 py-1"
                                    >
                                      ${level}
                                    </Badge>
                                  )
                                )}
                              </div>
                            </div>

                            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                              <h3 className="text-sm font-medium mb-3 flex items-center text-indigo-700">
                                <span className="inline-block w-3 h-3 rounded-full mr-2 bg-green-500"></span>
                                Support Levels
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {selectedStock.stockIndicators.support_levels.map(
                                  (level, index) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="bg-green-50 text-green-700 border-green-100 py-1"
                                    >
                                      ${level}
                                    </Badge>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="radar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="shadow-lg hover:shadow-xl transition-shadow border-0 rounded-xl overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-50 py-4">
                          <CardTitle className="text-indigo-700">
                            Stock Performance Radar
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 bg-white text-black">
                          <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                              <RadarChart
                                outerRadius={90}
                                data={getRadarData()}
                              >
                                <PolarGrid />
                                <PolarAngleAxis dataKey="subject" />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                <Radar
                                  name="Performance"
                                  dataKey="value"
                                  stroke="#4f46e5"
                                  fill="#4f46e5"
                                  fillOpacity={0.5}
                                />
                                <Tooltip
                                  contentStyle={{ borderRadius: "8px" }}
                                />
                              </RadarChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="shadow-lg hover:shadow-xl transition-shadow border-0 rounded-xl overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-50 py-4">
                          <CardTitle className="text-indigo-700">
                            Volume Analysis
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 bg-white text-black">
                          <div className="space-y-6">
                            <div className="flex items-center justify-between p-5 rounded-lg bg-gradient-to-r from-slate-50 to-blue-50 shadow-sm border border-blue-100">
                              <span className="font-medium text-lg">
                                Average Volume:
                              </span>
                              <span className="font-bold text-xl">
                                {selectedStock.stockIndicators.volume_analysis.average_volume.toLocaleString()}
                              </span>
                            </div>

                            <div className="flex items-center justify-between p-5 rounded-lg bg-gradient-to-r from-slate-50 to-blue-50 shadow-sm border border-blue-100">
                              <span className="font-medium text-lg">
                                Volume Change:
                              </span>
                              <Badge
                                className={`text-lg py-2 px-3 ${
                                  selectedStock.stockIndicators.volume_analysis
                                    .volume_change_percent > 0
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {selectedStock.stockIndicators.volume_analysis
                                  .volume_change_percent > 0
                                  ? "+"
                                  : ""}
                                {
                                  selectedStock.stockIndicators.volume_analysis
                                    .volume_change_percent
                                }
                                %
                              </Badge>
                            </div>

                            <div className="p-5 rounded-lg bg-gradient-to-r from-slate-50 to-blue-50 shadow-sm border border-blue-100">
                              <h3 className="font-medium text-lg mb-2">
                                Chart Pattern:
                              </h3>
                              <div className="bg-white p-3 rounded-lg border border-blue-100">
                                <span className="font-bold italic text-xl text-indigo-700">
                                  {
                                    selectedStock.stockIndicators
                                      .volume_analysis.chart_pattern
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="technicals">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="shadow-lg hover:shadow-xl transition-shadow border-0 rounded-xl overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-50 py-4">
                          <CardTitle className="text-indigo-700">
                            Moving Averages
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 bg-white text-black">
                          <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={getMovingAveragesWithPriceData()}>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke="#f0f0f0"
                                />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip
                                  contentStyle={{ borderRadius: "8px" }}
                                />
                                <Bar dataKey="value">
                                  {getMovingAveragesWithPriceData().map(
                                    (entry, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={
                                          entry.name === "Price"
                                            ? "#4f46e5"
                                            : index % 4 === 1
                                            ? "#818cf8"
                                            : index % 4 === 2
                                            ? "#a5b4fc"
                                            : "#c7d2fe"
                                        }
                                      />
                                    )
                                  )}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="shadow-lg hover:shadow-xl transition-shadow border-0 rounded-xl overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-50 py-4">
                          <CardTitle className="text-indigo-700">
                            RSI & MACD
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 bg-white text-black">
                          <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={getRsiChartData()}>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke="#f0f0f0"
                                />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip
                                  contentStyle={{ borderRadius: "8px" }}
                                  formatter={(value, name) => [
                                    `${value}`,
                                    name,
                                  ]}
                                />
                                <Bar dataKey="value">
                                  {getRsiChartData().map((entry, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={entry.color}
                                    />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="shadow-lg hover:shadow-xl transition-shadow border-0 rounded-xl overflow-hidden md:col-span-2">
                        <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-50 py-4">
                          <CardTitle className="text-indigo-700">
                            Technical Summary
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 bg-white text-black">
                          <div className="p-6 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 shadow-inner">
                            <div className="flex items-start">
                              <Info className="h-6 w-6 text-indigo-600 mt-1 mr-3 flex-shrink-0" />
                              <p className="text-gray-700 text-lg leading-relaxed">
                                <span className="font-bold text-indigo-700">
                                  {selectedStock.stockDetails.name}
                                </span>&quot;
                                is showing&quot;
                                {selectedStock.stockIndicators.technical_signals.overall.toLowerCase()}&quot;
                                technical signals with&nbsp;
                                <span
                                  className={
                                    selectedStock.stockIndicators.upside > 0
                                      ? "text-green-600 font-semibold"
                                      : "text-red-600 font-semibold"
                                  }
                                >
                                  {selectedStock.stockIndicators.upside > 0
                                    ? "positive"
                                    : "negative"}&quot;
                                  upside potential of&quot;
                                  {selectedStock.stockIndicators.upside}%
                                </span>
                                . Current pattern: "
                                <span className="italic font-semibold">
                                  {
                                    selectedStock.stockIndicators
                                      .volume_analysis.chart_pattern
                                  }
                                </span>
                                ".
                                {selectedStock.stockIndicators.rsi_indicators
                                  .rsi_14 > 70 &&
                                  " RSI indicates overbought conditions, suggesting caution."}
                                {selectedStock.stockIndicators.rsi_indicators
                                  .rsi_14 < 30 &&
                                  " RSI indicates oversold conditions, potentially signaling a buying opportunity."}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
