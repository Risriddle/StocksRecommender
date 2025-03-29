
// export interface Stock  {
//   _id: string;
//   name: string;
//   company:string;
//   stock_id: string;
//   category: string;
//   country:string;
//   volume:number;
//   market_cap:number;
//   pe_ratio:number;
//   zacks_rank:number;
//   recommended_price:number;
//   exchange:string;
//   currency:string;
//   industry:string;
//   added_date:string;
//   current_price: number;
//   indicators?: {
//     growth_rating?: string;
//     momentum_score?: string;
//     risk_score?: string;
//     value_rating?: string;
//     market_cap:number;
//     volume:number;
//     pe_ratio:number;
//   };
//   date_recommended:string;
//   returns?: {
//     oneWeekReturn?: number
//     oneMonthReturn?:number
//     threeMonthReturn?: number
//     growthLastWeek?:number
//     returnSinceAdded?: number
//     returnSinceBuy?:number
//     realizedReturn?: number
//     oneYearReturn:number;
//     ytdReturn:number;
 
//   };
//   status: string;
//   isPresent:boolean;
//   isInPortfolio?: boolean;

//   last_4_weeks_recommendations?: {
//     date_recommended: string
//     recommendation: string
//     reason: string
//   }[]
//   latestrecommendation?: {
//     date_recommended: string
//     recommendation: string
//     reason: string
//   }
// };



export interface Stock  {
  _id: string;
  name: string;
  company: string;
  stock_id: string;
  category: string;
  country: string;
  volume: number;
  market_cap: number;
  pe_ratio: number;
  zacks_rank: number;
  recommended_price: number;
  exchange: string;
  currency: string;
  industry: string;
  added_date: string;
  current_price: number;
  indicators?: {
    growth_rating?: string;
    momentum_score?: string;
    risk_score?: string;
    value_rating?: string;
    market_cap?: number;
    volume?: number;
    pe_ratio?: number;
    
    // New technical analysis properties
    last_updated?: string;
    technical_signals?: {
      overall?: string;
      short_term?: string;
      medium_term?: string;
      long_term?: string;
    };
    support_levels?: number[];
    resistance_levels?: number[];
    moving_averages?: {
      sma_20?: number;
      sma_50?: number;
      sma_200?: number;
      ema_20?: number;
    };
    rsi_indicators?: {
      rsi_14?: number;
      macd?: number;
      macd_signal?: number;
      macd_histogram?: number;
    };
    volume_analysis?: {
      average_volume?: number;
      volume_change_percent?: number;
      chart_pattern?: string;
    };
    upside?: number;
  };
  date_recommended: string;
  returns?: {
    oneWeekReturn?: number;
    oneMonthReturn?: number;
    threeMonthReturn?: number;
    growthLastWeek?: number;
    returnSinceAdded?: number;
    returnSinceBuy?: number;
    realizedReturn?: number;
    oneYearReturn?: number;
    ytdReturn?: number;
  };
  status: string;
  isPresent: boolean;
  isInPortfolio?: boolean;

  last_4_weeks_recommendations?: {
    date_recommended: string;
    recommendation: string;
    reason: string;
  }[];
  latestrecommendation?: {
    date_recommended: string;
    recommendation: string;
    reason: string;
  };
}



export interface Portfolio  {
  _id: string;
  name: string;
};

