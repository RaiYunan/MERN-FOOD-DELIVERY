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
import Orders from "../pages/Orders";
import AdminLayout from "@/layouts/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminProducts from "@/pages/admin/AdminProducts";

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
          { path: "profile", element: <Profile /> },
          { path: "orders", element: <Orders /> },
        ],
      },

      // protected - admin only
      {
        path: "/admin",
        element: <ProtectedRoute adminOnly />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <AdminDashboard /> },
              { path: "orders", element: <AdminOrders /> },
              { path: "products", element: <AdminProducts /> },
              { path: "users", element: <AdminUsers /> },
            ],
          },
        ],
      },
    ],
  },
]);
