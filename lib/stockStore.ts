import { create } from "zustand";
import type { Stock } from "@/types/stock";

type StockStore = {
  stocks: Stock[];
  setStocks: (stocks: Stock[]) => void;
};

export const useStockStore = create<StockStore>((set) => ({
  stocks: [],
  setStocks: (stocks) => set({ stocks }),
}));




