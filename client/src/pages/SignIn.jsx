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

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const {setUser} = useUserContext();
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const { setIsLoading } = useLoadingContext();
  const { setError } = useErrorContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const res = await axios.post(`${backendURL}/user/login`, formData);
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
      <form className="space-y-6" onSubmit={handleSubmit}>
        <FormInput
          label="Email address"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleInputChange}
        />

        <FormInput
          label="Password"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={formData.password}
          onChange={handleInputChange}
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
      </form>
    </AuthLayout>
  );
}