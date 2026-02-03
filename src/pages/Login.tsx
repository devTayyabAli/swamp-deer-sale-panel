import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import logo from '../assets/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading('Signing in...');
    try {
      await login({ email, password });
      toast.success('Welcome back!', { id: toastId });
      navigate('/dashboard');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Failed to login', { id: toastId });
      } else {
        toast.error('Failed to login', { id: toastId });
      }
    }
  };

  return (
    <div className="bg-neutral-light font-display min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-forest-green/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-warm-gold/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

      <main className="w-full max-w-[440px] relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4 bg-forest-green p-3 rounded-2xl shadow-xl shadow-forest-green/20">
            <div className="size-8 text-warm-gold">
              <img src={logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          {/* <h1 className="text-3xl font-black text-forest-green tracking-tight mb-2">Internal Access</h1>
            <p className="text-gray-500 text-sm font-medium italic">Secure Enterprise Resource Planning Gateway</p> */}
        </div>

        <div className="bg-white rounded-[32px] shadow-2xl shadow-forest-green/10 border border-border-light p-8 sm:p-10 relative overflow-hidden group">
          {/* Subtle gold accent line at the top */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-warm-gold via-swamp-deer to-warm-gold opacity-80"></div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Identity Endpoint (Email)</label>
              <div className="relative group/input">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/input:text-warm-gold transition-colors">alternate_email</span>
                <input
                  className="w-full pl-12 pr-4 py-4 bg-[#fbfcfa] border border-border-light rounded-2xl text-forest-green font-bold text-sm focus:ring-4 focus:ring-warm-gold/10 focus:border-warm-gold outline-none transition-all placeholder:text-gray-300"
                  placeholder="e.g. operative@salespro.com"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Access Protocol (Password)</label>
              <div className="relative group/input">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/input:text-warm-gold transition-colors">lock</span>
                <input
                  className="w-full pl-12 pr-12 py-4 bg-[#fbfcfa] border border-border-light rounded-2xl text-forest-green font-bold text-sm focus:ring-4 focus:ring-warm-gold/10 focus:border-warm-gold outline-none transition-all placeholder:text-gray-300"
                  placeholder="Enter secure key"
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-forest-green transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <Link to="/forgot-password" title="Lost Credentials?" className="text-[10px] font-black uppercase tracking-widest text-swamp-deer hover:text-warm-gold transition-colors">
                Lost Credentials?
              </Link>
            </div>

            <button
              disabled={isLoading}
              className="w-full bg-forest-green hover:bg-black text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-forest-green/20 hover:shadow-forest-green/30 active:scale-95 transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-2 group/btn"
              type="submit"
            >
              {isLoading ? (
                <div className="size-4 border-2 border-warm-gold border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Initiate Session
                  <span className="material-symbols-outlined text-sm text-warm-gold group-hover/btn:translate-x-1 transition-transform">login</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      <footer className="mt-12 text-center space-y-4 relative z-10 animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">© {new Date().getFullYear()} Swamp Deer</p>
        {/* <div className="flex justify-center gap-6">
          <a className="text-[10px] font-black text-swamp-deer uppercase tracking-widest hover:text-warm-gold transition-colors" href="#">Legal Documentation</a>
          <a className="text-[10px] font-black text-swamp-deer uppercase tracking-widest hover:text-warm-gold transition-colors" href="#">Security Protocols</a>
        </div> */}
      </footer>
    </div>
  );
};

export default Login;
