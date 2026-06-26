import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import useCartStore from '../store/cartStore';

export default function Checkout() {
  const navigate = useNavigate();
  const { clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOrder = async () => {
  setLoading(true);
  setError('');
  try {
    await api.post('/Orders/CreateOrder');
    clearCart();
    navigate('/orders');
  } catch (err) {
    setError(err.response?.data || 'حصل خطأ في إتمام الطلب');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center px-4">
      <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-2xl p-8 w-full max-w-md text-center">

        <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🛒</span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">إتمام الطلب</h1>
        <p className="text-gray-500 text-sm mb-6">
          هيتم تأكيد طلبك وإرساله للشحن في أقرب وقت
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <button
          onClick={handleOrder}
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition font-semibold disabled:opacity-50 mb-3"
        >
          {loading ? 'جاري التأكيد...' : '✓ تأكيد الطلب'}
        </button>

        <button
          onClick={() => navigate('/cart')}
          className="w-full text-gray-500 hover:text-gray-300 text-sm transition py-2"
        >
          ← رجوع للسلة
        </button>
      </div>
    </div>
  );
}