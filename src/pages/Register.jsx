import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosInstance';

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/Users', {
        Name: form.name,
        Email: form.email,
        Password: form.password,
      });
      navigate('/login');
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        setError(Object.values(errors).flat().join(' | '));
      } else {
        setError(err.response?.data || 'حصل خطأ، حاول تاني');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <span className="text-4xl">⚡</span>
          <h1 className="text-2xl font-bold text-white mt-2">إنشاء حساب جديد</h1>
          <p className="text-gray-500 text-sm mt-1">انضم إلينا دلوقتي</p>
        </div>

        <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-2xl p-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">الاسم</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="اسمك الكامل"
                className="w-full bg-[#0f1117] border border-[#2a2d3a] text-gray-300 placeholder-gray-600 rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">البريد الإلكتروني</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="example@email.com"
                className="w-full bg-[#0f1117] border border-[#2a2d3a] text-gray-300 placeholder-gray-600 rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">كلمة المرور</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full bg-[#0f1117] border border-[#2a2d3a] text-gray-300 placeholder-gray-600 rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2.5 rounded-xl hover:bg-purple-700 transition font-semibold disabled:opacity-50 mt-2"
            >
              {loading ? 'جاري الإنشاء...' : 'إنشاء حساب'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            عندك حساب؟{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 transition">
              سجل دخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}