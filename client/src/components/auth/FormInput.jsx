import { Field } from 'formik';
import { motion } from 'framer-motion';

export default function FormInput({ 
  label, 
  name, // Changed from id to name for Formik compatibility
  error, 
  touched,
  type = "text",
  ...props 
}) {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <div className="mt-2 relative">
        <Field
          id={name}
          name={name}
          type={type}
          {...props}
          className={`
            block w-full rounded-md border-0 py-2 px-3
            text-gray-900 shadow-sm ring-1 ring-inset
            ${error && touched ? 'ring-red-500' : 'ring-gray-300'}
            placeholder:text-gray-400
            focus:ring-2 focus:ring-inset focus:ring-primary
            transition-all duration-200
            sm:text-sm sm:leading-6
          `}
        />
        {error && touched && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-red-600"
          >
            {error}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
