import { motion } from 'framer-motion';

export default function LoadingSpinner({ size = 'md' }) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`${sizes[size]} border-2 border-primary border-t-transparent rounded-full`}
      />
    </div>
  );
}