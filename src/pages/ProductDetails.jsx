import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import useAuthStore from '../store/authStore';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/Products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError('المنتج مش موجود');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setCartLoading(true);
    try {
      await api.post('/CarItems', {
        ProductId: product.id,
        Quantity: quantity,
      });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setCartLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-[#0f1117]">
      <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen bg-[#0f1117]">
      <p className="text-red-400">{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f1117]">
      <div className="max-w-5xl mx-auto px-4 py-8">

        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-white transition mb-6 flex items-center gap-2 text-sm"
        >
          ← رجوع
        </button>

        <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-2xl overflow-hidden flex flex-col md:flex-row gap-0">

          {/* Image */}
          <div className="md:w-96 h-72 md:h-auto overflow-hidden shrink-0">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => e.target.src = 'https://via.placeholder.com/400x300/1a1d27/444?text=No+Image'}
            />
          </div>

          {/* Details */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full">
                {product.categoryName}
              </span>
              <h1 className="text-2xl font-bold text-white mt-3 mb-2">
                {product.name}
              </h1>

              {product.description && (
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {product.description}
                </p>
              )}

              <p className="text-3xl font-bold text-purple-400 mb-2">
                {product.price.toLocaleString()} ج.م
              </p>

              <span className={`text-xs px-3 py-1 rounded-full ${
                product.stockQuantity > 0
                  ? 'bg-green-500/10 text-green-400'
                  : 'bg-red-500/10 text-red-400'
              }`}>
                {product.stockQuantity > 0
                  ? `✓ متاح — ${product.stockQuantity} قطعة`
                  : '✗ نفذت الكمية'}
              </span>
            </div>

            {product.stockQuantity > 0 && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm">الكمية:</span>
                  <div className="flex items-center bg-[#0f1117] border border-[#2a2d3a] rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="px-4 py-2 text-gray-400 hover:text-white hover:bg-[#2a2d3a] transition"
                    >
                      −
                    </button>
                    <span className="px-4 py-2 text-white font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))}
                      className="px-4 py-2 text-gray-400 hover:text-white hover:bg-[#2a2d3a] transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={cartLoading || addedToCart}
                  className={`w-full py-3 rounded-xl font-semibold transition ${
                    addedToCart
                      ? 'bg-green-600 text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50'
                  }`}
                >
                  {addedToCart ? '✅ تمت الإضافة للسلة!' : cartLoading ? 'جاري الإضافة...' : '🛒 أضف للسلة'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}