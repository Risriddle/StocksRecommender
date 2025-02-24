
import { Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface FilterSectionProps {
  filters: {
    company: string
    exchange: string
    category: string
    industry: string
    country:string
    time: string
  }
  setFilters: (filters: any) => void
  uniqueValues: {
    exchanges: string[]
    categories: string[]
    industries: string[]
    countries:string[]
  }
}

export default function FilterSection({ filters, setFilters, uniqueValues }: FilterSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter companies..."
            className="pl-9"
            value={filters.company}
            onChange={(e) => setFilters({ ...filters, company: e.target.value })}
          />
      

        </div>
        <div className="grid grid-cols-2 gap-4 md:flex md:flex-1">
          <Select
            value={filters.exchange || "all"}
            onValueChange={(value) => setFilters({ ...filters, exchange: value === "all" ? "" : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Exchange" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Exchanges</SelectItem>
              {uniqueValues.exchanges.map((exchange) => (
                <SelectItem key={exchange} value={exchange}>
                  {exchange}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>



          <Select
            value={filters.country || "all"}
            onValueChange={(value) => setFilters({ ...filters, country: value === "all" ? "" : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {uniqueValues.countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>


          <Select
            value={filters.category || "all"}
            onValueChange={(value) => setFilters({ ...filters, category: value === "all" ? "" : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {uniqueValues.categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.industry || "all"}
            onValueChange={(value) => setFilters({ ...filters, industry: value === "all" ? "" : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {uniqueValues.industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.time || "all_time"}
            onValueChange={(value) => setFilters({ ...filters, time: value || "all_time" })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_time">All Time</SelectItem>
              <SelectItem value="last_month">Last Month</SelectItem>
              <SelectItem value="last_3_months">Last 3 Months</SelectItem>
              <SelectItem value="last_6_months">Last 6 Months</SelectItem>
              <SelectItem value="last_year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}




