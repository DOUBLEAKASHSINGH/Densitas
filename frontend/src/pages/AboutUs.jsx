import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowLeft } from 'lucide-react';

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 font-sans selection:bg-neon-cyan/30 flex flex-col relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none"></div>

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

      <div className="flex-1 flex items-center justify-center p-8 z-10">
        <div className="max-w-3xl bg-[#111827] border border-gray-800 rounded-xl p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-cyan to-blue-500"></div>
          
          <h2 className="text-3xl font-bold text-white mb-6 tracking-widest uppercase">About Us</h2>
          
          <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
            <p>
              <strong className="text-neon-cyan">OptiFlow</strong> is an enterprise-grade spatial intelligence platform engineered to eliminate high-density venue bottlenecks, mitigate crowd crushes, and maximize concession throughput.
            </p>
            <p>
              By combining event-driven micro-agent processing with low-latency edge machine learning, OptiFlow converts raw camera and IoT telemetry into proactive safety and resource orchestration—keeping large-scale events fluid, efficient, and safe.
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
}
