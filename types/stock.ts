// export interface StockData {
//     company: string;
//     exchange: string;
//     currency: string;
//     currentPrice: number;
//     priceChange: number;
//     dateUpdated: string;
//     returnSinceAdded: number;
//     returnSinceBuy: number;
//     requiredReturn: number;
//     status: 'Buy' | 'Hold' | 'Sell';
//     value: 'High' | 'Medium' | 'Low';
//     growth: 'High' | 'Medium' | 'Low';
//     weekReturn: number;
//     monthReturn: number;
//     threeMonthReturn: number;
//     riskRating: 'High' | 'Medium' | 'Low';
//     recommendedDate: string;
//     industry: string;
//     category: string;
//     isPresent:boolean;
//   }
  
//   export interface Watchlist {
//     id: string;
//     name: string;
//     stocks: string[];
//   }
  



export interface Stock  {
  _id: string;
  name: string;
  company:string;
  stock_id: string;
  category: string;
  country:string;
  exchange:string;
  currency:string;
  industry:string;
  added_date:string;
  current_price: number;
  indicators?: {
    growth_rating?: string;
    momentum_score?: string;
    risk_score?: string;
    value_rating?: string;
  };
  date_recommended:string;
  returns?: {
    oneWeekReturn?: number
    oneMonthReturn?:number
    threeMonthReturn?: number
    growthLastWeek?:number
    returnSinceAdded?: number
    returnSinceBuy?:number
    realizedReturn?: number
 
  };
  status: string;
  isPresent:boolean;
};



export interface Portfolio  {
  _id: string;
  name: string;
};