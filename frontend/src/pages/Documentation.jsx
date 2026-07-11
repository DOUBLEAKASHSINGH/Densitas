import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowLeft, BookOpen, Terminal, Code, Cpu } from 'lucide-react';

export default function Documentation() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 font-sans selection:bg-neon-cyan/30 flex flex-col relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none"></div>

      <nav className="flex justify-between items-center px-8 py-4 border-b border-gray-800 bg-[#111827]/80 backdrop-blur-md shrink-0 shadow-md z-[100]">
        <div className="flex items-center space-x-3">
          <Activity className="text-neon-cyan animate-pulse" size={26} />
          <h1 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-blue-500 uppercase">
            OptiFlow
          </h1>
        </div>
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm font-bold tracking-wider"
          >
            <ArrowLeft size={16} />
            <span>BACK</span>
          </button>
        </div>
      </nav>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="flex items-center space-x-3 mb-8">
            <BookOpen size={32} className="text-neon-cyan" />
            <h2 className="text-3xl font-bold text-white tracking-widest uppercase">System Architecture Cheat-Sheet</h2>
          </div>

          {/* Endpoints */}
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center"><Terminal size={20} className="mr-2 text-blue-400"/> Core Endpoints</h3>
            
            <div className="space-y-4">
              <div className="bg-[#0a0f1c] border border-gray-800 rounded p-4">
                <p className="text-sm text-gray-400 mb-2 font-bold tracking-wider">DATA INGESTION API</p>
                <div className="flex items-center space-x-4">
                  <span className="bg-green-500/20 text-green-400 font-mono text-sm px-2 py-1 rounded">POST</span>
                  <code className="text-neon-cyan font-mono text-sm">/api/v1/telemetry/ingest</code>
                </div>
                <p className="text-gray-400 text-sm mt-3 border-t border-gray-800 pt-2">
                  Accepts JSON payloads tracking <code className="text-white">zone_id</code>, <code className="text-white">headcount</code>, and <code className="text-white">timestamp</code>.
                </p>
              </div>

              <div className="bg-[#0a0f1c] border border-gray-800 rounded p-4">
                <p className="text-sm text-gray-400 mb-2 font-bold tracking-wider">REAL-TIME STREAM</p>
                <div className="flex items-center space-x-4">
                  <span className="bg-blue-500/20 text-blue-400 font-mono text-sm px-2 py-1 rounded">WS</span>
                  <code className="text-neon-cyan font-mono text-sm">/ws/dashboard/stream</code>
                </div>
                <p className="text-gray-400 text-sm mt-3 border-t border-gray-800 pt-2">
                  Broadcasts unified agent evaluation states every 2 seconds.
                </p>
              </div>
            </div>
          </div>

          {/* Orchestration Matrix */}
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center"><Cpu size={20} className="mr-2 text-neon-amber"/> Orchestration Matrix</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0a0f1c] border border-gray-800 rounded p-4 hover:border-gray-600 transition-colors">
                <h4 className="text-neon-cyan font-bold font-mono mb-2">DensityAgent</h4>
                <p className="text-sm text-gray-400">Calculates current volume profiles based on raw ingested telemetry.</p>
              </div>
              
              <div className="bg-[#0a0f1c] border border-gray-800 rounded p-4 hover:border-gray-600 transition-colors">
                <h4 className="text-blue-400 font-bold font-mono mb-2">PredictionAgent</h4>
                <p className="text-sm text-gray-400">Runs an XGBoost regressor window looking 5 minutes ahead.</p>
              </div>
              
              <div className="bg-[#0a0f1c] border border-gray-800 rounded p-4 hover:border-gray-600 transition-colors">
                <h4 className="text-neon-amber font-bold font-mono mb-2">DecisionAgent</h4>
                <p className="text-sm text-gray-400">Executes structural responses based on predefined safety thresholds.</p>
              </div>
              
              <div className="bg-[#0a0f1c] border border-gray-800 rounded p-4 hover:border-gray-600 transition-colors">
                <h4 className="text-green-400 font-bold font-mono mb-2">AlertAgent</h4>
                <p className="text-sm text-gray-400">Packages telemetry updates and routes instructions over WebSockets.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}
