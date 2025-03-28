import { createBrowserRouter } from "react-router-dom";
import App from "./App"; 
import Home from "./pages/Home";
import ContactUs from "./pages/ContactUs";
import Categories from "./pages/Categories";
import { ErrorPage } from "./pages/ErrorPage";
import AboutUS from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import ProtectedRoute from "./pages/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import MessagesPage from "./pages/MessagesPage";
import ProfilePage from "./pages/ProfilePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,  
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/aboutus", element: <AboutUS /> },
      { path: "/contactus", element: <ContactUs /> },
      { path: "/categories", element: <Categories /> },
      { path: "/login", element: <Login /> },   
      { path: "/signup", element: <Signup /> }, 
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/messages",
        element: (
          <ProtectedRoute>
            <MessagesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
