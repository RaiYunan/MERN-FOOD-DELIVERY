import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { store } from './app/store'
import { fetchMe } from './features/auth/authSlice'
import { ThemeProvider } from './context/ThemeContext'
import App from './App.jsx'

import '@fontsource/fraunces/600.css'
import '@fontsource/fraunces/700.css'
import '@fontsource/manrope/400.css'
import '@fontsource/manrope/500.css'
import '@fontsource/manrope/600.css'
import '@fontsource/manrope/700.css'
import './index.css'

const token = localStorage.getItem('token')
if (token) {
  store.dispatch(fetchMe())
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#1A1410',
              color: '#FFFBF5',
              fontFamily: 'Manrope, sans-serif',
              fontSize: '14px',
            },
          }}
        />
      </ThemeProvider>
    </Provider>
  </StrictMode>
)