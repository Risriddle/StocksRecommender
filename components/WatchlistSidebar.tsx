
// import React, { useState, useEffect } from 'react';
// import { useSession } from "next-auth/react";
// import { Plus, Eye, Trash2, Pencil } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

// const WatchlistSidebar = () => {
//   const { data: session, status } = useSession();
//   const [portfolios, setPortfolios] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [editOpen, setEditOpen] = useState(false);
//   const [currentPortfolio, setCurrentPortfolio] = useState(null);
//   const [newPortfolio, setNewPortfolio] = useState({ name: '', riskLevel: 'medium', description: '' });
//   const router = useRouter();
//   const userId = session?.user?.id;

//   useEffect(() => {
//     if (status === 'authenticated' && userId) {
//       const fetchPortfolios = async () => {
//         try {
//           const response = await fetch(`/api/portfolios/users/${userId}`);
//           const data = await response.json();
//           if (response.ok) {
//             setPortfolios(data);
//           }
//         } catch (error) {
//           console.error('Error fetching portfolios:', error);
//         }
//       };
//       fetchPortfolios();
//     }
//   }, [status, userId]);

//   const handleCreatePortfolio = async () => {
//     if (!newPortfolio.name.trim()) return;
//     try {
//       const response = await fetch(`/api/portfolios/users/${userId}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ ...newPortfolio, user_id: userId }),
//       });

//       const data = await response.json();
//       if (data.success) {
//         setPortfolios([...portfolios, data.portfolio]);
//         setNewPortfolio({ name: '', riskLevel: 'medium', description: '' });
//         setOpen(false);
//       }
//     } catch (error) {
//       console.error('Error creating portfolio:', error);
//     }
//   };

//   const handleDeletePortfolio = async (portfolioId) => {
//     try {
//       const response = await fetch(`/api/portfolios/${portfolioId}`, {
//         method: 'DELETE',
//       });
//       if (response.ok) {
//         setPortfolios(portfolios.filter((portfolio) => portfolio._id !== portfolioId));
//       }
//     } catch (error) {
//       console.error('Error deleting portfolio:', error);
//     }
//   };

//   const handleUpdatePortfolio = async () => {
//     if (!currentPortfolio.name.trim()) return;
//     try {
//       const response = await fetch(`/api/portfolios/${currentPortfolio._id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({...currentPortfolio, user_id: userId}),
//       });
//       if (response.ok) {
//         setPortfolios(portfolios.map(portfolio => 
//           portfolio._id === currentPortfolio._id ? currentPortfolio : portfolio
//         ));
//         setEditOpen(false);
//       }
//     } catch (error) {
//       console.error('Error updating portfolio:', error);
//     }
//   };

//   return (
//     <div className="w-64 bg-white border-r border-gray-200 h-full">
//       <div className="p-4">
//         <h2 className="text-xl text-black font-semibold mb-4">User Portfolios</h2>
//         <button onClick={() => setOpen(true)} className="w-full bg-black text-white rounded-md py-2 px-4 text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
//           <Plus className="w-4 h-4" /> Create Portfolio
//         </button>
//         <div className="space-y-2 mt-4">
//           {portfolios.map((portfolio) => (
//             <div key={portfolio._id} className="flex items-center justify-between p-3 bg-black rounded-md transition-colors cursor-pointer">
//               <div className="flex flex-col text-white">
//                 <span className="font-medium">{portfolio.name}</span>
//                 <span className="text-sm">{portfolio.stockCount} stocks</span>
//                 <span className="text-sm text-green-300">Portfolio Returns: {portfolio.portfolioReturn}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <button onClick={() => router.push(`/portfolios/${portfolio._id}`)} className="p-1 text-white hover:text-gray-300">
//                   <Eye className="w-5 h-5" />
//                 </button>
//                 <button onClick={() => {
//                   setCurrentPortfolio(portfolio);
//                   setEditOpen(true);
//                 }} className="p-1 text-blue-400 hover:text-blue-600">
//                   <Pencil className="w-5 h-5" />
//                 </button>
//                 <button onClick={() => handleDeletePortfolio(portfolio._id)} className="p-1 text-red-500 hover:text-red-700">
//                   <Trash2 className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//       <Dialog open={open} onClose={() => setOpen(false)}>
//         <DialogTitle>Create Portfolio</DialogTitle>
//         <DialogContent>
//           <TextField label="Name" fullWidth value={newPortfolio.name} onChange={(e) => setNewPortfolio({ ...newPortfolio, name: e.target.value })} margin="dense" />
//           <TextField label="Risk Level" fullWidth value={newPortfolio.riskLevel} onChange={(e) => setNewPortfolio({ ...newPortfolio, riskLevel: e.target.value })} margin="dense" />
//           <TextField label="Description" fullWidth value={newPortfolio.description} onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })} margin="dense" multiline rows={3} />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpen(false)}>Cancel</Button>
//           <Button onClick={handleCreatePortfolio} color="primary">Create</Button>
//         </DialogActions>
//       </Dialog>
//       <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
//         <DialogTitle>Edit Portfolio</DialogTitle>
//         <DialogContent>
//           <TextField label="Name" fullWidth value={currentPortfolio?.name || ''} onChange={(e) => setCurrentPortfolio({ ...currentPortfolio, name: e.target.value })} margin="dense" />
//           <TextField label="Risk Level" fullWidth value={currentPortfolio?.riskLevel || ''} onChange={(e) => setCurrentPortfolio({ ...currentPortfolio, riskLevel: e.target.value })} margin="dense" />
//           <TextField label="Description" fullWidth value={currentPortfolio?.description || ''} onChange={(e) => setCurrentPortfolio({ ...currentPortfolio, description: e.target.value })} margin="dense" multiline rows={3} />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setEditOpen(false)}>Cancel</Button>
//           <Button onClick={handleUpdatePortfolio} color="primary">Update</Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default WatchlistSidebar;








