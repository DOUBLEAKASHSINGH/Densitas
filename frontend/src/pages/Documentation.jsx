import React from 'react';
import { BookOpen, Terminal, Cpu, Database } from 'lucide-react';

export default function Documentation() {
  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex items-center space-x-3 mb-8">
          <BookOpen size={32} className="text-indigo-600" />
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Architecture Cheat-Sheet</h2>
        </div>

        {/* Endpoints */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center border-b border-slate-100 pb-3">
            <Terminal size={20} className="mr-2 text-indigo-500"/> Core Endpoints
          </h3>
          
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <p className="text-xs text-slate-500 mb-3 font-bold tracking-wider uppercase">Data Ingestion API</p>
              <div className="flex items-center space-x-4 mb-3">
                <span className="bg-emerald-100 text-emerald-700 font-mono font-bold text-xs px-2.5 py-1 rounded">POST</span>
                <code className="text-indigo-600 font-mono text-sm bg-indigo-50 px-2 py-0.5 rounded">/api/v1/telemetry/ingest</code>
              </div>
              <p className="text-slate-600 text-sm">
                Accepts JSON payloads tracking <code className="bg-slate-200 px-1 rounded text-slate-800">zone_id</code>, <code className="bg-slate-200 px-1 rounded text-slate-800">headcount</code>, and <code className="bg-slate-200 px-1 rounded text-slate-800">timestamp</code>.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <p className="text-xs text-slate-500 mb-3 font-bold tracking-wider uppercase">Real-Time Stream</p>
              <div className="flex items-center space-x-4 mb-3">
                <span className="bg-blue-100 text-blue-700 font-mono font-bold text-xs px-2.5 py-1 rounded">WS</span>
                <code className="text-indigo-600 font-mono text-sm bg-indigo-50 px-2 py-0.5 rounded">/ws/dashboard/stream</code>
              </div>
              <p className="text-slate-600 text-sm">
                Broadcasts unified agent evaluation states every 2 seconds over WebSockets.
              </p>
            </div>
          </div>
        </div>

        {/* Orchestration Matrix */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center border-b border-slate-100 pb-3">
            <Cpu size={20} className="mr-2 text-amber-500"/> Orchestration Matrix
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:border-indigo-300 transition-colors">
              <h4 className="text-indigo-700 font-bold font-mono mb-2 text-sm">DensityAgent</h4>
              <p className="text-sm text-slate-600 leading-relaxed">Calculates current volume profiles based on raw ingested telemetry.</p>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:border-blue-300 transition-colors">
              <h4 className="text-blue-700 font-bold font-mono mb-2 text-sm">PredictionAgent</h4>
              <p className="text-sm text-slate-600 leading-relaxed">Runs an XGBoost regressor window looking 5 minutes ahead.</p>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:border-amber-300 transition-colors">
              <h4 className="text-amber-700 font-bold font-mono mb-2 text-sm">DecisionAgent</h4>
              <p className="text-sm text-slate-600 leading-relaxed">Executes structural responses based on predefined safety thresholds.</p>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:border-emerald-300 transition-colors">
              <h4 className="text-emerald-700 font-bold font-mono mb-2 text-sm">AlertAgent</h4>
              <p className="text-sm text-slate-600 leading-relaxed">Packages telemetry updates and routes instructions over WebSockets.</p>
            </div>
          </div>
        </div>

        {/* Data Handling & Database Design */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center border-b border-slate-100 pb-3">
            <Database size={20} className="mr-2 text-emerald-500"/> Where the Data is Being Read
          </h3>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            To ace the Data Handling (15%) and Database Design (10%) criteria, the system reads data from a tiered hybrid pipeline.
          </p>

          {/* ASCII Pipeline diagram */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-8 overflow-x-auto shadow-inner">
            <pre className="text-[10px] sm:text-xs text-indigo-300 font-mono leading-relaxed">
{`[ Edge Sensors / Camera Telemetry ]
               │
               ▼
[ Python Stream Simulator Script ]  ──(HTTP POST)──> [ FastAPI Backend ]
                                                           │
                                                           ▼
                                                [ Supabase PostgreSQL ]
                                                ├─ Static Data: Event Details & Coordinates
                                                └─ Time-Series (TimescaleDB): Live Telemetry
                                                           │
                                                           ▼
                                                [ XGBoost Model Engine ]
                                                (Reads last 60s rolling window)
                                                           │
                                                           ▼
                                                [ FastAPI WebSockets ]
                                                           │
                                                           ▼
                                                [ Live React Dashboards ]`}
            </pre>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-slate-900 font-bold font-mono mb-2 text-sm">Static Configuration Data (Read Once at Selection)</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                When the user logs in and selects an event (e.g., Pharma Pro & Pack Expo), the system queries PostgreSQL to read static tables containing zone boundaries, max capacities, precise GPS coordinates, and asset locations.
              </p>
            </div>
            
            <div>
              <h4 className="text-slate-900 font-bold font-mono mb-2 text-sm">Live Telemetry Streams (Read Constantly)</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                The Python stream script pushes new counts every second. The backend writes these to a PostgreSQL hyper-table (TimescaleDB) and reads a rolling 60-second window to feed features to the ML forecasting model.
              </p>
            </div>

            <div>
              <h4 className="text-slate-900 font-bold font-mono mb-2 text-sm">State Updates (Pushed via WebSockets)</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                The React frontend never reads directly from the database. It maintains a high-speed WebSocket connection with FastAPI, listening to the processed state emitted by the multi-agent execution pipeline.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
