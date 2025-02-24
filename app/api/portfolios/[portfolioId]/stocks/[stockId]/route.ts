import { NextResponse } from "next/server"
import  dbConnect  from "@/lib/db/connect"
import { PortfolioStock } from "@/lib/db/models/PortfolioStock"

export async function DELETE(req: Request,  context: { params?: { portfolioId?: string,stockId?:string } } ) {
  try {
    await dbConnect()

    const  portfolioId =context.params?.portfolioId
    const  stockId = context.params?.stockId
console.log(portfolioId,stockId,"portfolioid,stockid")
    // Find and delete the stock entry from PortfolioStock collection
    const deletedStock = await PortfolioStock.findOneAndDelete({ portfolio_id: portfolioId,stock_id:stockId })
    console.log(deletedStock,"delete stock")
    if (!deletedStock) {
      return NextResponse.json({ error: "Stock not found in portfolio" }, { status: 404 })
    }

    return NextResponse.json({ message: "Stock removed successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error removing stock:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