import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { Plus, Eye, Trash2, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const WatchlistSidebar = () => {
  const { data: session, status } = useSession();
  const [portfolios, setPortfolios] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [currentPortfolio, setCurrentPortfolio] = useState(null);
  const [newPortfolio, setNewPortfolio] = useState({ name: '', riskLevel: 'medium', description: '' });
  const [sidebarWidth, setSidebarWidth] = useState(250); // Default width
  const router = useRouter();
  const userId = session?.user?.id;

  useEffect(() => {
    if (status === 'authenticated' && userId) {
      const fetchPortfolios = async () => {
        try {
          const response = await fetch(`/api/portfolios/users/${userId}`);
          const data = await response.json();
          if (response.ok) {
            setPortfolios(data);
          }
        } catch (error) {
          console.error('Error fetching portfolios:', error);
        }
      };
      fetchPortfolios();
    }
  }, [status, userId]);

  const handleCreatePortfolio = async () => {
        if (!newPortfolio.name.trim()) return;
        try {
          const response = await fetch(`/api/portfolios/users/${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...newPortfolio, user_id: userId }),
          });
    
          const data = await response.json();
          if (data.success) {
            setPortfolios([...portfolios, data.portfolio]);
            setNewPortfolio({ name: '', riskLevel: 'medium', description: '' });
            setOpen(false);
          }
        } catch (error) {
          console.error('Error creating portfolio:', error);
        }
      };
    
      const handleDeletePortfolio = async (portfolioId) => {
        try {
          const response = await fetch(`/api/portfolios/${portfolioId}`, {
            method: 'DELETE',
          });
          if (response.ok) {
            setPortfolios(portfolios.filter((portfolio) => portfolio._id !== portfolioId));
          }
        } catch (error) {
          console.error('Error deleting portfolio:', error);
        }
      };
    
      const handleUpdatePortfolio = async () => {
        if (!currentPortfolio.name.trim()) return;
        try {
          const response = await fetch(`/api/portfolios/${currentPortfolio._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({...currentPortfolio, user_id: userId}),
          });
          if (response.ok) {
            setPortfolios(portfolios.map(portfolio => 
              portfolio._id === currentPortfolio._id ? currentPortfolio : portfolio
            ));
            setEditOpen(false);
          }
        } catch (error) {
          console.error('Error updating portfolio:', error);
        }
      };
    










  // Handle resizing
  const handleMouseDown = (e) => {
    e.preventDefault();
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    setSidebarWidth(Math.max(200, e.clientX)); // Prevents sidebar from being too small
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="bg-white border-r border-gray-200 h-full relative" style={{ width: sidebarWidth }}>
        <div className="p-4">
          <h2 className="text-xl text-black font-semibold mb-4">User Portfolios</h2>
          <button onClick={() => setOpen(true)} className="w-full bg-black text-white rounded-md py-2 px-4 text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
            <Plus className="w-4 h-4" /> Create Portfolio
          </button>
          <div className="space-y-2 mt-4">
            {portfolios.map((portfolio) => (
              <div key={portfolio._id} className="flex items-center justify-between p-3 bg-black rounded-md transition-colors cursor-pointer">
                <div className="flex flex-col text-white">
                  <span className="font-medium">{portfolio.name}</span>
                  <span className="text-sm">{portfolio.stockCount} stocks</span>
                  <span className="text-sm text-green-300">Portfolio Returns: {portfolio.portfolioReturn}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => router.push(`/portfolios/${portfolio._id}`)} className="p-1 text-white hover:text-gray-300">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button onClick={() => {
                    setCurrentPortfolio(portfolio);
                    setEditOpen(true);
                  }} className="p-1 text-blue-400 hover:text-blue-600">
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDeletePortfolio(portfolio._id)} className="p-1 text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Drag Handle */}
        <div
          onMouseDown={handleMouseDown}
          className="absolute top-0 right-0 h-full w-2 cursor-ew-resize bg-gray-300 hover:bg-gray-500"
        />
      </div>

      {/* Dialogs for Creating and Editing Portfolios */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create Portfolio</DialogTitle>
        <DialogContent>
          <TextField label="Name" fullWidth value={newPortfolio.name} onChange={(e) => setNewPortfolio({ ...newPortfolio, name: e.target.value })} margin="dense" />
          <TextField label="Risk Level" fullWidth value={newPortfolio.riskLevel} onChange={(e) => setNewPortfolio({ ...newPortfolio, riskLevel: e.target.value })} margin="dense" />
          <TextField label="Description" fullWidth value={newPortfolio.description} onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })} margin="dense" multiline rows={3} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreatePortfolio} color="primary">Create</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Portfolio</DialogTitle>
        <DialogContent>
          <TextField label="Name" fullWidth value={currentPortfolio?.name || ''} onChange={(e) => setCurrentPortfolio({ ...currentPortfolio, name: e.target.value })} margin="dense" />
          <TextField label="Risk Level" fullWidth value={currentPortfolio?.riskLevel || ''} onChange={(e) => setCurrentPortfolio({ ...currentPortfolio, riskLevel: e.target.value })} margin="dense" />
          <TextField label="Description" fullWidth value={currentPortfolio?.description || ''} onChange={(e) => setCurrentPortfolio({ ...currentPortfolio, description: e.target.value })} margin="dense" multiline rows={3} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdatePortfolio} color="primary">Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default WatchlistSidebar;
