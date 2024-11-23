import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Summaries from './pages/Summaries'
import RegionalLanguage from './pages/RegionalLanguage'
import ChatBot from './pages/ChatBot'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/summaries" element={<Summaries />} />
            <Route path="/regional-language" element={<RegionalLanguage />} />
            <Route path="/chatbot" element={<ChatBot />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App