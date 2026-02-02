import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from '../lib/axios';

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading('Resetting password...');

        try {
            await axios.put(`/auth/resetpassword/${token}`, { password });
            toast.success('Password reset successful. Please login.', { id: toastId });
            navigate('/');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to reset password. Link may be expired.', { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-light flex flex-col items-center justify-center p-4 font-display">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-border-light overflow-hidden">
                <div className="h-2 bg-linear-to-r from-deep-green to-forest-green"></div>
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
                        <p className="text-gray-500 mt-2 text-sm">Create a new secure password for your account.</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-900" htmlFor="password">New Password</label>
                            <div className="relative">
                                <input 
                                    className="w-full rounded-xl border-border-light focus-gold p-3.5 pr-12 text-sm transition-all" 
                                    id="password" 
                                    placeholder="Enter new password" 
                                    required 
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-deep-green transition-colors"
                                >
                                    <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-900" htmlFor="confirm-password">Confirm Password</label>
                            <div className="relative">
                                <input 
                                    className="w-full rounded-xl border-border-light focus-gold p-3.5 pr-12 text-sm transition-all" 
                                    id="confirm-password" 
                                    placeholder="Confirm new password" 
                                    required 
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-deep-green transition-colors"
                                >
                                    <span className="material-symbols-outlined text-xl">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                                </button>
                            </div>
                        </div>

                        <button 
                            disabled={isLoading}
                            className="w-full py-3.5 bg-deep-green hover:bg-forest-green text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                            type="submit"
                        >
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <Link to="/" className="text-deep-green hover:text-forest-green font-bold text-sm transition-colors flex items-center justify-center gap-1">
                            Cancel and Return to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
