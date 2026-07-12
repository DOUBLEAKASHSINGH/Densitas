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

      {/* Section 3: Our Architecture Flowchart */}
      <div className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Our Architecture</h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              A deeply integrated, low-latency pipeline built for extreme resilience.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            
            {/* Step 1 */}
            <div className="flex-1 w-full bg-slate-50 border border-slate-200 p-6 rounded-xl text-center relative shadow-sm">
              <Cpu className="mx-auto text-slate-700 mb-4" size={32} />
              <h4 className="font-bold text-slate-900 mb-2">1. Edge Sensors</h4>
              <p className="text-sm text-slate-500">C++ IoT nodes parse raw camera and LiDAR telemetry locally to ensure memory-safe operation.</p>
            </div>
            
            {/* Arrow */}
            <div className="hidden lg:flex flex-col items-center justify-center text-indigo-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>

            {/* Step 2 */}
            <div className="flex-1 w-full bg-slate-50 border border-slate-200 p-6 rounded-xl text-center relative shadow-sm">
              <Server className="mx-auto text-slate-700 mb-4" size={32} />
              <h4 className="font-bold text-slate-900 mb-2">2. FastAPI Backend</h4>
              <p className="text-sm text-slate-500">Asynchronous Python runtime ingests heavy JSON payloads and terminates secure MQTT/WSS bridges.</p>
            </div>

            {/* Arrow */}
            <div className="hidden lg:flex flex-col items-center justify-center text-indigo-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>

            {/* Step 3 */}
            <div className="flex-1 w-full bg-slate-50 border border-slate-200 p-6 rounded-xl text-center relative shadow-sm border-b-4 border-b-indigo-500">
              <Zap className="mx-auto text-indigo-600 mb-4" size={32} />
              <h4 className="font-bold text-slate-900 mb-2">3. Agent Orchestration</h4>
              <p className="text-sm text-slate-500">Density calculation, XGBoost prediction, and strict rule engines apply deterministic safety bounds.</p>
            </div>

            {/* Arrow */}
            <div className="hidden lg:flex flex-col items-center justify-center text-indigo-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>

            {/* Step 4 */}
            <div className="flex-1 w-full bg-indigo-600 border border-indigo-700 p-6 rounded-xl text-center relative shadow-lg">
              <Network className="mx-auto text-white mb-4" size={32} />
              <h4 className="font-bold text-white mb-2">4. React Dashboard</h4>
              <p className="text-sm text-indigo-100">Live WebSockets push autonomous alert payloads to the Tailwind UI for instant command execution.</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
