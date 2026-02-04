"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Save, X, Eye, EyeOff, ArrowLeft, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function StaffList() {
  const params = useParams();
  const router = useRouter();
  const type = params.type; // 'billing' or 'serving'
  
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', phone: '' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', phone: '' });

  useEffect(() => {
    fetchStaff();
  }, [type]);

  const fetchStaff = async () => {
    try {
      const res = await fetch(`/api/staff?type=${type}`);
      const data = await res.json();
      if (data.success) {
        setStaffList(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newStaff, role: type })
      });
      const data = await res.json();
      if (data.success) {
        setStaffList([data.data, ...staffList]);
        setIsAdding(false);
        setNewStaff({ name: '', phone: '' });
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Failed to add staff:', error);
    }
  };

  const handleDelete = async (id) => {
    if(!confirm("Are you sure you want to delete this staff member?")) return;
    try {
        const res = await fetch(`/api/staff?id=${id}`, { method: 'DELETE' });
        const data = await res.json();
        if(data.success) {
            setStaffList(staffList.filter(s => s.id !== id));
        }
    } catch (error) {
        console.error('Failed to delete staff:', error);
    }
  };

  const startEdit = (staff) => {
      setEditingId(staff.id);
      setEditForm({ name: staff.name, phone: staff.phone });
  };

  const saveEdit = async () => {
      try {
          const res = await fetch('/api/staff', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: editingId, ...editForm })
          });
          const data = await res.json();
          if(data.success) {
              setStaffList(staffList.map(s => s.id === editingId ? data.data : s));
              setEditingId(null);
          }
      } catch (error) {
          console.error("Failed to update staff:", error);
      }
  };

  return (
    <div className="min-h-screen bg-paper-white text-text-dark p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-6 mb-12">
            <Link href="/dashboard/staff">
                <Button variant="ghost" className="text-ruby-red hover:bg-ruby-red/10 rounded-full p-2"><ArrowLeft size={28} /></Button>
            </Link>
            <div>
              <h1 className="text-5xl font-serif font-bold text-ruby-red capitalize tracking-tight mb-2">{params.type} Staff</h1>
              <p className="text-text-muted font-serif italic text-lg opacity-80">Manage your term details and access permissions.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Add New Staff Form */}
            <div className="lg:col-span-4 h-fit sticky top-8">
                <div className="bg-white p-8 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-gold-start/20">
                    <h2 className="text-2xl font-bold text-ruby-red mb-6 font-serif border-b border-gold-start/10 pb-4">Add New Member</h2>
                    <form onSubmit={handleAdd} className="space-y-6">
                        <Input 
                            placeholder="Full Name" 
                            value={newStaff.name}
                            onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                            required
                            className="bg-paper-white border-gold-start/20 focus:border-ruby-red h-12"
                        />
                        <Input 
                            placeholder="Phone Number" 
                            value={newStaff.phone}
                            onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                            required
                            className="bg-paper-white border-gold-start/20 focus:border-ruby-red h-12"
                        />
                        <Button type="submit" disabled={loading} className="w-full h-12 bg-linear-to-r from-ruby-red to-primary text-white font-bold tracking-wide hover:shadow-lg transition-all duration-300 rounded-xl">
                            {loading ? 'Processing...' : 'Generate Credentials'}
                        </Button>
                    </form>
                </div>
            </div>

            {/* Staff List */}
            <div className="lg:col-span-8">
                <h2 className="text-2xl font-bold text-text-dark mb-6 font-serif">Existing Staff <span className="text-gold-start text-lg font-normal ml-2">({staffList.length})</span></h2>
                <div className="space-y-4">
                    {staffList.map((staff) => (
                        <motion.div 
                            key={staff.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-6 rounded-xl shadow-sm border border-black/5 hover:border-gold-start/50 hover:shadow-md transition-all duration-300 flex justify-between items-center group"
                        >
                            <div className="flex items-center gap-4 flex-1">
                                <div className="w-12 h-12 rounded-full bg-ruby-red/5 flex items-center justify-center text-ruby-red font-bold text-xl font-serif shrink-0">
                                  {staff.name.charAt(0)}
                                </div>
                                <div className="w-full">
                                    {editingId === staff.id ? (
                                        <div className="flex flex-col gap-2 w-full max-w-xs">
                                            <Input 
                                                value={editForm.name} 
                                                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                                className="h-9 text-sm bg-white border-gold-start/30"
                                                placeholder="Name"
                                            />
                                            <Input 
                                                value={editForm.phone} 
                                                onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                                                className="h-9 text-sm bg-white border-gold-start/30"
                                                placeholder="Phone"
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <p className="font-bold text-lg text-text-dark group-hover:text-ruby-red transition-colors">{staff.name}</p>
                                            <p className="text-text-muted text-sm">{staff.phone}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                              <span className="text-xs font-semibold text-gold-start bg-gold-start/10 px-2 py-0.5 rounded-full">ID: {staff.username}</span>
                                              {staff.tempPassword && <span className="text-xs font-mono text-text-muted/70 bg-gray-100 px-2 py-0.5 rounded-full">Pass: {staff.tempPassword}</span>}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                {editingId === staff.id ? (
                                    <>
                                        <Button size="sm" onClick={saveEdit} className="bg-green-600 text-white hover:bg-green-700 h-9 w-9 p-0 rounded-full"><Save size={16} /></Button>
                                        <Button size="sm" onClick={() => setEditingId(null)} variant="outline" className="border-red-200 text-red-500 hover:bg-red-50 h-9 w-9 p-0 rounded-full"><X size={16} /></Button>
                                    </>
                                ) : (
                                    <>
                                        <Button size="sm" onClick={() => startEdit(staff)} variant="ghost" className="text-accent hover:bg-accent/10 hover:text-ruby-red h-9 w-9 p-0 rounded-full"><Edit2 size={18} /></Button>
                                        <Button size="sm" onClick={() => handleDelete(staff.id)} variant="ghost" className="text-gray-400 hover:bg-red-50 hover:text-red-500 h-9 w-9 p-0 rounded-full"><Trash2 size={18} /></Button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {!loading && staffList.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                        <div className="text-gold-start mb-4 opacity-50"><Receipt size={48} className="mx-auto"/></div>
                        <p className="text-text-muted text-lg font-serif italic">No staff members found.</p>
                        <p className="text-sm text-gray-400">Add a new member to get started.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
