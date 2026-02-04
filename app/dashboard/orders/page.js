"use client";
import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { X, Receipt, Clock } from 'lucide-react';

const calendarStyles = `
  .react-calendar {
    background: #FFFFFF;
    border: 1px solid #C8A951;
    border-radius: 12px;
    color: #3B0A0D;
    font-family: inherit;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 4px 15px rgba(200, 169, 81, 0.2);
  }
  .react-calendar__navigation button {
    color: #7B1F1F;
    min-width: 44px;
    background: none;
    font-weight: bold;
  }
  .react-calendar__navigation button:enabled:hover,
  .react-calendar__navigation button:enabled:focus {
    background-color: rgba(200, 169, 81, 0.1);
  }
  .react-calendar__month-view__days__day {
    color: #3B0A0D;
  }
  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background-color: rgba(200, 169, 81, 0.1);
    color: #7B1F1F;
  }
  .react-calendar__tile--now {
    background: rgba(123, 31, 31, 0.1);
    color: #7B1F1F;
  }
  .react-calendar__tile--active {
    background: #7B1F1F !important;
    color: #FFFFFF !important;
  }
`;

export default function OrderPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders(selectedDate);
  }, [selectedDate]);

  const fetchOrders = async (date) => {
    setLoading(true);
    try {
      // Calculate start and end of the selected LOCAL date
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      // Pass as ISO strings (which include timezone offset info if doing it right, or typically UTC)
      // Standard ISO string is UTC. 
      // Problem: new Date().toISOString() converts 00:00 Local to 18:30 Prev Day UTC.
      // Solution: Pass the ISO string of the specific instants we want.
      
      const res = await fetch(`/api/orders?from=${start.toISOString()}&to=${end.toISOString()}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchOrders(selectedDate);
  }, [selectedDate]); // Keeping fetchOrders logic here

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => {
        const qty = item.count || item.quantity || 0;
        return sum + (item.price * qty);
    }, 0);
  };

  const dailyTotal = orders.reduce((sum, order) => sum + calculateTotal(order.items), 0);

  return (
    <div className="min-h-screen bg-background text-foreground p-8 font-sans">
      <style>{calendarStyles}</style>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Left Panel: Calendar & Summary */}
        <div className="lg:w-1/3 space-y-8">
            <div className="bg-card-white p-6 rounded-2xl shadow-xl border border-gold-start/20">
                <h2 className="text-2xl font-bold text-ruby-red mb-6 font-serif">Select Date</h2>
                <div className="calendar-wrapper bg-paper-white rounded-xl p-4 border border-gold-start/10 min-h-[300px]">
                    {mounted ? (
                        <Calendar
                            mode="single"
                            value={selectedDate}
                            onChange={setSelectedDate}
                            className="rounded-md"
                            tileClassName={({ date, view }) => {
                               if (view === 'month' && date.toDateString() === selectedDate.toDateString()) {
                                   return 'react-calendar__tile--active';
                               }
                            }}
                        />
                    ) : (
                        <div className="h-full flex items-center justify-center text-text-muted">Loading calendar...</div>
                    )}
                </div>
            </div>

            <div className="bg-linear-to-br from-ruby-red to-secondary p-6 rounded-2xl shadow-xl text-white relative overflow-hidden">
                <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-gold-start/20 rounded-full blur-2xl"></div>
                <h2 className="text-xl font-bold mb-2 opacity-90">Daily Total Revenue</h2>
                <p className="text-4xl font-bold font-serif">₹{dailyTotal.toLocaleString()}</p>
                <div className="mt-4 text-sm opacity-70 flex items-center gap-2">
                    <Receipt size={16} /> {orders.length} orders today
                </div>
            </div>
        </div>

        {/* Right Panel: Orders List */}
        <div className="lg:w-2/3">
             <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-serif font-bold text-ruby-red">Order History</h1>
                <Button variant="outline" onClick={() => fetchOrders(selectedDate)} className="border-gold-start/30 text-ruby-red hover:bg-gold-start/10">
                    Refresh List
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ruby-red"></div>
                </div>
            ) : orders.length === 0 ? (
                <div className="bg-card-white p-12 rounded-2xl border-2 border-dashed border-text-muted/20 text-center">
                    <p className="text-text-muted text-lg">No orders found for this date.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => {
                        const orderTotal = calculateTotal(order.items);
                        return (
                            <motion.div 
                                key={order._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-card-white p-6 rounded-xl shadow-md border border-gold-start/10 hover:shadow-lg hover:border-gold-start/30 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="bg-gold-start/20 text-text-dark font-bold px-3 py-1 rounded-full text-sm border border-gold-start/30">
                                                Table {order.tableNo}
                                            </span>
                                            <span className="text-sm text-text-muted flex items-center gap-1">
                                                <Clock size={14} /> {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                        <p className="text-xs text-text-muted uppercase tracking-wide">Order ID: {order._id.slice(-6)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-ruby-red font-serif">₹{orderTotal}</p>
                                        <p className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full inline-block mt-1">PAID</p>
                                    </div>
                                </div>
                                
                                <div className="border-t border-dashed border-gray-200 pt-4 mt-4">
                                    <p className="text-sm font-bold text-text-dark mb-2">Items Ordered:</p>
                                    <ul className="space-y-1">
                                        {order.items.map((item, idx) => (
                                            <li key={idx} className="flex justify-between text-sm">
                                                <span className="text-text-muted"><span className="font-bold text-text-dark">{item.count || item.quantity}x</span> {item.name}</span>
                                                <span className="font-medium text-text-dark">₹{item.price * (item.count || item.quantity)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
