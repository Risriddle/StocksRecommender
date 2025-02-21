

import React, { useState } from 'react';
import { useSession } from "next-auth/react";
import { ArrowUpIcon, ArrowDownIcon, ArrowUpDown } from 'lucide-react';
import { Stock } from '@/types/stock';
import StockActionModal from "@/components/StockActionModal"; 

interface StockTableProps {
  data: Stock[];
  onSort: (key: keyof Stock) => void;
}

const StockTable = ({ data, onSort }: StockTableProps) => {
  const { data: session, status } = useSession();
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const userId = session?.user?.id;

  const handleStockAction = (stock: Stock) => {
    setSelectedStock(stock);
  };

  const handleConfirmAction = async () => {
    if (!selectedStock) return;
    window.location.reload();
  };

  const renderPercentage = (value?: number | null) => {
    if (value === undefined || value === null) return <span className="text-gray-500">N/A</span>;
    const color = value >= 0 ? 'text-green-500' : 'text-red-500';
    return (
      <span className={`flex items-center font-medium ${color}`}>
        {value >= 0 ? <ArrowUpIcon className="w-4 h-4 mr-1" /> : <ArrowDownIcon className="w-4 h-4 mr-1" />}
        {Math.abs(value)}%
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-800 text-white text-sm font-semibold">
            <tr>
              {[
                'Company', 'Exchange', 'Currency', 'Current Price', 'Growth (1W)', 'Date Added',
                'Return Since Added', 'Return Since Buy', 'Realized Return', 'Status', 'Value',
                'Growth', '1 Week Return', '1 Month Return', '3 Month Return', 'Risk Rating',
                'Recommended Date', 'Industry', 'Category', 'Action'
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left whitespace-nowrap cursor-pointer border-b border-gray-700"
                  onClick={() => onSort(header.toLowerCase().replace(/ /g, '') as keyof Stock)}
                >
                  <div className="flex items-center justify-between">
                    {header}
                    <ArrowUpDown className="w-4 h-4 ml-1 opacity-60" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 text-gray-800">
            {data.map((stock) => (
              <tr key={stock.name ?? 'N/A'} className="hover:bg-gray-100 transition">
                <td className="px-4 py-3 font-medium">{stock.name ?? 'N/A'}</td>
                <td className="px-4 py-3">{stock.exchange ?? 'N/A'}</td>
                <td className="px-4 py-3">{stock.currency ?? 'N/A'}</td>
                <td className="px-4 py-3 font-semibold text-blue-600">${stock.current_price?.toFixed(2) ?? 'N/A'}</td>
                <td className="px-4 py-3">{renderPercentage(stock.returns?.growthLastWeek)}</td>
                <td className="px-4 py-3">{new Date(stock.added_date).toLocaleDateString('en-US')}</td>
                <td className="px-4 py-3">{renderPercentage(stock.returns?.returnSince)}</td>
                <td className="px-4 py-3">{renderPercentage(stock.returns?.returnSinceBuy)}</td>
                <td className="px-4 py-3">{renderPercentage(stock.returns?.realizedReturn)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    stock.status === 'BUY' ? 'bg-green-200 text-green-800' :
                    stock.status === 'HOLD' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {stock.status ?? 'N/A'}
                  </span>
                </td>
                <td className="px-4 py-3">{stock.indicators?.value_rating ?? 'N/A'}</td>
                <td className="px-4 py-3">{stock.indicators?.growth_rating ?? 'N/A'}</td>
                <td className="px-4 py-3">{renderPercentage(stock.returns?.oneWeekReturn)}</td>
                <td className="px-4 py-3">{renderPercentage(stock.returns?.oneMonthReturn)}</td>
                <td className="px-4 py-3">{renderPercentage(stock.returns?.threeMonthReturn)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    stock.indicators?.risk_score === 'Low' ? 'bg-green-100 text-green-800' :
                    stock.indicators?.risk_score === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {stock.indicators?.risk_score ?? 'N/A'}
                  </span>
                </td>
                <td className="px-4 py-3">{new Date(stock.date_recommended).toLocaleDateString('en-US')}</td>
                <td className="px-4 py-3">{stock.industry ?? 'N/A'}</td>
                <td className="px-4 py-3">{stock.category ?? 'N/A'}</td>
                <td className="px-4 py-3">
                  <button
                    className={`px-3 py-1 rounded text-xs font-semibold transition ${
                      stock.isPresent ? "bg-red-500 text-white hover:bg-red-600" : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                    onClick={() => handleStockAction(stock)}
                  >
                    {stock.isPresent ? "Remove from Portfolio" : "Add to Portfolio"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedStock && (
        <StockActionModal
          stock={selectedStock}
          isPresent={selectedStock.isPresent}
          onClose={() => setSelectedStock(null)}
          onConfirm={handleConfirmAction}
          userId={userId}
          status={status}
        />
      )}
    </div>
  );
};

export default StockTable;


