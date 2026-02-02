import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../lib/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const UpdateProfile = () => {
    const { user } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const toastId = toast.loading('Updating profile...');

        try {
            await axios.put('/auth/profile', { name, email });
            toast.success('Profile updated successfully', { id: toastId });
            // Refresh user data or just navigate
            navigate('/dashboard');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to update profile', { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Update Profile</h1>
                <p className="text-gray-500 mt-1">Manage your account information.</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-border-light overflow-hidden">
                <form className="p-6 sm:p-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-900" htmlFor="name">Full Name</label>
                        <input 
                            className="w-full rounded-lg border-border-light focus-gold text-sm p-3" 
                            id="name" 
                            placeholder="Enter your name" 
                            required 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-900" htmlFor="email">Email Address</label>
                        <input 
                            className="w-full rounded-lg border-border-light focus-gold text-sm p-3" 
                            id="email" 
                            placeholder="Enter your email" 
                            required 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-4">
                        <button 
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-500 hover:bg-neutral-light transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-deep-green hover:bg-forest-green text-white text-sm font-bold transition-all shadow-md disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined text-sm">save</span>
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProfile;
