import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProtectedRoute from "../components/common/ProtectedRoute";
import Dashboard from "../pages/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute publicOnly>
        <MainLayout />
      </ProtectedRoute>
    ),
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        element: (
          <ProtectedRoute publicOnly>
            <Login />
          </ProtectedRoute>
        ),
      },
      {
        path: "register",
        element: (
          <ProtectedRoute publicOnly>
            <Register />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
]);
