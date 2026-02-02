import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const UserLayout = () => {
    const { logout } = useAuth();

    return (
        <div className="min-h-screen flex flex-col bg-neutral-light text-[#111813] font-display">
            <header className="bg-forest-green h-16 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-50 shadow-lg shadow-forest-green/10">
                <div className="flex items-center gap-3 text-white">
                    <div className="size-8 text-warm-gold">
                        <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd"></path>
                            <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd"></path>
                        </svg>
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
                <p className="group-hover:text-swamp-deer transition-colors font-black">© 2024 SalesPro Management Systems. All rights reserved.</p>
                <div className="flex gap-6 mt-4 sm:mt-0">
                    <a className="hover:text-forest-green transition-colors" href="#">Legal Documentation</a>
                    <a className="hover:text-forest-green transition-colors" href="#">Service Protocols</a>
                </div>
            </footer>
        </div>
    );
};

export default UserLayout;
