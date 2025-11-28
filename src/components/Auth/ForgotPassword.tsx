import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from '../../hooks/useNavigate';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-[#bfa078]/20 rounded-2xl p-8 max-w-md text-center"
        >
          <div className="w-16 h-16 bg-[#bfa078]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-[#bfa078]" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
          <p className="text-gray-400 mb-6">
            We've sent password reset instructions to {email}
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-[#bfa078] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#d4b48f] transition-colors"
          >
            Back to Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center text-gray-400 hover:text-[#bfa078] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to login
          </button>

          <div className="text-center mb-8">
            <Mail className="w-12 h-12 text-[#bfa078] mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
            <p className="text-gray-400">Enter your email to receive reset instructions</p>
          </div>

          <form onSubmit={handleReset} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#bfa078]/50 transition-colors"
                  placeholder="your@email.com"
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#bfa078] text-black py-3 rounded-lg font-semibold hover:bg-[#d4b48f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Reset Instructions'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
