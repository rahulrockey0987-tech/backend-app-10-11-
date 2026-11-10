import React, { useEffect, useState } from 'react';
import { UserCheck, Star, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';
import { Partner } from '../../types';
import { api } from '../../services/api';

export const PartnerManagement: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPartners().then(setPartners).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Partner Management
          </h1>
          <p className="text-xs text-slate-500">
            Onboarded, verified home service professionals and multi-skilled partners.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {partners.map((partner) => (
          <div key={partner.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={partner.avatarUrl}
                  alt={partner.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100"
                />
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{partner.name}</h3>
                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{partner.rating}</span>
                    <span className="text-slate-400 font-normal">({partner.completedJobs} jobs)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-xs space-y-1 text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{partner.phone}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{partner.location.address}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 pt-1">
              {partner.skills.map((skill) => (
                <span key={skill} className="px-1.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] rounded">
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                partner.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {partner.status}
              </span>
              <span className="text-[11px] font-semibold text-blue-600 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> KYC Verified
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
