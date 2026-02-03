import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { fetchSales } from '../store/slices/salesSlice';

const SalesDashboard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items: sales, isLoading } = useSelector((state: RootState) => state.sales);

    useEffect(() => {
        dispatch(fetchSales({ limit: 5 }));
    }, [dispatch]);

    // Derived stats
    const totalAmount = sales.reduce((acc, curr) => acc + curr.amount, 0);
    const totalCommission = sales.reduce((acc, curr) => acc + curr.commission, 0);
    const stats = { totalAmount, totalCommission };

    if (isLoading && sales.length === 0) {
        return <div className="min-h-screen flex items-center justify-center bg-neutral-light font-black text-forest-green animate-pulse">Initializing Dashboard Vault...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-700 pb-12">
            {/* Header section with refined spacing */}
            <div className="flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-4">
                <div className="animate-in slide-in-from-left duration-500">
                    <h1 className="text-xl sm:text-2xl font-black text-forest-green tracking-tight leading-none">Executive Dashboard</h1>
                    <p className="text-gray-400 text-[11px] mt-1.5 font-bold uppercase tracking-widest opacity-70">Operational network overview</p>
                </div>
                <button
                    onClick={() => window.location.href = '/log-sale'}
                    className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded-lg text-[11px] font-black flex items-center justify-center gap-2 hover:bg-forest-green transition-all shadow-xl shadow-forest-green/10 active:scale-95 group"
                >
                    <span className="material-symbols-outlined text-lg group-hover:rotate-90 transition-transform">add_circle</span>
                    LOG NEW TRANSACTION
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white p-6 rounded-2xl border border-border-light shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:scale-125 transition-transform duration-700">
                        <span className="material-symbols-outlined text-[100px]">trending_up</span>
                    </div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Gross Revenue</span>
                        <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-600">
                            <span className="material-symbols-outlined text-xl">analytics</span>
                        </div>
                    </div>
                    <h3 className="text-3xl font-black text-forest-green tracking-tighter relative z-10">
                        Rs {stats.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-3 relative z-10">
                        <div className="h-1 w-12 bg-warm-gold rounded-full"></div>
                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">
                            Lifetime Total
                        </p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-border-light shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:scale-125 transition-transform duration-700">
                        <span className="material-symbols-outlined text-[100px]">payments</span>
                    </div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Net Commission</span>
                        <div className="p-2.5 bg-amber-50 rounded-lg text-warm-gold">
                            <span className="material-symbols-outlined text-xl">rewarded_ads</span>
                        </div>
                    </div>
                    <h3 className="text-3xl font-black text-forest-green tracking-tighter relative z-10">
                        Rs {stats.totalCommission.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-3 relative z-10">
                        <div className="h-1 w-12 bg-emerald-500 rounded-full"></div>
                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">
                            Performance Status
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-border-light shadow-xl shadow-forest-green/5 overflow-hidden animate-in slide-in-from-bottom duration-700">
                <div className="px-6 py-4 border-b border-border-light bg-[#fbfcfa]/50 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-forest-green text-xl">inventory_2</span>
                        <h2 className="text-sm font-black text-forest-green uppercase tracking-wider">Recent Enterprise Sales</h2>
                    </div>
                    <button
                        onClick={() => window.location.href = '/history'}
                        className="text-[10px] font-black text-warm-gold uppercase tracking-[0.15em] hover:text-forest-green transition-colors flex items-center gap-1.5"
                    >
                        Vault View
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#fbfcfa]/30 border-b border-border-light/40">
                            <tr>
                                <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Timestamp</th>
                                <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Stakeholder</th>
                                <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Branch</th>
                                <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Commission</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light/30">
                            {sales.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic text-xs font-bold uppercase tracking-widest opacity-40">
                                        No recent transactions found
                                    </td>
                                </tr>
                            ) : (
                                sales.map((sale) => (
                                    <tr key={sale._id} className="hover:bg-[#fbfcfa]/80 transition-all duration-200 group">
                                        <td className="px-6 py-4 text-xs text-gray-400 font-bold whitespace-nowrap">
                                            {new Date(sale.date || sale.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2.5">
                                                <div className="size-8 rounded-lg bg-forest-green text-warm-gold flex items-center justify-center font-black text-[9px] shadow-sm transform group-hover:rotate-12 transition-transform duration-300">
                                                    {(sale.investorId as any)?.fullName?.substring(0, 2).toUpperCase() || 'NA'}
                                                </div>
                                                <span className="text-[13px] font-bold text-gray-800">{(sale.investorId as any)?.fullName || 'Direct Partner'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold text-gray-500 bg-neutral-light/50 border border-border-light/30">
                                                {(sale.branchId as any)?.name || 'Central Hub'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-[13px] font-black text-forest-green whitespace-nowrap">Rs {sale.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <span className="text-[13px] font-black text-warm-gold">Rs {sale.commission.toLocaleString()}</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SalesDashboard;
