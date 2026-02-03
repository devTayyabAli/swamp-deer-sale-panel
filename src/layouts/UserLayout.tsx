import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import logo from '../assets/logo.png';

const UserLayout = () => {
    const { logout } = useAuth();

    return (
        <div className="min-h-screen flex flex-col bg-neutral-light text-[#111813] font-display">
            <header className="bg-forest-green h-16 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-50 shadow-lg shadow-forest-green/10">
                <div className="flex items-center gap-3 text-white">
                    <div className="size-8 text-warm-gold">
                        <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <Link to="/dashboard" className="text-xl font-black tracking-tighter hover:text-warm-gold transition-colors">SalesPro</Link>
                </div>
                <div className="flex items-center gap-8">
                    <nav className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-white/70">
                        <Link to="/profile" className="hover:text-warm-gold hover:translate-y-[-1px] transition-all">Profile</Link>
                        <Link to="/change-password" className="hover:text-warm-gold hover:translate-y-[-1px] transition-all">Password</Link>
                    </nav>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 group text-white/80 hover:text-warm-gold transition-all font-black text-[11px] uppercase tracking-widest"
                    >
                        <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </header>
            <div className="flex flex-1">
                <main className="flex-1 p-4 sm:p-8 overflow-y-auto w-full bg-neutral-light">
                    <Outlet />
                </main>
            </div>
            <footer className="bg-white border-t border-border-light py-6 px-8 flex flex-col sm:flex-row justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest group">
                <p className="group-hover:text-swamp-deer transition-colors font-black">© {new Date().getFullYear()} Swamp Deer. All rights reserved.</p>
                {/* <div className="flex gap-6 mt-4 sm:mt-0">
                    <a className="hover:text-forest-green transition-colors" href="#">Legal Documentation</a>
                    <a className="hover:text-forest-green transition-colors" href="#">Service Protocols</a>
                </div> */}
            </footer>
        </div>
    );
};

export default UserLayout;
