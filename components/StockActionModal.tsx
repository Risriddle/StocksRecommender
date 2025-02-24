

import React, { useEffect, useState } from "react";
import { Stock } from '@/types/stock';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react"


interface StockActionModalProps {
  stock: Stock;
  isPresent: boolean;
  onClose: () => void;
  onConfirm: (portfolioId: string) => void; // Modified to accept portfolioId
  userId: string;
  status: string;
}

const StockActionModal: React.FC<StockActionModalProps> = ({
  stock,
  isPresent,
  onClose,
  onConfirm,
  userId,
  status
}) => {

  const [portfolios, setPortfolios] = useState<{ _id: string; name: string }[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
 

  // ... rest of your state and useEffect code ...
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
        } finally {
          setIsFetching(false);
        }
      };
      fetchPortfolios();
    }
  }, [status, userId]);

  const handleConfirm = async () => {
    if (!selectedPortfolio) return;
    setIsLoading(true);
    
    try {
      // Call the parent's onConfirm with the selected portfolio ID
      await onConfirm(selectedPortfolio);
      onClose();
    } catch (error) {
      console.error("Error updating portfolio:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isPresent ? "Remove Stock from Portfolio" : "Add Stock to Portfolio"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                <span className="text-xl font-semibold">{stock.name}</span>
              </div>
              <div>
                {/* <h3 className="font-medium">{stock.name}</h3> */}
                <p className="text-sm text-muted-foreground">{stock.company}</p>
              </div>
            </div>

            {isFetching ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : portfolios.length > 0 ? (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Select Portfolio
                </label>
                <Select
                  value={selectedPortfolio}
                  onValueChange={setSelectedPortfolio}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a portfolio" />
                  </SelectTrigger>
                  <SelectContent>
                    {portfolios.map((portfolio) => (
                      <SelectItem key={portfolio._id} value={portfolio._id}>
                        {portfolio.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <p>No portfolios found.</p>
                <p className="text-sm mt-1">Create a portfolio to add stocks.</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant={isPresent ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={!selectedPortfolio || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isPresent ? "Removing..." : "Adding..."}
              </>
            ) : (
              isPresent ? "Remove Stock" : "Add Stock"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StockActionModal;


 

