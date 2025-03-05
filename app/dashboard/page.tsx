
// "use client"

// import { useState, useMemo, useEffect } from "react"
// import { useSession } from "next-auth/react"
// import { useRouter } from "next/navigation"
// import { Loader2, ChevronDown, ChevronUp, ListFilter } from "lucide-react"
// import { SidebarProvider } from "@/components/ui/sidebar"
// import MetricsSection from "@/components/MetricsSection"
// import FilterSection from "@/components/FilterSection"
// import StockTable from "@/components/StockTable"
// import WatchlistPanel from "@/components/WatchlistPanel"
// import StockDetails from "@/components/StockDetails"
// import { Button } from "@/components/ui/button"
// import type { Stock } from "@/types/stock"
// import { useStockStore } from "@/lib/stockStore"
// import {getUserPortfolioStocks } from "@/lib/stockInPortfolio"

// const getTimeRange = (filter: string) => {
//   const now = new Date()
//   switch (filter) {
//     case "last_month":
//       return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
//     case "last_3_months":
//       return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
//     case "last_6_months":
//       return new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
//     case "last_year":
//       return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
//     default:
//       return null
//   }
// }

// export default function DashboardPage() {
//   const { data: session, status } = useSession()
//   const router = useRouter()
//   const { stocks, setStocks } = useStockStore()
//   const [filteredStocks, setFilteredStocks] = useState<Stock[]>(stocks)
//   const [filters, setFilters] = useState({
//     company: "",
//     exchange: "",
//     category: "",
//     industry: "",
//     country: "",
//     time: "",
//   })
//   const [loading, setLoading] = useState(false)
//   const [isMetricsOpen, setIsMetricsOpen] = useState(false)
//   const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
//   const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({})
//   const [isWatchlistOpen, setIsWatchlistOpen] = useState(false)


//   const [loadingbutton, setLoadingbutton] = useState<string | null>(null); // Track which button is clicked

//   const handleNavigation = (path: string) => {
//     setLoadingbutton(path); 
//     router.push(path);
//   };

//   const userId = session?.user?.id

//   useEffect(() => {
//     if (stocks.length === 0) {
//       fetchStockIndicators()
//     }
//   }, [stocks.length])

//   useEffect(() => {
//     const filtered = stocks.filter((stock) => {
//       const matchCompany = stock.company.toLowerCase().includes(filters.company.toLowerCase())
//       const matchExchange = filters.exchange ? stock.exchange === filters.exchange : true
//       const matchCategory = filters.category ? stock.category === filters.category : true
//       const matchIndustry = filters.industry ? stock.industry === filters.industry : true
//       const matchCountry = filters.country ? stock.country === filters.country : true

//       const stockDate = new Date(stock.added_date)
//       const timeFilter = getTimeRange(filters.time)
//       const matchTime = timeFilter ? stockDate >= timeFilter : true

//       return matchCompany && matchExchange && matchCategory && matchIndustry && matchCountry && matchTime
//     })

//     setFilteredStocks(filtered)
//   }, [filters, stocks])

//   const fetchStockIndicators = async () => {
//     try {
//       setLoading(true)
//       // const updateStockPrices = await fetch("/api/fetchDailyStockPrice")
//       const response = await fetch("/api/stocks/indicators")
//       const data = await response.json()
//       if (data.success) {
    
//         if (userId) {
//           const userStocks = new Set(await getUserPortfolioStocks(userId)); // Single DB call
//           const updatedStocks = data.data.map((stock: Stock) => ({
//             ...stock,
//             isPresent: userStocks.has(stock._id),
//           }));
//           setStocks(updatedStocks)
//         } else {
//           const updatedStocks = data.data.map((stock: Stock) => ({
//             ...stock,
//             isPresent: false,
//           }));
//           setStocks(updatedStocks)
//         }
      
        
      
//       }
//     } catch (error) {
//       console.error("Error fetching stock indicators:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const [sortConfig, setSortConfig] = useState<{
//     key: keyof Stock
//     direction: "asc" | "desc"
//   } | null>(null)

