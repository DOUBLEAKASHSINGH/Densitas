import React from 'react';
import { Shield, Cpu, Activity, Zap, Server, Network } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="w-full min-h-full bg-white overflow-y-auto pb-20">
      {/* Section 1: Hero Header */}
      <div className="bg-slate-900 text-white py-24 px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-slate-900 to-black"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Securing the Future of Global Mass Gatherings.
          </h1>
          <p className="text-xl md:text-2xl text-indigo-200 leading-relaxed font-light">
            OptiFlow is the enterprise standard for predictive spatial intelligence, transforming raw edge telemetry into autonomous, life-saving crowd orchestration.
          </p>
        </div>
      </div>

      {/* Section 2: The Core Problem vs OptiFlow Advantage */}
      <div className="py-24 px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">The Core Problem</h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              High-density venues have historically relied on human observation, leading to delayed responses during critical cascading events.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Status Quo */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <Activity className="text-red-600" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">The Status Quo: Reactive Security</h3>
              <ul className="space-y-4 text-slate-600">
                <li className="flex items-start">
                  <span className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center mr-3 mt-0.5 text-xs font-bold text-slate-700">1</span>
                  <p>Security teams monitor hundreds of CCTV feeds manually, severely limiting spatial awareness.</p>
                </li>
                <li className="flex items-start">
                  <span className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center mr-3 mt-0.5 text-xs font-bold text-slate-700">2</span>
                  <p>Decisions are made only after a bottleneck or crush has already occurred.</p>
                </li>
                <li className="flex items-start">
                  <span className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center mr-3 mt-0.5 text-xs font-bold text-slate-700">3</span>
                  <p>Hardware endpoints are siloed and fail to communicate across zones in real-time.</p>
                </li>
              </ul>
            </div>
            
            {/* The OptiFlow Advantage */}
            <div className="bg-indigo-50 p-8 rounded-2xl shadow-sm border border-indigo-100">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-6">
                <Shield className="text-white" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-indigo-900 mb-4">The OptiFlow Advantage: Proactive AI</h3>
              <ul className="space-y-4 text-indigo-900">
                <li className="flex items-start">
                  <span className="h-6 w-6 rounded-full bg-indigo-200 flex items-center justify-center mr-3 mt-0.5 text-xs font-bold text-indigo-800">1</span>
                  <p>Autonomous edge-nodes parse spatial vectors instantly without human bottlenecking.</p>
                </li>
                <li className="flex items-start">
                  <span className="h-6 w-6 rounded-full bg-indigo-200 flex items-center justify-center mr-3 mt-0.5 text-xs font-bold text-indigo-800">2</span>
                  <p>XGBoost regression models forecast crowd density exactly 5 minutes into the future.</p>
                </li>
                <li className="flex items-start">
                  <span className="h-6 w-6 rounded-full bg-indigo-200 flex items-center justify-center mr-3 mt-0.5 text-xs font-bold text-indigo-800">3</span>
                  <p>Deterministic Rule Agents automatically dispatch personnel before capacity exceeds 85%.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
