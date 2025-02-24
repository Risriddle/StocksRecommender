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



