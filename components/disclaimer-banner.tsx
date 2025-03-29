import { AlertTriangle } from "lucide-react"

export function DisclaimerBanner() {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-lg">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-amber-800">Important Disclaimer</h3>
          <div className="mt-1 text-xs text-amber-700">
            <p>
              The information provided by 10xStx is for informational and educational purposes only and should not be
              considered as investment advice. Our ratings and insights are based on data analysis and do not constitute
              recommendations to buy, sell, or hold any securities.
            </p>
            <p className="mt-1">
              Past performance is not indicative of future results. Always conduct your own research and consider
              consulting with a financial advisor before making investment decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

