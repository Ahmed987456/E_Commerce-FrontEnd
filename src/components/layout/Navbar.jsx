import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-[#1a1d27] border-b border-[#2a2d3a] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-purple-500">⚡</span>
          <span>ShopZone</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl hidden md:block">
          <input
            type="text"
            placeholder="ابحث عن منتج..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') navigate(`/products?search=${e.target.value}`);
            }}
            className="w-full bg-[#2a2d3a] border border-[#3a3d4a] text-gray-300 placeholder-gray-500 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 transition"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link to="/products" className="text-gray-400 hover:text-white transition text-sm hidden md:block">
            المنتجات
          </Link>

          {user ? (
            <>
              {user.role === 'Admin' && (
                <Link to="/admin" className="text-purple-400 hover:text-purple-300 transition text-sm font-medium">
                  لوحة التحكم
                </Link>
              )}
              <Link to="/cart" className="relative text-gray-400 hover:text-white transition">
                <span className="text-xl">🛒</span>
              </Link>
              <Link to="/orders" className="text-gray-400 hover:text-white transition text-sm">
                طلباتي
              </Link>
              <div className="flex items-center gap-2 border-r border-[#3a3d4a] pr-3">
                <span className="text-sm text-gray-400">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-lg text-sm hover:bg-red-500/20 transition"
                >
                  خروج
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-400 hover:text-white transition text-sm">
                دخول
              </Link>
              <Link
                to="/register"
                className="bg-purple-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-purple-700 transition"
              >
                حساب جديد
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}