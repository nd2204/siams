import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { Spinner } from "./ui/spinner";

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
