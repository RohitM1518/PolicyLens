import { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import { use } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { useResponseContext } from '../contexts/ResponseContext';
import { useErrorContext } from '../contexts/ErrorContext';
import { errorParser } from '../utils/errorParser';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';
import { updateUserDetails } from '../redux/userSlice';

// Validation schemas
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
  // const user = useSelector((state) => state?.currentUser?.user);
  const dispatch = useDispatch()
  const { setResponse } = useResponseContext()
  const { setError } = useErrorContext()
  const backendURL = import.meta.env.VITE_BACKEND_URL
  const accessToken = useSelector((state) => state?.currentUser?.accessToken);
  const {user,setUser}=useUserContext()
  // Handlers for form submission
  const handleProfileUpdate = async (values) => {
    console.log('Profile update:', values);
    // Add your API call for updating profile
    try {
      const res=await axios.put(`${backendURL}/user/profile`, values, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      // navigate(0)
      setUser(res?.data?.data?.user)
      dispatch(updateUserDetails(res?.data?.data?.user))
      setResponse("User Details Updated Successfully")
    } catch (error) {
      setError(errorParser(error));
      console.log(error)
    }
  };



  const handlePasswordUpdate = async (values) => {
    console.log('Password update:', values);
    // Add your API call for updating password
    try {
      await axios.put(`${backendURL}/user/change-password`, values, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      setResponse("Password Updated Successfully")
    } catch (error) {
      setError(errorParser(error));
      console.log(error)
    }
  };

  return (
    <div className="py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h2>

            <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
              <Tab.List className="flex space-x-1 rounded-lg bg-gray-100 p-1 mb-6">
                <Tab
                  className={({ selected }) =>
                    clsx(
                      'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-center',
                      'focus:outline-none focus:ring-2 ring-offset-2',
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
                      'focus:outline-none focus:ring-2 ring-offset-2',
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
                {/* Profile Information Form */}
                <Tab.Panel>
                  <Formik
                    initialValues={{
                      name: user?.name,
                      age: user?.age,
                      maritalStatus: user?.maritalStatus,
                      occupation: user?.occupation,
                      location: user?.location,
                      monthlySalary: user?.monthlySalary,
                      existingDebts: user?.existingDebts,
                      familySize: user?.familySize,
                      annualIncome: user?.annualIncome,
                      healthStatus: user?.healthStatus,
                      travelHabits: user?.travelHabits,
                      primaryGoalForInsurance: user?.primaryGoalForInsurance,
                      coverageAmountPreference: user?.coverageAmountPreference,
                      willingnessToPayPremiums: user?.willingnessToPayPremiums,
                      lifestyleHabits: user?.lifestyleHabits,
                      vehicleOwnership: user?.vehicleOwnership
                    }}
                    validationSchema={profileSchema}
                    onSubmit={handleProfileUpdate}
                  >
                    {({ errors, touched }) => (
                      <Form className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <Field
                              name="name"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary focus:ring-opacity-50"
                            />
                            {errors.name && touched.name && (
                              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Age</label>
                            <Field
                              name="age"
                              type="number"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary focus:ring-opacity-50"
                            />
                            {errors.age && touched.age && (
                              <p className="mt-1 text-sm text-red-600">{errors.age}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                            <Field
                              as="select"
                              name="maritalStatus"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary focus:ring-opacity-50"
                            >
                              <option value="">Select status</option>
                              <option value="Single">Single</option>
                              <option value="Married">Married</option>
                              <option value="Divorced">Divorced</option>
                              <option value="Widowed">Widowed</option>
                            </Field>
                            {errors.maritalStatus && touched.maritalStatus && (
                              <p className="mt-1 text-sm text-red-600">{errors.maritalStatus}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">Occupation</label>
                            <Field
                              name="occupation"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary focus:ring-opacity-50"
                            />
                            {errors.occupation && touched.occupation && (
                              <p className="mt-1 text-sm text-red-600">{errors.occupation}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <Field
                              name="location"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary focus:ring-opacity-50"
                            />
                            {errors.location && touched.location && (
                              <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">Monthly Salary</label>
                            <Field
                              name="monthlySalary"
                              type="number"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary focus:ring-opacity-50"
                            />
                            {errors.monthlySalary && touched.monthlySalary && (
                              <p className="mt-1 text-sm text-red-600">{errors.monthlySalary}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">Annual Income</label>
                            <Field
                              name="annualIncome"
                              type="number"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary focus:ring-opacity-50"
                            />
                            {errors.annualIncome && touched.annualIncome && (
                              <p className="mt-1 text-sm text-red-600">{errors.annualIncome}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Existing Debts</label>
                            <Field
                              name="existingDebts"
                              type="number"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary focus:ring-opacity-50"
                            />
                            {errors.existingDebts && touched.existingDebts && (
                              <p className="mt-1 text-sm text-red-600">{errors.existingDebts}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Family Size</label>
                            <Field
                              name="familySize"
                              type="number"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary focus:ring-opacity-50"
                            />
                            {errors.familySize && touched.familySize && (
                              <p className="mt-1 text-sm text-red-600">{errors.familySize}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Coverage Ammount Preference</label>
                            <Field
                              name="coverageAmountPreference"
                              type="number"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary focus:ring-opacity-50"
                            />
                            {errors.coverageAmountPreference && touched.coverageAmountPreference && (
                              <p className="mt-1 text-sm text-red-600">{errors.coverageAmountPreference}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">Vehicle Ownership</label>
                            <Field
                              name="vehicleOwnership"
                              type="boolean"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary focus:ring-opacity-50"
                            />
                            {errors.vehicleOwnership && touched.vehicleOwnership && (
                              <p className="mt-1 text-sm text-red-600">{errors.vehicleOwnership}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Primary Goal of Insurance</label>
                            <Field
                              name="primaryGoalForInsurance"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary focus:ring-opacity-50"
                            />
                            {errors.primaryGoalForInsurance && touched.primaryGoalForInsurance && (
                              <p className="mt-1 text-sm text-red-600">{errors.primaryGoalForInsurance}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">Willingness to Pay Premiums</label>
                            <Field
                              as="select"
                              name="willingnessToPayPremiums"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary focus:ring-opacity-50"
                            >
                              <option value="">Select status</option>
                              <option value="Monthly">Monthly</option>
                              <option value="Quarterly">Quarterly</option>
                              <option value="Annually">Annually</option>
                            </Field>

                            {errors.willingnessToPayPremiums && touched.willingnessToPayPremiums && (
                              <p className="mt-1 text-sm text-red-600">{errors.willingnessToPayPremiums}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Travel Habits</label>
                            <Field
                              as="select"
                              name="travelHabits"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary focus:ring-opacity-50"
                            >
                              <option value="">Select status</option>
                              <option value="Domestic">Domestic</option>
                              <option value="International">International</option>
                              <option value="None">None</option>
                            </Field>

                            {errors.travelHabits && touched.travelHabits && (
                              <p className="mt-1 text-sm text-red-600">{errors.travelHabits}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Health Status</label>
                            <Field
                              as="select"
                              name="healthStatus"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary focus:ring-opacity-50"
                            >
                              <option value="">Select status</option>
                              <option value="Excellent">Excellent</option>
                              <option value="Good">Good</option>
                              <option value="Fair">Fair</option>
                              <option value="Poor">Poor</option>
                            </Field>
                            {errors.healthStatus && touched.healthStatus && (
                              <p className="mt-1 text-sm text-red-600">{errors.healthStatus}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Life Style habits</label>
                            <Field
                              as="select"
                              name="lifestyleHabits"
                              multiple={true}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary focus:ring-opacity-50"
                            >
                              <option value="Smoking">Smoking</option>
                              <option value="Alcohol">Alcohol</option>
                              <option value="None">None</option>
                            </Field>
                            {errors.lifestyleHabits && touched.lifestyleHabits && (
                              <p className="mt-1 text-sm text-red-600">{errors.lifestyleHabits}</p>
                            )}
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

                {/* Change Password Form */}
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
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary focus:ring-opacity-50"
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
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary focus:ring-opacity-50"
                          />
                          {errors.newPassword && touched.newPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                          <Field
                            name="confirmPassword"
                            type="password"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary focus:ring-opacity-50"
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
