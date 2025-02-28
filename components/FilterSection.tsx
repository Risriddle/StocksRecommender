
"use client"

import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface FilterSectionProps {
  filters: {
    company: string;
    exchange: string;
    category: string;
    industry: string;
    country: string;
    time: string;
  };
  setFilters: (filters: any) => void;
  uniqueValues: {
    exchanges: string[];
    categories: string[];
    industries: string[];
    countries: string[];
  };
  visibleColumns?: Record<string, boolean>;
  setVisibleColumns?: (columns: Record<string, boolean>) => void;
}

export default function FilterSection({
  filters,
  setFilters,
  uniqueValues,
  visibleColumns = {},
  setVisibleColumns,
}: FilterSectionProps) {
  const [isColumnsOpen, setIsColumnsOpen] = useState(false);
  const [columns, setColumns] = useState<Record<string, boolean>>({});

  // Define all possible columns
  const columnGroups = [
    { key: "stock_info", label: "Stock Info", essential: true },
    { key: "zacks_rank", label: "Zacks Rank", essential: true },
    { key: "industry", label: "Industry", essential: true },
    { key: "return_since_rec", label: "Return Since Rec.", essential: true },
    { key: "status", label: "Status", essential: true },
    { key: "returns", label: "Returns", essential: true },
    { key: "current_price", label: "Current Price" },
    { key: "exchange", label: "Exchange" },
    { key: "currency", label: "Currency" },
    { key: "country", label: "Country" },
    { key: "added_date", label: "Date Added" },
    { key: "return_since_added", label: "Return Since Added" },
    { key: "return_since_buy", label: "Return Since Buy" },
    { key: "realized_return", label: "Realized Return" },
    { key: "value_rating", label: "Value Rating" },
    { key: "growth_rating", label: "Growth Rating" },
    { key: "risk_score", label: "Risk Rating" },
    { key: "date_recommended", label: "Recommended Date" },
    { key: "category", label: "Category" },
    { key: "action", label: "Action" },
  ];

  // Initialize visible columns with only essential ones checked
  useEffect(() => {
    if (setVisibleColumns) {
      const initialColumns = columnGroups.reduce((acc, col) => {
        acc[col.key] = col.essential;
        return acc;
      }, {} as Record<string, boolean>);
      setColumns(initialColumns);
      setVisibleColumns(initialColumns);
    }
  }, [setVisibleColumns]);

  const toggleColumn = (key: string) => {
    const updatedColumns = {
      ...columns,
      [key]: !columns[key],
    };
    setColumns(updatedColumns);
    setVisibleColumns?.(updatedColumns);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter stocks..."
            className="pl-9"
            value={filters.company}
            onChange={(e) => setFilters({ ...filters, company: e.target.value })}
          />
        </div>
        <div className="flex flex-wrap gap-2 md:flex-1">
          <Select
            value={filters.exchange || "all"}
            onValueChange={(value) => setFilters({ ...filters, exchange: value === "all" ? "" : value })}
          >
            <SelectTrigger className="w-[140px]">
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
            <SelectTrigger className="w-[140px]">
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
            value={filters.industry || "all"}
            onValueChange={(value) => setFilters({ ...filters, industry: value === "all" ? "" : value })}
          >
            <SelectTrigger className="w-[140px]">
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
            value={filters.category || "all"}
            onValueChange={(value) => setFilters({ ...filters, category: value === "all" ? "" : value })}
          >
            <SelectTrigger className="w-[140px]">
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
            value={filters.time || "all_time"}
            onValueChange={(value) => setFilters({ ...filters, time: value || "all_time" })}
          >
            <SelectTrigger className="w-[140px]">
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



          <Popover open={isColumnsOpen} onOpenChange={setIsColumnsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[140px]">Columns</Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px]" align="end">
              <div className="space-y-4">
                <h4 className="font-medium">Toggle Columns</h4>
                <div className="grid grid-cols-2 gap-3">
                  {columnGroups.map((column) => (
                    <div key={column.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={`column-${column.key}`}
                        checked={columns[column.key] ?? false}
                        onCheckedChange={() => toggleColumn(column.key)}
                      />
                      <Label htmlFor={`column-${column.key}`} className="text-sm">
                        {column.label}
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const allVisible = Object.fromEntries(columnGroups.map((col) => [col.key, true]));
                      setColumns(allVisible);
                      setVisibleColumns?.(allVisible);
                    }}
                  >
                    Show All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const defaultColumns = columnGroups.reduce((acc, col) => {
                        acc[col.key] = col.essential;
                        return acc;
                      }, {} as Record<string, boolean>);
                      setColumns(defaultColumns);
                      setVisibleColumns?.(defaultColumns);
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
