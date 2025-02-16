
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation'; 

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const router = useRouter(); 

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    console.log("Users data:", data);
    setUsers(data);
  };

  const handleRoleChange = async (userId: string, role: string) => {
    await fetch(`/api/admin/users/${userId}/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
  });
  loadUsers();
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      loadUsers();
  }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Button onClick={() => router.push('/admin')}>Back to Admin Panel</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(value) => handleRoleChange(user._id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visitor">Visitor</SelectItem>
                        <SelectItem value="paid_user">Paid User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{user.created_at}</TableCell>
                  
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
