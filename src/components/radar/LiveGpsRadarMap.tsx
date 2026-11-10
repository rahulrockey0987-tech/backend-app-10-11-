import React from 'react';
import { Radio, MapPin, Zap } from 'lucide-react';

export const LiveGpsRadarMap: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Radio className="w-5 h-5 text-blue-600 animate-pulse" />
            Live GPS Partner Radar
          </h1>
          <p className="text-xs text-slate-500">
            Real-time geospatial fleet positioning across Bengaluru service zones.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>4 Active Telemetry Streams</span>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 text-white min-h-[480px] relative overflow-hidden flex flex-col justify-between border border-slate-800">
        {/* Radar concentric rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-64 h-64 border border-blue-500 rounded-full" />
          <div className="w-96 h-96 border border-blue-500 rounded-full absolute" />
          <div className="w-[500px] h-[500px] border border-blue-500 rounded-full absolute" />
        </div>

        {/* Partner Pins simulation overlay */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/80 backdrop-blur-md p-3.5 rounded-xl border border-slate-700 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-100">Rajesh Kumar</span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded">
                Active
              </span>
            </div>
            <div className="text-slate-400 text-[11px]">Indiranagar 100ft Rd • Lat: 12.9716</div>
            <div className="text-amber-400 font-semibold text-[11px]">Speed: 18 km/h • On Job</div>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-md p-3.5 rounded-xl border border-slate-700 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-100">Mohammed Tariq</span>
              <span className="text-[10px] text-purple-400 font-bold bg-purple-950/60 px-1.5 py-0.5 rounded">
                On Voice Job
              </span>
            </div>
            <div className="text-slate-400 text-[11px]">Koramangala 5th Block • Lat: 12.9352</div>
            <div className="text-emerald-400 font-semibold text-[11px]">VB-901 in progress</div>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-md p-3.5 rounded-xl border border-slate-700 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-100">Suresh Babu</span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded">
                Available
              </span>
            </div>
            <div className="text-slate-400 text-[11px]">HSR Layout Sector 2 • Lat: 12.9279</div>
            <div className="text-blue-400 font-semibold text-[11px]">Idle • Ready for dispatch</div>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-md p-3.5 rounded-xl border border-slate-700 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-100">Anand Verma</span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded">
                Available
              </span>
            </div>
            <div className="text-slate-400 text-[11px]">Malleshwaram 8th Cross • Lat: 12.9915</div>
            <div className="text-blue-400 font-semibold text-[11px]">Idle • Ready for dispatch</div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-6">
          <span>Map Mode: High Precision Street Grid</span>
          <span>Refresh Frequency: 5,000ms</span>
        </div>
      </div>
    </div>
  );
};
