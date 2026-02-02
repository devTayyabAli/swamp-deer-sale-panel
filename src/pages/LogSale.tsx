import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { createNewSale } from '../store/slices/salesSlice';
import { fetchBranches } from '../store/slices/branchSlice';
import { fetchInvestors } from '../store/slices/investorSlice';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import SearchableDropdown from '../components/SearchableDropdown';

const LogSale = () => {
    const { user } = useAuth();
    const dispatch = useDispatch<AppDispatch>();
    
    // Redux state
    const { items: branches } = useSelector((state: RootState) => state.branches);
    const { items: allInvestors } = useSelector((state: RootState) => state.investors);
    
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState<number>(0);
    const [commissionRate, setCommissionRate] = useState(0.05); // Default 5%
    const [investorProfitRate, setInvestorProfitRate] = useState(0.10); // Default 10%
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedInvestor, setSelectedInvestor] = useState('');
    const [selectedReferrer, setSelectedReferrer] = useState('company');
    const [paymentMethod, setPaymentMethod] = useState<'Cash in hand' | 'Bank account'>('Cash in hand');
    
    // Local loading state for form submission interaction
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successSale, setSuccessSale] = useState<{ _id: string, documentPath?: string } | null>(null);
    
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch dependencies
        dispatch(fetchBranches({ limit: -1 }));
        // For the LogSale page, we want to fetch both investors and referrers
        // The slice currently fetches all, but we might want to filter or just use all and filter locally
        dispatch(fetchInvestors({ limit: -1 }));
    }, [dispatch]);

    // Local filtering for Referrers and Investors
    const referrers = [
        { _id: 'company', fullName: 'Company Referral', phone: 'Internal', isReferrer: true },
        ...(allInvestors || [])
    ];
    const investors = allInvestors || [];

    useEffect(() => {
        if (!user) return;
        
        // Extract branch ID from user object (handles populated or ID only)
        const userBranchId = user.branchId;
        const branchIdStr = typeof userBranchId === 'string' ? userBranchId : (userBranchId as any)?._id || (userBranchId as any)?.id;
        
        if (branchIdStr && !selectedBranch) {
            setSelectedBranch(branchIdStr);
        }
    }, [user, selectedBranch]);

    useEffect(() => {
        if (selectedInvestor) {
            const investor = (allInvestors || []).find(i => i._id === selectedInvestor);
            if (investor && investor.upline) {
                const uplineId = typeof investor.upline === 'string' ? investor.upline : (investor.upline as any)?._id;
                if (uplineId) {
                    setSelectedReferrer(uplineId);
                }
            } else {
                // Default back to company if no upline exists
                setSelectedReferrer('company');
            }
        }
    }, [selectedInvestor, allInvestors]);

    const calculatedCommission = amount * commissionRate;

    const handleSubmit = async () => {
        const missingFields = [];
        if (!selectedInvestor) missingFields.push('Investor');
        if (!description) missingFields.push('Description');
        if (!amount) missingFields.push('Amount');
        if (!paymentMethod) missingFields.push('Payment Method');
        if (!selectedBranch) missingFields.push('Branch');

        if (missingFields.length > 0) {
            toast.error(`Please provide: ${missingFields.join(', ')}`);
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading('Logging sale...');
        try {
            const result = await dispatch(createNewSale({
                branch: selectedBranch,
                investor: selectedInvestor,
                referrer: selectedReferrer === 'company' ? undefined : selectedReferrer,
                customerName: 'Walk-in Client', // Could add field for this
                description,
                amount,
                commission: calculatedCommission,
                investorProfit: amount * investorProfitRate,
                paymentMethod
            })).unwrap(); // Unwrap to catch errors in the try/catch block
            
            toast.success('Sale logged successfully!', { id: toastId });
            setSuccessSale(result);
            // Don't navigate immediately, let them see the success state/print button
            // navigate('/dashboard');
        } catch (err: unknown) {
            if (typeof err === 'string') {
                 toast.error(err, { id: toastId });
            } else {
                 toast.error('Failed to log sale', { id: toastId });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddReferrer = () => {
        navigate('/create-investor?type=referrer');
    };

    const handleAddInvestor = () => {
        navigate('/create-investor?type=investor');
    };

    const handlePrint = () => {
        if (successSale?.documentPath) {
            const apiBase = 'http://localhost:5000'; // Should ideally come from env
            window.open(`${apiBase}/${successSale.documentPath}`, '_blank');
        }
    };

    if (successSale) {
        return (
            <div className="max-w-[520px] w-full mx-auto py-24 px-4 sm:px-6 animate-in fade-in zoom-in duration-700 font-display">
                <div className="bg-white rounded-[32px] shadow-[0_25px_60px_-15px_rgba(0,104,32,0.12)] border border-[#dbe6df]/40 overflow-hidden text-center p-10 sm:p-14 relative">
                    {/* Background subtle gradient element */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#006820]/40 to-transparent"></div>
                    
                    <div className="size-20 bg-[#f0f7f2] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <span className="material-symbols-outlined text-[#006820] text-4xl font-black">check_circle</span>
                    </div>
                    
                    <h1 className="text-[#111813] text-3xl font-black mb-4 tracking-tight leading-[1.1]">Sale Logged Successfully!</h1>
                    <p className="text-[#61896f] text-[15px] font-medium mb-12 leading-relaxed px-2">
                        The investment document has been generated and is ready for the investor to review.
                    </p>
                    
                    <div className="space-y-4">
                        <button 
                            onClick={handlePrint}
                            className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#006820] hover:bg-black text-white text-[15px] font-black transition-all shadow-xl shadow-[#006820]/15 active:scale-[0.98]"
                        >
                            <span className="material-symbols-outlined text-xl">print</span>
                            Print Investment Receipt
                        </button>
                        
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border-2 border-[#f0f4f2] text-[#4a5f52] text-[15px] font-bold hover:bg-[#fbfcfa] hover:border-[#dbe6df] transition-all active:scale-[0.98]"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                    
                    <button 
                        onClick={() => setSuccessSale(null)}
                        className="mt-10 text-[#006820] font-black text-xs uppercase tracking-widest hover:opacity-70 transition-opacity"
                    >
                        Log Another Sale
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[840px] w-full mx-auto py-12 sm:py-24 px-4 sm:px-6 animate-in fade-in slide-in-from-bottom duration-1000 font-display">
            <div className="text-center mb-12">
                <h1 className="text-[#111813] text-4xl sm:text-[42px] font-black leading-tight tracking-[-0.03em] mb-3">Log New Sale Entry</h1>
                <p className="text-[#61896f] text-[15px] font-medium opacity-70 italic tracking-tight">Record a new transaction for your branch</p>
            </div>

            <div className="bg-white rounded-[16px] shadow-2xl border border-[#dbe6df]/60 overflow-hidden">
                {/* Current Context Section */}
                <div className="p-8 pb-10 border-b border-[#f0f4f2]">
                    <h2 className="text-[#006820] text-[11px] font-black uppercase tracking-[0.2em] mb-8">
                        CURRENT CONTEXT
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Referrer Selector */}
                        <SearchableDropdown 
                            label="Referrer Info"
                            placeholder="Select Referrer..."
                            options={referrers}
                            value={selectedReferrer}
                            onChange={(val) => setSelectedReferrer(val)}
                            onAddNew={handleAddReferrer}
                            addNewLabel="Add Referrer"
                            icon="person"
                        />

                        {/* Investor Selector */}
                        <SearchableDropdown 
                            label="Investor Info"
                            placeholder="Select Investor..."
                            options={investors}
                            value={selectedInvestor}
                            onChange={(val) => setSelectedInvestor(val)}
                            onAddNew={handleAddInvestor}
                            addNewLabel="Add Investor"
                            icon="person"
                        />

                         {/* Branch Display (Readonly) */}
                        <div className="flex flex-col gap-2.5 relative">
                            <div className="flex justify-between items-center mb-0.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Assigned Branch</label>
                            </div>
                            <div className="w-full flex items-center gap-3 px-4 py-3 bg-[#fbfcfa] border border-[#dbe6df] rounded-lg text-left shadow-sm opacity-80 cursor-not-allowed">
                                <span className="material-symbols-outlined text-lg text-gray-400 opacity-50">location_on</span>
                                <span className="text-[14px] font-bold text-forest-green truncate">
                                    {(user?.branchId as any)?.name || branches.find(b => b._id === selectedBranch)?.name || 'Loading branch info...'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sale Details Section */}
                <div className="p-10 space-y-12">
                    <div className="space-y-8">
                        <h2 className="text-[#111813] text-2xl font-black tracking-tight flex items-center gap-3 mb-8">
                            Sale Details
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2 col-span-1">
                                <label className="text-[11px] font-black text-[#111813] uppercase tracking-widest ml-1 opacity-70">Sale Description</label>
                                <input 
                                    className="w-full rounded-lg border-[#dbe6df] bg-white focus:ring-2 focus:ring-[#006820]/5 focus:border-[#006820] text-[13px] p-3 placeholder:text-gray-300 font-medium transition-all" 
                                    placeholder="Enter specific details about the sale items" 
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-[#111813] uppercase tracking-widest ml-1 opacity-70">Investor Type</label>
                                <div className="relative">
                                    <select className="w-full rounded-lg border-[#dbe6df] bg-white focus:ring-2 focus:ring-[#006820]/5 focus:border-[#006820] text-[13px] p-3 font-medium text-gray-700">
                                        <option>With Product</option>
                                         <option>With Out Product</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-[#111813] uppercase tracking-widest ml-1 opacity-70">Investor Profit Rate</label>
                                <div className="relative">
                                    <select 
                                        className="w-full rounded-lg border-[#dbe6df] bg-white focus:ring-2 focus:ring-[#006820]/5 focus:border-[#006820] text-[13px] p-3 font-medium text-gray-700"
                                        onChange={(e) => setInvestorProfitRate(parseFloat(e.target.value))}
                                        value={investorProfitRate}
                                    >
                                        <option value={0.10}>10% Profit Share</option>
                                        <option value={0.15}>15% Profit Share</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-[#111813] uppercase tracking-widest ml-1 opacity-70">Amount (USD)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-[13px]">$</span>
                                    <input 
                                        className="w-full rounded-lg border-[#dbe6df] bg-white focus:ring-2 focus:ring-[#006820]/5 focus:border-[#006820] text-[13px] pl-10 p-3 font-bold text-gray-900 transition-all" 
                                        placeholder="0.00" 
                                        type="number"
                                        value={amount || ''}
                                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-[#111813] uppercase tracking-widest ml-1 opacity-70">Commission Rate</label>
                                <div className="relative">
                                    <select 
                                        className="w-full rounded-lg border-[#dbe6df] bg-white focus:ring-2 focus:ring-[#006820]/5 focus:border-[#006820] text-[13px] p-3 pr-10 font-medium text-gray-700 transition-all" 
                                        id="commission-select"
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === 'standard') setCommissionRate(0.05);
                                            else if (val === 'premium') setCommissionRate(0.08);
                                        }}
                                    >
                                        <option value="standard">Standard (5%)</option>
                                        <option value="premium">Premium (8%)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-[#111813] uppercase tracking-widest ml-1 opacity-70">Payment Method</label>
                                <div className="relative">
                                    <select 
                                        className="w-full rounded-lg border-[#dbe6df] bg-white focus:ring-2 focus:ring-[#006820]/5 focus:border-[#006820] text-[13px] p-3 font-medium text-gray-700 transition-all" 
                                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                                        value={paymentMethod}
                                    >
                                        <option value="Cash in hand">Cash in hand</option>
                                        <option value="Bank account">Bank account</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Calculated Commission Card */}
                        <div className="p-8 mt-12 bg-white rounded-xl border-[2px] border-[#D4AF37] relative overflow-hidden group/reward shadow-[0_8px_30px_rgb(212,175,55,0.06)]">
                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-8">
                                    <div className="size-14 bg-[#D4AF37] rounded-lg shadow-xl shadow-[#D4AF37]/20 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-white text-3xl font-black">payments</span>
                                    </div>
                                    <div>
                                        <p className="text-[#61896f] text-[10px] font-black uppercase tracking-[0.25em] mb-1">CALCULATED COMMISSION</p>
                                        <p className="text-[#D4AF37] text-5xl font-black tracking-tighter tabular-nums leading-none">${calculatedCommission.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end gap-2">
                                    <p className="text-[#61896f] text-[11px] font-bold italic tracking-tight opacity-50">Based on {(commissionRate * 100).toFixed(0)}% branch rate</p>
                                    <div className="flex items-center gap-2 text-[#006820] font-black text-[11px] uppercase bg-[#006820]/5 px-4 py-2 rounded-full border border-[#006820]/10">
                                        <span className="material-symbols-outlined text-[15px]">verified</span>
                                        Auto-calculated
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-[#f0f4f2] flex flex-col sm:flex-row items-center justify-between gap-8 mt-12">
                        <p className="text-[11px] text-[#61896f] font-medium max-w-[440px] text-center sm:text-left leading-relaxed opacity-60">
                            By clicking "Submit Sale", you confirm that the above details are accurate and comply with the branch sales policy.
                        </p>
                        <div className="flex items-center gap-12 w-full sm:w-auto">
                            <button 
                                onClick={() => navigate('/dashboard')}
                                className="text-[15px] font-black text-gray-400 hover:text-[#006820] transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex items-center justify-center gap-3 px-10 py-3.5 rounded-lg bg-[#006820] hover:bg-black text-white text-[15px] font-black transition-all shadow-2xl shadow-[#006820]/20 disabled:opacity-50 group/submit"
                            >
                                <span>Submit Sale</span>
                                <span className="text-white opacity-40 font-light ml-1">&gt;</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogSale;
