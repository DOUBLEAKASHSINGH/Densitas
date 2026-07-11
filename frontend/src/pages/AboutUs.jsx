import React from 'react';

export default function AboutUs() {
  return (
    <div className="flex-1 bg-slate-50 flex justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-12">
        
        <div className="text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Mission & Vision</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Redefining Spatial Intelligence
          </p>
          <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
            OptiFlow is an enterprise-grade spatial orchestration platform engineered to eliminate high-density venue bottlenecks, mitigate crowd crushes, and maximize concession throughput.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 sm:p-10 space-y-8">
          
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">The Problem</h3>
            <p className="text-slate-600 leading-relaxed text-lg">
              Massive live events—from international cricket matches to global trade expos—suffer from critical, life-threatening bottlenecks. When thousands of people converge without systematic flow control, the risk of <strong>crowd crushes</strong> skyrockets. Beyond the severe safety implications, venue operators face massive economic losses due to poor throughput at concession stands, restrooms, and merchandise stalls. Traditional security relies on reactive radio calls rather than proactive, data-driven orchestration.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Our Technology</h3>
            <p className="text-slate-600 leading-relaxed text-lg">
              OptiFlow integrates three core technological pillars to completely modernize crowd management:
            </p>
            <ul className="mt-4 space-y-4">
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold mr-3">1</span>
                <p className="text-slate-600 text-lg"><strong>Spatial IoT Telemetry:</strong> We ingest high-frequency data from edge sensors and camera networks directly into a TimescaleDB hyper-table.</p>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold mr-3">2</span>
                <p className="text-slate-600 text-lg"><strong>AI-Driven Predictive Modeling:</strong> Our XGBoost regression engine analyzes a 60-second rolling window to forecast exact congestion levels 5 minutes into the future.</p>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold mr-3">3</span>
                <p className="text-slate-600 text-lg"><strong>Deterministic Multi-Agent Orchestration:</strong> A pipeline of specialized Python agents evaluates predictions against strict safety thresholds, instantly calculating response tactics.</p>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">The Solution</h3>
            <p className="text-slate-600 leading-relaxed text-lg">
              By converting raw telemetry into actionable intelligence, OptiFlow saves lives and increases operational efficiency. Our system executes <strong>dynamic rerouting</strong> by updating public LED signage and pushing notifications to attendee devices before a bottleneck even forms. Simultaneously, it automates <strong>real-time staff dispatch</strong>, sending security personnel to specific zones the moment predictive capacity thresholds are breached. OptiFlow turns reactive chaos into proactive harmony.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
