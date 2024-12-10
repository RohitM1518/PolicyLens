import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { useResponseContext } from './contexts/ResponseContext'
import { useErrorContext } from './contexts/ErrorContext'
import { useLoadingContext } from './contexts/LoadingContext'
import { useUserContext } from './contexts/UserContext'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'


function App() {
  const { response, setResponse } = useResponseContext()
  const { error, setError } = useErrorContext()
  const { isLoading } = useLoadingContext()
  const { setUser } = useUserContext()
  const accessToken = useSelector((state) => state?.currentUser?.accessToken);
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const user = useSelector(state=>state?.currentUser?.user)
  
  useEffect(()=>{
    if(user){
      setUser(user);
    }
  },[])


  // Handle clearing error messages after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('')
      }, 5000)
      return () => clearTimeout(timer) // Cleanup on component unmount
    }
  }, [error, setError])

  // Handle clearing response messages after 5 seconds
  useEffect(() => {
    if (response) {
      const timer = setTimeout(() => {
        setResponse('')
      }, 5000)
      return () => clearTimeout(timer) // Cleanup on component unmount
    }
  }, [response, setResponse])

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        {response && (
          <div className="toast toast-bottom toast-start z-50">
            <div className="alert bg-green-400">
              <span>{response}</span>
            </div>
          </div>
        )}
        {error && (
          <div className="toast toast-bottom toast-start z-50">
            <div className="alert bg-red-600 text-white">
              <span>{error}</span>
            </div>
          </div>
        )}
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  )
}

export default App
