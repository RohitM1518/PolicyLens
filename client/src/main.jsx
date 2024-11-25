import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AuthLayout from './utils/AuthLayout.jsx'
import { Home, Summaries, RegionalLanguage, ChatBot, SignIn, SignUp, Dashboard, Profile } from './pages/index.js'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import { ErrorContextProvider } from './contexts/ErrorContext.jsx'
import { LoadingContextProvider } from './contexts/LoadingContext.jsx'
import { UserContextProvider } from './contexts/UserContext.jsx'
import { ResponseContextProvider } from './contexts/ResponseContext.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <AuthLayout authentication={false}>
          <Home />
        </AuthLayout>
      },
      {
        path: '/summaries',
        element: <AuthLayout authentication={false}>
          <Summaries />
        </AuthLayout>
      },
      {
        path: '/regional-language',
        element: <AuthLayout authentication={false}>
          <RegionalLanguage />
        </AuthLayout>
      },
      {
        path: '/chatbot',
        element: <AuthLayout authentication={false}>
          <ChatBot />
        </AuthLayout>
      },
      {
        path: '/signin',
        element: <AuthLayout authentication={false}>
          <SignIn />
        </AuthLayout>
      },
      {
        path: '/signup',
        element: <AuthLayout authentication={false}>
          <SignUp />
        </AuthLayout>
      },
      {
        path: '/dashboard',
        element: <AuthLayout authentication={true}>
          <Dashboard />
        </AuthLayout>
      },
      {
        path: '/profile',
        element: <AuthLayout authentication={true}>
          <Profile />
        </AuthLayout>
      },

    ]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContextProvider>
      <LoadingContextProvider>
        <ErrorContextProvider>
          <ResponseContextProvider>
            <Provider store={store}>
              <RouterProvider router={router} />
            </Provider>
          </ResponseContextProvider>
        </ErrorContextProvider>
      </LoadingContextProvider>
    </UserContextProvider>
  </StrictMode>,
)
