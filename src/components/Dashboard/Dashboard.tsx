import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { InvestmentForm } from './InvestmentForm';
import { InvestmentList } from './InvestmentList';
import { Investment } from '../../types';

export const Dashboard = () => {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvestments = async () => {
    const { data, error } = await supabase
      .from('investments')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setInvestments(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <nav className="border-b border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#bfa078]">ROI Validator</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-300">
              <User className="w-5 h-5" />
              <span className="text-sm">{user?.email}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </motion.button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-4xl font-bold mb-2">Validate Your Ideas</h2>
          <p className="text-gray-400">Calculate ROI and track your project investments</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <InvestmentForm onSuccess={fetchInvestments} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <InvestmentList
              investments={investments}
              loading={loading}
              onUpdate={fetchInvestments}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
