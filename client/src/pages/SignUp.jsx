import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

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
  const backendURL = import.meta.env.VITE_BACKEND_URL
  const handleSubmit = async (values) => {
    console.log('Form submitted:', values);
    try {
      const res = await axios.post(`${backendURL}/user/register`,values);
      console.log("User logged in");
    } catch (error) {
      console.log(error)
    }
  };

  const renderField = (fieldName) => {
    const fieldProps = {
      className: "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6",
    };

    switch (fieldName) {
      case 'password':
        return <Field type="password" name={fieldName} {...fieldProps} />;
      case 'maritalStatus':
        return (
          <Field as="select" name={fieldName} {...fieldProps}>
            <option value="">Select status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </Field>
        );
      case 'healthStatus':
        return (
          <Field as="select" name={fieldName} {...fieldProps}>
            <option value="">Select status</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
          </Field>
        );
      case 'willingnessToPayPremiums':
        return (
          <Field as="select" name={fieldName} {...fieldProps}>
            <option value="">Select frequency</option>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Annually">Annually</option>
          </Field>
        );
      case 'lifestyleHabits':
        return (
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <Field type="checkbox" name={fieldName} value="Smoking" className="h-4 w-4 rounded" />
              <span>Smoking</span>
            </label>
            <label className="flex items-center space-x-2">
              <Field type="checkbox" name={fieldName} value="Alcohol" className="h-4 w-4 rounded" />
              <span>Alcohol</span>
            </label>
            <label className="flex items-center space-x-2">
              <Field type="checkbox" name={fieldName} value="None" className="h-4 w-4 rounded" />
              <span>None</span>
            </label>
          </div>
        );
      default:
        return <Field type="text" name={fieldName} {...fieldProps} />;
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          {steps[currentStep].title}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
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
                {steps[currentStep].fields.map((fieldName) => (
                  <div key={fieldName}>
                    <label htmlFor={fieldName} className="block text-sm font-medium leading-6 text-gray-900 capitalize">
                      {fieldName.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <div className="mt-2">
                      {renderField(fieldName)}
                      {errors[fieldName] && touched[fieldName] && (
                        <p className="mt-2 text-sm text-red-600">{errors[fieldName]}</p>
                      )}
                    </div>
                  </div>
                ))}

                <div className="flex justify-between">
                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      <ChevronLeftIcon className="w-4 h-4 mr-2" />
                      Previous
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-primary rounded-md hover:bg-secondary ml-auto"
                  >
                    {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
                    {currentStep !== steps.length - 1 && <ChevronRightIcon className="w-4 h-4 ml-2" />}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}