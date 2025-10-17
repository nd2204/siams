import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global.css'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { ThemeProvider } from "@/components/theme-provider"

import {
  SigninView,
  SignupView
} from './app/auth';

import {
  AuthLayout,
  DashboardLayout
} from './app/layout';

import {
  ClusterView,
  DashboardView,
  SettingView,
  UserProfileView
} from './app/dashboard';

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        Component: AuthLayout,
        children: [
          { index: true, Component: SigninView },
          { path: "signin", Component: SigninView },
          { path: "signup", Component: SignupView }
        ]
      },
      {
        path: "dashboard",
        Component: DashboardLayout,
        children: [
          { index: true, Component: DashboardView },
          { Component: ClusterView },
          { Component: SettingView },
          { Component: UserProfileView },
        ]
      }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
