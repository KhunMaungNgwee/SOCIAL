import Cookies from "js-cookie";
import { useState } from "react";

export default function useAuth() {
  const token = Cookies.get("react-template-app-token");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
  const [userRole, setUserRole] = useState<string | null>(null);


  const userLogin = (token: string) => {
    // console.log("Token",token);
    Cookies.set("react-template-app-token", token);
    setIsAuthenticated(true);

  };

  const userLogout = () => {
    Cookies.remove("react-template-app-token");
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return { isAuthenticated, userRole, userLogin, userLogout };
}
