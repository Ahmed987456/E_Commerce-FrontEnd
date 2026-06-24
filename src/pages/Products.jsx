import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosInstance";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

 useEffect(() => {
  const fetchInitialData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/Products'),
        api.get('/Categorys'),
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      setError('حصل خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };
  fetchInitialData();
}, []);

useEffect(() => {
  if (!search.trim()) return;

  const delaySearch = setTimeout(async () => {
    try {
      const res = await api.get(`/Products/search?Name=${search}`);
      setProducts(res.data);
      setSelectedCategory(null);
    } catch (err) {
      setProducts([]);
    }
  }, 400);

  return () => clearTimeout(delaySearch);
}, [search]);


  const handleCategorySelect = async (categoryId) => {
    setSearch("");
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      const res = await api.get("/Products");
      setProducts(res.data);
      return;
    }
    setSelectedCategory(categoryId);
    try {
      const res = await api.get(`/Products/productsByCategory/${categoryId}`);
      setProducts(res.data);
    } catch (err) {
      setError("حصل خطأ في الفلتر");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0f1117]">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500">جاري التحميل...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0f1117]">
      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-6">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 hidden md:block">
          <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-2xl p-4 sticky top-20">
            <h2 className="font-bold text-white mb-4 text-sm">الفئات</h2>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => handleCategorySelect(null)}
                  className={`w-full text-right px-3 py-2 rounded-xl text-sm transition ${
                    selectedCategory === null
                      ? "bg-purple-600 text-white"
                      : "text-gray-400 hover:bg-[#2a2d3a] hover:text-white"
                  }`}
                >
                  كل المنتجات
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`w-full text-right px-3 py-2 rounded-xl text-sm font-medium transition ${
                      selectedCategory === cat.id
                        ? "bg-purple-600 text-white"
                        : "text-gray-300 hover:bg-[#2a2d3a] hover:text-white"
                    }`}
                  >
                    {cat.name}
                  </button>
                  {cat.subCategories?.length > 0 && (
                    <ul className="mt-1 ml-2 space-y-1">
                      {cat.subCategories.map((sub) => (
                        <li key={sub.id}>
                          <button
                            onClick={() => handleCategorySelect(sub.id)}
                            className={`w-full text-right px-3 py-1.5 rounded-xl text-xs transition ${
                              selectedCategory === sub.id
                                ? "bg-purple-500 text-white"
                                : "text-gray-500 hover:bg-[#2a2d3a] hover:text-gray-300"
                            }`}
                          >
                            — {sub.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1">
          {/* Search */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedCategory(null);
              }}
              placeholder="ابحث عن منتج..."
              className="flex-1 bg-[#1a1d27] border border-[#2a2d3a] text-gray-300 placeholder-gray-600 rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          {/* Results Count */}
          <p className="text-gray-600 text-sm mb-4">{products.length} منتج</p>

          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-gray-500">مفيش منتجات في هذه الفئة</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((product) => (
                <Link
                  to={`/products/${product.id}`}
                  key={product.id}
                  className="bg-[#1a1d27] border border-[#2a2d3a] hover:border-purple-500/40 rounded-2xl overflow-hidden transition group"
                >
                  <div className="overflow-hidden h-48">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/300x200/1a1d27/444?text=No+Image")
                      }
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-purple-400">
                      {product.categoryName}
                    </span>
                    <h2 className="font-semibold text-gray-200 text-sm mt-1 mb-3 line-clamp-2 group-hover:text-white transition">
                      {product.name}
                    </h2>
                    <div className="flex items-center justify-between">
                      <span className="text-purple-400 font-bold">
                        {product.price.toLocaleString()} ج.م
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          product.stockQuantity > 0
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {product.stockQuantity > 0
                          ? `${product.stockQuantity} متاح`
                          : "نفذ"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
