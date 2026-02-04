"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function StaffLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    userId: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const data = await res.json(); // Safely parse JSON

        if (res.ok && data.success) {
            // Check role and redirect?
            // "staff login page - then submit button(login) ... verify with database"
            // Redirect to a dashboard.
            if (typeof window !== 'undefined') {
                localStorage.setItem('staff', JSON.stringify(data.data));
            }
            // For now, redirect to a generic staff dashboard or same dashboard with restricted access?
            // "staff dashboard(which is not yet done)" - User said.
            // But earlier I redirected to `/staff-dashboard-placeholder`
            // I'll stick to that or just `/dashboard` if user wants.
            // Prompt said: "staff dashboard(which is not yet done)".
            // I will redirect to `/dashboard` but maybe show different things.
            // Or just `/staff-dashboard-placeholder` as per prompt history.
            router.push('/staff-dashboard'); 
        } else {
            setError(data.error || 'Login failed');
        }
    } catch (err) {
        setError('Something went wrong. Please try again.');
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-ruby-red/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold-start/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-ruby-red/10 relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-ruby-red mb-2">Staff Portal</h1>
          <p className="text-text-muted">Enter your staff ID to continue</p>
        </div>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-dark">User ID</label>
            <Input 
              placeholder="e.g. SERV-1234" 
              className="bg-paper-white border-ruby-red/10 focus:border-ruby-red text-text-dark placeholder:text-text-muted/50"
              value={formData.userId}
              onChange={(e) => setFormData({...formData, userId: e.target.value})} 
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-dark">Password</label>
            <Input 
              type="password" 
              placeholder="Enter password" 
              className="bg-paper-white border-ruby-red/10 focus:border-ruby-red text-text-dark placeholder:text-text-muted/50"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-ruby-red text-white font-bold hover:bg-ruby-red/90 hover:shadow-lg transition-all"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Login'}
          </Button>
        </form>

        <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-text-muted hover:text-ruby-red underline decoration-ruby-red/30">
                Back to Home
            </Link>
        </div>
      </motion.div>
    </div>
  );
}
