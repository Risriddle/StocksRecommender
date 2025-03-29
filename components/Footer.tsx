"use client";

import { useState, useEffect } from "react";

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-slate-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm mr-2">
              10x
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-200 to-indigo-200 text-transparent bg-clip-text">
              10xStx
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">10xStx Insights</h3>
            <p className="text-sm text-slate-300">
              Advanced data analysis and AI-powered insights to help you track potential market opportunities.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Important Information</h3>
            <p className="text-sm text-slate-300">
              All content is for informational purposes only. We are not registered financial advisors. Our
              analysis is based on data and should not be considered as investment advice.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="text-sm text-slate-300 space-y-2">
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
              <li>Disclaimer</li>
              <li>Contact Us</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-400">
          <p>© {currentYear} 10xStx. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
