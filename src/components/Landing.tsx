import { motion } from 'framer-motion';
import { TrendingUp, Calculator, Shield } from 'lucide-react';
import { useNavigate } from '../hooks/useNavigate';

export const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Calculator,
      title: 'Instant ROI Calculation',
      description: 'Get real-time ROI percentages for every business idea you validate.'
    },
    {
      icon: TrendingUp,
      title: 'Visual Validation',
      description: 'See immediately if your project is validated or burning cash with color-coded feedback.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your business ideas are encrypted and only visible to you.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Validate Your Business Ideas
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Stop guessing. Calculate ROI instantly.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(191, 160, 120, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            className="bg-[#bfa078] text-black px-10 py-4 rounded-lg text-lg font-semibold hover:bg-[#d4b48f] transition-all"
          >
            Start Validating
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.2 }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-[#bfa078]/30 transition-all"
            >
              <feature.icon className="w-12 h-12 text-[#bfa078] mb-4" />
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
