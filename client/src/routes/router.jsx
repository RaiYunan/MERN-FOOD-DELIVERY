import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Menu from "@/pages/Menu";
import ProductDetail from "@/pages/ProductDetail";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import About from "@/pages/About";
import Profile from "../pages/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "menu", element: <Menu /> },
      { path: "menu/:id", element: <ProductDetail /> },
      { path: "about", element: <About /> },

      // protected - logged in users only
      {
        element: <ProtectedRoute />,
        children: [
          { path: "cart", element: <Cart /> },
          { path: "checkout", element: <Checkout /> },
          { path: 'profile', element: <Profile /> },
          // { path: 'orders', element: <Orders /> },
        ],
      },

      // protected - admin only
      {
        element: <ProtectedRoute adminOnly />,
        children: [
          // { path: 'admin', element: <AdminDashboard /> },
        ],
      },
    ],
  },
]);
