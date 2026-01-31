"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    phone: '',
    otp: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Mock login for now as requested
    // In real scenario, would hit an API
    if (formData.phone && formData.otp) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('admin', JSON.stringify({ phone: formData.phone, role: 'admin' }));
        }
        // Redirect to dashboard
        router.push('/dashboard');
    } else {
        setError('Please enter valid credentials.');
        setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-paper-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gold-start/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-ruby-red/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gold-start/20 relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-ruby-red mb-2">Admin Portal</h1>
          <p className="text-text-muted">Enter credentials to access the dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-dark">Phone Number / User ID</label>
            <Input 
              placeholder="Enter your ID" 
              className="bg-paper-white border-gold-start/30 focus:border-ruby-red text-text-dark placeholder:text-text-muted/50"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-dark">Password / OTP</label>
            <Input 
              type="password" 
              placeholder="Enter password" 
              className="bg-paper-white border-gold-start/30 focus:border-ruby-red text-text-dark placeholder:text-text-muted/50"
              value={formData.otp}
              onChange={(e) => setFormData({...formData, otp: e.target.value})}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-linear-to-r from-gold-start to-gold-end text-ruby-red font-bold hover:shadow-lg transition-all"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Login to Dashboard'}
          </Button>
        </form>

        <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-text-muted hover:text-ruby-red underline decoration-gold-start/50">
                Back to Home
            </Link>
        </div>
      </motion.div>
    </div>
  );
}
