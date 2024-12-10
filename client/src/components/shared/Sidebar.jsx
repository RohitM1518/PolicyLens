import { motion } from 'framer-motion';

export default function Sidebar({ 
  title, 
  children,
  isOpen,
  onClose,
  className = ''
}) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", damping: 20 }}
        className={`fixed md:static left-0 top-0 h-full w-64 bg-white shadow-lg z-50 transform md:transform-none transition-transform duration-300 ${className}`}
      >
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {children}
        </div>
      </motion.div>
    </>
  );
}