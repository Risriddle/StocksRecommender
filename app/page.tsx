
"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Shield, Target, ArrowRight, BarChart2, Users, Bell, ChevronRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function Home() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const userRole = session?.user?.role

  // Redirect authenticated users to the dashboard
  useEffect(() => {
    if (status === "authenticated") {
      if (userRole == "visitor") {
        router.replace("/dashboard")
      }
      if (userRole == "admin") {
        router.replace("/admin")
      }
    }
  }, [status, router, userRole])

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section with CTA */}
      <section className="relative py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/20 z-0"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="container relative z-10 mx-auto px-4 text-center"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 leading-tight">
            Smart Stock Recommendations
          </h1>
          <p className="text-lg md:text-xl mb-10 text-muted-foreground max-w-2xl mx-auto">
            Make informed investment decisions with our AI-powered stock analysis and personalized recommendations.
          </p>
          <motion.div
            className="flex gap-4 justify-center flex-wrap"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { delay: 0.4, duration: 0.6 },
              },
            }}
          >
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="px-8 py-6 text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-center mb-16"
          >
            Why Choose Our Platform
          </motion.h2>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 md:gap-12"
          >
            <motion.div variants={fadeIn}>
              <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 border-t-4 border-primary/70 h-full">
                <CardHeader className="pb-2 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Smart Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our advanced algorithms analyze market trends&comma; stock performance&comma; and economic indicators to provide
                    intelligent recommendations.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/analysis" className="text-primary flex items-center text-sm font-medium group">
                    Learn more
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 border-t-4 border-primary/70 h-full">
                <CardHeader className="pb-2 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Risk Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Get comprehensive risk assessments for each recommendation with clear metrics to help you make
                    balanced decisions.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/risk" className="text-primary flex items-center text-sm font-medium group">
                    Learn more
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 border-t-4 border-primary/70 h-full">
                <CardHeader className="pb-2 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Portfolio Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Create and monitor custom portfolios with real-time updates&comma; performance metrics&comma; and automated
                    alerts.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/portfolio" className="text-primary flex items-center text-sm font-medium group">
                    Learn more
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="py-24 bg-gradient-to-br from-muted/30 to-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-secondary/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-center mb-16"
          >
            More Powerful Features
          </motion.h2>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-10"
          >
            <motion.div variants={fadeIn} className="bg-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <BarChart2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Market Insights</h3>
                  <p className="text-muted-foreground">
                    Daily updates and in-depth analysis of market trends and key events affecting your investments.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="bg-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <Bell className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Price Alerts</h3>
                  <p className="text-muted-foreground">
                    Custom notifications when stocks hit your specified price targets or significant market movements
                    occur.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="bg-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Community Insights</h3>
                  <p className="text-muted-foreground">
                    See what stocks are trending among our community of investors and gain valuable collective wisdom.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/20 z-0"></div>
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-background to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container relative z-10 mx-auto px-4 text-center"
        >
          <div className="max-w-3xl mx-auto bg-card/80 backdrop-blur-sm p-10 rounded-2xl shadow-2xl border border-muted">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Make Smarter Investment Decisions?</h2>
            <p className="text-lg mb-8 text-muted-foreground max-w-2xl mx-auto">
              Join thousands of investors who are already benefiting from our AI-powered stock recommendations.
            </p>
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="px-10 py-6 text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

