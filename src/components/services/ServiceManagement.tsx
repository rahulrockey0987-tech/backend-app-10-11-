import React, { useEffect, useState } from 'react';
import { Layers, Sparkles, IndianRupee } from 'lucide-react';
import { ServiceCategory } from '../../types';
import { api } from '../../services/api';

export const ServiceManagement: React.FC = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);

  useEffect(() => {
    api.getCategories().then(setCategories);
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Services & Categories</h1>
        <p className="text-xs text-slate-500">Service hierarchy, fixed-price services and hourly partner offerings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">{cat.name}</h3>
              <span className="font-bold text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                From ₹{cat.basePrice}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{cat.description}</p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Category Code: {cat.id}</span>
              <span className="text-emerald-600 font-semibold">Active</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
