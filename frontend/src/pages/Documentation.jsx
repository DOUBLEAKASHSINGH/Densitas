import React from 'react';
import { BookOpen, Terminal, Code, Cpu, Map, Play, ShieldAlert } from 'lucide-react';

export default function Documentation() {
  return (
    <div className="w-full min-h-full bg-white flex flex-col md:flex-row border-t border-slate-200">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 flex-shrink-0 p-6 overflow-y-auto hidden md:block">
        <div className="flex items-center space-x-2 mb-8 text-slate-900 font-bold text-lg">
          <BookOpen size={24} className="text-indigo-600" />
          <span>OptiFlow Docs</span>
        </div>
        
        <nav className="space-y-8">
          <div>
            <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">User Manual</h4>
            <ul className="space-y-3 text-sm font-medium text-slate-600">
              <li className="text-indigo-600 cursor-pointer flex items-center"><Play size={14} className="mr-2"/> Quick Start</li>
              <li className="hover:text-indigo-600 cursor-pointer transition-colors flex items-center"><Map size={14} className="mr-2"/> Map Navigation</li>
              <li className="hover:text-indigo-600 cursor-pointer transition-colors flex items-center"><ShieldAlert size={14} className="mr-2"/> Dispatching Units</li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">Architecture</h4>
            <ul className="space-y-3 text-sm font-medium text-slate-600">
              <li className="hover:text-indigo-600 cursor-pointer transition-colors">System Flowchart</li>
              <li className="hover:text-indigo-600 cursor-pointer transition-colors">WebSocket API</li>
              <li className="hover:text-indigo-600 cursor-pointer transition-colors">XGBoost ML Pipeline</li>
              <li className="hover:text-indigo-600 cursor-pointer transition-colors">Edge Constraints (C++)</li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-12 bg-white">
        <div className="max-w-4xl mx-auto space-y-16">
          
          {/* Header */}
          <section className="border-b border-slate-200 pb-10">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
              OptiFlow <span className="text-indigo-600">Documentation</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed font-light">
              Master the platform. From everyday operational guidelines in the User Manual to deep dives into our multi-agent architecture and XGBoost prediction pipelines.
            </p>
          </section>

          {/* User Manual Section */}
          <section>
            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center">
              <Play className="mr-3 text-indigo-600" size={32}/> User Manual
            </h2>
            
            <div className="space-y-8">
              {/* Manual Step 1 */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 relative overflow-hidden group hover:border-indigo-200 transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Map size={80} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 relative z-10">1. Connecting to Venues</h3>
                <p className="text-slate-600 leading-relaxed relative z-10">
                  Begin by searching for an active event on the <strong>Select Location</strong> screen. Our backend automatically scrapes live events from BookMyShow and maps them to our strict geographical boundaries. Select your event to initialize the real-time WebSocket connection and enter the Dashboard.
                </p>
              </div>

              {/* Manual Step 2 */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 relative overflow-hidden group hover:border-indigo-200 transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Activity size={80} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 relative z-10">2. Navigating the GIS Map</h3>
                <p className="text-slate-600 leading-relaxed relative z-10 mb-4">
                  The central map is a fully functional Geographic Information System (GIS). You will see:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-2 ml-2 relative z-10">
                  <li><strong>Blue Polygons:</strong> The exact real-world perimeter of the venue.</li>
                  <li><strong>Pulsing Heatmaps:</strong> Real-time crowd density percentages.</li>
                  <li><strong>Curved Evacuation Routes:</strong> When congestion hits 85%, segmented red lines will appear, guiding crowds down actual pedestrian walkways to the nearest exits.</li>
                </ul>
              </div>

              {/* Manual Step 3 */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 relative overflow-hidden group hover:border-indigo-200 transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <ShieldAlert size={80} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 relative z-10">3. Command & Dispatch</h3>
                <p className="text-slate-600 leading-relaxed relative z-10">
                  When the ML pipeline predicts a bottleneck, an incident alert will appear in the right-hand panel. Click <strong>Dispatch</strong> on an available security unit to immediately route them to the congested zone. The system will track their deployment status in real-time.
                </p>
              </div>
            </div>
          </section>

          {/* System Architecture Overview */}
          <section>
            <h2 className="text-3xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4">
              System Architecture Flowchart
            </h2>
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 w-full hover:shadow-2xl transition-shadow">
              <img src="/optiflow-architecture.png" alt="OptiFlow Architecture" className="w-full h-auto object-contain rounded-lg" />
              <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                <p className="text-sm text-indigo-900 leading-relaxed">
                  <strong>End-to-End Flow:</strong> The diagram above details our complete pipeline. Hardware sensors push edge telemetry to our cloud ingestion engine. The decoupled XGBoost model provides live inference, while the Multi-Agent orchestrator translates predictions into deterministic broadcast schemas over WebSocket for this React dashboard.
                </p>
              </div>
            </div>
          </section>

          {/* Machine Learning Pipeline */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-2 flex items-center">
              <Cpu className="mr-3 text-indigo-600" size={28}/> XGBoost Regression Pipeline
            </h2>
            <div className="prose prose-indigo max-w-none text-slate-600 leading-relaxed bg-slate-50 p-8 rounded-2xl border border-slate-200">
              <p className="mb-4">
                The core predictive power of OptiFlow lies in its globally loaded XGBoost Regression model. Rather than relying on simple linear extrapolation, the model ingests a 60-second rolling window of complex, non-linear human behavioral data (including <code className="bg-white px-2 py-0.5 rounded text-indigo-700 text-sm border border-slate-200 font-bold">flow_rate</code>, <code className="bg-white px-2 py-0.5 rounded text-indigo-700 text-sm border border-slate-200 font-bold">average_velocity</code>, and <code className="bg-white px-2 py-0.5 rounded text-indigo-700 text-sm border border-slate-200 font-bold">time_of_day</code> variance).
              </p>
              <p>
                By employing Gradient Boosted Decision Trees, the inference engine successfully maps these spatial vectors against historical anomalies, producing highly accurate forecasts of localized zone capacity exactly 5 minutes into the future. The data is aggressively scaled using <code className="bg-white px-2 py-0.5 rounded text-indigo-700 text-sm border border-slate-200 font-bold">StandardScaler</code> before inference.
              </p>
            </div>
          </section>

          {/* WebSocket Payload */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-2 flex items-center">
              <Terminal className="mr-3 text-indigo-600" size={28}/> Unified WebSocket Schema
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Upon successful evaluation by the Multi-Agent orchestrator, the <code className="bg-slate-100 px-2 py-0.5 rounded text-slate-800 text-sm border border-slate-200 font-bold">AlertAgent</code> broadcasts the finalized deterministic payload across the active WebSocket connections. The React client intercepts this strictly formatted JSON object to drive the UI.
            </p>
            
            <div className="bg-[#0d1117] rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
              <div className="flex items-center px-4 py-3 bg-[#161b22] border-b border-slate-800">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="ml-4 text-xs font-mono text-slate-400">wss://api.optiflow.io/stream</span>
              </div>
              <pre className="p-6 overflow-x-auto">
                <code className="text-sm font-mono text-indigo-300">
{`{
  "zone_id": "zone_c_south_pavilion",
  "timestamp": "2026-07-12T14:32:01Z",
  "metrics": {
    "current_occupancy_percent": 82.4,
    "predicted_5m_occupancy": 88.1,
    "flow_velocity_mps": 0.45
  },
  "deterministic_action": {
    "status_level": "CRITICAL",
    "dispatch_directive": "Deploy Guard Unit Alpha to Zone C",
    "led_signage_text": "ZONE C CONGESTED - PLEASE USE WEST EXITS"
  }
}`}
                </code>
              </pre>
            </div>
          </section>

          {/* Edge Constraint */}
          <section className="pb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-2 flex items-center">
              <Code className="mr-3 text-indigo-600" size={28}/> Edge Hardware Constraints (C++)
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              IoT sensors deployed at venue ingress points operate under strict memory limits. Our C++ edge telemetry parsers avoid namespace resolution overhead to maximize raw buffer parsing speed. Note the intentional absence of <code className="bg-slate-100 px-2 py-0.5 rounded text-slate-800 text-sm border border-slate-200 font-bold">std::</code> prefixes per architectural mandates.
            </p>
            
            <div className="bg-[#0d1117] rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
              <div className="flex items-center px-4 py-3 bg-[#161b22] border-b border-slate-800">
                <span className="text-xs font-mono text-slate-400">edge_telemetry_parser.cpp</span>
              </div>
              <pre className="p-6 overflow-x-auto">
                <code className="text-sm font-mono text-blue-300">
{`#include <iostream>
#include <string>

// Explicit namespace inclusion constraint
using namespace std;

void parseIncomingBuffer(string bufferPayload) {
    if (bufferPayload.empty()) {
        cout << "[EDGE] Buffer empty. Awaiting sensor ping." << endl;
        return;
    }
    
    // Immediate bitwise dispatch logic
    cout << "[EDGE] Packet received. Length: " << bufferPayload.length() << endl;
    cout << "[EDGE] Serializing to MQTT bridge..." << endl;
}`}
                </code>
              </pre>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
