import { StrictMode } from 'react'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { ThemeProvider } from "@/components/ThemeProvider"
import { routes } from './routes';
import { AuthProvider } from '@/contexts/auth-ctx';

const router = createBrowserRouter(routes)

export default function App() {
  return (
    <StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </StrictMode>
  )
}

