
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function StandardPortfoliosPage() {
  const [standardPortfolios, setStandardPortfolios] = useState<any[]>([]);

  useEffect(() => {
    getStandardPortfolios();
  }, []);

  const getStandardPortfolios = async () => {
    try {
      const response = await fetch('/api/admin/portfolios');
      const data = await response.json();
      console.log(data, 'standard portfoliosssssssssssssss');
      setStandardPortfolios(data || []);
    } catch (error) {
      console.error('Error loading portfolios:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-extrabold text-center">Standard Portfolios</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {standardPortfolios.map((portfolio) => (
          <Card key={portfolio._id} className="transition-transform transform hover:scale-105 shadow-lg border bg-white border-gray-200">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg text-black font-semibold">{portfolio.name}</CardTitle>
                  <p className="text-sm text-gray-500">Risk Level: <span className="font-medium">{portfolio.riskLevel}</span></p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{portfolio.description}</p>
              <Link href={`/portfolios/${portfolio._id}`}>
                <Button variant="outline" size="sm" className="w-full">Learn More</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

