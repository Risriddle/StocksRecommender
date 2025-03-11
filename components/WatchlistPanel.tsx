
"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Plus, Eye, Trash2, Pencil, Loader2 } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Portfolio {
  _id: string
  name: string
  riskLevel: string
  description: string
  stockCount: number
  portfolioReturn: number
}

interface WatchlistPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: any[]
}

export default function WatchlistPanel({ open, onOpenChange, data }: WatchlistPanelProps) {
  const { data: session, status } = useSession()
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [currentPortfolio, setCurrentPortfolio] = useState<Portfolio | null>(null)
  const [newPortfolio, setNewPortfolio] = useState({
    name: "",
    riskLevel: "medium",
    description: "",
  })
  const router = useRouter()
  const userId = session?.user?.id

  const fetchPortfolios = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/portfolios/users/${userId}`)
      const data = await response.json()
      console.log(data, "data in watchlist panel")
      if (response.ok) {
        setPortfolios(data)
      }
    } catch (error) {
      console.error("Error fetching portfolios:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "authenticated" && userId) {
      fetchPortfolios()
    }
  }, [status, userId]) 

  const handleCreatePortfolio = async () => {
    if (!newPortfolio.name.trim()) return
    try {
      setLoading(true)
      const response = await fetch(`/api/portfolios/users/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newPortfolio, user_id: userId }),
      })

      const data = await response.json()
      if (data.success) {
        setPortfolios([...portfolios, data.portfolio])
        setNewPortfolio({ name: "", riskLevel: "medium", description: "" })
        setCreateDialogOpen(false)
      }
    } catch (error) {
      console.error("Error creating portfolio:", error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleDeletePortfolio = async (portfolioId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/portfolios/${portfolioId}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setPortfolios(portfolios.filter((portfolio) => portfolio._id !== portfolioId))
      }
    } catch (error) {
      console.error("Error deleting portfolio:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePortfolio = async () => {
    if (!currentPortfolio?.name.trim()) return
    try {
      setLoading(true)
      const response = await fetch(`/api/portfolios/${currentPortfolio._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...currentPortfolio, user_id: userId }),
      })
      if (response.ok) {
        setPortfolios(
          portfolios.map((portfolio) => (portfolio._id === currentPortfolio._id ? currentPortfolio : portfolio)),
        )
        setEditDialogOpen(false)
      }
    } catch (error) {
      console.error("Error updating portfolio:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange} >
        <SheetContent className="w-[400px] sm:w-[540px] p-0" side="right">
          <SheetHeader className="p-6 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-2xl font-bold">Watchlists</SheetTitle>
              <Button onClick={() => setCreateDialogOpen(true)} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Watchlist
              </Button>
            </div>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-5rem)]">
            <div className="p-6 space-y-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-muted-foreground">Loading watchlists...</p>
                </div>
              ) : portfolios.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No watchlists found. Create one to get started.</p>
                </div>
              ) : (
                portfolios.map((portfolio) => (
                  <Card key={portfolio._id} className="group relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl font-bold">{portfolio.name}</CardTitle>
                          <CardDescription className="text-base">{portfolio.stockCount} stocks</CardDescription>
                        </div>
                        <TooltipProvider>
                          <div className="flex items-center space-x-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => router.push(`/portfolios/${portfolio._id}`)}
                                >
                                  <Eye className="h-5 w-5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View Portfolio</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setCurrentPortfolio(portfolio)
                                    setEditDialogOpen(true)
                                  }}
                                >
                                  <Pencil className="h-5 w-5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit Portfolio</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => handleDeletePortfolio(portfolio._id)}>
                                  <Trash2 className="h-5 w-5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete Portfolio</TooltipContent>
                            </Tooltip>
                          </div>
                        </TooltipProvider>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-base">
                          Returns:
                          <span
                            className={
                              portfolio.portfolioReturn >= 0
                                ? "text-green-500 font-semibold"
                                : "text-red-500 font-semibold"
                            }
                          >
                            {" "}
                            {portfolio.portfolioReturn}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              router.push(`/portfolios/${portfolio._id}/manage`)
                            }}
                          >
                            Manage Stocks
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
    
        </SheetContent>
      </Sheet>

      {/* Create Portfolio Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Watchlist</DialogTitle>
            <DialogDescription>Create a new watchlist to track stocks.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newPortfolio.name}
                onChange={(e) => setNewPortfolio({ ...newPortfolio, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="risk">Risk Level</Label>
              <Select
                value={newPortfolio.riskLevel}
                onValueChange={(value) => setNewPortfolio({ ...newPortfolio, riskLevel: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select risk level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newPortfolio.description}
                onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePortfolio} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Portfolio Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Watchlist</DialogTitle>
            <DialogDescription>Make changes to your watchlist.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={currentPortfolio?.name || ""}
                onChange={(e) => setCurrentPortfolio((curr) => (curr ? { ...curr, name: e.target.value } : null))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-risk">Risk Level</Label>
              <Select
                value={currentPortfolio?.riskLevel || ""}
                onValueChange={(value) => setCurrentPortfolio((curr) => (curr ? { ...curr, riskLevel: value } : null))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select risk level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={currentPortfolio?.description || ""}
                onChange={(e) =>
                  setCurrentPortfolio((curr) => (curr ? { ...curr, description: e.target.value } : null))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePortfolio} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}