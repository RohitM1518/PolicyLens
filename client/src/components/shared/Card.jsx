import { motion } from 'framer-motion';

export default function Card({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
}