
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from "react-router";
import {AppRouter} from './router/AppRouter.jsx';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css'

const queryClient = new QueryClient()

createRoot( document.getElementById( 'root' ) ).render(
  // <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>
  // </StrictMode >
  ,
)