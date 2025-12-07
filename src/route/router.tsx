import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import LoginView from "../modules/login/login";
import ProfileView from "../modules/profile/profile";
import HomeFeedView from "../modules/homefeed/home";
import NotFoundView from "../modules/notfound/NotFoundView ";
import RouteGuard from "../layouts/RouteGuard";
import DefaultLayout from "../layouts/common/DefaultLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RouteGuard>
        <DefaultLayout />
      </RouteGuard>
    ),
    children: [
      {
        path: "",
        element: <HomeFeedView />,
      },
      {
        path: "homefeed",
        element: <HomeFeedView />,
      },
      {
        path: "profile",
        element: <ProfileView />,
      },
    ],
  },
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      {
        path: "",
        element: <Navigate to="login" replace />,
      },
      {
        path: "login",
        element: <LoginView />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundView />,
  },
]);

const Wrapper = () => {
  return <RouterProvider router={router} />;
};

export default Wrapper;
