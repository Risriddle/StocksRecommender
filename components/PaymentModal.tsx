'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
  }
  
  export default function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
   const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const handlePayment = () => {
    console.log(`Processing payment of $${amount} via ${paymentMethod}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>Enter payment details below.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="credit_card">Credit Card</SelectItem>
              <SelectItem value="paypal">PayPal</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handlePayment} disabled={!amount || !paymentMethod}>Pay Now</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
