import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/hooks/use-auth";

interface Props {
  roles?: string[];
  children?: React.ReactNode;
}

export default function ProtectedRoute({ roles, children }: Props) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/auth" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return children ? <>{children}</> : <Outlet />;
}
