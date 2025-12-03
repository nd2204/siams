import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/hooks/use-auth";

interface Props {
  roles?: string[];
  children?: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="bg-background justify-center items-center"> </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  return children ? <>{children}</> : <Outlet />;
}
