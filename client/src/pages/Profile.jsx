import { useState } from 'react';
import { motion } from 'framer-motion';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { updateUserDetails } from '../redux/userSlice';
import { useUserContext } from '../contexts/UserContext';
import { useResponseContext } from '../contexts/ResponseContext';
import { useErrorContext } from '../contexts/ErrorContext';
import { errorParser } from '../utils/errorParser';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import PageHeader from '../components/shared/PageHeader';
import FormInput from '../components/auth/FormInput';
import { fadeIn, scaleIn } from '../styles/animations';
import { Field } from 'formik';

const profileSchema = Yup.object().shape({
  name: Yup.string(),
  age: Yup.number().nullable().min(0, 'Age must be positive'),
  maritalStatus: Yup.string().oneOf(['Single', 'Married', 'Divorced', 'Widowed']),
  occupation: Yup.string().nullable(),
  location: Yup.string().nullable(),
  monthlySalary: Yup.number().nullable().min(0, 'Salary must be positive'),
  existingDebts: Yup.number().nullable(),
  familySize: Yup.number().nullable().min(1, "At least one should be there"),
  annualIncome: Yup.number().nullable().min(0, 'Income must be positive'),
  healthStatus: Yup.string().oneOf(['Excellent', 'Good', 'Fair', 'Poor']),
  vehicleOwnership: Yup.boolean().nullable(),
  travelHabits: Yup.string().oneOf(['Domestic', 'International', 'None']),
  primaryGoalForInsurance: Yup.string().nullable(),
  coverageAmountPreference: Yup.number().nullable().min(0, "Amount must be positive"),
  willingnessToPayPremiums: Yup.string().oneOf(['Monthly', 'Quarterly', 'Annually']),
  lifestyleHabits: Yup.array().of(Yup.string().oneOf(['Smoking', 'Alcohol', 'None']))
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setResponse } = useResponseContext();
  const { setError } = useErrorContext();
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const accessToken = useSelector((state) => state?.currentUser?.accessToken);
  const { setUser } = useUserContext();
  const user = useSelector(state=>state?.currentUser.user)
  console.log(user)
  const handleProfileUpdate = async (values) => {
    try {
      const res = await axios.put(`${backendURL}/user/profile`, values, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setUser(res?.data?.data?.user);
      dispatch(updateUserDetails(res?.data?.data?.user));
      setResponse("Profile updated successfully");
    } catch (error) {
      setError(errorParser(error));
    }
  };

  const handlePasswordUpdate = async (values) => {
    try {
      await axios.put(`${backendURL}/user/change-password`, values, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setResponse("Password updated successfully");
    } catch (error) {
      setError(errorParser(error));
    }
  };

  return (
    <motion.div {...fadeIn} className="py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <div className="p-6">
            <PageHeader 
              title="Profile Settings" 
              subtitle="Manage your account settings and preferences"
            />

            <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
              <Tab.List className="flex space-x-1 rounded-lg bg-gray-100 p-1 mb-6">
                <Tab
                  className={({ selected }) =>
                    clsx(
                      'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-center',
                      'focus:outline-none focus:ring-2 ring-offset-2 transition-all duration-200',
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
                      'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-center',
                      'focus:outline-none focus:ring-2 ring-offset-2 transition-all duration-200',
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
                  <motion.div {...scaleIn}>
                    <Formik
                      initialValues={{
                        name: user?.name ?? '',
                        age: user?.age || '',
                        maritalStatus: user?.maritalStatus || '',
                        occupation: user?.occupation || '',
                        location: user?.location || '',
                        monthlySalary: user?.monthlySalary || '',
                        existingDebts: user?.existingDebts || '',
                        familySize: user?.familySize || '',
                        annualIncome: user?.annualIncome || '',
                        healthStatus: user?.healthStatus || '',
                        travelHabits: user?.travelHabits || '',
                        primaryGoalForInsurance: user?.primaryGoalForInsurance || '',
                        coverageAmountPreference: user?.coverageAmountPreference || '',
                        willingnessToPayPremiums: user?.willingnessToPayPremiums || '',
                        lifestyleHabits: user?.lifestyleHabits || [],
                        vehicleOwnership: user?.vehicleOwnership || false
                      }}
                      validationSchema={profileSchema}
                      onSubmit={handleProfileUpdate}
                    >
                      {({ errors, touched }) => (
                        <Form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormInput
                            label="Name"
                            name="name"
                            error={errors.name}
                            touched={touched.name}
                          />
                          <FormInput
                            label="Age"
                            name="age"
                            type="number"
                            error={errors.age}
                            touched={touched.age}
                          />
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Marital Status
                            </label>
                            <Field
                              as="select"
                              name="maritalStatus"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                            >
                              <option value="">Select Status</option>
                              <option value="Single">Single</option>
                              <option value="Married">Married</option>
                              <option value="Divorced">Divorced</option>
                              <option value="Widowed">Widowed</option>
                            </Field>
                          </div>
                          <FormInput
                            label="Occupation"
                            name="occupation"
                            error={errors.occupation}
                            touched={touched.occupation}
                          />
                          <FormInput
                            label="Location"
                            name="location"
                            error={errors.location}
                            touched={touched.location}
                          />
                          <FormInput
                            label="Monthly Salary"
                            name="monthlySalary"
                            type="number"
                            error={errors.monthlySalary}
                            touched={touched.monthlySalary}
                          />
                          <FormInput
                            label="Annual Income"
                            name="annualIncome"
                            type="number"
                            error={errors.annualIncome}
                            touched={touched.annualIncome}
                          />
                          <FormInput
                            label="Existing Debts"
                            name="existingDebts"
                            type="number"
                            error={errors.existingDebts}
                            touched={touched.existingDebts}
                          />
                          <FormInput
                            label="Family Size"
                            name="familySize"
                            type="number"
                            error={errors.familySize}
                            touched={touched.familySize}
                          />
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Health Status
                            </label>
                            <Field
                              as="select"
                              name="healthStatus"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                            >
                              <option value="">Select Status</option>
                              <option value="Excellent">Excellent</option>
                              <option value="Good">Good</option>
                              <option value="Fair">Fair</option>
                              <option value="Poor">Poor</option>
                            </Field>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Vehicle Ownership
                            </label>
                            <Field
                              type="checkbox"
                              name="vehicleOwnership"
                              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Travel Habits
                            </label>
                            <Field
                              as="select"
                              name="travelHabits"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                            >
                              <option value="">Select Habit</option>
                              <option value="Domestic">Domestic</option>
                              <option value="International">International</option>
                              <option value="None">None</option>
                            </Field>
                          </div>
                          <FormInput
                            label="Primary Goal for Insurance"
                            name="primaryGoalForInsurance"
                            error={errors.primaryGoalForInsurance}
                            touched={touched.primaryGoalForInsurance}
                          />
                          <FormInput
                            label="Coverage Amount Preference"
                            name="coverageAmountPreference"
                            type="number"
                            error={errors.coverageAmountPreference}
                            touched={touched.coverageAmountPreference}
                          />
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Premium Payment Frequency
                            </label>
                            <Field
                              as="select"
                              name="willingnessToPayPremiums"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                            >
                              <option value="">Select Frequency</option>
                              <option value="Monthly">Monthly</option>
                              <option value="Quarterly">Quarterly</option>
                              <option value="Annually">Annually</option>
                            </Field>
                          </div>
                          <div>
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
                        </div>
                        <div className="flex justify-end">
                          <Button type="submit" variant="primary">
                            Update Profile
                          </Button>
                        </div>
                      </Form>
                      
                      )}
                    </Formik>
                  </motion.div>
                </Tab.Panel>

                <Tab.Panel>
                  <motion.div {...scaleIn}>
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
                          <FormInput
                            label="Current Password"
                            name="currentPassword"
                            type="password"
                            error={errors.currentPassword}
                            touched={touched.currentPassword}
                          />
                          <FormInput
                            label="New Password"
                            name="newPassword"
                            type="password"
                            error={errors.newPassword}
                            touched={touched.newPassword}
                          />
                          <FormInput
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            error={errors.confirmPassword}
                            touched={touched.confirmPassword}
                          />
                          <div className="flex justify-end">
                            <Button type="submit" variant="primary">
                              Update Password
                            </Button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </motion.div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}