'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AuditResultsProps {
  id: string;
}

const mockAuditResult = {
  totalMonthlySavings: 640,
  totalAnnualSavings: 7680,
  perToolBreakdown: [
    {
      tool: 'Cursor',
      currentSpend: 80,
      recommendedAction: 'Downgrade to Pro',
      potentialSavings: 40,
      reason: 'You have 2 users on a Team plan. Downgrading to Pro saves $40/mo.'
    },
    {
      tool: 'Claude',
      currentSpend: 300,
      recommendedAction: 'Optimize API Usage',
      potentialSavings: 100,
      reason: 'High spend detected. Switching to Credex credits can save 20%.'
    },
    {
      tool: 'OpenAI API',
      currentSpend: 2500,
      recommendedAction: 'Switch to Credex credits',
      potentialSavings: 500,
      reason: 'Your spend is high enough to benefit from Credex discounted credits.'
    }
  ],
  showCredexCall: true
};

export default function AuditResults({ id }: AuditResultsProps) {
  const result = mockAuditResult; // Use mock data

  const [summary, setSummary] = useState<string>('Generating AI summary...');
  const [loading, setLoading] = useState<boolean>(true);

  const isHighSavings = result.totalMonthlySavings > 500;
  const isOptimal = result.totalMonthlySavings < 100;

  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await fetch('/api/summary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currentSpend: result.perToolBreakdown.reduce((acc, item) => acc + item.currentSpend, 0),
            potentialSavings: result.totalMonthlySavings,
            recommendations: result.perToolBreakdown.map(item => `- ${item.tool}: ${item.recommendedAction} (${item.reason})`).join('\n')
          }),
        });
        const data = await response.json();
        setSummary(data.summary);
      } catch (error) {
        console.error('Failed to fetch summary:', error);
        setSummary('Failed to load AI summary. Please check your network or API key.');
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, [id]);

  return (
    <div className="min-h-screen bg-black text-white font-sans p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl mt-12 mb-8 flex justify-between items-center">
        <Link href="/" className="text-zinc-500 hover:text-white transition flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Form
        </Link>
        <span className="text-zinc-600 text-sm">Audit ID: {id}</span>
      </div>

      {/* Hero Section */}
      <div className="w-full max-w-4xl bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-zinc-800 p-8 mb-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10 opacity-50" />
        
        <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-2">Total Potential Savings</h2>
        
        {isOptimal ? (
          <div>
            <div className="text-5xl font-extrabold text-green-500 mb-4">$0</div>
            <p className="text-xl text-zinc-300 font-medium">You’re spending well.</p>
            <p className="text-zinc-500 mt-2">Your stack is already optimized for your team size.</p>
          </div>
        ) : (
          <div>
            <div className="text-7xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-4">
              ${result.totalMonthlySavings.toLocaleString()}/mo
            </div>
            <div className="text-xl text-zinc-400">
              That's <span className="text-white font-semibold">${result.totalAnnualSavings.toLocaleString()}</span> per year left on the table.
            </div>
          </div>
        )}

        {/* AI Summary */}
        <div className="mt-8 pt-6 border-t border-zinc-800 text-left">
          <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-2">AI Summary</h3>
          <p className={`text-zinc-300 text-sm leading-relaxed ${loading ? 'animate-pulse' : ''}`}>
            {summary}
          </p>
        </div>
      </div>

      {/* Credex CTA for high savings */}
      {isHighSavings && (
        <div className="w-full max-w-4xl bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between shadow-lg shadow-purple-600/20">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h3 className="text-xl font-bold text-white mb-1">Claim Your Savings with Credex</h3>
            <p className="text-purple-100 text-sm">We can help you secure the same tools at a massive discount.</p>
          </div>
          <button className="px-6 py-3 bg-white text-purple-700 font-bold rounded-lg hover:bg-zinc-100 transition transform hover:scale-[1.02] active:scale-[0.98]">
            Book a Consultation
          </button>
        </div>
      )}

      {/* Breakdown */}
      <div className="w-full max-w-4xl space-y-4 mb-12">
        <h3 className="text-xl font-bold text-white mb-4">Per-Tool Breakdown</h3>
        
        {result.perToolBreakdown.map((item, index) => (
          <div key={index} className="bg-zinc-900/30 backdrop-blur-sm rounded-xl border border-zinc-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-lg">{item.tool}</span>
                <span className="text-sm text-zinc-500">Current: ${item.currentSpend}/mo</span>
              </div>
              <div className="text-zinc-400 text-sm">{item.reason}</div>
            </div>
            
            <div className="flex flex-col md:items-end gap-1">
              <div className="text-sm font-medium text-zinc-500">Recommended Action</div>
              <div className={`font-semibold ${item.potentialSavings > 0 ? 'text-pink-500' : 'text-zinc-400'}`}>
                {item.recommendedAction}
              </div>
              {item.potentialSavings > 0 && (
                <div className="text-sm text-green-500 font-medium">Save ${item.potentialSavings}/mo</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Share Button Placeholder */}
      <div className="w-full max-w-4xl text-center">
        <button className="px-6 py-3 bg-zinc-800 text-white font-medium rounded-lg hover:bg-zinc-700 transition inline-flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
          Share This Report
        </button>
      </div>
    </div>
  );
}
