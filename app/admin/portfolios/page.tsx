'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { debounce } from "lodash";

import { Eye, Pencil, Trash, Check, X, Search } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

import { useSession } from "next-auth/react";
import calculateStockReturns from '@/lib/calculateReturns';

const MAX_PORTFOLIOS = 5;

export default function PortfolioManagement() {
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<any>(null);
  const [stocks, setStocks] = useState<any[]>([]);
  const [allStocks, setAllStocks] = useState<any[]>([]);
  const [displayedStocks, setDisplayedStocks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const [newPortfolioRisk, setNewPortfolioRisk] = useState('');
  const [newPortfolioDescription, setNewPortfolioDescription] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showNewPortfolioDialog, setShowNewPortfolioDialog] = useState(false);
  const [pendingStock, setPendingStock] = useState<any>(null);
  const router = useRouter();
  const [updatedName, setUpdatedName] = useState<string>("");
  const [editId, setEditId] = useState<string | null>(null);
  const { data: session } = useSession(); 
  const [loading, setLoading] = useState(false);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [stockToAdd, setStockToAdd] = useState<any>(null);
  const [stocksLoading, setStocksLoading] = useState(false);

  useEffect(() => {
    loadPortfolios();
    loadAllStocks();
  }, []);

  // Filter stocks when search query changes
  useEffect(() => {
    filterStocks(searchQuery);
  }, [searchQuery, allStocks]);

  const loadPortfolios = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/portfolios');
      const data = await response.json();
      setPortfolios(data || []);
    } catch (error) {
      console.error('Error loading portfolios:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllStocks = async () => {
    try {
      setStocksLoading(true);
      const response = await fetch('/api/stocks');
      if (!response.ok) throw new Error("Failed to fetch stocks");
      
      const data = await response.json();
      setAllStocks(data || []);
      setDisplayedStocks(data || []);
    } catch (error) {
      console.error('Error loading all stocks:', error);
    } finally {
      setStocksLoading(false);
    }
  };

  // Filter stocks locally based on search query
  const filterStocks = (query: string) => {
    if (!query.trim()) {
      setDisplayedStocks(allStocks);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = allStocks.filter(stock => 
      stock.name?.toLowerCase().includes(lowercaseQuery) ||
      stock.company?.toLowerCase().includes(lowercaseQuery) ||
      stock.industry?.toLowerCase().includes(lowercaseQuery) ||
      stock.exchange?.toLowerCase().includes(lowercaseQuery)
    );
    
    setDisplayedStocks(filtered);
  };

  const createPortfolio = async () => {
    if (!newPortfolioName.trim()) return;

    if (portfolios.length >= MAX_PORTFOLIOS) {
      console.error(`Cannot create more than ${MAX_PORTFOLIOS} portfolios.`);
      return;
    }

    // Get userId from session
    const userId = session?.user?.id; 
    if (!userId) {
      console.error("User ID not found. Please log in.");
      return;
    }

    try {
      const response = await fetch("/api/admin/portfolios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId, // Send user_id
          name: newPortfolioName,
          riskLevel: newPortfolioRisk,
          description: newPortfolioDescription,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        loadPortfolios();
        setNewPortfolioName("");
        setNewPortfolioRisk("");
        setNewPortfolioDescription("");
        setShowNewPortfolioDialog(false);

        if (pendingStock) {
          addStockToPortfolio(result.portfolio, pendingStock);
          setPendingStock(null);
        }
      } else {
        console.error("Error creating portfolio:", result.message);
      }
    } catch (error) {
      console.error("Error creating portfolio:", error);
    }
  };

  const loadStocks = async (portfolioId: number) => {
    try {
      const response = await fetch(`/api/admin/portfolios/${portfolioId}/stocks`);
      if (!response.ok) throw new Error("Failed to fetch stocks");
  
      const stocks = await response.json();
      setStocks(stocks || []);
    } catch (error) {
      console.error("Error fetching stocks ❌", error);
      setStocks([]);
    }
  };

  const addStockToPortfolio = async (portfolio: any, stock: any) => {
    if (!portfolio) return;
  
    try {
      const response = await fetch(`/api/admin/portfolios/${portfolio._id}/stocks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: stock.name,
          stockId: stock._id,
          price: stock.current_price,
        }),
      });

      if (!response.ok) throw new Error('Failed to add stock');
     
      await loadStocks(portfolio._id);
      setShowAddStockModal(false);
      setStockToAdd(null);
    } catch (error) {
      console.error('Error adding stock:', error);
    }
  };

  const deleteStock = async (stockId: string) => {
    if (!selectedPortfolio) return;
    try {
      const response = await fetch(`/api/admin/portfolios/${selectedPortfolio._id}/stocks`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ stockId }) // Sending stockId in the request body
      });
    
      if (!response.ok) throw new Error("Failed to delete stock");
  
      await loadStocks(selectedPortfolio._id);
    } catch (error) {
      console.error("Error deleting stock ❌", error);
    }
  };

  const handleAddStock = (stock: any) => {
    setStockToAdd(stock);
    setShowAddStockModal(true);
  };

  const confirmAddStock = () => {
    if (!selectedPortfolio && stockToAdd) {
      setPendingStock(stockToAdd);
      setShowNewPortfolioDialog(true);
      setShowAddStockModal(false);
    } else if (selectedPortfolio && stockToAdd) {
      addStockToPortfolio(selectedPortfolio, stockToAdd);
    }
  };

  const handleViewStocks = (portfolio: any) => {
    setSelectedPortfolio(portfolio);
    loadStocks(portfolio._id);
    setIsDialogOpen(true);
  };

  const handleViewPortfolio = async (portfolio: any) => {
    router.push(`/portfolios/${portfolio._id}`);
  };

  const handleDeletePortfolio = async (portfolioId: string) => {
    if (!portfolioId) return;
  
    try {
      const response = await fetch(`/api/admin/portfolios`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: portfolioId }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        loadPortfolios(); // Refresh portfolios after deletion
        console.log('Portfolio deleted successfully');
      } else {
        console.error('Error deleting portfolio:', result.message);
      }
    } catch (error) {
      console.error('Error deleting portfolio:', error);
    }
  };
  
  const handleUpdatePortfolio = async (portfolioId: string) => {
    if (!updatedName.trim()) return;

    try {
      const response = await fetch('/api/admin/portfolios', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: portfolioId,
          name: updatedName,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        loadPortfolios(); 
        setEditId(null);
        console.log('Portfolio updated successfully');
      } else {
        console.error('Error updating portfolio:', result.message);
      }
    } catch (error) {
      console.error('Error updating portfolio:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Button onClick={() => router.push('/admin')}>Back to Admin Panel</Button>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        )}
        <Card>
          <CardHeader>
            <CardTitle>Create New Portfolio</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            <Input
              type="text"
              placeholder="Portfolio Name"
              value={newPortfolioName}
              onChange={(e) => setNewPortfolioName(e.target.value)}
              disabled={portfolios.length >= MAX_PORTFOLIOS}
            />
            <Input
              type="text"
              placeholder="Portfolio Risk Level"
              value={newPortfolioRisk}
              onChange={(e) => setNewPortfolioRisk(e.target.value)}
              disabled={portfolios.length >= MAX_PORTFOLIOS}
            />
            <Input
              type="text"
              placeholder="Portfolio Description"
              value={newPortfolioDescription}
              onChange={(e) => setNewPortfolioDescription(e.target.value)}
              disabled={portfolios.length >= MAX_PORTFOLIOS}
            />
            <Button onClick={createPortfolio} disabled={portfolios.length >= MAX_PORTFOLIOS}>Create</Button>
          </CardContent>
        </Card>
      </div>

      {/* All Stocks Section with Search Bar */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Available Stocks</CardTitle>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search by name, company, industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {stocksLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500"></div>
            </div>
          ) : displayedStocks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-2">No stocks found matching your search criteria</p>
              {allStocks.length === 0 && (
                <>
                  <p className="text-red-400 mb-2">No stocks have been added to the system yet</p>
                  <Button onClick={() => router.push('/admin/stocks')} className="mt-2">
                    Add New Stocks
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white text-black z-10">
                  <TableRow>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Exchange</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedStocks.map((stock) => (
                    <TableRow key={stock._id}>
                      <TableCell>{stock.company}</TableCell>
                      <TableCell>{stock.name}</TableCell>
                      <TableCell>{stock.industry}</TableCell>
                      <TableCell>{stock.exchange}</TableCell>
                      <TableCell className='text-green-500'>{stock.current_price}</TableCell>
                      <TableCell>{stock.currency}</TableCell>
                      <TableCell>{stock.status}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleAddStock(stock)}
                        >
                          Add to Portfolio
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Portfolios Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Portfolios</CardTitle>
        </CardHeader>
        <CardContent>
          {portfolios.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500">You haven&apos;t created any portfolios yet</p>
              <p className="text-sm mt-2">Create a portfolio above to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(portfolios) &&
                  portfolios.map((portfolio) => (
                    <TableRow key={portfolio._id}>
                      {/* Portfolio Name with Inline Editing */}
                      <TableCell className='text-base'>
                        {editId === portfolio._id ? (
                          <Input
                            type="text"
                            value={updatedName}
                            onChange={(e) => setUpdatedName(e.target.value)}
                            placeholder="Enter new name"
                            autoFocus
                          />
                        ) : (
                          portfolio.name
                        )}
                      </TableCell>
                      
                      <TableCell>{portfolio.riskLevel || "N/A"}</TableCell>
                      <TableCell>{portfolio.description || "N/A"}</TableCell>

                      {/* Action Buttons */}
                      <TableCell className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewStocks(portfolio)}
                        >
                          View Stocks
                        </Button>
                        
                        {/* View Portfolio */}
                        <Button variant="ghost" size="icon" onClick={() => handleViewPortfolio(portfolio)}>
                          <Eye className="h-4 w-4" />
                        </Button>

                        {/* Update Portfolio - Toggle Editing Mode */}
                        {editId === portfolio._id ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleUpdatePortfolio(portfolio._id)}
                            >
                              <Check className="h-4 w-4 text-green-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditId(null)}
                            >
                              <X className="h-4 w-4 text-gray-500" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditId(portfolio._id);
                              setUpdatedName(portfolio.name);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}

                        {/* Delete Portfolio */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeletePortfolio(portfolio._id)}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Stock to Portfolio Modal */}
      <Dialog open={showAddStockModal} onOpenChange={setShowAddStockModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Stock to Portfolio</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {stockToAdd && (
              <div className="mb-4">
                <p className="font-semibold">Selected Stock:</p>
                <p>{stockToAdd.company} ({stockToAdd.name})</p>
                <p className="text-green-500">Price: {stockToAdd.current_price} {stockToAdd.currency}</p>
              </div>
            )}
            <div className="mb-4">
              <p className="mb-2">Select a portfolio to add this stock to:</p>
              <select 
                className="w-full border p-2 rounded" 
                onChange={(e) => setSelectedPortfolio(portfolios.find(p => p._id === e.target.value))}
                value={selectedPortfolio?._id || ""}
              >
                <option value="">Select Portfolio</option>
                {portfolios.map(portfolio => (
                  <option key={portfolio._id} value={portfolio._id}>{portfolio.name}</option>
                ))}
              </select>
            </div>
            {!portfolios.length && (
              <p className="text-red-400 my-2">You don&apos;t have any portfolios. Create one first!</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddStockModal(false)}>Cancel</Button>
            <Button 
              onClick={confirmAddStock}
              disabled={!selectedPortfolio && portfolios.length > 0}
            >
              {portfolios.length === 0 ? "Create New Portfolio" : "Add to Portfolio"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create New Portfolio Dialog */}
      <Dialog open={showNewPortfolioDialog} onOpenChange={setShowNewPortfolioDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Portfolio</DialogTitle>
          </DialogHeader>
          <p>Create a new portfolio for this stock:</p>
          <Input
            type="text"
            placeholder="Portfolio Name"
            value={newPortfolioName}
            onChange={(e) => setNewPortfolioName(e.target.value)}
            className="mb-2"
          />
          <Input
            type="text"
            placeholder="Portfolio Risk Level"
            value={newPortfolioRisk}
            onChange={(e) => setNewPortfolioRisk(e.target.value)}
            className="mb-2"
          />
          <Input
            type="text"
            placeholder="Portfolio Description"
            value={newPortfolioDescription}
            onChange={(e) => setNewPortfolioDescription(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewPortfolioDialog(false)}>Cancel</Button>
            <Button onClick={createPortfolio}>Create & Add Stock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Stocks in Portfolio Dialog */}
      {selectedPortfolio && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Stocks in {selectedPortfolio.name}</DialogTitle>
              <DialogClose />
            </DialogHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stock Company</TableHead>
                    <TableHead>Stock Symbol</TableHead>
                    <TableHead>Stock Industry</TableHead>
                    <TableHead>Stock Exchange</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stocks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        No stocks in this portfolio yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    stocks.map((stock) => (
                      <TableRow key={stock._id}>
                        <TableCell>{stock.company}</TableCell>
                        <TableCell>{stock.name}</TableCell>
                        <TableCell>{stock.industry}</TableCell>
                        <TableCell>{stock.exchange}</TableCell>
                        <TableCell className="text-green-500">{stock.current_price}</TableCell>
                        <TableCell>{stock.currency}</TableCell>
                        <TableCell>{stock.status}</TableCell>
                        <TableCell>
                          <Button variant="destructive" size="sm" onClick={() => deleteStock(stock._id)}>
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}