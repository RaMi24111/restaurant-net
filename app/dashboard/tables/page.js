"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { QrCode, Trash2, CheckCircle, XCircle, Settings, X } from 'lucide-react';

export default function TablesPage() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [setupCount, setSetupCount] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    fetchTables();
    
    // Check if we've prompted in this session
    const hasPrompted = sessionStorage.getItem('tables_prompted');
    if (!hasPrompted) {
        setShowPrompt(true);
    }
  }, []);

  const fetchTables = async () => {
    try {
      const res = await fetch('/api/tables');
      const data = await res.json();
      if (data.success) {
        setTables(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSetup = async (e) => {
    e.preventDefault();
    if (!setupCount || setupCount < 1) return;
    try {
      setLoading(true);
      const res = await fetch('/api/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: setupCount, reset: true }) 
      });
      const data = await res.json();
      if (data.success) {
          setTables(data.data);
          setShowPrompt(false);
          sessionStorage.setItem('tables_prompted', 'true');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const closePrompt = () => {
      setShowPrompt(false);
      sessionStorage.setItem('tables_prompted', 'true');
  };

  const toggleStatus = async (table) => {
      const newStatus = table.status === 'Occupied' ? 'Empty' : 'Occupied';
      try {
          const res = await fetch(`/api/tables/${table.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: newStatus })
          });
          const data = await res.json();
          if (data.success) {
              setTables(tables.map(t => t.id === table.id ? data.data : t));
          }
      } catch (err) {
          console.error(err);
      }
  };

  const addTable = async () => {
      const nextNo = tables.length > 0 ? tables[tables.length - 1].tableNo + 1 : 1;
      try {
          const res = await fetch('/api/tables', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ tableNo: nextNo, status: 'Empty' })
          });
          const data = await res.json();
          if (data.success) {
              setTables([...tables, data.data]);
          }
      } catch (err) {
          console.error(err);
      }
  };

  const removeTable = async (id) => {
      if (!confirm('Remove this table?')) return;
      try {
          await fetch(`/api/tables/${id}`, { method: 'DELETE' });
          setTables(tables.filter(t => t.id !== id));
      } catch (err) {
          console.error(err);
      }
  };

  return (
    <div className="min-h-screen bg-paper-white text-text-dark p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-serif font-bold text-ruby-red">Table Details</h1>
            <Button onClick={() => setShowPrompt(true)} variant="outline" className="flex items-center gap-2 border-gold-start text-ruby-red hover:bg-gold-start/10">
                <Settings size={18} /> Configure Count
            </Button>
        </div>

        {loading ? (
            <p>Loading tables...</p>
        ) : (
            <div>
                <div className="flex justify-between items-center mb-6">
                    <p className="text-text-muted">Manage table status and QR codes.</p>
                    <Button onClick={addTable} variant="outline" className="flex items-center gap-2 border-gold-start/50 text-ruby-red hover:bg-gold-start/10"><CheckCircle size={16}/> Add Table</Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {tables.map((table, index) => (
                        <motion.div 
                            key={table.id}
                            layout
                            className={`relative p-6 rounded-xl border flex flex-col items-center justify-center gap-4 transition-all shadow-sm ${table.status === 'Occupied' ? 'bg-ruby-red border-ruby-red text-white' : 'bg-card-white border-gold-start/30 text-text-dark hover:border-gold-start hover:shadow-lg'}`}
                        >
                            <div className="absolute top-2 right-2 z-10">
                                <button onClick={(e) => { e.stopPropagation(); removeTable(table.id); }} className={`p-1 rounded transition-colors ${table.status === 'Occupied' ? 'text-white/70 hover:text-white hover:bg-white/20' : 'text-text-muted hover:text-red-500 hover:bg-red-50'}`}><Trash2 size={16}/></button>
                            </div>
                            
                            <div className={`text-3xl font-bold font-serif ${table.status === 'Occupied' ? 'text-gold-end' : 'text-ruby-red'}`}>
                                {table.tableNo}
                            </div>
                            
                            {/* Toggle Switch */}
                            <div 
                                onClick={(e) => { e.stopPropagation(); toggleStatus(table); }}
                                className={`flex items-center gap-2 cursor-pointer px-3 py-1 rounded-full transition-colors ${table.status === 'Occupied' ? 'bg-black/20 text-white' : 'bg-paper-white text-text-muted hover:bg-paper-white/80'}`}
                            >
                                <div className={`w-2 h-2 rounded-full ${table.status === 'Occupied' ? 'bg-gold-end' : 'bg-text-muted'}`}></div>
                                <span className="text-xs uppercase tracking-widest font-bold">{table.status}</span>
                            </div>

                            {/* QR Code Preview */}
                             <div className="mt-2 bg-white p-2 rounded shadow-inner">
                                 {/* eslint-disable-next-line @next/next/no-img-element */}
                                 <img src={table.qrCode} alt={`QR Table ${table.tableNo}`} className="w-16 h-16" />
                             </div>
                             <a href={table.qrCode} download={`table-${table.tableNo}-qr.png`} className={`text-xs underline opacity-60 hover:opacity-100 ${table.status === 'Occupied' ? 'text-white' : 'text-ruby-red'}`}>Download QR</a>
                        </motion.div>
                    ))}
                </div>
            </div>
        )}
      </div>

      {/* Setup Prompt Modal */}
      <AnimatePresence>
        {showPrompt && (
           <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
           >
               <motion.div 
                   initial={{ scale: 0.9, y: 20 }}
                   animate={{ scale: 1, y: 0 }}
                   exit={{ scale: 0.9, y: 20 }}
                   className="bg-card-white border border-gold-start rounded-2xl p-8 max-w-md w-full relative shadow-2xl"
               >
                   <button onClick={closePrompt} className="absolute top-4 right-4 text-text-muted hover:text-ruby-red">
                       <X size={24} />
                   </button>
                   <h2 className="text-3xl font-bold text-ruby-red mb-4 font-serif text-center">Setup Tables</h2>
                   <p className="text-center text-text-muted mb-8">How many tables are in your restaurant?</p>
                   
                   <form onSubmit={handleSetup} className="space-y-6">
                       <Input 
                          placeholder="Number of tables (e.g. 15)" 
                          type="number" 
                          value={setupCount} 
                          onChange={(e) => setSetupCount(e.target.value)}
                          required
                          min="1"
                          className="text-center text-lg bg-paper-white border-gold-start/30 focus:border-ruby-red"
                       />
                       <div className="flex gap-4">
                           <Button type="submit" className="flex-1 bg-ruby-red text-white font-bold hover:bg-ruby-red/90 shadow-lg">Initialize</Button>
                           <Button type="button" variant="outline" onClick={closePrompt} className="flex-1 border-gray-200 text-text-muted hover:bg-gray-50">Skip</Button>
                       </div>
                   </form>
               </motion.div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
