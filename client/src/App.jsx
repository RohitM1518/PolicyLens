import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { useResponseContext } from './contexts/ResponseContext'
import { useErrorContext } from './contexts/ErrorContext'
import { useLoadingContext } from './contexts/LoadingContext'

function App() {
  const { response, setResponse } = useResponseContext()
  const { error, setError } = useErrorContext()
  const { isLoading } = useLoadingContext()
  if (error) {
    setTimeout(() => {
      setError('')
    }, 5000)
  }
  if (response) {
    setTimeout(() => {
      setResponse('')
    }, 5000)
  }

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        {response && <div className="toast toast-bottom toast-start z-20">
          <div className="alert bg-green-400">
            <span>{response}</span>
          </div>
        </div>}
        {error && <div className="toast toast-bottom toast-start z-20">
          <div className="alert bg-red-600 text-white">
            <span>{error}</span>
          </div>
        </div>}
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  )
}

export default App