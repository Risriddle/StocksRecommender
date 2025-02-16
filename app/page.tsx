import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TrendingUp, Shield, Target } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-to-b from-background to-secondary">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Smart Stock Recommendations</h1>
          <p className="text-xl mb-8 text-muted-foreground">
            Make informed investment decisions with our AI-powered stock analysis
          </p>
          <div className="flex gap-4 justify-center">
            {/* <Link href="/auth/signup">
              <Button size="lg">Get Started</Button>
            </Link> */}
            {/* <Link href="/stocks">
              <Button variant="outline" size="lg">View Recommendations</Button>
            </Link> */}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <TrendingUp className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Smart Analysis</h3>
              <p className="text-muted-foreground">
                Advanced algorithms analyze market trends and stock performance
              </p>
            </Card>
            <Card className="p-6">
              <Shield className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Risk Management</h3>
              <p className="text-muted-foreground">
                Comprehensive risk assessment for each recommendation
              </p>
            </Card>
            <Card className="p-6">
              <Target className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Portfolio Tracking</h3>
              <p className="text-muted-foreground">
                Create and monitor custom portfolios with real-time updates
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}