import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle, Loader2, ShieldCheck, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminLoginPage.css';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('admin@webtrekitsolutions.in');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Authentication failed. Please verify credentials or ensure backend is running.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#021343] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#fe8a04]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/20 space-y-6">
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#fe8a04] to-[#ff5e13] text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-glow-orange">
              W
            </div>
            <h2 className="font-heading font-black text-2xl text-[#021343]">
              Admin Control Center
            </h2>
            <p className="text-xs text-gray-500">
              Sign in with your verified credentials to manage Webtrek IT Solutions
            </p>
            <div className="mt-2 py-1.5 px-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 font-medium">
              Default Login: <strong className="text-gray-900">admin@webtrekitsolutions.in</strong> &nbsp;|&nbsp; Password: <strong className="text-gray-900">admin123</strong>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-600">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@webtrekitsolutions.in"
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#fe8a04] focus:ring-2 focus:ring-[#fe8a04]/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#fe8a04] focus:ring-2 focus:ring-[#fe8a04]/20 transition-all"
                />
              </div>
            </div>

            {/* Quick credential reminder */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 space-y-1">
              <span className="font-bold block">Default Administrator Credentials:</span>
              <div>Email: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">admin@webtrekitsolutions.in</code></div>
              <div>Pass: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">Admin@Webtrek2026!</code></div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#fe8a04] to-[#ff5e13] text-white py-3.5 rounded-xl font-bold text-sm shadow-glow-orange hover:shadow-orange-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In To Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#021343] transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;

