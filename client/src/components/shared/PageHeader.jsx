import { motion } from 'framer-motion';

export default function PageHeader({ title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      {subtitle && (
        <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
      )}
    </motion.div>
  );
}