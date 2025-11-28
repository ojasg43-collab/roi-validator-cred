import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Investment } from '../../types';
import { EditModal } from './EditModal';

interface InvestmentListProps {
  investments: Investment[];
  loading: boolean;
  onUpdate: () => void;
}

export const InvestmentList = ({ investments, loading, onUpdate }: InvestmentListProps) => {
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const calculateROI = (cost: number, revenue: number) => {
    return ((revenue - cost) / cost) * 100;
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const { error } = await supabase.from('investments').delete().eq('id', id);

    if (!error) {
      onUpdate();
    }
    setDeletingId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-[#bfa078]/20 border-t-[#bfa078] rounded-full animate-spin" />
      </div>
    );
  }

  if (investments.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
        <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-400 mb-2">No investments yet</h3>
        <p className="text-gray-500">Add your first project to start calculating ROI</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <h3 className="text-2xl font-bold mb-6">Your Investments</h3>
        <AnimatePresence>
          {investments.map((investment, index) => {
            const roi = calculateROI(investment.cost, investment.revenue);
            const isValidated = roi > 0;

            return (
              <motion.div
                key={investment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-[#bfa078]/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold mb-2">{investment.project_name}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>Cost: ${investment.cost.toLocaleString()}</span>
                      <span>Revenue: ${investment.revenue.toLocaleString()}</span>
                    </div>
                  </div>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                      isValidated
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.2)]'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                    }`}
                  >
                    {isValidated ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {isValidated ? 'VALIDATED' : 'BURNING CASH'}
                  </motion.div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Return on Investment</p>
                    <p className={`text-3xl font-bold ${isValidated ? 'text-green-400' : 'text-red-400'}`}>
                      {roi > 0 ? '+' : ''}{roi.toFixed(2)}%
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setEditingInvestment(investment)}
                      className="p-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-blue-400" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(investment.id)}
                      disabled={deletingId === investment.id}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {editingInvestment && (
        <EditModal
          investment={editingInvestment}
          onClose={() => setEditingInvestment(null)}
          onSuccess={() => {
            setEditingInvestment(null);
            onUpdate();
          }}
        />
      )}
    </>
  );
};
