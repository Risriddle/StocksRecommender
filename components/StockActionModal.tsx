
import React, { useEffect, useState } from "react";
import { Stock } from '@/types/stock';

interface StockActionModalProps {
  stock: Stock
  isPresent: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userId: string;
  status: string;
}

const StockActionModal: React.FC<StockActionModalProps> = ({ stock, isPresent, onClose, onConfirm,userId, status }) => {
  const [portfolios, setPortfolios] = useState<{ _id: string; name: string }[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>("");

  useEffect(() => {
    if (status === "authenticated" && userId) {
      const fetchPortfolios = async () => {
        try {
          const response = await fetch(`/api/portfolios/users/${userId}`);
          const data = await response.json();
          if (response.ok) {
            setPortfolios(data);
            setSelectedPortfolio(data.length > 0 ? data[0]._id : "");
          }
        } catch (error) {
          console.error("Error fetching portfolios:", error);
        }
      };
      fetchPortfolios();
    }
  }, [status, userId]);

  const handleConfirm = async () => {
    if (!selectedPortfolio) return;
     console.log(selectedPortfolio,"portfolio idddddddddd")
    try {
      const response = await fetch(`/api/portfolios/${selectedPortfolio}/stocks`, {
        method: isPresent ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock }),
      });

      if (response.ok) {
        
        onConfirm();
        onClose();
      } else {
        console.error("Failed to update portfolio");
      }
    } catch (error) {
      console.error("Error updating portfolio:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-black p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">
          {isPresent ? "Remove Stock" : "Add Stock"}
        </h2>
        <p>Choose a portfolio to {isPresent ? "remove" : "add"} {stock.name}:</p>

        {portfolios.length > 0 ? (
          <select
            className="w-full mt-2 p-2 border rounded"
            value={selectedPortfolio}
            onChange={(e) => setSelectedPortfolio(e.target.value)}
          >
            {portfolios.map((portfolio) => (
              <option key={portfolio._id} value={portfolio._id}>
                {portfolio.name}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-gray-500 mt-2">No portfolios found.</p>
        )}

        <div className="flex justify-end mt-4">
          <button className="px-4 py-2 bg-gray-300 rounded mr-2" onClick={onClose}>
            Cancel
          </button>
          <button
            className={`px-4 py-2 ${isPresent ? "bg-red-500" : "bg-blue-500"} text-white rounded`}
            onClick={handleConfirm}
            disabled={!selectedPortfolio}
          >
            {isPresent ? "Remove" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockActionModal;
