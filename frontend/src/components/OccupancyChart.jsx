import React, { memo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const OccupancyChart = memo(function OccupancyChart({ chartData }) {
  return (
    <div className="h-full w-full flex flex-col">
      <h2 className="text-slate-500 font-semibold text-xs mb-4 tracking-wider flex items-center uppercase">
        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse mr-2"></span>
        Live Occupancy vs Prediction Performance
      </h2>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickMargin={10} />
            <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `${val}%`} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '8px' }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
              labelStyle={{ color: '#64748b', marginBottom: '4px', fontSize: '11px' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px', color: '#64748b' }} />
            <Line 
              type="monotone" 
              dataKey="current" 
              name="Current Venue Occupancy" 
              stroke="#4f46e5" 
              strokeWidth={2} 
              dot={false}
              activeDot={{ r: 4, fill: '#4f46e5', stroke: '#fff' }}
              isAnimationActive={true}
              animationDuration={300}
            />
            <Line 
              type="monotone" 
              dataKey="predicted" 
              name="Expected Occupancy (Next 5 Minutes)" 
              stroke="#f59e0b" 
              strokeWidth={2}
              strokeDasharray="5 5" 
              dot={false}
              isAnimationActive={true}
              animationDuration={300}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

export default OccupancyChart;
