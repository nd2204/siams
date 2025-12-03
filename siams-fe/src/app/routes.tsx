import ProtectedRoute from '@/components/ProtectedRoute';
import ClusterDetailPage from '@/pages/dashboard/ClusterDetailPage';
import DeviceDetailPage from '@/pages/dashboard/DeviceDetailPage';
import UserProfilePage from '@/pages/dashboard/UserProfilePage';
import type { AppRouteObject } from '@/types/navigations';
import { lazy } from 'react';
import { IconChartBar, IconCpu2, IconHelp, IconLayoutDashboard, IconSearch, IconSettings, IconStack2, IconUsers } from '@tabler/icons-react';

// Layouts
const AuthLayout = lazy(() => import('@/layouts/AuthLayout'));
const MainLayout = lazy(() => import('@/layouts/MainLayout'));

// Pages
const DashboardPage = lazy(() => import('@/pages/dashboard'));
const SigninPage = lazy(() => import('@/pages/auth/signin-page'));
const SignupPage = lazy(() => import('@/pages/auth/signup-page'));
const SettingPage = lazy(() => import('@/pages/dashboard/SettingPage'))
const ClusterPage = lazy(() => import('@/pages/dashboard/ClusterPage'))
const DevicePage = lazy(() => import('@/pages/dashboard/DevicePage'))
const OrganizationPage = lazy(() => import('@/pages/dashboard/OrganizationPage'));
const NotFoundPage = lazy(() => import('@/pages/errors/NotFoundPage'));

export const routes: AppRouteObject[] = [
  {
    id: "dashboard",
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    meta: {
      title: "Dashboard",
      order: 1,
      tablerIcon: IconLayoutDashboard,
      group: "general",
      sidebar: true
    },
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        id: "analytic",
        element: <DashboardPage />, // Change to analytics page
        meta: {
          title: "Analytics",
          order: 2,
          tablerIcon: IconChartBar,
          group: "general",
          sidebar: true
        }
      },
      {
        id: "clusters",
        path: "cluster",
        element: <ClusterPage />,
        meta: {
          title: "Clusters",
          order: 3,
          tablerIcon: IconStack2,
          group: "general",
          sidebar: true
        }
      },
      {
        id: "devices",
        path: "device",
        element: <DevicePage />,
        meta: {
          title: "Devices",
          order: 4,
          tablerIcon: IconCpu2,
          group: "general",
          sidebar: true,
        }
      },
      {
        id: "organization",
        path: "organization",
        element: <OrganizationPage />,
        meta: {
          title: "Organization",
          order: 5,
          tablerIcon: IconUsers,
          group: "general",
          sidebar: true,
        }
      },
      {
        id: "setting",
        path: "setting",
        element: <SettingPage />,
        meta: {
          title: "Settings",
          order: 1,
          tablerIcon: IconSettings,
          group: "secondary",
          sidebar: true,
        }
      },
      {
        id: "gethelp",
        path: "#",
        element: <SettingPage />,
        meta: {
          title: "Get Help",
          order: 2,
          tablerIcon: IconHelp,
          group: "secondary",
          sidebar: true,
        }
      },
      {
        id: "search",
        path: "#",
        meta: {
          title: "Search",
          tablerIcon: IconSearch,
          order: 3,
          group: "secondary",
          sidebar: true,
        }
      },
      {
        id: "profile",
        path: "profile",
        element: <UserProfilePage />,
        meta: {
          title: "Account",
          sidebar: false,
        }
      },
      {
        id: "clusterDetail",
        path: "cluster/:id",
        element: <ClusterDetailPage />,
        meta: {
          sidebar: false
        }
      },
      {
        id: "deviceDetail",
        path: "device/:id",
        element: <DeviceDetailPage />,
        meta: {
          sidebar: false
        }
      },
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

// export const routes: RouteObject[] = [
//   {
//     path: "/",
//     element: (
//       <ProtectedRoute>
//         <MainLayout />
//       </ProtectedRoute>
//     ),
//     children: [
//       { index: true, element: <DashboardPage /> },
//       { path: "device", element: <DevicePage /> },
//       { path: "device/:id", element: <DeviceDetailPage /> },
//       { path: "cluster", element: <ClusterPage /> },
//       { path: "cluster/:id", element: <ClusterDetailPage /> },
//       { path: "organization", element: <OrganizationPage /> },
//       { path: "setting", element: <SettingPage /> },
//       { path: "profile", element: <UserProfilePage /> },
//     ]
//   },
//   {
//     path: "/auth",
//     element: <AuthLayout />,
//     children: [
//       { index: true, element: <SigninPage /> },
//       { path: "signup", element: <SignupPage /> },
//     ],
//   },
//   { path: "*", element: <NotFoundPage /> },
// ];
