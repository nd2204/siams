// Layouts
import ProtectedRoute from '@/components/ProtectedRoute';
import AuthLayout from '@/layouts/AuthLayout';
import MainLayout from '@/layouts/MainLayout'
// Pages
import SigninPage from '@/pages/auth/signin-page';
import SignupPage from '@/pages/auth/signup-page';
import DashboardPage from '@/pages/dashboard';
import ClusterPage from '@/pages/dashboard/ClusterPage';
import ClusterDetailPage from '@/pages/dashboard/ClusterDetailPage';
import DevicePage from '@/pages/dashboard/DevicePage';
import DeviceDetailPage from '@/pages/dashboard/DeviceDetailPage';
import SettingPage from '@/pages/dashboard/SettingPage';
import UserProfilePage from '@/pages/dashboard/UserProfilePage';
import type { RouteObject } from 'react-router';
import NotFoundPage from '@/pages/errors/NotFoundPage';

export const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <ProtectedRoute roles={["user", "admin"]} >
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "device", element: <DevicePage /> },
      { path: "device/:id", element: <DeviceDetailPage /> },
      { path: "cluster", element: <ClusterPage /> },
      { path: "cluster/:id", element: <ClusterDetailPage /> },
      { path: "setting", element: <SettingPage /> },
      { path: "profile", element: <UserProfilePage /> },
    ]
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { index: true, element: <SigninPage /> },
      { path: "signup", element: <SignupPage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
];
