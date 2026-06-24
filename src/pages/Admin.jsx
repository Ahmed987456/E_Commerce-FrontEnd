import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';

const STATUS_OPTIONS = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const statusArabic = {
  Pending: 'قيد الانتظار',
  Processing: 'جاري التجهيز',
  Shipped: 'تم الشحن',
  Delivered: 'تم التسليم',
  Cancelled: 'ملغي',
};

const statusColors = {
  Pending: 'bg-yellow-500/10 text-yellow-400',
  Processing: 'bg-blue-500/10 text-blue-400',
  Shipped: 'bg-purple-500/10 text-purple-400',
  Delivered: 'bg-green-500/10 text-green-400',
  Cancelled: 'bg-red-500/10 text-red-400',
};

export default function Admin() {
  const [activeTab, setActiveTab] = useState('products');

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);

  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', stockQuantity: '', imageUrl: '', categoryId: '',
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', parentCategoryId: '' });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    const res = await api.get('/Products');
    setProducts(res.data);
  };

  const fetchCategories = async () => {
    const res = await api.get('/Categorys');
    setCategories(res.data);
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get('/Orders/AllOrders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getAllSubCategories = () => {
    const subs = [];
    categories.forEach(cat => cat.subCategories?.forEach(sub => subs.push(sub)));
    return subs;
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        Name: productForm.name,
        Description: productForm.description,
        Price: parseFloat(productForm.price),
        StockQuantity: parseInt(productForm.stockQuantity),
        ImageUrl: productForm.imageUrl,
        CategoryId: parseInt(productForm.categoryId),
      };
      if (editingProduct) {
        await api.put(`/Products/${editingProduct}`, body);
      } else {
        await api.post('/Products', body);
      }
      setProductForm({ name: '', description: '', price: '', stockQuantity: '', imageUrl: '', categoryId: '' });
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data || 'حصل خطأ');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stockQuantity: product.stockQuantity,
      imageUrl: product.imageUrl,
      categoryId: product.categoryId,
    });
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('هتحذف المنتج ده؟')) return;
    await api.delete(`/Products/${id}`);
    fetchProducts();
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/Categorys', {
        Name: categoryForm.name,
        ParentCategoryId: categoryForm.parentCategoryId ? parseInt(categoryForm.parentCategoryId) : null,
      });
      setCategoryForm({ name: '', parentCategoryId: '' });
      fetchCategories();
    } catch (err) {
      alert(err.response?.data || 'حصل خطأ');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('هتحذف الفئة دي؟')) return;
    try {
      await api.delete(`/Categorys/${id}`);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data || 'حصل خطأ');
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await api.put(`/Orders/UpdateStatus/${orderId}`, { OrderStatus: status });
      fetchOrders();
    } catch (err) {
      alert('حصل خطأ في تحديث الحالة');
    }
  };

  const tabs = [
    { key: 'products', label: '📦 المنتجات', count: products.length },
    { key: 'categories', label: '🗂 الفئات', count: categories.length },
    { key: 'orders', label: '🧾 الطلبات', count: orders.length },
  ];

  const inputClass = "w-full bg-[#0f1117] border border-[#2a2d3a] text-gray-300 placeholder-gray-600 rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500 transition";

  return (
    <div className="min-h-screen bg-[#0f1117]">
      <div className="max-w-6xl mx-auto px-4 py-8">

        <h1 className="text-2xl font-bold text-white mb-6">⚙️ لوحة التحكم</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-[#2a2d3a]">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 font-medium transition border-b-2 text-sm flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.label}
              <span className="bg-[#2a2d3a] text-gray-400 text-xs px-2 py-0.5 rounded-full">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-2xl p-6">
              <h2 className="font-bold text-white mb-4">
                {editingProduct ? '✏️ تعديل منتج' : '➕ إضافة منتج جديد'}
              </h2>
              <form onSubmit={handleProductSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input placeholder="اسم المنتج" value={productForm.name}
                  onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                  className={inputClass} />
                <input placeholder="السعر" type="number" value={productForm.price}
                  onChange={e => setProductForm({ ...productForm, price: e.target.value })}
                  className={inputClass} />
                <input placeholder="الكمية" type="number" value={productForm.stockQuantity}
                  onChange={e => setProductForm({ ...productForm, stockQuantity: e.target.value })}
                  className={inputClass} />
                <input placeholder="رابط الصورة" value={productForm.imageUrl}
                  onChange={e => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  className={inputClass} />
                <textarea placeholder="الوصف" value={productForm.description}
                  onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                  className={`${inputClass} sm:col-span-2`} rows={2} />
                <select value={productForm.categoryId}
                  onChange={e => setProductForm({ ...productForm, categoryId: e.target.value })}
                  className={inputClass}>
                  <option value="">اختر الفئة الفرعية</option>
                  {getAllSubCategories().map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
                <div className="flex gap-2 sm:col-span-2">
                  <button type="submit"
                    className="bg-purple-600 text-white px-6 py-2.5 rounded-xl hover:bg-purple-700 transition font-medium">
                    {editingProduct ? 'حفظ التعديل' : 'إضافة'}
                  </button>
                  {editingProduct && (
                    <button type="button"
                      onClick={() => { setEditingProduct(null); setProductForm({ name: '', description: '', price: '', stockQuantity: '', imageUrl: '', categoryId: '' }); }}
                      className="bg-[#2a2d3a] text-gray-400 px-6 py-2.5 rounded-xl hover:bg-[#3a3d4a] transition">
                      إلغاء
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2a2d3a]">
                    <th className="p-4 text-right text-gray-500 font-medium">المنتج</th>
                    <th className="p-4 text-right text-gray-500 font-medium">الفئة</th>
                    <th className="p-4 text-right text-gray-500 font-medium">السعر</th>
                    <th className="p-4 text-right text-gray-500 font-medium">الكمية</th>
                    <th className="p-4 text-right text-gray-500 font-medium">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id} className="border-b border-[#2a2d3a] hover:bg-[#2a2d3a]/30 transition">
                      <td className="p-4 text-gray-300">{product.name}</td>
                      <td className="p-4 text-gray-500 text-xs">{product.categoryName}</td>
                      <td className="p-4 text-purple-400 font-medium">{product.price.toLocaleString()} ج.م</td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          product.stockQuantity > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {product.stockQuantity}
                        </span>
                      </td>
                      <td className="p-4 flex gap-3">
                        <button onClick={() => handleEditProduct(product)}
                          className="text-blue-400 hover:text-blue-300 text-xs transition">
                          تعديل
                        </button>
                        <button onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-400 hover:text-red-300 text-xs transition">
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-2xl p-6">
              <h2 className="font-bold text-white mb-4">➕ إضافة فئة جديدة</h2>
              <form onSubmit={handleCategorySubmit} className="flex gap-3 flex-wrap">
                <input placeholder="اسم الفئة" value={categoryForm.name}
                  onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className={`${inputClass} flex-1`} required />
                <select value={categoryForm.parentCategoryId}
                  onChange={e => setCategoryForm({ ...categoryForm, parentCategoryId: e.target.value })}
                  className="bg-[#0f1117] border border-[#2a2d3a] text-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500 transition">
                  <option value="">فئة رئيسية</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <button type="submit"
                  className="bg-purple-600 text-white px-6 py-2.5 rounded-xl hover:bg-purple-700 transition font-medium">
                  إضافة
                </button>
              </form>
            </div>

            <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2a2d3a]">
                    <th className="p-4 text-right text-gray-500 font-medium">الفئة</th>
                    <th className="p-4 text-right text-gray-500 font-medium">النوع</th>
                    <th className="p-4 text-right text-gray-500 font-medium">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(cat => (
                    <>
                      <tr key={`cat-${cat.id}`} className="border-b border-[#2a2d3a] bg-[#2a2d3a]/20">
                        <td className="p-4 font-semibold text-white">{cat.name}</td>
                        <td className="p-4">
                          <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-1 rounded-full">رئيسية</span>
                        </td>
                        <td className="p-4">
                          <button onClick={() => handleDeleteCategory(cat.id)}
                            className="text-red-400 hover:text-red-300 text-xs transition">
                            حذف
                          </button>
                        </td>
                      </tr>
                      {cat.subCategories?.map(sub => (
                        <tr key={`sub-${sub.id}`} className="border-b border-[#2a2d3a] hover:bg-[#2a2d3a]/30 transition">
                          <td className="p-4 pr-8 text-gray-400">— {sub.name}</td>
                          <td className="p-4">
                            <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full">فرعية</span>
                          </td>
                          <td className="p-4">
                            <button onClick={() => handleDeleteCategory(sub.id)}
                              className="text-red-400 hover:text-red-300 text-xs transition">
                              حذف
                            </button>
                          </td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a2d3a]">
                  <th className="p-4 text-right text-gray-500 font-medium">رقم الطلب</th>
                  <th className="p-4 text-right text-gray-500 font-medium">التاريخ</th>
                  <th className="p-4 text-right text-gray-500 font-medium">الإجمالي</th>
                  <th className="p-4 text-right text-gray-500 font-medium">الحالة</th>
                  <th className="p-4 text-right text-gray-500 font-medium">تغيير الحالة</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b border-[#2a2d3a] hover:bg-[#2a2d3a]/30 transition">
                    <td className="p-4 text-gray-300">#{order.id}</td>
                    <td className="p-4 text-gray-500 text-xs">
                      {new Date(order.orderDate).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="p-4 text-purple-400 font-medium">
                      {order.totalPrice.toLocaleString()} ج.م
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.orderStatus]}`}>
                        {statusArabic[order.orderStatus]}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={order.orderStatus}
                        onChange={e => handleUpdateStatus(order.id, e.target.value)}
                        disabled={order.orderStatus === 'Cancelled'}
                        className="bg-[#0f1117] border border-[#2a2d3a] text-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-purple-500 transition disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{statusArabic[s]}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">مفيش طلبات لحد دلوقتي</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}