import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosInstance";

const categoryIcons = {
  Electronics: "💻",
  Fashion: "👗",
  "Beauty & Personal Care": "💄",
  "Sports & Fitness": "🏋️",
  Books: "📚",
};

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, prodsRes] = await Promise.all([
          api.get("/Categorys"),
          api.get("/Products"),
        ]);
        setCategories(catsRes.data);
        setProducts(prodsRes.data.slice(0, 6));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f1117]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1a1d27] via-[#1e1b2e] to-[#0f1117] py-24 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-block bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm px-4 py-1.5 rounded-full mb-6">
            🔥 أفضل الأسعار في المنطقة
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            تسوق بذكاء،
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {" "}
              وفّر أكتر
            </span>
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            آلاف المنتجات من أفضل الماركات بأسعار لا تُقاوم، توصلك لحد بيتك
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              to="/products"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition"
            >
              تسوق دلوقتي
            </Link>
            <Link
              to="/products"
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-3 rounded-xl font-semibold transition"
            >
              اكتشف المنتجات
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#1a1d27] border-y border-[#2a2d3a] py-6">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-3 gap-4 text-center">
          {[
            { label: "منتج متاح", value: "1000+" },
            { label: "عميل سعيد", value: "50K+" },
            { label: "تسليم سريع", value: "24h" },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-2xl font-bold text-purple-400">{stat.value}</p>
              <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">تسوق حسب الفئة</h2>
          <Link
            to="/products"
            className="text-purple-400 hover:text-purple-300 text-sm transition"
          >
            عرض الكل ←
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="relative group">
              <div className="bg-[#1a1d27] border border-[#2a2d3a] hover:border-purple-500/50 rounded-2xl p-4 text-center transition cursor-pointer">
                <div className="text-3xl mb-2">
                  {categoryIcons[cat.name] || "🛍️"}
                </div>
                <p className="font-medium text-gray-300 text-sm group-hover:text-white transition">
                  {cat.name}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {cat.subCategories?.length} أقسام
                </p>
              </div>

              {/* Dropdown */}
              {cat.subCategories?.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1d27] border border-[#2a2d3a] rounded-xl overflow-hidden z-10 hidden group-hover:block">
                  {cat.subCategories.map((sub) => (
                    <Link
                      key={sub.id}
                      to="/products"
                      state={{ categoryId: sub.id }}
                      className="block px-4 py-2 text-sm text-gray-400 hover:bg-[#2a2d3a] hover:text-white transition"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">منتجات مميزة 🔥</h2>
          <Link
            to="/products"
            className="text-purple-400 hover:text-purple-300 text-sm transition"
          >
            عرض الكل ←
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              to={`/products/${product.id}`}
              key={product.id}
              className="bg-[#1a1d27] border border-[#2a2d3a] hover:border-purple-500/30 rounded-2xl overflow-hidden transition group"
            >
              <div className="overflow-hidden h-48">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/300x200/1a1d27/666?text=No+Image")
                  }
                />
              </div>
              <div className="p-4">
                <span className="text-xs text-purple-400">
                  {product.categoryName}
                </span>
                <h3 className="font-semibold text-gray-200 text-sm mt-1 mb-2 line-clamp-2 group-hover:text-white transition">
                  {product.name}
                </h3>
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
                    {product.stockQuantity > 0 ? "متاح" : "نفذ"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1d27] border-t border-[#2a2d3a] py-8 text-center">
        <p className="text-gray-600 text-sm">
          © 2025 ShopZone — جميع الحقوق محفوظة
        </p>
      </footer>
    </div>
  );
}
