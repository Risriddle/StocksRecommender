
"use client"

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Shield, Target, ArrowRight, BarChart2, Users, Bell } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userRole = session?.user?.role;
  // Redirect authenticated users to the dashboard
  useEffect(() => {
    if (status === "authenticated") {
      if(userRole=="visitor"){ router.replace("/dashboard");}
      if(userRole=="admin"){ router.replace("/admin");}
    }
  }, [status, router]);


  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with CTA */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-secondary/20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            Smart Stock Recommendations
          </h1>
          <p className="text-xl mb-10 text-muted-foreground max-w-2xl mx-auto">
            Make informed investment decisions with our AI-powered stock analysis and personalized recommendations.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/auth/signup">
              <Button size="lg" className="px-8">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8">
              How It Works
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Platform</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2">
                <TrendingUp className="w-12 h-12 text-primary mb-4" />
                <CardTitle className="text-xl">Smart Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our advanced algorithms analyze market trends&comma; stock performance&comma; and economic indicators to provide intelligent recommendations.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/analysis" className="text-primary flex items-center text-sm">
                  Learn more <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </CardFooter>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2">
                <Shield className="w-12 h-12 text-primary mb-4" />
                <CardTitle className="text-xl">Risk Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get comprehensive risk assessments for each recommendation with clear metrics to help you make balanced decisions.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/risk" className="text-primary flex items-center text-sm">
                  Learn more <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </CardFooter>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2">
                <Target className="w-12 h-12 text-primary mb-4" />
                <CardTitle className="text-xl">Portfolio Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Create and monitor custom portfolios with real-time updates&comma; performance metrics, and automated alerts.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/portfolio" className="text-primary flex items-center text-sm">
                  Learn more <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">More Powerful Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start p-4">
              <BarChart2 className="w-8 h-8 text-primary mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Market Insights</h3>
                <p className="text-muted-foreground">Daily updates and in-depth analysis of market trends and key events.</p>
              </div>
            </div>
            <div className="flex items-start p-4">
              <Bell className="w-8 h-8 text-primary mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Price Alerts</h3>
                <p className="text-muted-foreground">Custom notifications when stocks hit your specified price targets.</p>
              </div>
            </div>
            <div className="flex items-start p-4">
              <Users className="w-8 h-8 text-primary mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Community Insights</h3>
                <p className="text-muted-foreground">See what stocks are trending among our community of investors.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-tr from-primary/10 to-secondary/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make Smarter Investment Decisions?</h2>
          <p className="text-lg mb-8 text-muted-foreground max-w-2xl mx-auto">
            Join thousands of investors who are already benefiting from our AI-powered stock recommendations.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="px-10">Get Started Now</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
