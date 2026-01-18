import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CreditCard, Wallet, Lock } from 'lucide-react';

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const planSlug = query.get('plan');

  const [paypalEnabled, setPaypalEnabled] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!planSlug) navigate('/pricing');

    // Check PayPal config
    api.get('/checkout/paypal-config')
      .then(res => setPaypalEnabled(res.data.enabled))
      .catch(() => { });
  }, []);

  const handleMockPayment = async (method) => {
    setProcessing(true);
    try {
      // Simulate network delay
      await new Promise(r => setTimeout(r, 1500));

      await api.post('/checkout/mock', {
        plan_slug: planSlug,
        method: method
      });

      navigate('/dashboard');
    } catch (error) {
      alert('Payment failed: ' + (error.response?.data?.error || 'Unknown'));
      setProcessing(false);
    }
  };

  const [cmiData, setCmiData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: '',
    email: ''
  });

  const handleCmiChange = (e) => {
    setCmiData({ ...cmiData, [e.target.name]: e.target.value });
  };

  return (
    <div className="py-20 max-w-lg mx-auto px-4">
      <div className="card bg-slate-900 border-slate-800 p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Secure Checkout</h2>
          <p className="text-slate-400">Complete your purchase to start the {planSlug} challenge.</p>
        </div>

        <div className="space-y-6">
          {/* CMI Form */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="font-bold flex items-center gap-2"><CreditCard className="w-5 h-5 text-blue-500" /> CMI Secure Payment</h3>
            <input type="text" name="name" placeholder="Cardholder Name" value={cmiData.name} onChange={handleCmiChange} className="input w-full bg-slate-800 border-slate-700" />
            <input type="text" name="cardNumber" placeholder="Card Number" value={cmiData.cardNumber} onChange={handleCmiChange} className="input w-full bg-slate-800 border-slate-700" />
            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="expiry" placeholder="MM/YY" value={cmiData.expiry} onChange={handleCmiChange} className="input w-full bg-slate-800 border-slate-700" />
              <input type="text" name="cvv" placeholder="CVV" value={cmiData.cvv} onChange={handleCmiChange} className="input w-full bg-slate-800 border-slate-700" />
            </div>
            <button
              disabled={processing || !cmiData.cardNumber}
              onClick={() => handleMockPayment('CMI')}
              className="w-full btn bg-blue-600 hover:bg-blue-700 text-white py-3 flex items-center justify-center gap-2 font-bold"
            >
              {processing ? 'Processing...' : 'Pay Now'}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-px bg-slate-800 flex-1"></div>
            <span className="text-sm text-slate-500">OR</span>
            <div className="h-px bg-slate-800 flex-1"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              disabled={processing}
              onClick={() => handleMockPayment('CRYPTO')}
              className="btn bg-amber-600 hover:bg-amber-700 text-white py-3 flex items-center justify-center gap-2 text-sm"
            >
              <Wallet className="w-4 h-4" /> Crypto
            </button>

            <button
              disabled={processing}
              onClick={() => handleMockPayment('PAYPAL')}
              className="btn bg-[#0070ba] hover:bg-[#003087] text-white py-3 flex items-center justify-center gap-2 text-sm font-bold"
            >
              PayPal
            </button>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500">
          <Lock className="w-3 h-3" />
          <span>256-bit SSL Encrypted Payment</span>
        </div>
      </div>
    </div>
  );
}

export default Checkout;