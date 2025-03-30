"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Send, CheckCircle } from "lucide-react"

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubscribed(true)
      setEmail("")

      toast({
        title: "Successfully subscribed!",
        description: "You'll receive our next stock insights directly to your inbox.",
      })
    }, 1500)
  }

  if (isSubscribed) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg">
        <CheckCircle className="h-12 w-12 text-green-600 mb-2" />
        <h3 className="text-xl font-bold text-green-800">Thank You for Subscribing!</h3>
        <p className="text-green-700 mb-1">You&apos;ll receive our weekly 10xStx insights directly to your inbox.</p>
        <p className="text-xs text-green-600">Including curated portfolios, stocks to track, and detailed analysis.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
      <Input
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-grow bg-white/80 border-0"
      />
      <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
        {isSubmitting ? (
          "Subscribing..."
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" /> Subscribe
          </>
        )}
      </Button>
    </form>
  )
}

