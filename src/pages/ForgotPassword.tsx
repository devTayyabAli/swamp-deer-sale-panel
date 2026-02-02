import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import axios from '../lib/axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const toastId = toast.loading('Sending reset link...');

        try {
            await axios.post('/auth/forgotpassword', { email });
            toast.success('Reset link sent to your email', { id: toastId });
            setIsSent(true);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to send reset link', { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    if (isSent) {
        return (
            <div className="min-h-screen bg-neutral-light flex flex-col items-center justify-center p-4 font-display">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-border-light p-8 text-center">
                    <div className="size-16 bg-deep-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-deep-green text-3xl">mark_email_read</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
                    <p className="text-gray-500 mb-8">
                        We've sent a password reset link to <span className="font-bold text-gray-700">{email}</span>. Please check your inbox and follow the instructions.
                    </p>
                    <Link 
                        to="/" 
                        className="inline-block w-full py-3 bg-deep-green hover:bg-forest-green text-white font-bold rounded-xl transition-all shadow-md"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-light flex flex-col items-center justify-center p-4 font-display">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-border-light overflow-hidden">
                <div className="h-2 bg-linear-to-r from-deep-green to-forest-green"></div>
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>
                        <p className="text-gray-500 mt-2 text-sm">Enter your email and we'll send you a link to reset your password.</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-900" htmlFor="email">Email Address</label>
                            <input 
                                className="w-full rounded-xl border-border-light focus-gold p-3.5 text-sm" 
                                id="email" 
                                placeholder="Enter your email" 
                                required 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <button 
                            disabled={isLoading}
                            className="w-full py-3.5 bg-deep-green hover:bg-forest-green text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                            type="submit"
                        >
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <Link to="/" className="text-deep-green hover:text-forest-green font-bold text-sm transition-colors flex items-center justify-center gap-1">
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