//   const uniqueValues = useMemo(
//     () => ({
//       exchanges: Array.from(new Set(stocks.map((stock) => stock.exchange))),
//       categories: Array.from(new Set(stocks.map((stock) => stock.category))),
//       industries: Array.from(new Set(stocks.map((stock) => stock.industry))),
//       countries: Array.from(new Set(stocks.map((stock) => stock.country))),
//     }),
//     [stocks],
//   )

//   const handleSort = (key: keyof Stock) => {
//     setSortConfig((prevSort) => ({
//       key,
//       direction: prevSort?.key === key && prevSort.direction === "asc" ? "desc" : "asc",
//     }))
//   }

//   const handleViewStock = (stock: Stock) => {
//     setSelectedStock((prev) => (prev?._id === stock._id ? null : stock))
//   }

//   return (
//     <SidebarProvider>
//       <div className="flex h-screen overflow-hidden">
//         <div className="flex-1 flex flex-col overflow-hidden">
//           {/* Header */}
//           <div className="border-b bg-background">
//             <div className="flex items-center justify-between p-4">
//               <div className="flex items-center gap-4">
//                 <h1 className="text-3xl font-bold">Stock Dashboard</h1>
//                 <div className="flex gap-2">
//                   <Button variant="outline" 
//                   // onClick={() => router.push("/stocks/history")}
//                   onClick={() => handleNavigation("/stocks/history")}
//                   disabled={loadingbutton === "/stocks/history"}
//                 >
//                   {loadingbutton === "/stocks/history" ? "Loading..." : "View History"}
                 
//                   </Button>
//                   <Button variant="outline" 
//                   // onClick={() => router.push("/stocks/compare")}>
//                   //   Compare Stocks
//                   onClick={() => handleNavigation("/stocks/compare")}
//                   disabled={loadingbutton === "/stocks/compare"}
//                 >
//                   {loadingbutton === "/stocks/compare" ? "Loading..." : "Compare Stocks"}
          
//                   </Button>
//                 </div>
//               </div>
//               <Button variant="outline" onClick={() => setIsWatchlistOpen(true)}>
//                 <ListFilter className="h-4 w-4 mr-2" />
//                 Watchlists
//               </Button>
//             </div>
//           </div>

//           <div className="flex-1 flex overflow-hidden">
//             {/* Main content area */}
//             <div className="flex-1 overflow-auto">
//               <div className="p-4">
//                 {/* Collapsible Metrics Section */}
//                 <div className="mb-4">
//                   <button
//                     onClick={() => setIsMetricsOpen(!isMetricsOpen)}
//                     className="flex items-center text-lg font-semibold w-full text-left border-b pb-2"
//                   >
//                     {isMetricsOpen ? "Hide Metrics" : "Show Metrics"}
//                     {isMetricsOpen ? <ChevronUp className="ml-2" /> : <ChevronDown className="ml-2" />}
//                   </button>
//                   {isMetricsOpen && <MetricsSection />}
//                 </div>
//                 <FilterSection
//                   filters={filters}
//                   setFilters={setFilters}
//                   uniqueValues={uniqueValues}
//                   visibleColumns={visibleColumns}
//                   setVisibleColumns={setVisibleColumns}
//                 />
//               </div>

//               <div className="px-4 pb-4">
//                 <div className="flex gap-6">
//                   <div className={`flex-1 transition-all ${selectedStock ? "w-2/3" : "w-full"}`}>
//                     <StockTable
//                       data={filteredStocks}
//                       onSort={handleSort}
//                       onViewStock={handleViewStock}
//                       selectedStockId={selectedStock?._id}
//                       visibleColumns={visibleColumns}
//                     />
//                   </div>

//                   {selectedStock && (
//                     <div className="w-1/3 min-w-[400px]">
//                       <StockDetails stock={selectedStock} />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Watchlist Panel */}
//       <WatchlistPanel open={isWatchlistOpen} onOpenChange={setIsWatchlistOpen} data={filteredStocks} />

