"use client"
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ZAxis,
  AreaChart,
  Area,
  ComposedChart,
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Activity, DollarSign, BarChart2 } from 'lucide-react';

export default function StockComparison() {
  const router=useRouter();
  const [stocks, setStocks] = useState([]);
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchStockIndicators = async () => {
      try {
        const response = await fetch('/api/stocks/indicators');
        const data = await response.json();

        if (data.success) {
          const updatedStocks = await Promise.all(
            data.data.map(async (stock) => {
              try {
                const returnsResponse = await fetch(`/api/stocks/${stock._id}`);
                const returnsData = await returnsResponse.json();

                return {
                  ...stock,
                  returns: returnsData.success ? returnsData.data : null,
                };
              } catch (error) {
                console.error(`Error fetching returns for ${stock.name}:`, error);
                return stock;
              }
            })
          );

          setStocks(updatedStocks);
          setSelectedStocks(updatedStocks.slice(0, 3).map(stock => stock._id)); // Select first three stocks
        }
      } catch (error) {
        console.error('Error fetching stock indicators:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockIndicators();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-xl font-medium">Loading stock data...</p>
        </div>
      </div>
    );
  }

  const getStockById = (id) => stocks.find((s) => s._id === id);
  
  const getIndicatorValue = (id, key) => {
    const stock = getStockById(id);
    return stock?.indicators?.[key] || 'N/A';
  };
  
  const getReturnValue = (id, key) => {
    const stock = getStockById(id);
    const value = stock?.returns?.[key];
    return value === null ? 'N/A' : value;
  };

  const getStockColor = (index) => {
    const colors = ['#8884d8', '#82ca9d', '#ff8042', '#a4de6c', '#ffc658', '#d0ed57'];
    return colors[index % colors.length];
  };

  // Convert text ratings to numbers for charts
  const ratingToNumber = (rating) => {
    const map = { 'Low': 1, 'Medium': 2, 'High': 3 };
    return map[rating] || 0;
  };

  // Prepare data for various charts
  const stockDetails = selectedStocks.map(id => {
    const stock = getStockById(id);
    return {
      id,
      name: stock?.name || 'Unknown',
      company: stock?.company || 'Unknown',
      price: stock?.current_price || 'N/A',
      industry: stock?.industry || 'N/A',
      country: stock?.country || 'N/A',
      status: stock?.status || 'N/A',
      category: stock?.category || 'N/A',
      oneWeekReturn: parseFloat(getReturnValue(id, 'oneWeekReturn')) || 0,
      returnSinceAdded: parseFloat(getReturnValue(id, 'returnSinceAdded')) || 0,
      growthRating: getIndicatorValue(id, 'growth_rating'),
      riskScore: getIndicatorValue(id, 'risk_score'),
      momentumScore: getIndicatorValue(id, 'momentum_score'),
      valueRating: getIndicatorValue(id, 'value_rating'),
    };
  });

  // Combined metrics data for radar and bar charts
  const metricsData = [
    { metric: 'Growth', ...Object.fromEntries(selectedStocks.map(id => [id, getIndicatorValue(id, 'growth_rating')])) },
    { metric: 'Momentum', ...Object.fromEntries(selectedStocks.map(id => [id, getIndicatorValue(id, 'momentum_score')])) },
    { metric: 'Risk', ...Object.fromEntries(selectedStocks.map(id => [id, getIndicatorValue(id, 'risk_score')])) },
    { metric: 'Value', ...Object.fromEntries(selectedStocks.map(id => [id, getIndicatorValue(id, 'value_rating')])) },
  ];

  // Risk vs Return data for scatter plot
  const riskReturnData = selectedStocks.map(id => {
    const stock = getStockById(id);
    return {
      name: stock?.name || 'Unknown',
      risk: ratingToNumber(getIndicatorValue(id, 'risk_score')),
      return: parseFloat(getReturnValue(id, 'returnSinceAdded')) || 0,
    };
  });

  // Returns comparison data
  const returnsData = [
    { period: '1 Week', ...Object.fromEntries(selectedStocks.map(id => [id, parseFloat(getReturnValue(id, 'oneWeekReturn')) || 0])) },
    { period: 'Since Added', ...Object.fromEntries(selectedStocks.map(id => [id, parseFloat(getReturnValue(id, 'returnSinceAdded')) || 0])) },
  ];

  // Radar chart data
  const radarData = selectedStocks.map(id => {
    const stock = getStockById(id);
    return {
      subject: stock?.name || 'Unknown',
      Growth: ratingToNumber(getIndicatorValue(id, 'growth_rating')),
      Momentum: ratingToNumber(getIndicatorValue(id, 'momentum_score')),
      Risk: ratingToNumber(getIndicatorValue(id, 'risk_score')),
      Value: ratingToNumber(getIndicatorValue(id, 'value_rating')),
      fullMark: 3,
    };
  });

  // Industry distribution data
  const industryData = selectedStocks.map(id => {
    const stock = getStockById(id);
    return {
      name: stock?.industry || 'Unknown',
      value: 1,
    };
  });

  // Generate sample historical price data (since actual data not provided)
  const generateHistoricalData = (stocks) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, i) => {
      const data = { month };
      selectedStocks.forEach((id, index) => {
        const stock = getStockById(id);
        // Create somewhat realistic price movement based on current price
        const basePrice = stock?.current_price || 100;
        const volatilityFactor = ratingToNumber(getIndicatorValue(id, 'risk_score')) / 10 + 0.05;
        const trend = ratingToNumber(getIndicatorValue(id, 'momentum_score')) / 10;
        
        // Generate price with some randomness, trend, and monthly progression
        data[id] = basePrice * (1 + (trend * i/5) + (Math.random() * 2 - 1) * volatilityFactor);
      });
      return data;
    });
  };

  const historicalPriceData = generateHistoricalData(selectedStocks);

  return (
    <div className="space-y-6">
       <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Stock Comparison</h1>
          <p className="text-muted-foreground">Compare metrics, returns and performance across stocks</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Select
              key={index}
              value={selectedStocks[index] || ''}
              onValueChange={(value) =>
                setSelectedStocks((prev) => {
                  const newSelection = [...prev];
                  newSelection[index] = value;
                  return newSelection;
                })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={`Select stock ${index + 1}`} />
              </SelectTrigger>
              <SelectContent>
                {stocks.map((stock) => (
                  <SelectItem key={stock._id} value={stock._id}>
                    {stock.name} - {stock.company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
      </div>

      {/* Stock Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {stockDetails.map((stock, index) => (
          <Card key={stock.id} className="overflow-hidden border-t-4" style={{ borderTopColor: getStockColor(index) }}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{stock.name}</CardTitle>
                  <CardDescription className="text-sm truncate">{stock.company}</CardDescription>
                </div>
                <Badge variant={stock.status === 'BUY' ? 'default' : 'secondary'}>
                  {stock.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-medium text-lg">${stock.price}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Return</span>
                  <div className="flex items-center">
                    <span className="font-medium text-lg">{stock.returnSinceAdded}%</span>
                    {stock.returnSinceAdded > 0 ? (
                      <ArrowUpRight className="ml-1 h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="ml-1 h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Industry</span>
                  <span className="font-medium">{stock.industry}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Country</span>
                  <span className="font-medium">{stock.country}</span>
                </div>
              </div>
              
              <Separator className="my-3" />
              
              <div className="grid grid-cols-4 gap-1 text-xs mt-2">
                <div className="flex flex-col items-center">
                  <span className="text-muted-foreground">Growth</span>
                  <span className={`font-medium ${stock.growthRating === 'High' ? 'text-green-500' : stock.growthRating === 'Low' ? 'text-red-500' : 'text-yellow-500'}`}>
                    {stock.growthRating}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-muted-foreground">Risk</span>
                  <span className={`font-medium ${stock.riskScore === 'Low' ? 'text-green-500' : stock.riskScore === 'High' ? 'text-red-500' : 'text-yellow-500'}`}>
                    {stock.riskScore}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-muted-foreground">Momentum</span>
                  <span className={`font-medium ${stock.momentumScore === 'High' ? 'text-green-500' : stock.momentumScore === 'Low' ? 'text-red-500' : 'text-yellow-500'}`}>
                    {stock.momentumScore}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-muted-foreground">Value</span>
                  <span className={`font-medium ${stock.valueRating === 'High' ? 'text-green-500' : stock.valueRating === 'Low' ? 'text-red-500' : 'text-yellow-500'}`}>
                    {stock.valueRating}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Visualization Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="returns">Returns</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Price Trend Comparison
                </CardTitle>
                <CardDescription>Historical price movement over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalPriceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, 'Price']} />
                      <Legend />
                      {selectedStocks.map((id, index) => {
                        const stock = getStockById(id);
                        return (
                          <Line
                            key={id}
                            type="monotone"
                            dataKey={id}
                            name={stock?.name || id}
                            stroke={getStockColor(index)}
                            activeDot={{ r: 8 }}
                          />
                        );
                      })}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Performance Matrix
                </CardTitle>
                <CardDescription>Risk vs. Return analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid />
                      <XAxis 
                        type="number" 
                        dataKey="risk" 
                        name="Risk Level" 
                        domain={[0, 4]}
                        label={{ value: 'Risk (1=Low, 3=High)', position: 'bottom', offset: 0 }}
                      />
                      <YAxis 
                        type="number" 
                        dataKey="return" 
                        name="Return"
                        label={{ value: 'Return %', angle: -90, position: 'insideLeft' }}
                      />
                      <ZAxis range={[60, 600]} />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }}
                        formatter={(value, name) => [name === 'return' ? `${value}%` : value, name === 'return' ? 'Return' : 'Risk']}
                      />
                      <Legend />
                      {riskReturnData.map((entry, index) => (
                        <Scatter 
                          key={entry.name} 
                          // name={entry.name} 
                          data={[entry]} 
                          fill={getStockColor(index)}
                        />
                      ))}
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Metrics Tab */}
        <TabsContent value="metrics" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5" />
                  Key Metrics Comparison
                </CardTitle>
                <CardDescription>Compare growth, momentum, risk, and value ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metricsData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="metric" type="category" />
                      <Tooltip />
                      <Legend />
                      {selectedStocks.map((id, index) => {
                        const stock = getStockById(id);
                        return (
                          <Bar 
                            key={id} 
                            dataKey={id} 
                            name={stock?.name || id} 
                            fill={getStockColor(index)} 
                          />
                        );
                      })}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Rating Radar</CardTitle>
                <CardDescription>Visual comparison of all metrics in a radar format</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                      {name: 'Growth', fullMark: 3},
                      {name: 'Momentum', fullMark: 3},
                      {name: 'Risk', fullMark: 3},
                      {name: 'Value', fullMark: 3}
                    ]}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="name" />
                      <PolarRadiusAxis angle={30} domain={[0, 3]} />
                      {selectedStocks.map((id, index) => {
                        const stock = getStockById(id);
                        return (
                          <Radar
                            key={id}
                            name={stock?.name || id}
                            dataKey={(val) => {
                              const stockData = radarData.find(d => d.subject === stock?.name);
                              return stockData ? stockData[val.name] : 0;
                            }}
                            stroke={getStockColor(index)}
                            fill={getStockColor(index)}
                            fillOpacity={0.6}
                          />
                        );
                      })}
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Returns Tab */}
        <TabsContent value="returns" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Returns Comparison
                </CardTitle>
                <CardDescription>Performance across different time periods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={returnsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis label={{ value: 'Return %', angle: -90, position: 'insideLeft' }} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Return']} />
                      <Legend />
                      {selectedStocks.map((id, index) => {
                        const stock = getStockById(id);
                        return (
                          <Bar 
                            key={id} 
                            dataKey={id} 
                            name={stock?.name || id} 
                            fill={getStockColor(index)} 
                          />
                        );
                      })}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Cumulative Returns</CardTitle>
                <CardDescription>Visual representation of growth over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historicalPriceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {selectedStocks.map((id, index) => {
                        const stock = getStockById(id);
                        const baseValue = historicalPriceData[0]?.[id] || 100;
                        
                        return (
                          <Area
                            key={id}
                            type="monotone"
                            dataKey={(entry) => ((entry[id] / baseValue - 1) * 100)}
                            name={stock?.name || id}
                            stroke={getStockColor(index)}
                            fill={getStockColor(index)}
                            fillOpacity={0.3}
                          />
                        );
                      })}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Performance Tab */}
        <TabsContent value="performance" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Price vs Value Rating</CardTitle>
                <CardDescription>Comparison of current price to value perception</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={stockDetails}>
                      <CartesianGrid stroke="#f5f5f5" />
                      <XAxis dataKey="name" scale="band" />
                      <YAxis yAxisId="left" orientation="left" label={{ value: 'Price ($)', angle: -90, position: 'insideLeft' }} />
                      <YAxis yAxisId="right" orientation="right" label={{ value: 'Value Rating', angle: 90, position: 'insideRight' }} domain={[0, 3]} />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="price" name="Current Price" barSize={20} fill="#413ea0" />
                      <Line yAxisId="right" type="monotone" dataKey={(entry) => ratingToNumber(entry.valueRating)} name="Value Rating" stroke="#ff7300" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Industry Breakdown</CardTitle>
                <CardDescription>Distribution of selected stocks by industry</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={industryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {industryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getStockColor(index)} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name, props) => [props.payload.name, '']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Risk Analysis Tab */}
        <TabsContent value="risk" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Risk vs Momentum</CardTitle>
                <CardDescription>Balanced view of risk against market momentum</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        type="number" 
                        dataKey={(entry) => ratingToNumber(entry.riskScore)} 
                        name="Risk" 
                        domain={[0, 4]}
                        label={{ value: 'Risk Rating', position: 'bottom' }}
                      />
                      <YAxis 
                        type="number" 
                        dataKey={(entry) => ratingToNumber(entry.momentumScore)} 
                        name="Momentum"
                        domain={[0, 4]}
                        label={{ value: 'Momentum Rating', angle: -90, position: 'insideLeft' }}
                      />
                      <ZAxis range={[60, 400]} />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Legend />
                      {stockDetails.map((entry, index) => (
                        <Scatter 
                          key={entry.name} 
                          name={entry.name} 
                          data={[entry]} 
                          fill={getStockColor(index)}
                        />
                      ))}
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Risk-Adjusted Returns</CardTitle>
                <CardDescription>Return efficiency based on risk taken</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stockDetails.map(stock => ({
                        name: stock.name,
                        return: stock.returnSinceAdded,
                        riskAdjusted: stock.returnSinceAdded / (ratingToNumber(stock.riskScore) || 1)
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'return' ? `${value}%` : value, 
                          name === 'return' ? 'Return' : 'Risk-Adjusted Return'
                        ]} 
                      />
                      <Legend />
                      <Bar dataKey="return" name="Return %" fill="#8884d8" />
                      <Bar dataKey="riskAdjusted" name="Risk-Adjusted Return" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}