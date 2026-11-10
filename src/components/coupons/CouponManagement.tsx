import React, { useEffect, useState } from 'react';
import { TicketPercent, Tag } from 'lucide-react';
import { Coupon } from '../../types';
import { api } from '../../services/api';

export const CouponManagement: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    api.getCoupons().then(setCoupons);
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Coupons & Promotions</h1>
        <p className="text-xs text-slate-500">Discount codes, promotional campaigns and redemption limits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {coupons.map((c) => (
          <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                  {c.code}
                </span>
                <span className="text-xs text-emerald-600 font-bold">
                  {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT OFF`}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Min. Booking: ₹{c.minBookingValue} • Used {c.usageCount} times
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Active
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