//       {loading && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
//           <Loader2 className="h-8 w-8 animate-spin text-primary" />
//         </div>
//       )}
//     </SidebarProvider>
//   )
// }
















"use client"

import { useState, useMemo, useEffect, lazy, Suspense } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader2, ChevronDown, ChevronUp, ListFilter } from "lucide-react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import type { Stock } from "@/types/stock"
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getUserPortfolioStocks } from "@/lib/stockInPortfolio"

// Lazy load heavy components
const MetricsSection = lazy(() => import("@/components/MetricsSection"))
const FilterSection = lazy(() => import("@/components/FilterSection"))
const StockTable = lazy(() => import("@/components/StockTable"))
const StockDetails = lazy(() => import("@/components/StockDetails"))
const WatchlistPanel = lazy(() => import("@/components/WatchlistPanel"))

// Create a Zustand store for stocks with persistent storage
interface StockStore {
  stocks: Stock[]
  filteredStocks: Stock[]
  isLoaded: boolean
  setStocks: (stocks: Stock[]) => void
  setFilteredStocks: (stocks: Stock[]) => void
  clearStocks: () => void
}

const useStockStore = create<StockStore>()(
  persist(
    (set) => ({
      stocks: [],
      filteredStocks: [],
      isLoaded: false,
      setStocks: (stocks) => set({ stocks, isLoaded: true }),
      setFilteredStocks: (filteredStocks) => set({ filteredStocks }),
      clearStocks: () => set({ stocks: [], filteredStocks: [], isLoaded: false }),
    }),
    { 
      name: 'stock-storage',
      partialize: (state) => ({
        stocks: state.stocks,
        isLoaded: state.isLoaded
      })
    }
  )
)

