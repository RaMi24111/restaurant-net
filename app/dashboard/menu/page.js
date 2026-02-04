"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, ExternalLink, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Beverages");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', description: '', image: '', category: 'Beverages' });
  const [editId, setEditId] = useState(null);

  const categories = ["Beverages", "Veg", "Non-Veg", "Today's Special"];

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `/api/menu/${editId}` : '/api/menu';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setEditId(null);
        setFormData({ name: '', price: '', description: '', image: '', category: activeCategory }); // Reset with current category
        fetchItems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditId(item.id);
    setActiveCategory(item.category); // Switch to item's category
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if(!confirm("Are you sure?")) return;
    try {
      await fetch(`/api/menu/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch(err) { console.error(err); }
  };

  const filteredItems = items.filter(item => {
      // Normalize: lowercase, remove special chars (apostrophes, spaces, hyphens)
      const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
      return normalize(item.category) === normalize(activeCategory);
  });

  return (
    <div className="min-h-screen bg-paper-white text-text-dark p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-serif font-bold text-ruby-red">Menu Management</h1>
              <p className="text-text-muted">Curate your dining offerings.</p>
            </div>
            <Button onClick={() => { setEditId(null); setFormData({name:'', price:'', description:'', image:'', category: activeCategory}); setShowModal(true); }} className="bg-ruby-red text-white hover:bg-ruby-red/90 shadow-lg">
                <Plus size={20} className="mr-2"/> Add Item
            </Button>
        </div>

        {/* Categories Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
            {categories.map(cat => (
                <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-2 rounded-full whitespace-nowrap transition-all font-semibold ${activeCategory === cat ? 'bg-ruby-red text-gold-end shadow-md' : 'bg-card-white text-text-muted hover:bg-white hover:text-ruby-red'}`}
                >
                    {cat}
                </button>
            ))}
        </div>

        {loading ? (
            <p>Loading menu...</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                    <motion.div 
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-card-white rounded-xl shadow-md border border-gold-start/10 overflow-hidden group hover:shadow-xl hover:border-gold-start/30 transition-all"
                    >
                        <div className="h-48 relative overflow-hidden bg-paper-white">
                            {item.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-text-muted/30">
                                    <Utensils size={40} />
                                </div>
                            )}
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 p-1 rounded-lg backdrop-blur-sm">
                                <button onClick={() => handleEdit(item)} className="p-1 text-white hover:text-gold-end"><Edit2 size={16} /></button>
                                <button onClick={() => handleDelete(item.id)} className="p-1 text-white hover:text-red-400"><Trash2 size={16} /></button>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg text-ruby-red line-clamp-1">{item.name}</h3>
                                <span className="font-bold text-text-dark bg-gold-start/20 px-2 py-0.5 rounded text-sm">₹{item.price}</span>
                            </div>
                            <p className="text-text-muted text-sm line-clamp-2 h-10">{item.description}</p>
                        </div>
                    </motion.div>
                ))}
                </AnimatePresence>
                {filteredItems.length === 0 && (
                    <div className="col-span-full text-center py-12 text-text-muted/40">
                        No items in {activeCategory}. Add one to get started.
                    </div>
                )}
            </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
          {showModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                  <motion.div 
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 50 }}
                      className="bg-card-white rounded-2xl p-8 max-w-lg w-full shadow-2xl border border-gold-start/30"
                  >
                      <h2 className="text-2xl font-bold text-ruby-red mb-6">{editId ? 'Edit Item' : 'Add New Item'}</h2>
                      <form onSubmit={handleSubmit} className="space-y-4">
                          <Input placeholder="Item Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="bg-paper-white border-gold-start/20" />
                          <div className="flex gap-4">
                              <Input type="number" placeholder="Price (₹)" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required className="bg-paper-white border-gold-start/20" />
                              <select 
                                value={formData.category} 
                                onChange={e => setFormData({...formData, category: e.target.value})}
                                className="w-full rounded-md border border-gold-start/20 bg-paper-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ruby-red/20"
                              >
                                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                              </select>
                          </div>
                          <textarea 
                            placeholder="Description" 
                            value={formData.description} 
                            onChange={e => setFormData({...formData, description: e.target.value})} 
                            className="w-full rounded-md border border-gold-start/20 bg-paper-white px-3 py-2 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-ruby-red/20"
                          />
                           <div className="space-y-2">
                                <label className="text-xs font-bold text-text-muted uppercase">Image Source</label>
                                <Input 
                                    placeholder="Image URL (e.g. Google Drive Link or Direct URL)" 
                                    value={formData.image} 
                                    onChange={e => setFormData({...formData, image: e.target.value})} 
                                    className="bg-paper-white border-gold-start/20" 
                                />
                                <p className="text-xs text-text-muted">
                                    Tip: Use <a href="https://drive.google.com/drive/folders/1Wk_CQeZw5dMv0ndYBah2Tp_aIj0Wi-xt?usp=sharing" target="_blank" rel="noreferrer" className="underline text-ruby-red">Google Drive</a> for hosting.
                                </p>
                           </div>

                          <div className="flex justify-end gap-3 mt-6">
                              <Button type="button" variant="ghost" onClick={() => setShowModal(false)} className="text-text-muted hover:bg-gray-100">Cancel</Button>
                              <Button type="submit" className="bg-ruby-red text-white hover:bg-ruby-red/90">{editId ? 'Update' : 'Create'}</Button>
                          </div>
                      </form>
                  </motion.div>
              </div>
          )}
      </AnimatePresence>
    </div>
  );
}
