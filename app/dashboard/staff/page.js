"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Receipt, Coffee, Utensils } from 'lucide-react';

export default function StaffManagement() {

  return (
    <div className="min-h-screen bg-ruby-red relative overflow-hidden flex items-center justify-center p-8 font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-gold-start rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-gold-end rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-6xl w-full mx-auto relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-serif font-bold text-transparent bg-clip-text bg-linear-to-r from-gold-start via-white to-gold-end mb-4 drop-shadow-sm">Staff Management</h1>
          <p className="text-white/60 text-xl font-light tracking-wide italic font-serif">Select a role to manage credentials and access.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <Link href="/dashboard/staff/billing">
            <motion.div 
               whileHover={{ y: -10, scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               className="bg-white/10 backdrop-blur-md p-14 rounded-3xl border border-white/10 flex flex-col items-center justify-center gap-8 cursor-pointer hover:border-gold-start/50 hover:bg-white/15 hover:shadow-[0_20px_60px_rgba(212,175,55,0.2)] transition-all duration-500 group"
            >
              <div className="p-8 bg-linear-to-br from-gold-start to-gold-end rounded-full text-ruby-red shadow-lg group-hover:scale-110 transition-transform duration-500">
                 <Receipt size={48} />
              </div>
              <div className="text-center">
                  <h2 className="text-4xl font-bold text-white mb-3 font-serif group-hover:text-gold-start transition-colors">Billing Staff</h2>
                  <p className="text-white/60 font-light">Manage cashier terminals and transaction logs.</p>
              </div>
            </motion.div>
          </Link>

          <Link href="/dashboard/staff/serving">
            <motion.div 
               whileHover={{ y: -10, scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               className="bg-white/10 backdrop-blur-md p-14 rounded-3xl border border-white/10 flex flex-col items-center justify-center gap-8 cursor-pointer hover:border-gold-start/50 hover:bg-white/15 hover:shadow-[0_20px_60px_rgba(212,175,55,0.2)] transition-all duration-500 group"
            >
              <div className="p-8 bg-linear-to-br from-gold-start to-gold-end rounded-full text-ruby-red shadow-lg group-hover:scale-110 transition-transform duration-500">
                 <Utensils size={48} />
              </div>
              <div className="text-center">
                  <h2 className="text-4xl font-bold text-white mb-3 font-serif group-hover:text-gold-start transition-colors">Serving Staff</h2>
                  <p className="text-white/60 font-light">Manage floor staff and service assignments.</p>
              </div>
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
}
