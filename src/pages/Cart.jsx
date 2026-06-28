import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { cart, fetchCart, loading } = useCartStore();
  const [updating, setUpdating] = useState(null);
  const [warnings, setWarnings] = useState([]);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    loadCart();
  }, [user]);

  const loadCart = async () => {
    await fetchCart();
  };

  // لما السلة بتتحمل نتحقق من التحذيرات
  useEffect(() => {
    if (cart?.warnings) {
      setWarnings(cart.warnings);
    }
  }, [cart]);

  const handleUpdateQuantity = async (productId, newQty) => {
    if (newQty < 1) return;
    setUpdating(productId);
    try {
      await api.put('/CarItems', { ProductId: productId, Quantity: newQty });
      await fetchCart();
    } catch (err) {
      alert(err.response?.data || 'حصل خطأ');
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await api.delete(`/CarItems?ProductId=${productId}`);
      await fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-[#0f1117]">
      <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!cart || cart.items.length === 0) return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#0f1117] gap-4">
      <p className="text-5xl">🛒</p>
      <p className="text-gray-400 text-xl">السلة فاضية</p>
      <button onClick={() => navigate('/products')}
        className="bg-purple-600 text-white px-6 py-2.5 rounded-xl hover:bg-purple-700 transition">
        تسوق دلوقتي
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f1117]">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">🛒 سلة التسوق</h1>

        {/* تحذيرات الكمية */}
        {warnings.length > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-4">
            {warnings.map((w, i) => (
              <p key={i} className="text-yellow-400 text-sm">⚠️ {w}</p>
            ))}
          </div>
        )}

        <div className="space-y-3">
          {cart.items.map((item) => (
            <div key={item.productId}
              className="bg-[#1a1d27] border border-[#2a2d3a] rounded-2xl p-4 flex items-center gap-4">
              <div className="flex-1">
                <h2 className="font-semibold text-white text-sm">{item.productName}</h2>
                <p className="text-purple-400 font-bold mt-1">{item.price.toLocaleString()} ج.م</p>
              </div>

              <div className="flex items-center bg-[#0f1117] border border-[#2a2d3a] rounded-xl overflow-hidden">
                <button
                  onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                  disabled={updating === item.productId}
                  className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-[#2a2d3a] transition">
                  −
                </button>
                <span className="px-3 py-1.5 text-white">{item.quantity}</span>
                <button
                  onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                  disabled={updating === item.productId}
                  className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-[#2a2d3a] transition">
                  +
                </button>
              </div>

              <p className="font-bold text-white w-28 text-right">
                {item.itemTotal.toLocaleString()} ج.م
              </p>

              {/* زرار الحذف */}
              <button
                onClick={() => handleDelete(item.productId)}
                className="text-red-400 hover:text-red-300 transition text-lg px-2"
                title="حذف من السلة">
                🗑
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-[#1a1d27] border border-[#2a2d3a] rounded-2xl p-4 flex items-center justify-between">
          <span className="font-bold text-white">الإجمالي</span>
          <span className="text-purple-400 font-bold text-xl">
            {cart.totalPrice.toLocaleString()} ج.م
          </span>
        </div>

        <button
          onClick={() => navigate('/checkout')}
          className="w-full mt-4 bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition font-semibold text-lg">
          إتمام الطلب ←
        </button>
      </div>
    </div>
  );
}