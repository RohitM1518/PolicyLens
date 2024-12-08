import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AuthLayout from './utils/AuthLayout.jsx';
import { Home, Summaries, RegionalLanguage, ChatBot, SignIn, SignUp, Dashboard, Profile } from './pages/index.js';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store.js';
import { ErrorContextProvider } from './contexts/ErrorContext.jsx';
import { LoadingContextProvider } from './contexts/LoadingContext.jsx';
import { UserContextProvider } from './contexts/UserContext.jsx';
import { ResponseContextProvider } from './contexts/ResponseContext.jsx';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'react-hot-toast';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: '/summaries',
        element: <AuthLayout authentication={true}>
          <Summaries />
        </AuthLayout>
      },
      {
        path: '/regional-language',
        element: <AuthLayout authentication={true}>
          <RegionalLanguage />
        </AuthLayout>
      },
      {
        path: '/chatbot',
        element: <AuthLayout authentication={true}>
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
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <UserContextProvider>
          <LoadingContextProvider>
            <ErrorContextProvider>
              <ResponseContextProvider>
                <RouterProvider router={router} />
                <Toaster 
                  position="bottom-left"
                  toastOptions={{
                    duration: 5000,
                    style: {
                      background: '#333',
                      color: '#fff',
                    },
                    success: {
                      style: {
                        background: 'green',
                      },
                    },
                    error: {
                      style: {
                        background: 'red',
                      },
                    },
                  }}
                />
              </ResponseContextProvider>
            </ErrorContextProvider>
          </LoadingContextProvider>
        </UserContextProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);