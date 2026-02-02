import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { createNewInvestor, fetchInvestors } from '../store/slices/investorSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import SearchableDropdown from '../components/SearchableDropdown';

const CreateInvestor = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items: allInvestors } = useSelector((state: RootState) => state.investors);
    
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [selectedUpline, setSelectedUpline] = useState('');
    
    // Local loading state
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get('type') || 'investor'; // default to investor
    const isAddingReferrer = type === 'referrer';

    useEffect(() => {
        // Fetch all potential partners for the upline dropdown
        dispatch(fetchInvestors({ limit: -1 }));
    }, [dispatch]);

    const referrers = allInvestors || [];

    const handleSubmit = async () => {
        if (!fullName || !phone || !email || !address) {
            toast.error('Please fill in all fields');
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading(`Creating ${isAddingReferrer ? 'Referrer' : 'Investor'}...`);
        try {
            await dispatch(createNewInvestor({ 
                fullName, 
                email,
                phone, 
                address, 
                role: isAddingReferrer ? 'referrer' : 'investor',
                upline: selectedUpline || undefined
            })).unwrap();
            
            toast.success(`${isAddingReferrer ? 'Referrer' : 'Investor'} added successfully`, { id: toastId });
            navigate('/log-sale'); // Navigate back to sales entry
        } catch (err: unknown) {
            if (typeof err === 'string') {
                 toast.error(err, { id: toastId });
            } else {
                 toast.error('Failed to add profile', { id: toastId });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-[600px] w-full mx-auto py-12 sm:py-20 px-4 sm:px-6 animate-in fade-in duration-700 font-display">
            <div className="text-center mb-12">
                <h1 className="text-forest-green text-3xl sm:text-4xl font-black leading-tight tracking-tight mb-3">
                    {isAddingReferrer ? 'Referrer Account Setup' : 'Investor Account Setup'}
                </h1>
                <p className="text-[#61896f] text-base font-medium italic opacity-70">
                    {isAddingReferrer ? 'Onboard a new strategic partner to the referral network' : 'Create a new profile for a participating investor'}
                </p>
            </div>

            <div className="bg-white rounded-[24px] shadow-2xl border border-[#dbe6df] overflow-hidden">
                <div className="p-8 sm:p-10 space-y-8">
                    <div className="grid grid-cols-1 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest ml-1 opacity-70" htmlFor="full-name">Full Name</label>
                            <input 
                                className="w-full rounded-lg border-[#dbe6df] bg-white focus:ring-2 focus:ring-[#006820]/5 focus:border-[#006820] text-sm p-3.5 placeholder:text-gray-400 font-medium transition-all" 
                                id="full-name" 
                                placeholder="e.g. Ali Khan" 
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest ml-1 opacity-70" htmlFor="phone">Phone Number</label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-lg opacity-50">call</span>
                                <input 
                                    className="w-full rounded-lg border-[#dbe6df] bg-white focus:ring-2 focus:ring-[#006820]/5 focus:border-[#006820] text-sm pl-11 p-3.5 placeholder:text-gray-400 font-medium transition-all" 
                                    id="phone" 
                                    placeholder="+92 300 1234567" 
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest ml-1 opacity-70" htmlFor="email">Email Address</label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-lg opacity-50">mail</span>
                                <input 
                                    className="w-full rounded-lg border-[#dbe6df] bg-white focus:ring-2 focus:ring-[#006820]/5 focus:border-[#006820] text-sm pl-11 p-3.5 placeholder:text-gray-400 font-medium transition-all" 
                                    id="email" 
                                    placeholder="e.g. contact@example.com" 
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <SearchableDropdown 
                            label={isAddingReferrer ? "Referrer Upline (Optional)" : "Upline (Referrer)"}
                            placeholder="Select Upline Partner..."
                            options={referrers}
                            value={selectedUpline}
                            onChange={(val) => setSelectedUpline(val)}
                            icon="hub"
                        />

                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest ml-1 opacity-70" htmlFor="address">Address</label>
                            <textarea 
                                className="w-full rounded-lg border-[#dbe6df] bg-white focus:ring-2 focus:ring-[#006820]/5 focus:border-[#006820] text-sm p-3.5 placeholder:text-gray-400 font-medium transition-all" 
                                id="address" 
                                placeholder="Enter residential or office address details..." 
                                rows={3}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            ></textarea>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-[#f0f4f2] flex flex-col-reverse sm:flex-row items-center justify-between gap-6 sm:gap-0">
                        <button 
                            type="button"
                            onClick={() => navigate('/log-sale')}
                            className="text-sm font-black text-gray-400 hover:text-forest-green uppercase tracking-widest transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 rounded-xl bg-forest-green hover:bg-black text-white text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-forest-green/20 disabled:opacity-50 group/btn"
                        >
                            <span>{isSubmitting ? 'Syncing...' : `Create ${isAddingReferrer ? 'Referrer' : 'Investor'}`}</span>
                            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateInvestor;
