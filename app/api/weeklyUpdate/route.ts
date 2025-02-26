import { NextResponse ,NextRequest} from "next/server";
import { updateStockData } from "@/lib/updateStockData"; 


export async function GET() {
  try {
    
    await updateStockData();
    return NextResponse.json({ message: "Stock data updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating stock data:", error);
    return NextResponse.json({ message: "Failed to update stock data" }, { status: 500 });
  }
}




