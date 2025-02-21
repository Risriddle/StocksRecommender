
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { debounce } from "lodash";

import { Eye, Pencil, Trash, Check, X } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

import { useSession } from "next-auth/react";

const MAX_PORTFOLIOS = 5;

export default function PortfolioManagement() {
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<any>(null);
  const [stocks, setStocks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
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


  useEffect(() => {
    loadPortfolios();

  }, []);

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel(); 
  }, [searchQuery]);

  const loadPortfolios = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/portfolios');
      const data = await response.json();
      setPortfolios(data || []);
    } catch (error) {
      console.error('Error loading portfolios:', error);
    }
    finally{
      setLoading(false);
    }
  };




const createPortfolio = async () => {
  if (!newPortfolioName.trim() && !newPortfolioRisk.trim() && !newPortfolioDescription.trim()) return;

  if (portfolios.length >= MAX_PORTFOLIOS) {
    console.error(`Cannot create more than ${MAX_PORTFOLIOS} portfolios.`);
    return;
  }

  // Get userId from session
  const userId = session?.user?.id; 
  console.log(session,"------------------------------")
console.log(userId,"user id in create portfoliossssssssss")
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
    console.log(result, "create portfolio result");

    if (response.ok) {
      loadPortfolios();
      setNewPortfolioName("");
      setNewPortfolioRisk("")
      setNewPortfolioDescription("")

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
      setSearchResults([])
      setSearchQuery("")
    } catch (error) {
      console.error('Error adding stock:', error);
      
    }
  };
  const searchStocks = async (searchQuery: string) => {
        if (!searchQuery.trim()) return;
      
        try {
          const response = await fetch(`/api/admin/portfolios/stocks/search?query=${encodeURIComponent(searchQuery)}`);
          // const response = await fetch(` https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(searchQuery)}&apikey=${process.env.NEXT_PUBLIC_API_KEY}`);
           if (!response.ok) throw new Error("Failed to search stocks");
          
          const result = await response.json();
          console.log(result,"======",response,"searchhhhhhhhh")
          setSearchResults(result.stocks || []);
        } catch (error) {
          console.error("Error searching stocks ❌", error);
          setSearchResults([]);
        }
      };

      
      // Debounce API call
      const debouncedSearch = debounce((searchQuery:string) => {
        searchStocks(searchQuery);
      }, 500); // 500ms delay
      

        const deleteStock = async (stockId: string) => {
    if (!selectedPortfolio) return;
  console.log(stockId,"stockId in delete stockkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
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
    if (!selectedPortfolio) {
      setPendingStock(stock);
      setShowNewPortfolioDialog(true);
    } else {
      addStockToPortfolio(selectedPortfolio, stock);
    }
  };

    const handleViewStocks = (portfolio: any) => {
    setSelectedPortfolio(portfolio);
    loadStocks(portfolio._id);
    setIsDialogOpen(true);
  };


  const handleViewPortfolio=async(portfolio:any)=>{
          router.push(`/portfolios/${portfolio._id}`)
  }


  const handleDeletePortfolio = async (portfolioId:string) => {
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
  


const handleUpdatePortfolio = async (portfolioId:string) => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <Card>
          <CardHeader>
            <CardTitle>Search and Add Stocks</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
          
            <Input
    type="text"
    placeholder="Search stocks"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
            {/* <Button onClick={searchStocks}>Search</Button> */}
            <Button onClick={() => searchStocks(searchQuery

            )}>Search</Button>

            <select className="border p-2" onChange={(e) => setSelectedPortfolio(portfolios.find(p => p._id == e.target.value))}>
              <option value="">Select Portfolio To Add the Stock To</option>
              {portfolios.map(portfolio => (
                <option key={portfolio._id} value={portfolio._id}>{portfolio.name}</option>
              ))}
            </select>
            {searchResults.length === 0 && searchQuery.length > 1 && (
          <div className="text-center mt-4">
            <p className="text-red-400">No stocks found. Consider adding new stocks.</p>
            <Button onClick={() => router.push('/admin/stocks')} className="mt-2 bg-white hover:bg-gray-100 text-black px-4 py-2 rounded-lg">Go to Add Stocks</Button>
          </div>
        )}
            {searchResults.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stock Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.map((stock) => (
                    <TableRow key={stock._id}>
                      <TableCell>{stock.name}</TableCell>
                      <TableCell>{stock.current_price}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => handleAddStock(stock)}>
                          Add to Portfolio
                        </Button>
                         
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      <Dialog open={showNewPortfolioDialog} onOpenChange={setShowNewPortfolioDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>No Portfolio Selected</DialogTitle>
          </DialogHeader>
          <p>You haven&apos;t selected a portfolio. Would you like to create a new one for this stock?</p>
          <Input
            type="text"
            placeholder="New Portfolio Name"
            value={newPortfolioName}
            onChange={(e) => setNewPortfolioName(e.target.value)}
          />
          <Button onClick={createPortfolio}>Create & Add Stock</Button>
        </DialogContent>
      </Dialog>
             <Card>
        <CardHeader>
           <CardTitle>Standard Portfolios</CardTitle>
         </CardHeader>
        <CardContent>
           <Table>
             <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                 
                 <TableHead>Actions</TableHead>
               </TableRow>
             </TableHeader>
             
<TableBody>
  {Array.isArray(portfolios) &&
    portfolios.map((portfolio) => (
      <TableRow key={portfolio._id}>
        {/* Portfolio Name with Inline Editing */}
        <TableCell>
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


        {/* View & Manage Stocks Button */}
        <TableCell>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewStocks(portfolio)}
          >
            View & Manage Stocks
          </Button>
        </TableCell>

        {/* Action Buttons (View, Edit, Delete) */}
        <TableCell className="flex gap-2">
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
        </CardContent>
      </Card>

      {selectedPortfolio && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Stocks in {selectedPortfolio.name}</DialogTitle>
              <DialogClose />
            </DialogHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stock Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stocks.map((stock) => (
                  <TableRow key={stock._id}>
                    <TableCell>{stock.name}</TableCell>
                    <TableCell className="text-green-500">${stock.current_price}</TableCell>
                    <TableCell>
                      <Button variant="destructive" size="sm" onClick={() => deleteStock(stock.stock_id)}>
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}










