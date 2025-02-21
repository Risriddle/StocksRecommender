import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get('q');  // Search query

        if (!q) {
            return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
        }
        // const response=await fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${q}&apikey=${process.env.NEXT_PUBLIC_API_KEY}`)
        const response = await fetch(`https://query2.finance.yahoo.com/v1/finance/search?q=${q}`);
       
        const data = await response.json();
        
console.log(data.quotes)


        return NextResponse.json(data.quotes, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}




// import { NextRequest, NextResponse } from 'next/server';

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const q = searchParams.get('q');  // Search query

//     if (!q) {
//       return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
//     }

//     const response = await fetch(
//       `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${q}&apikey=${process.env.NEXT_PUBLIC_API_KEY}`
//     );
//     const data = await response.json();

//     if (data.bestMatches && data.bestMatches.length === 0) {
//       return NextResponse.json({ error: "No stocks found for the given query." }, { status: 404 });
//     }

//     console.log(data.bestMatches); // Log before returning

//     const stocks = data.bestMatches?.map((match: any) => ({
//       symbol: match["1. symbol"],
//       name: match["2. name"],
//       type: match["3. type"],
//       region: match["4. region"],
//     })) || [];

//     return NextResponse.json(stocks, { status: 200 });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
