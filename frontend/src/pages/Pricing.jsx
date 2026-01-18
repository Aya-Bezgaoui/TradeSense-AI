import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Check } from 'lucide-react';
import api from '../services/api';

function Pricing() {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get('/plans/');
        setPlans(res.data);
      } catch (e) {
        // Fallback if API offline
        setPlans([
          { id: 1, slug: 'starter', price_dh: 200, features: { balance: 10000, profit_target: 10 } },
          { id: 2, slug: 'pro', price_dh: 500, features: { balance: 50000, profit_target: 10 } },
          { id: 3, slug: 'elite', price_dh: 1000, features: { balance: 100000, profit_target: 10 } },
        ]);
      }
    };
    fetchPlans();
  }, []);

  const handleChoose = (slug) => {
    navigate(`/checkout?plan=${slug}`);
  };

  return (
    <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Choose Your Challenge</h2>
        <p className="text-slate-400">Transparent pricing. No hidden fees. One-time payment.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, idx) => (
          <div key={plan.id} className={`relative p-8 rounded-2xl border ${plan.slug === 'pro' ? 'border-primary bg-slate-900/80 shadow-2xl shadow-primary/10' : 'border-slate-800 bg-slate-900/40'} flex flex-col`}>
            {plan.slug === 'pro' && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </div>
            )}

            <h3 className="text-2xl font-bold capitalize mb-2">{plan.slug}</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">{plan.price_dh} DH</span>
            </div>

            <ul className="flex-1 space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-primary" />
                <span className="text-slate-300">Balance: <strong className="text-white">${plan.features?.balance?.toLocaleString()}</strong></span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-primary" />
                <span className="text-slate-300">Profit Target: 10%</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-primary" />
                <span className="text-slate-300">Max Daily Loss: 5%</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-primary" />
                <span className="text-slate-300">Max Total Loss: 10%</span>
              </li>
            </ul>

            <button onClick={() => handleChoose(plan.slug)} className={`btn w-full py-3 ${plan.slug === 'pro' ? 'btn-primary' : 'btn-secondary'}`}>
              Select Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pricing;