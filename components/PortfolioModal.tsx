import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";


interface Portfolio {
  _id: string;
  name: string;
}

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolios: Portfolio[];
  onAdd: (portfolioIdOrName: string) => void;
}

export default function PortfolioModal({
  isOpen,
  onClose,
  portfolios,
  onAdd,
}: PortfolioModalProps) {
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>("");
  const [newPortfolioName, setNewPortfolioName] = useState<string>("");

  const handleAdd = () => {
    onAdd(selectedPortfolio || newPortfolioName);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">📂 Add to Portfolio</h2>

        <Select value={selectedPortfolio} onValueChange={setSelectedPortfolio}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an existing portfolio" />
          </SelectTrigger>
          <SelectContent>
            {portfolios.map((portfolio) => (
              <SelectItem key={portfolio._id} value={portfolio._id}>
                {portfolio.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="text-center my-3">OR</div>

        <Input
          placeholder="New portfolio name..."
          value={newPortfolioName}
          onChange={(e) => setNewPortfolioName(e.target.value)}
        />

        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={onClose} variant="outline">Cancel</Button>
          <Button onClick={handleAdd} disabled={!selectedPortfolio && !newPortfolioName}>
            Add Stock
          </Button>
        </div>
      </div>
    </div>
  );
}
