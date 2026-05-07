'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ToolUsage, AuditInput, runAudit } from '@/lib/audit-engine';
import { supabase } from '@/lib/supabase';

const AVAILABLE_TOOLS = [
  'Cursor', 'GitHub Copilot', 'Claude', 'ChatGPT', 
  'Anthropic API', 'OpenAI API', 'Gemini', 'Windsurf'
];

const USE_CASES = ['coding', 'writing', 'data', 'research', 'mixed'];

export default function SpendForm() {
  const router = useRouter();
  const [teamSize, setTeamSize] = useState<number>(1);
  const [useCase, setUseCase] = useState<string>('mixed');
  const [selectedTools, setSelectedTools] = useState<ToolUsage[]>([]);
  
  // State for current tool being added
  const [currentTool, setCurrentTool] = useState<string>('Cursor');
  const [currentPlan, setCurrentPlan] = useState<string>('Pro');
  const [currentSpend, setCurrentSpend] = useState<number>(20);
  const [currentSeats, setCurrentSeats] = useState<number>(1);
  const [email, setEmail] = useState<string>('');

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('auditFormState');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      setTeamSize(parsed.teamSize || 1);
      setUseCase(parsed.useCase || 'mixed');
      setSelectedTools(parsed.selectedTools || []);
    }
  }, []);

  // Save state to localStorage on change
  useEffect(() => {
    const stateToSave = { teamSize, useCase, selectedTools };
    localStorage.setItem('auditFormState', JSON.stringify(stateToSave));
  }, [teamSize, useCase, selectedTools]);

  const addTool = () => {
    const newTool: ToolUsage = {
      tool: currentTool,
      plan: currentPlan,
      monthlySpend: currentSpend,
      seats: currentSeats
    };
    setSelectedTools([...selectedTools, newTool]);
    // Reset inputs
    setCurrentSpend(20);
    setCurrentSeats(1);
  };

  const removeTool = (index: number) => {
    const updated = [...selectedTools];
    updated.splice(index, 1);
    setSelectedTools(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const auditInput: AuditInput = {
      tools: selectedTools,
      teamSize,
      useCase: useCase as any
    };

    console.log('Submitting audit:', auditInput);
    
    // Run audit engine
    const results = runAudit(auditInput);

    // Save to Supabase
    try {
      const { data, error } = await supabase
        .from('audits')
        .insert([
          {
            team_size: teamSize,
            use_case: useCase,
            tools: selectedTools,
            results: results,
            email: email
          }
        ])
        .select();

      if (error) {
        console.warn('Error saving audit:', error);
        alert('Failed to save audit. Proceeding to results anyway.');
        // Still proceed to a random ID for demo purposes if DB fails
        const mockId = Math.random().toString(36).substring(7);
        router.push(`/audit/${mockId}`);
      } else if (data && data[0]) {
        router.push(`/audit/${data[0].id}`);
      }
    } catch (err) {
      console.warn('Exception saving audit:', err);
      const mockId = Math.random().toString(36).substring(7);
      router.push(`/audit/${mockId}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-zinc-800 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
        Audit Your AI Spend
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Company Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Team Size</label>
            <input
              type="number"
              value={teamSize}
              onChange={(e) => setTeamSize(parseInt(e.target.value) || 1)}
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Primary Use Case</label>
            <select
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            >
              {USE_CASES.map((uc) => (
                <option key={uc} value={uc}>{uc.charAt(0).toUpperCase() + uc.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Tool Section */}
        <div className="bg-zinc-800/30 p-6 rounded-xl border border-zinc-800">
          <h3 className="text-lg font-semibold text-white mb-4">Add a Tool</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Tool</label>
              <select
                value={currentTool}
                onChange={(e) => setCurrentTool(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {AVAILABLE_TOOLS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Plan</label>
              <input
                type="text"
                value={currentPlan}
                onChange={(e) => setCurrentPlan(e.target.value)}
                placeholder="e.g. Pro, Team"
                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Monthly Spend ($)</label>
              <input
                type="number"
                value={currentSpend}
                onChange={(e) => setCurrentSpend(parseFloat(e.target.value) || 0)}
                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Seats</label>
              <input
                type="number"
                value={currentSeats}
                onChange={(e) => setCurrentSeats(parseInt(e.target.value) || 1)}
                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="1"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={addTool}
            className="mt-4 w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Add Tool
          </button>
        </div>

        {/* Selected Tools List */}
        {selectedTools.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Your Stack</h3>
            <div className="space-y-2">
              {selectedTools.map((tool, index) => (
                <div key={index} className="flex items-center justify-between bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
                  <div>
                    <span className="font-medium text-white">{tool.tool}</span>
                    <span className="text-sm text-zinc-400 ml-2">({tool.plan})</span>
                    <div className="text-sm text-zinc-500">{tool.seats} seats • ${tool.monthlySpend}/mo</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTool(index)}
                    className="text-zinc-500 hover:text-red-500 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Email Field */}
        <div className="bg-zinc-800/30 p-6 rounded-xl border border-zinc-800">
          <label className="block text-sm font-medium text-zinc-400 mb-2">Work Email (to save results)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={selectedTools.length === 0}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            selectedTools.length > 0
              ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white shadow-lg shadow-purple-600/20 transform hover:scale-[1.01] active:scale-[0.99]'
              : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
          }`}
        >
          Generate Audit Report
        </button>
      </form>
    </div>
  );
}
