import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Protected({ children, authentication = true }) {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const authStatus = useSelector(state => state?.isLoggedIn);

  useEffect(() => {
    if (authentication && !authStatus) {
      navigate("/signin", { 
        state: { 
          message: "Please sign in to access this feature",
          from: window.location.pathname 
        }
      });
    }
    setLoader(false);
  }, [authStatus, navigate, authentication]);

  if (loader) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return <>{children}</>;
}