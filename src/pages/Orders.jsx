import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import useAuthStore from '../store/authStore';

const statusColors = {
  Pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  Processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Delivered: 'bg-green-500/10 text-green-400 border-green-500/20',
  Cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const statusArabic = {
  Pending: 'قيد الانتظار',
  Processing: 'جاري التجهيز',
  Shipped: 'تم الشحن',
  Delivered: 'تم التسليم',
  Cancelled: 'ملغي',
};

export default function Orders() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/Orders/MyOrders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    if (selectedOrder === orderId) {
      setSelectedOrder(null);
      setOrderDetails(null);
      return;
    }
    setSelectedOrder(orderId);
    setLoadingDetails(true);
    try {
      const res = await api.get(`/Orders/orderdetails/${orderId}`);
      setOrderDetails(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCancel = async (orderId) => {
    try {
      await api.put(`/Orders/CancelOrder/${orderId}`);
      setOrders(prev => prev.map(o =>
        o.id === orderId ? { ...o, orderStatus: 'Cancelled' } : o
      ));
      setSelectedOrder(null);
      setOrderDetails(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-[#0f1117]">
      <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (orders.length === 0) return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#0f1117] gap-4">
      <p className="text-5xl">📦</p>
      <p className="text-gray-400 text-xl">مفيش طلبات لحد دلوقتي</p>
      <button
        onClick={() => navigate('/products')}
        className="bg-purple-600 text-white px-6 py-2.5 rounded-xl hover:bg-purple-700 transition"
      >
        تسوق دلوقتي
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f1117]">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">📦 طلباتي</h1>

        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-[#1a1d27] border border-[#2a2d3a] rounded-2xl overflow-hidden">

              {/* Header */}
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#2a2d3a]/30 transition"
                onClick={() => fetchOrderDetails(order.id)}
              >
                <div>
                  <p className="font-semibold text-white">طلب #{order.id}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(order.orderDate).toLocaleDateString('ar-EG')}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs px-3 py-1 rounded-full border ${statusColors[order.orderStatus]}`}>
                    {statusArabic[order.orderStatus]}
                  </span>
                  <span className="font-bold text-purple-400">
                    {order.totalPrice.toLocaleString()} ج.م
                  </span>
                  <span className="text-gray-600 text-sm">
                    {selectedOrder === order.id ? '▲' : '▼'}
                  </span>
                </div>
              </div>

              {/* Details */}
              {selectedOrder === order.id && (
                <div className="border-t border-[#2a2d3a] px-4 pb-4">
                  {loadingDetails ? (
                    <div className="py-4 flex justify-center">
                      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : orderDetails && (
                    <>
                      <div className="mt-3 space-y-2">
                        {orderDetails.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm py-2 border-b border-[#2a2d3a] last:border-0">
                            <span className="text-gray-400">{item.productName} × {item.quantity}</span>
                            <span className="text-white font-medium">{item.itemTotal.toLocaleString()} ج.م</span>
                          </div>
                        ))}
                      </div>

                      {order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Delivered' && (
                        <button
                          onClick={() => handleCancel(order.id)}
                          className="mt-4 bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-lg text-sm hover:bg-red-500/20 transition"
                        >
                          إلغاء الطلب
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}