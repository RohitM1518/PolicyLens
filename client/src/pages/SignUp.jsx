import { useState } from 'react';
import { motion } from 'framer-motion';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useLoadingContext } from '../contexts/LoadingContext';
import { useDispatch } from 'react-redux';
import { login } from '../redux/userSlice';
import { useErrorContext } from '../contexts/ErrorContext';
import { errorParser } from '../utils/errorParser';
import { useUserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/auth/FormInput';
import AuthLayout from '../components/auth/authLayout';

const steps = [
  {
    title: 'Basic Information',
    fields: ['name', 'email', 'password'],
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    }),
  },
  {
    title: 'Personal Details',
    fields: ['age', 'maritalStatus', 'occupation', 'location'],
    validationSchema: Yup.object({
      age: Yup.number().min(0, 'Age must be positive'),
      maritalStatus: Yup.string().oneOf(['Single', 'Married', 'Divorced', 'Widowed']),
      occupation: Yup.string(),
      location: Yup.string(),
    }),
  },
  {
    title: 'Financial Information',
    fields: ['monthlySalary', 'annualIncome', 'existingDebts'],
    validationSchema: Yup.object({
      monthlySalary: Yup.number().min(0, 'Salary must be positive'),
      annualIncome: Yup.number().min(0, 'Income must be positive'),
      existingDebts: Yup.number().min(0, 'Debts must be positive'),
    }),
  },
  {
    title: 'Health & Lifestyle',
    fields: ['healthStatus', 'lifestyleHabits', 'familySize'],
    validationSchema: Yup.object({
      healthStatus: Yup.string().oneOf(['Excellent', 'Good', 'Fair', 'Poor']),
      lifestyleHabits: Yup.array().of(Yup.string().oneOf(['Smoking', 'Alcohol', 'None'])),
      familySize: Yup.number().min(1, 'Family size must be at least 1'),
    }),
  },
  {
    title: 'Insurance Preferences',
    fields: ['primaryGoalForInsurance', 'coverageAmountPreference', 'willingnessToPayPremiums'],
    validationSchema: Yup.object({
      primaryGoalForInsurance: Yup.string(),
      coverageAmountPreference: Yup.number().min(0),
      willingnessToPayPremiums: Yup.string().oneOf(['Monthly', 'Quarterly', 'Annually']),
    }),
  },
];

const initialValues = {
  name: '',
  email: '',
  password: '',
  age: '',
  maritalStatus: '',
  occupation: '',
  location: '',
  monthlySalary: '',
  annualIncome: '',
  existingDebts: '',
  familySize: '',
  healthStatus: '',
  lifestyleHabits: [],
  primaryGoalForInsurance: '',
  coverageAmountPreference: '',
  willingnessToPayPremiums: '',
};

export default function SignUp() {
  const [currentStep, setCurrentStep] = useState(0);
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const { setIsLoading } = useLoadingContext();
  const { setError } = useErrorContext();
  const dispatch = useDispatch();
  const { setUser } = useUserContext();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true);
      const res = await axios.post(`${backendURL}/user/register`, values);
      dispatch(login(res?.data?.data));
      setUser(res?.data?.data?.user);
      navigate('/');
    } catch (error) {
      setError(errorParser(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={steps[currentStep].title}
      subtitle="Already have an account?"
      linkText="Sign in"
      linkTo="/signin"
    >
      <div className="mb-8">
        <div className="relative">
          <div className="absolute left-0 top-1/2 h-0.5 w-full bg-gray-200 -translate-y-1/2" />
          <div className="relative z-10 flex justify-between">
            {steps.map((_, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${index <= currentStep ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}
                  transition-colors duration-200
                `}
              >
                {index + 1}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={steps[currentStep].validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          if (currentStep === steps.length - 1) {
            handleSubmit(values);
          } else {
            setCurrentStep(currentStep + 1);
          }
          setSubmitting(false);
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="space-y-6">
            {steps[currentStep].fields.map((fieldName) => {
              // Special handling for different field types
              if (fieldName === 'maritalStatus') {
                return (
                  <div key={fieldName}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Marital Status
                    </label>
                    <Field
                      as="select"
                      name={fieldName}
                      className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black transition-all duration-200 sm:text-sm sm:leading-6"
                    >
                      <option value="">Select Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </Field>
                  </div>
                );
              }

              if (fieldName === 'lifestyleHabits') {
                return (
                  <div key={fieldName}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lifestyle Habits
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <Field
                          type="checkbox"
                          name="lifestyleHabits"
                          value="Smoking"
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mr-2"
                          />
                        Smoking
                      </label>
                      <label className="flex items-center">
                        <Field
                          type="checkbox"
                          name="lifestyleHabits"
                          value="Alcohol"
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mr-2"
                          />
                        Alcohol
                      </label>
                      <label className="flex items-center">
                        <Field
                          type="checkbox"
                          name="lifestyleHabits"
                          value="None"
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mr-2"
                          />
                        None
                      </label>
                    </div>
                  </div>
                );
              }

              if (fieldName === 'healthStatus') {
                return (
                  <div key={fieldName}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Health Status
                    </label>
                    <Field
                      as="select"
                      name={fieldName}
                      className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary transition-all duration-200 sm:text-sm sm:leading-6"
                    >
                      <option value="">Select Status</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </Field>
                  </div>
                );
              }

              if (fieldName === 'willingnessToPayPremiums') {
                return (
                  <div key={fieldName}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Premium Payment Frequency
                    </label>
                    <Field
                      as="select"
                      name={fieldName}
                      className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary transition-all duration-200 sm:text-sm sm:leading-6"
                    >
                      <option value="">Select Frequency</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Annually">Annually</option>
                    </Field>
                  </div>
                );
              }

              // Default FormInput for other fields
              return (
                <FormInput
                  key={fieldName}
                  label={fieldName.replace(/([A-Z])/g, ' $1').trim()}
                  id={fieldName}
                  name={fieldName}
                  type={
                    ['age', 'monthlySalary', 'annualIncome', 'existingDebts', 'familySize', 'coverageAmountPreference'].includes(fieldName)
                      ? 'number'
                      : fieldName === 'password'
                        ? 'password'
                        : 'text'
                  }
                  error={errors[fieldName]}
                  touched={touched[fieldName]}
                />
              );
            })}

            <div className="flex justify-between pt-4">
              {currentStep > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  <ChevronLeftIcon className="w-4 h-4 mr-2" />
                  Previous
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className={`
                  inline-flex items-center px-4 py-2 text-sm font-semibold text-white
                  bg-gradient-to-r from-primary to-secondary rounded-md
                  hover:from-primary/90 hover:to-secondary/90
                  transition-all duration-200
                  ${currentStep === 0 ? 'w-full' : 'ml-auto'}
                `}
              >
                {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
                {currentStep !== steps.length - 1 && <ChevronRightIcon className="w-4 h-4 ml-2" />}
              </motion.button>
            </div>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
}