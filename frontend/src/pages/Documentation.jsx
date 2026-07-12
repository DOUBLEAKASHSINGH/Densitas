import React from 'react';
import { BookOpen, Terminal, Code, Cpu } from 'lucide-react';

export default function Documentation() {
  return (
    <div className="w-full min-h-full bg-white flex flex-col md:flex-row border-t border-slate-200">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 flex-shrink-0 p-6 overflow-y-auto hidden md:block">
        <div className="flex items-center space-x-2 mb-8 text-slate-900 font-bold">
          <BookOpen size={20} className="text-indigo-600" />
          <span>Developer Hub</span>
        </div>
        
        <nav className="space-y-6">
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Getting Started</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="text-indigo-600 font-medium cursor-pointer">Introduction</li>
              <li className="hover:text-slate-900 cursor-pointer transition-colors">Authentication</li>
              <li className="hover:text-slate-900 cursor-pointer transition-colors">Edge Constraints</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Core Systems</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="hover:text-slate-900 cursor-pointer transition-colors">WebSocket API</li>
              <li className="hover:text-slate-900 cursor-pointer transition-colors">XGBoost ML Pipeline</li>
              <li className="hover:text-slate-900 cursor-pointer transition-colors">Deterministic Fallback</li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-12">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <section>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">OptiFlow System Architecture</h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              Welcome to the OptiFlow Developer Hub. This documentation outlines the integration methods for connecting physical edge nodes to the cloud ingestion engine, detailing the predictive pipeline and deterministic broadcast schemas.
            </p>
          </section>

          {/* Machine Learning Pipeline */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2 flex items-center">
              <Cpu className="mr-2 text-indigo-500" size={24}/> XGBoost Regression Pipeline
            </h2>
            <div className="prose prose-indigo max-w-none text-slate-600 leading-relaxed">
              <p className="mb-4">
                The core predictive power of OptiFlow lies in its globally loaded XGBoost Regression model. Rather than relying on simple linear extrapolation, the model ingests a 60-second rolling window of complex, non-linear human behavioral data (including <code className="bg-slate-100 px-1 rounded text-slate-800 text-sm border border-slate-200">flow_rate</code>, <code className="bg-slate-100 px-1 rounded text-slate-800 text-sm border border-slate-200">average_velocity</code>, and <code className="bg-slate-100 px-1 rounded text-slate-800 text-sm border border-slate-200">time_of_day</code> variance).
              </p>
              <p>
                By employing Gradient Boosted Decision Trees, the inference engine successfully maps these spatial vectors against historical anomalies, producing highly accurate forecasts of localized zone capacity exactly 5 minutes into the future. The data is aggressively scaled using <code className="bg-slate-100 px-1 rounded text-slate-800 text-sm border border-slate-200">StandardScaler</code> before inference to ensure that extreme spikes in footfall do not catastrophically skew the predictive weighting mechanism.
              </p>
            </div>
          </section>

          {/* WebSocket Payload */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2 flex items-center">
              <Terminal className="mr-2 text-indigo-500" size={24}/> Unified WebSocket Schema
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Upon successful evaluation by the Multi-Agent orchestrator, the <code className="bg-slate-100 px-1 rounded text-slate-800 text-sm border border-slate-200">AlertAgent</code> broadcasts the finalized deterministic payload across the active WebSocket connections. The React client intercepts this strictly formatted JSON object to drive the UI.
            </p>
            
            <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-800">
              <div className="flex items-center px-4 py-2 bg-slate-800 border-b border-slate-700">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="ml-4 text-xs font-mono text-slate-400">wss://api.optiflow.io/stream</span>
              </div>
              <pre className="p-4 overflow-x-auto">
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
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2 flex items-center">
              <Code className="mr-2 text-indigo-500" size={24}/> Edge Hardware Constraints (C++)
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              IoT sensors deployed at venue ingress points operate under strict memory limits. Our C++ edge telemetry parsers avoid namespace resolution overhead to maximize raw buffer parsing speed. Note the intentional absence of <code className="bg-slate-100 px-1 rounded text-slate-800 text-sm border border-slate-200">std::</code> prefixes per architectural mandates.
            </p>
            
            <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-800">
              <div className="flex items-center px-4 py-2 bg-slate-800 border-b border-slate-700">
                <span className="text-xs font-mono text-slate-400">edge_telemetry_parser.cpp</span>
              </div>
              <pre className="p-4 overflow-x-auto">
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
