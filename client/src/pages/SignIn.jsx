import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useDispatch } from "react-redux";
import { useLoadingContext } from "../contexts/LoadingContext";
import { useErrorContext } from "../contexts/ErrorContext";
import { login } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { errorParser } from '../utils/errorParser';
import { useUserContext } from '../contexts/UserContext';
import FormInput from '../components/auth/FormInput';
import AuthLayout from '../components/auth/authLayout';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
// ... other imports remain the same

export default function SignIn() {
  const {setUser} = useUserContext();
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const { setIsLoading } = useLoadingContext();
  const { setError } = useErrorContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
  });

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true);
      const res = await axios.post(`${backendURL}/user/login`, values);
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
      title="Welcome back!"
      subtitle="New to PolicyLens?"
      linkText="Create an account"
      linkTo="/signup"
    >
      <Formik
        initialValues={{
          email: '',
          password: ''
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className="space-y-6">
            <FormInput
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              error={errors.email}
              touched={touched.email}
            />

            <FormInput
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              error={errors.password}
              touched={touched.password}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex w-full justify-center rounded-md bg-gradient-to-r from-primary to-secondary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:from-primary/90 hover:to-secondary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-200"
              >
                Sign in
              </motion.button>
            </motion.div>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
}
