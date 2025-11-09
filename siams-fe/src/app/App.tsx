import { StrictMode } from 'react'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { ThemeProvider } from "@/components/ThemeProvider"
import { routes } from './routes';
import { AuthProvider } from '@/contexts/auth-ctx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner"

const router = createBrowserRouter(routes)
const queryClient = new QueryClient();

export default function App() {
  return (
    <StrictMode>
      <Toaster />
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </AuthProvider>
      </ThemeProvider>
    </StrictMode>
  )
}