const getTimeRange = (filter: string) => {
  const now = new Date()
  switch (filter) {
    case "last_month":
      return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    case "last_3_months":
      return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
    case "last_6_months":
      return new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
    case "last_year":
      return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
    default:
      return null
  }
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  
  // Use the Zustand store
  const { stocks, filteredStocks, isLoaded, setStocks, setFilteredStocks } = useStockStore()
  
  const [filters, setFilters] = useState({
    company: "",
    exchange: "",
    category: "",
    industry: "",
    country: "",
    time: "",
  })
  const [loading, setLoading] = useState(false)
  const [isMetricsOpen, setIsMetricsOpen] = useState(false)
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({})
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false)
  const [loadingButton, setLoadingButton] = useState<string | null>(null)

  const userId = session?.user?.id

  // Fetch stocks only if not already loaded
  useEffect(() => {
    const fetchStocks = async () => {
      if (isLoaded) return

      try {
        setLoading(true)
        const response = await fetch("/api/stocks/indicators")
        const data = await response.json()
        
        if (data.success) {
    
                  if (userId) {
                    const userStocks = new Set(await getUserPortfolioStocks(userId)); // Single DB call
                    const updatedStocks = data.data.map((stock: Stock) => ({
                      ...stock,
                      isPresent: userStocks.has(stock._id),
                    }));
                    setStocks(updatedStocks)
                  } else {
                    const updatedStocks = data.data.map((stock: Stock) => ({
                      ...stock,
                      isPresent: false,
                    }));
                    setStocks(updatedStocks)
                  }
        }
      } catch (error) {
        console.error("Error fetching stock indicators:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStocks()
  }, [isLoaded, userId, setStocks, setFilteredStocks])


  // Apply filters
  useEffect(() => {
    const applyFilters = () => {
      const filtered = stocks.filter((stock) => {
        const matchCompany = stock.company.toLowerCase().includes(filters.company.toLowerCase())
        const matchExchange = filters.exchange ? stock.exchange === filters.exchange : true
        const matchCategory = filters.category ? stock.category === filters.category : true
        const matchIndustry = filters.industry ? stock.industry === filters.industry : true
        const matchCountry = filters.country ? stock.country === filters.country : true

        const stockDate = new Date(stock.added_date)
        const timeFilter = getTimeRange(filters.time)
        const matchTime = timeFilter ? stockDate >= timeFilter : true

        return matchCompany && matchExchange && matchCategory && 
               matchIndustry && matchCountry && matchTime
      })

      setFilteredStocks(filtered)
    }

    applyFilters()
  }, [filters, stocks, setFilteredStocks])

  const [sortConfig, setSortConfig] = useState<{
        key: keyof Stock
        direction: "asc" | "desc"
      } | null>(null)

  // Unique values for filters
  const uniqueValues = useMemo(
    () => ({
      exchanges: Array.from(new Set(stocks.map((stock) => stock.exchange))),
      categories: Array.from(new Set(stocks.map((stock) => stock.category))),
      industries: Array.from(new Set(stocks.map((stock) => stock.industry))),
      countries: Array.from(new Set(stocks.map((stock) => stock.country))),
    }),
    [stocks]
  )

  const handleNavigation = (path: string) => {
    setLoadingButton(path)
    router.push(path)
  }

    const handleSort = (key: keyof Stock) => {
    setSortConfig((prevSort) => ({
      key,
      direction: prevSort?.key === key && prevSort.direction === "asc" ? "desc" : "asc",
    }))
  }
  const handleViewStock = (stock: Stock) => {
    setSelectedStock((prev) => (prev?._id === stock._id ? null : stock))
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="border-b bg-background">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold">Stock Dashboard</h1>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleNavigation("/stocks/history")}
                    disabled={loadingButton === "/stocks/history"}
                  >
                    {loadingButton === "/stocks/history" ? "Loading..." : "View History"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleNavigation("/stocks/compare")}
                    disabled={loadingButton === "/stocks/compare"}
                  >
                    {loadingButton === "/stocks/compare" ? "Loading..." : "Compare Stocks"}
                  </Button>
                </div>
              </div>
              <Button variant="outline" onClick={() => setIsWatchlistOpen(true)}>
                <ListFilter className="h-4 w-4 mr-2" />
                Watchlists
              </Button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 overflow-auto">
              <div className="p-4">
                {/* Metrics Section */}
                <div className="mb-4">
                  <button
                    onClick={() => setIsMetricsOpen(!isMetricsOpen)}
                    className="flex items-center text-lg font-semibold w-full text-left border-b pb-2"
                  >
                    {isMetricsOpen ? "Hide Metrics" : "Show Metrics"}
                    {isMetricsOpen ? <ChevronUp className="ml-2" /> : <ChevronDown className="ml-2" />}
                  </button>
                  {isMetricsOpen && (
                    <Suspense fallback={<div>Loading Metrics...</div>}>
                      <MetricsSection />
                    </Suspense>
                  )}
                </div>
                
                <Suspense fallback={<div>Loading Filters...</div>}>
                  <FilterSection
                    filters={filters}
                    setFilters={setFilters}
                    uniqueValues={uniqueValues}
                    visibleColumns={visibleColumns}
                    setVisibleColumns={setVisibleColumns}
                  />
                </Suspense>
              </div>

              <div className="px-4 pb-4">
                <div className="flex gap-6">
                  <div className={`flex-1 transition-all ${selectedStock ? "w-2/3" : "w-full"}`}>
                    <Suspense fallback={<div>Loading Stock Table...</div>}>
                      <StockTable
                        data={filteredStocks}
                        onSort={handleSort}
                        onViewStock={handleViewStock}
                        selectedStockId={selectedStock?._id}
                        visibleColumns={visibleColumns}
                      />
                    </Suspense>
                  </div>

                  {selectedStock && (
                    <div className="w-1/3 min-w-[400px]">
                      <Suspense fallback={<div>Loading Stock Details...</div>}>
                        <StockDetails stock={selectedStock} />
                      </Suspense>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Watchlist Panel - Loaded only when opened */}
      {isWatchlistOpen && (
        <Suspense fallback={<div>Loading Watchlist...</div>}>
          <WatchlistPanel 
            open={isWatchlistOpen} 
            onOpenChange={setIsWatchlistOpen} 
            data={filteredStocks}
          />
        </Suspense>
      )}

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </SidebarProvider>
  )
}