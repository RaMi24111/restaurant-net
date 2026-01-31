"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Utensils, LayoutGrid, Receipt, Users } from 'lucide-react';

export default function Dashboard() {
  const menuItems = [
    { 
      title: 'Menu Management', 
      icon: <Utensils size={48} />, 
      href: '/dashboard/menu',
      description: 'Add, update, or remove menu items.'
    },
    { 
      title: 'Staff Management', 
      icon: <Users size={48} />, 
      href: '/dashboard/staff',
      description: 'Manage billing and serving staff credentials.'
    },
    { 
      title: 'Table Details', 
      icon: <LayoutGrid size={48} />, 
      href: '/dashboard/tables',
      description: 'Configure layout, view status, and QR codes.'
    },
    { 
      title: 'Order Bill', 
      icon: <Receipt size={48} />, 
      href: '/dashboard/orders',
      description: 'View daily orders and billing history.'
    },
  ];

  return (
    <div className="min-h-screen font-sans relative flex flex-col">
       {/* Background Image */}
       <div className="fixed inset-0 z-0">
          <img 
            src="/restaurant_hero.png" 
            alt="Background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-paper-white/80"></div>
       </div>

      {/* Header Section */}
      <header className="relative z-10 bg-ruby-red py-12 px-8 shadow-2xl border-b-4 border-gold-start text-center">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-serif font-bold text-transparent bg-clip-text bg-linear-to-r from-gold-start via-white to-gold-end mb-4 drop-shadow-sm">
              Admin Dashboard
            </h1>
            <p className="text-gold-start/80 text-lg tracking-wide uppercase font-semibold">
              Oversee your fine dining operations
            </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex-1 p-8 md:p-16 flex items-center">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {menuItems.map((item, index) => (
            <Link href={item.href} key={index}>
                <motion.div
                whileHover={{ y: -10, scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-card-white/90 backdrop-blur-md border border-white/50 p-8 rounded-2xl h-full flex flex-col items-center text-center cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgba(212,175,55,0.3)] hover:border-gold-start transition-all duration-300 group relative overflow-hidden"
                >
                <div className="absolute inset-0 bg-linear-to-br from-gold-start/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="mb-6 text-ruby-red p-5 bg-paper-white rounded-full group-hover:bg-ruby-red group-hover:text-gold-start transition-colors duration-300 shadow-inner relative z-10">
                    {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-text-dark group-hover:text-ruby-red transition-colors font-serif relative z-10">{item.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed relative z-10">{item.description}</p>
                </motion.div>
            </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
