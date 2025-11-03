import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/hooks/use-auth";

interface Props {
  roles?: string[];
  children?: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/auth" replace />;

  return children ? <>{children}</> : <Outlet />;
}
