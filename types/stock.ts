



export interface Stock  {
  _id: string;
  name: string;
  company:string;
  stock_id: string;
  category: string;
  country:string;
  volume:number;
  market_cap:number;
  pe_ratio:number;
  zacks_rank:number;
  recommended_price:number;
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
    market_cap:number;
    volume:number;
    pe_ratio:number;
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
    oneYearReturn:number;
    ytdReturn:number;
 
  };
  status: string;
  isPresent:boolean;
};







export interface Portfolio  {
  _id: string;
  name: string;
};

