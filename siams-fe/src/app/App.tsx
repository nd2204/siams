import { StrictMode } from 'react'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { ThemeProvider } from "@/components/ThemeProvider"
import { routes } from './routes';
import { AuthProvider } from '@/contexts/auth-ctx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner"
import { useEffect } from 'react'
import { apiClient } from '@/services/api/client'

const router = createBrowserRouter(routes)
const queryClient = new QueryClient();

export default function App() {
  useEffect(() => {
    // Fetch CSRF token on app startup so subsequent mutating requests include it
    (async () => {
      try {
        const resp: any = await apiClient.get('/csrf-token');
        if (resp && resp.csrfToken) {
          apiClient.setCsrfToken(resp.csrfToken);
        }
      } catch (err) {
        // non-fatal: server may not support CSRF endpoint in some environments
        console.warn('Could not retrieve csrf token', err);
      }
    })();
  }, []);
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

