import { motion } from 'framer-motion';

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary',
  className = '',
  disabled = false,
  type = 'button',
  icon: Icon = null
}) {
  const baseStyles = "inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200";
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90",
    secondary: "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50",
    danger: "bg-red-600 text-white hover:bg-red-700"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </motion.button>
  );
}