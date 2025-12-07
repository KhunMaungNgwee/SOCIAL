import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";


const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
 console.log("ROuteGuard",isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};


export default RouteGuard;
