import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Tab } from '@headlessui/react';
import clsx from 'clsx';

const profileSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  age: Yup.number().min(0, 'Age must be positive'),
  maritalStatus: Yup.string().oneOf(['Single', 'Married', 'Divorced', 'Widowed']),
  occupation: Yup.string(),
  location: Yup.string(),
  monthlySalary: Yup.number().min(0, 'Salary must be positive'),
  annualIncome: Yup.number().min(0, 'Income must be positive'),
  healthStatus: Yup.string().oneOf(['Excellent', 'Good', 'Fair', 'Poor']),
});

const passwordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function Profile() {
  const [activeTab, setActiveTab] = useState(0);

  const handleProfileUpdate = async (values) => {
    console.log('Profile update:', values);
    // Implement API call to update profile
  };

  const handlePasswordUpdate = async (values) => {
    console.log('Password update:', values);
    // Implement API call to update password
  };

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

            <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
              <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1 mb-6">
                <Tab
                  className={({ selected }) =>
                    clsx(
                      'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                      'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-white text-primary shadow'
                        : 'text-gray-600 hover:bg-white/[0.12] hover:text-primary'
                    )
                  }
                >
                  Profile Information
                </Tab>
                <Tab
                  className={({ selected }) =>
                    clsx(
                      'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                      'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-white text-primary shadow'
                        : 'text-gray-600 hover:bg-white/[0.12] hover:text-primary'
                    )
                  }
                >
                  Change Password
                </Tab>
              </Tab.List>

              <Tab.Panels>
                <Tab.Panel>
                  <Formik
                    initialValues={{
                      name: '',
                      email: '',
                      age: '',
                      maritalStatus: '',
                      occupation: '',
                      location: '',
                      monthlySalary: '',
                      annualIncome: '',
                      healthStatus: '',
                    }}
                    validationSchema={profileSchema}
                    onSubmit={handleProfileUpdate}
                  >
                    {({ errors, touched }) => (
                      <Form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <Field
                              name="name"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                            />
                            {errors.name && touched.name && (
                              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <Field
                              name="email"
                              type="email"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                            />
                            {errors.email && touched.email && (
                              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">Age</label>
                            <Field
                              name="age"
                              type="number"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                            <Field
                              as="select"
                              name="maritalStatus"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                            >
                              <option value="">Select status</option>
                              <option value="Single">Single</option>
                              <option value="Married">Married</option>
                              <option value="Divorced">Divorced</option>
                              <option value="Widowed">Widowed</option>
                            </Field>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">Occupation</label>
                            <Field
                              name="occupation"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <Field
                              name="location"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">Monthly Salary</label>
                            <Field
                              name="monthlySalary"
                              type="number"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">Annual Income</label>
                            <Field
                              name="annualIncome"
                              type="number"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">Health Status</label>
                            <Field
                              as="select"
                              name="healthStatus"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                            >
                              <option value="">Select status</option>
                              <option value="Excellent">Excellent</option>
                              <option value="Good">Good</option>
                              <option value="Fair">Fair</option>
                              <option value="Poor">Poor</option>
                            </Field>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary"
                          >
                            Update Profile
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </Tab.Panel>

                <Tab.Panel>
                  <Formik
                    initialValues={{
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    }}
                    validationSchema={passwordSchema}
                    onSubmit={handlePasswordUpdate}
                  >
                    {({ errors, touched }) => (
                      <Form className="space-y-6 max-w-md">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Current Password</label>
                          <Field
                            name="currentPassword"
                            type="password"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                          />
                          {errors.currentPassword && touched.currentPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">New Password</label>
                          <Field
                            name="newPassword"
                            type="password"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                          />
                          {errors.newPassword && touched.newPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                          <Field
                            name="confirmPassword"
                            type="password"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                          />
                          {errors.confirmPassword && touched.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                          )}
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary"
                          >
                            Update Password
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </div>
    </div>
  );
}