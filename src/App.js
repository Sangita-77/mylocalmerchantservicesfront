/////////////  IMPORTS  /////////////
import { useContext, useEffect, useState } from "react";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "./utils/apiManager";
import { AppContext } from "./utils/context";
import { BASENAME } from "./config";

/////////////  PAGES  ///////////////
import OnboardingPage from "./pages/OnboardingPage";
import OnboardingPageHeader from "./components/OnboardingPageHeader";
import OnboardingPageFooter from "./components/OnboardingPageFooter";
import ForgetPassword from "./pages/ForgetPassword";

/////////////  STYLES  ///////////
import "./styles/styles.css";
import ResetPassword from "./pages/ResetPassword";
import MerchantRegistration from "./pages/merchant/MerchantRegistration";
import AdminSidebar from "./components/AdminSidebar";
import SuperAdminDashboard from "./pages/admin/SuperAdminDashboard";
import AdminMerchantList from "./pages/admin/AdminMerchantList";
import MerchantDashboard from "./pages/merchant/MerchantDashboard";
import MerchantSidebar from "./components/MerchantSidebar";
import MerchantProfile from "./pages/merchant/MerchantProfile";
import MerchantList from "./pages/MerchantList";
import InitialLoader from "./components/InitialLoader";
import MerchantFooter from "./components/MerchantFooter";
import { middleware, testAuthToken } from "./utils/helper";
import UserConnectedHistory from "./pages/merchant/UserConnectedHistory";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [loading, setLoading] = useState(false);

  const { isLoggedIn, setIsLoggedIn, setToken, isAuthenticated } =
    useContext(AppContext);

  const fetchAuthToken = async () => {
    setLoading(true);
    const sessionToken = sessionStorage.getItem("cc_set");

    if (sessionToken) {
      setToken(sessionToken);
      setLoading(false);
      return;
    }

    const authToken = await testAuthToken(); // assuming it returns a string token
    sessionStorage.setItem("cc_set", authToken);
    setToken(authToken);
    setLoading(false);
  };

  const MainLayout = () => {
    return (
      <div className="mainLayoutContainer">
        <OnboardingPageHeader />

        <div className="mainLayoutOutlet">
          <Outlet />
        </div>

        <OnboardingPageFooter />
      </div>
    );
  };

  const SuperAdminLayout = () => {
    return (
      <div className="adminLayoutContainer">
        <AdminSidebar />
        <div className="adminOutletContainer">
          <Outlet />
        </div>
      </div>
    );
  };

  const MerchantAdminLayout = () => {
    return (
      <div className="adminLayoutContainer">
        <MerchantSidebar />
        <div className="adminOutletContainer">
          <Outlet />
        </div>
      </div>
    );
  };

  // const ProtectedRoute = ({ children }) => {
  //   // if (loading) {
  //   //   return <div>Checking authentication...</div>;
  //   // }
  //   // const isLoggedIn = JSON.parse(localStorage.getItem("logged_in"));
  //   // console.log("logged_in status from app.js", isLoggedIn);

  //   const isAuthenticated = JSON.parse(
  //     localStorage.getItem("is_authenticated")
  //   );
  //   const personType = JSON.parse(localStorage.getItem("person_type"));

  //   if (isAuthenticated === true && personType === "merchant") {
  //     return children;
  //   } else {
  //     return <Navigate to="/registration" replace />;
  //   }
  // };

  // useEffect(() => {
  //   localStorage.removeItem("is_authenticated");
  //   localStorage.removeItem("person_type");
  //   localStorage.removeItem("user_id");
  // }, [])

  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          {
            path: "/",
            element: <OnboardingPage />,
          },
          {
            path: "/registration",
            element: <MerchantRegistration />,
          },
          {
            path: "/forget-password",
            element: <ForgetPassword />,
          },
          {
            path: "/reset-password",
            element: <ResetPassword />,
          },
          {
            path: "/merchant-list",
            element: <MerchantList />,
          },
        ],
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute>
            <SuperAdminLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "/admin/dashboard",
            element: <SuperAdminDashboard />,
          },
          {
            path: "/admin/merchant_list",
            element: <AdminMerchantList />,
          },
        ],
      },
      {
        path: "/merchant",
        element: (
          <ProtectedRoute>
            <MerchantAdminLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "/merchant/dashboard",
            element: <MerchantDashboard />,
          },
          {
            path: "/merchant/profile",
            element: <MerchantProfile />,
          },
          {
            path: "/merchant/user_connected_history",
            element: <UserConnectedHistory />,
          },
        ],
      },
    ],
    {
      basename: BASENAME,
    }
  );

  // if (pageLoading) {
  //   return <InitialLoader />; // or a spinner component
  // }

  useEffect(() => {
    // sessionStorage.removeItem("cc_set");
    fetchAuthToken();
  }, []);

  return <RouterProvider router={router} />;
}

export default App;

//////////////////  full screen width 1600
