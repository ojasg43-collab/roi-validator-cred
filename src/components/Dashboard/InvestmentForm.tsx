import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, DollarSign } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface InvestmentFormProps {
  onSuccess: () => void;
}

export const InvestmentForm = ({ onSuccess }: InvestmentFormProps) => {
  const { user } = useAuth();
  const [projectName, setProjectName] = useState('');
  const [cost, setCost] = useState('');
  const [revenue, setRevenue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const costNum = parseFloat(cost);
    const revenueNum = parseFloat(revenue);

    if (isNaN(costNum) || isNaN(revenueNum)) {
      setError('Please enter valid numbers');
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase
      .from('investments')
      .insert([
        {
          project_name: projectName,
          cost: costNum,
          revenue: revenueNum,
          user_id: user?.id,
        },
      ]);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      setProjectName('');
      setCost('');
      setRevenue('');
      setLoading(false);
      onSuccess();
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#bfa078]/20 rounded-lg flex items-center justify-center">
          <Plus className="w-5 h-5 text-[#bfa078]" />
        </div>
        <h3 className="text-xl font-bold">Add Investment</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Project Name
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#bfa078]/50 transition-colors"
            placeholder="E.g., Mobile App Launch"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Investment Cost ($)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="number"
              step="0.01"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              required
              className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#bfa078]/50 transition-colors"
              placeholder="10000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Expected Revenue ($)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="number"
              step="0.01"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              required
              className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#bfa078]/50 transition-colors"
              placeholder="15000"
            />
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(191, 160, 120, 0.3)' }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-[#bfa078] text-black py-3 rounded-lg font-semibold hover:bg-[#d4b48f] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Adding...' : 'Calculate ROI'}
        </motion.button>
      </form>
    </div>
  );
};
