
import React from "react";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface FilterSectionProps {
  filters: {
    company: string;
    exchange: string;
    category: string;
    industry: string;
    time: string;
  };
  setFilters: (filters: any) => void;
  uniqueValues: {
    exchanges: string[];
    categories: string[];
    industries: string[];
  };
}

const FilterSection = ({ filters, setFilters, uniqueValues }: FilterSectionProps) => {
  return (
    <div className="flex gap-4 items-center">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Filter companies..."
          className="pl-9 w-64"
          value={filters.company}
          onChange={(e) => setFilters({ ...filters, company: e.target.value })}
        />
      </div>

      {/* Exchange Filter */}
      <Select
        value={filters.exchange || "all"}
        onValueChange={(value) => setFilters({ ...filters, exchange: value === "all" ? "" : value })}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filter exchange..." />
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

      {/* Category Filter */}
      <Select
        value={filters.category || "all"}
        onValueChange={(value) => setFilters({ ...filters, category: value === "all" ? "" : value })}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filter category..." />
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

      {/* Industry Filter */}
      <Select
        value={filters.industry || "all"}
        onValueChange={(value) => setFilters({ ...filters, industry: value === "all" ? "" : value })}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filter industry..." />
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

      {/* Time Filter */}
      <Select
        value={filters.time || "all_time"}
        onValueChange={(value) => setFilters({ ...filters, time: value || "all_time" })}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filter time..." />
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
  );
};

export default FilterSection;












