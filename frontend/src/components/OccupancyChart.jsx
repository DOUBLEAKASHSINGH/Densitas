import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function OccupancyChart({ chartData }) {
  return (
    <div className="h-full w-full bg-gray-900/50 rounded-xl border border-gray-800 p-4 shadow-[0_0_15px_rgba(0,243,255,0.05)] flex flex-col">
      <h2 className="text-neon-cyan font-mono text-sm mb-4 uppercase tracking-wider flex items-center">
        <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse mr-2"></span>
        Live Occupancy vs XGBoost Prediction
      </h2>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis dataKey="time" stroke="#4b5563" fontSize={12} tickMargin={10} />
            <YAxis stroke="#4b5563" fontSize={12} tickFormatter={(val) => `${val}%`} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#f3f4f6' }}
              itemStyle={{ fontFamily: 'monospace', fontSize: '12px' }}
              labelStyle={{ fontFamily: 'monospace', color: '#9ca3af', marginBottom: '4px' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', fontFamily: 'monospace', paddingTop: '10px' }} />
            <Line 
              type="monotone" 
              dataKey="current" 
              name="Current Capacity %" 
              stroke="#00f3ff" 
              strokeWidth={2} 
              dot={false}
              activeDot={{ r: 4, fill: '#00f3ff', stroke: '#fff' }}
              isAnimationActive={false}
            />
            <Line 
              type="monotone" 
              dataKey="predicted" 
              name="Predicted Capacity % (5m)" 
              stroke="#ffb000" 
              strokeWidth={2}
              strokeDasharray="5 5" 
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
