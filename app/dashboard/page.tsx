

"use client";


import { useState, useMemo, useEffect } from "react";
import { useSession } from "next-auth/react";
import {useRouter} from "next/navigation"
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import MetricsSection from "@/components/MetricsSection";
import FilterSection from "@/components/FilterSection";
import StockTable from "@/components/StockTable";
import WatchlistSidebar from "@/components/WatchlistSidebar";
import type { Stock } from "@/types/stock";
import { isStockInUserPortfolio } from "@/lib/stockInPortfolio";

const getTimeRange = (filter: string) => {
  const now = new Date();
  switch (filter) {
    case "last_month":
      return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    case "last_3_months":
      return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    case "last_6_months":
      return new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    case "last_year":
      return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    default:
      return null;
  }
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router=useRouter();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>(stocks);
  const [filters, setFilters] = useState({
    company: "",
    exchange: "",
    category: "",
    industry: "",
    country:"",
    time: "",
  });
  const [loading, setLoading] = useState(false);
  const [isMetricsOpen, setIsMetricsOpen] = useState(false);
  

  const userId = session?.user?.id;


  

  useEffect(() => {
    fetchStockIndicators();
  }, []);

  useEffect(() => {
    const filtered = stocks.filter((stock) => {
      const matchCompany = stock.company
        .toLowerCase()
        .includes(filters.company.toLowerCase());
      const matchExchange = filters.exchange
        ? stock.exchange === filters.exchange
        : true;
      const matchCategory = filters.category
        ? stock.category === filters.category
        : true;
      const matchIndustry = filters.industry
        ? stock.industry === filters.industry
        : true;
      const matchCountry = filters.country
        ? stock.country === filters.country
        : true;

      const stockDate = new Date(stock.added_date);
      const timeFilter = getTimeRange(filters.time);
      const matchTime = timeFilter ? stockDate >= timeFilter : true;

      return (
        matchCompany &&
        matchExchange &&
        matchCategory &&
        matchIndustry &&
        matchCountry &&
        matchTime
      );
    });

    setFilteredStocks(filtered);
  }, [filters, stocks]);


  useEffect(() => {
    fetchStockIndicators();
  }, []);

  useEffect(() => {
    const filtered = stocks.filter((stock) => {
      const matchCompany = stock.company.toLowerCase().includes(filters.company.toLowerCase());
      const matchExchange = filters.exchange ? stock.exchange === filters.exchange : true;
      const matchCategory = filters.category ? stock.category === filters.category : true;
      const matchIndustry = filters.industry ? stock.industry === filters.industry : true;
      const matchCountry = filters.country ? stock.country === filters.country : true;
      const stockDate = new Date(stock.added_date);
      const timeFilter = getTimeRange(filters.time);
      const matchTime = timeFilter ? stockDate >= timeFilter : true;
      return matchCompany && matchExchange && matchCategory && matchIndustry && matchCountry && matchTime;
    });
    setFilteredStocks(filtered);
  }, [filters, stocks]);

  const fetchStockIndicators = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/stocks/indicators");
      const data = await response.json();
      if (data.success) {
        const updatedStocks = await Promise.all(
          data.data.map(async (stock: Stock) => {
            const response = await fetch(`/api/stocks/${stock._id}`);
            const returnsData = await response.json();
            const isPresent = userId ? await isStockInUserPortfolio(userId, stock._id) : false;
            return { ...stock, returns: returnsData.success ? returnsData.data : null, isPresent };
          })
        );
        setStocks(updatedStocks);
      }
    } catch (error) {
      console.error("Error fetching stock indicators:", error);
    } finally {
      setLoading(false);
    }
  };

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Stock;
    direction: "asc" | "desc";
  } | null>(null);

  const uniqueValues = useMemo(
    () => ({
      exchanges: Array.from(new Set(stocks.map((stock) => stock.exchange))),
      categories: Array.from(new Set(stocks.map((stock) => stock.category))),
      industries: Array.from(new Set(stocks.map((stock) => stock.industry))),
      countries:Array.from(new Set(stocks.map((stock) => stock.country))),
    }),
    [stocks]
  );


    const handleSort = (key: keyof Stock) => {
    setSortConfig((prevSort) => ({
      key,
      direction:
        prevSort?.key === key && prevSort.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          <h1 className="text-3xl font-bold p-4 bg-background border-b">Stock Dashboard</h1>
          <div className="flex gap-4 mt-4">
                  <button onClick={() => router.push("/stocks/history")} className="px-4 py-2 bg-white text-black rounded-md">View Stock History</button>
                  <button onClick={() => router.push("/stocks/compare")} className="px-4 py-2 bg-white text-black rounded-md">Compare Stocks</button>
                </div>
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 overflow-auto">
              <div className="p-4">
                {/* Collapsible Metrics Section */}
                <div className="mb-4">
                  <button
                    onClick={() => setIsMetricsOpen(!isMetricsOpen)}
                    className="flex items-center text-lg font-semibold w-full text-left border-b pb-2"
                  >
                    {isMetricsOpen ? "Hide Metrics" : "Show Metrics"}
                    {isMetricsOpen ? <ChevronUp className="ml-2" /> : <ChevronDown className="ml-2" />}
                  </button>
                  {isMetricsOpen && <MetricsSection />}
                 
                </div>
                <FilterSection filters={filters} setFilters={setFilters} uniqueValues={uniqueValues} />
              </div>
              
              <div className="px-4">
                <StockTable data={filteredStocks} onSort={handleSort}/>
              </div>

            </div>
            <div className="w-80 border-l bg-background">
              <WatchlistSidebar data={filteredStocks} />
            </div>
          </div>
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </SidebarProvider>
  );
}


