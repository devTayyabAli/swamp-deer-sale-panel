import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { fetchSales } from '../store/slices/salesSlice';

const SalesHistory = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items: sales, pagination, isLoading } = useSelector((state: RootState) => state.sales);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;

    useEffect(() => {
        dispatch(fetchSales({ page: currentPage, limit }));
    }, [dispatch, currentPage]);

    if (isLoading && sales.length === 0) {
        return <div className="min-h-screen flex items-center justify-center">Loading history...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Comprehensive Sales History</h1>
                    <p className="text-gray-500 text-sm mt-1">Review all your logged transactions across the platform.</p>
                </div>
                <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="text-deep-green text-sm font-bold flex items-center gap-1 hover:underline underline-offset-4"
                >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back to Dashboard
                </button>
            </div>

            <div className="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-neutral-light border-b border-border-light">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Investor</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Branch</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Method</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Commission</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light">
                            {sales.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No sales history found.</td>
                                </tr>
                            ) : (
                                sales.map((sale) => (
                                    <tr key={sale._id} className="hover:bg-neutral-light transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                            {new Date(sale.date || sale.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400 text-xs">
                                                    {(sale.investorId as any)?.fullName?.substring(0, 2).toUpperCase() || 'NI'}
                                                </div>
                                                <span className="font-semibold text-gray-900">{(sale.investorId as any)?.fullName || 'No Investor'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
                                            {(sale.branchId as any)?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-sm truncate">{sale.description}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900">Rs {sale.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">{sale.paymentMethod}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={clsx(
                                                "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                                sale.status === 'completed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                    sale.status === 'rejected' ? "bg-red-50 text-red-600 border-red-100" :
                                                        "bg-amber-50 text-amber-600 border-amber-100"
                                            )}>
                                                {sale.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-warm-gold text-right">Rs {sale.commission.toLocaleString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination */}
                <div className="bg-neutral-light/30 px-6 py-4 border-t border-border-light flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest opacity-60">
                        Showing {(pagination.page - 1) * limit + 1} to {Math.min(pagination.page * limit, pagination.total)} of {pagination.total.toLocaleString()} Records
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1 || isLoading}
                            className="p-1 px-3 rounded-lg border border-border-light hover:bg-white text-gray-400 hover:text-swamp-deer transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                            <span className="material-symbols-outlined align-middle">chevron_left</span>
                        </button>

                        {[...Array(pagination.pages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={clsx(
                                    "w-8 h-8 rounded-lg text-sm font-bold transition-all",
                                    currentPage === i + 1
                                        ? "bg-swamp-deer text-white shadow-lg"
                                        : "hover:bg-white hover:text-swamp-deer text-gray-500"
                                )}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(p => Math.min(pagination.pages, p + 1))}
                            disabled={currentPage === pagination.pages || isLoading}
                            className="p-1 px-3 rounded-lg border border-border-light hover:bg-white text-gray-400 hover:text-swamp-deer transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                            <span className="material-symbols-outlined align-middle">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesHistory;
