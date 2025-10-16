import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global.css'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import DashboardLayout from './app/dashboard/layout';

const router = createBrowserRouter([
  {
    path: "/",
    Component: DashboardLayout,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
