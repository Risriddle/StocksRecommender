'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function UserSettings() {
  const [profile, setProfile] = useState({
    username: 'john_doe',
    email: 'john@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    recommendationUpdates: true,
    portfolioSummary: false,
    marketNews: true,
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement profile update logic
    setMessage({ type: 'success', text: 'Profile updated successfully' });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement password change logic
    setMessage({ type: 'success', text: 'Password changed successfully' });
  };

  const handleNotificationUpdate = async () => {
    // Implement notification settings update logic
    setMessage({ type: 'success', text: 'Notification preferences updated' });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      {message && (
        <Alert variant={message.type === 'success' ? 'default' : 'destructive'}>
          {message.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="membership">Membership</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={profile.username}
                    onChange={(e) =>
                      setProfile({ ...profile, username: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                  />
                </div>
                <Button type="submit">Update Profile</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={profile.currentPassword}
                    onChange={(e) =>
                      setProfile({ ...profile, currentPassword: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={profile.newPassword}
                    onChange={(e) =>
                      setProfile({ ...profile, newPassword: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={profile.confirmPassword}
                    onChange={(e) =>
                      setProfile({ ...profile, confirmPassword: e.target.value })
                    }
                  />
                </div>
                <Button type="submit">Change Password</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Price Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts when stock prices change significantly
                  </p>
                </div>
                <Switch
                  checked={notifications.priceAlerts}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, priceAlerts: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Recommendation Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when stock recommendations change
                  </p>
                </div>
                <Switch
                  checked={notifications.recommendationUpdates}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, recommendationUpdates: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Portfolio Summary</Label>
                  <p className="text-sm text-muted-foreground">
                    Daily summary of your portfolio performance
                  </p>
                </div>
                <Switch
                  checked={notifications.portfolioSummary}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, portfolioSummary: checked })
                  }
                />
              </div>
              <Button onClick={handleNotificationUpdate}>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="membership">
          <Card>
            <CardHeader>
              <CardTitle>Membership Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-secondary rounded-lg">
                <p className="font-medium">Current Plan: Free</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Upgrade to Premium for advanced features and real-time data
                </p>
              </div>
              <Button className="w-full">Upgrade to Premium</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}