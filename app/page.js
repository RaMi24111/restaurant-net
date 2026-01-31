"use client";
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col md:flex-row font-sans">
      {/* Left Image Section - "No overlay, no tint" */}
      <div className="w-full md:w-1/2 relative min-h-[50vh] md:min-h-screen bg-black">
        <Image
          src="/restaurant_hero.png"
          alt="Restaurant Interior"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Right Content Section - Ivory Background */}
      <div className="w-full md:w-1/2 bg-background flex items-center justify-center p-8 md:p-16 relative">
          {/* Decorative Corner Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left max-w-xl z-10"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6 font-serif tracking-tight leading-tight">
              Admin <br/> <span className="text-accent">Control Hub</span>
            </h1>
            <p className="text-xl text-secondary mb-12 font-light tracking-wide leading-relaxed">
              Experience the administration of fine dining with elegance, precision, and a touch of royalty.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start">
               <Link href="/login/staff">
                <Button className="text-lg px-8 py-4 min-w-[180px] bg-primary text-white hover:bg-primary/90 font-bold shadow-[0_4px_14px_rgba(123,31,31,0.4)] hover:shadow-[0_6px_20px_rgba(123,31,31,0.6)] transition-all rounded-full">
                  Staff Login
                </Button>
              </Link>
              <Link href="/login/admin">
                <Button variant="outline" className="text-lg px-8 py-4 min-w-[180px] border-2 border-accent text-primary hover:bg-accent hover:text-white font-bold transition-all rounded-full">
                  Admin Login
                </Button>
              </Link>
            </div>
          </motion.div>
      </div>
    </main>
  );
}
