import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, DollarSign } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Investment } from '../../types';

interface EditModalProps {
  investment: Investment;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditModal = ({ investment, onClose, onSuccess }: EditModalProps) => {
  const [projectName, setProjectName] = useState(investment.project_name);
  const [cost, setCost] = useState(investment.cost.toString());
  const [revenue, setRevenue] = useState(investment.revenue.toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
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

    const { error: updateError } = await supabase
      .from('investments')
      .update({
        project_name: projectName,
        cost: costNum,
        revenue: revenueNum,
      })
      .eq('id', investment.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-8 max-w-md w-full"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Edit Investment</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-5">
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

          <div className="flex gap-3">
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-[#bfa078] text-black py-3 rounded-lg font-semibold hover:bg-[#d4b48f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
