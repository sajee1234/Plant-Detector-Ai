import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CloudSun, Droplets, Wind, History, Sprout, Trash2 } from 'lucide-react';
import { ScanHistoryItem } from '../types';

interface DashboardProps {
  history: ScanHistoryItem[];
  onClearHistory?: () => void;
  onDeleteItem?: (id: string) => void;
}

const data = [
  { name: 'Mon', health: 65, moisture: 40 },
  { name: 'Tue', health: 68, moisture: 35 },
  { name: 'Wed', health: 75, moisture: 60 },
  { name: 'Thu', health: 72, moisture: 55 },
  { name: 'Fri', health: 85, moisture: 70 },
  { name: 'Sat', health: 82, moisture: 65 },
  { name: 'Sun', health: 90, moisture: 80 },
];

export const Dashboard: React.FC<DashboardProps> = ({ history, onClearHistory, onDeleteItem }) => {
  return (
    <div className="p-6 space-y-8 pb-24 animate-fade-in">
      {/* Weather Widget */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-lg shadow-emerald-200">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
              My Farm
            </span>
            <h2 className="text-3xl font-bold mt-2">24°C</h2>
            <p className="text-emerald-50 text-sm">Mostly Sunny</p>
          </div>
          <CloudSun size={48} className="text-yellow-300" />
        </div>
        <div className="flex gap-4">
          <div className="flex items-center space-x-2 bg-black/10 px-3 py-2 rounded-xl">
            <Droplets size={16} className="text-blue-200" />
            <span className="text-sm font-medium">62% Hum</span>
          </div>
          <div className="flex items-center space-x-2 bg-black/10 px-3 py-2 rounded-xl">
            <Wind size={16} className="text-stone-200" />
            <span className="text-sm font-medium">12 km/h</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div>
        <h3 className="text-lg font-bold text-stone-800 mb-4">Crop Health Index</h3>
        <div className="h-64 w-full bg-white rounded-3xl p-4 shadow-sm">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#a8a29e', fontSize: 12}} 
                dy={10}
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="health" 
                stroke="#10b981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorHealth)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Health History Log */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-stone-800">Health History Log</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400 bg-white px-2 py-1 rounded-full border border-stone-200">
              {history.length} Records
            </span>
            {history.length > 0 && onClearHistory && (
               <button onClick={onClearHistory} className="text-xs text-red-500 font-medium px-2 py-1 hover:bg-red-50 rounded-full transition-colors">
                 Clear All
               </button>
             )}
          </div>
        </div>
        
        {history.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-dashed border-stone-300 flex flex-col items-center justify-center text-stone-400 space-y-2">
            <History size={32} className="opacity-50" />
            <p className="text-sm">No scans recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => {
               const isHealthy = item.healthStatus === 'Healthy';
               const isUnknown = item.healthStatus === 'Unknown';
               
               const statusColor = isHealthy ? 'bg-green-100 text-green-700' : 
                                   isUnknown ? 'bg-stone-100 text-stone-600' : 
                                   'bg-red-100 text-red-700';

              return (
                <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between transition-transform hover:scale-[1.02] group">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-stone-100 overflow-hidden flex-shrink-0">
                      {item.imageUrl ? (
                         <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.plantName} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Sprout size={20} className="text-stone-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-800 text-sm line-clamp-1">{item.plantName}</h4>
                      <p className="text-xs text-stone-400">{item.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${statusColor}`}>
                      {item.healthStatus}
                    </span>
                    {onDeleteItem && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteItem(item.id);
                        }}
                        className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};