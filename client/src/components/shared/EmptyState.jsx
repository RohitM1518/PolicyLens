import { motion } from 'framer-motion';

export default function EmptyState({ 
  title, 
  description, 
  icon: Icon,
  action = null 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      {Icon && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-auto w-12 h-12 text-gray-400"
        >
          <Icon className="w-full h-full" />
        </motion.div>
      )}
      <h3 className="mt-2 text-sm font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </motion.div>
  );
}