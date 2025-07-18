import React, { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/apiManager";
import { AppContext } from "../utils/context";

const ProtectedRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  const [dotCount, setDotCount] = useState(1);
  const { token } = useContext(AppContext);
  const location = useLocation();

  useEffect(() => {
    // animate dots
    const interval = setInterval(() => {
      setDotCount((prev) => (prev < 3 ? prev + 1 : 1));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchMerchantProfile = async () => {
      const user_id = localStorage.getItem("user_id");
      const storedToken = localStorage.getItem("is_authenticated");
      const personType = localStorage.getItem("person_type");

      // Block unauthorized access by URL path
      const pathname = location.pathname;
      // console.log("pathname",pathname);

      if (pathname.includes("/admin") && personType !== "admin") {
        setIsAllowed(false);
        setChecking(false);
        return;
      }

      if (pathname.includes("/merchant") && personType === "admin") {
        setIsAllowed(false);
        setChecking(false);
        return;
      }

      if (!user_id || !storedToken || !personType) {
        setIsAllowed(false);
        setChecking(false);
        return;
      }

      try {
        const response = await axios.post(
          `${BASE_URL}/validationforLogin`,
          { user_id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );



        const { merchant } = response.data;

        if (merchant && merchant === storedToken) {
          setIsAllowed(true);
        } else {
          setIsAllowed(false);
        }
      } catch (error) {
        console.error("Error fetching merchant profile:", error);
        setIsAllowed(false);
      } finally {
        setChecking(false);
      }
    };

    if (token) {
      fetchMerchantProfile();
    }
  }, [token, location]);

  if (!checking && !isAllowed) {
    return <Navigate to="/" replace />;
  }

  const dots = ".".repeat(dotCount);

  return (
    <>
      {children}
      {checking && (
        <div style={overlayStyle}>
          <div style={spinnerStyle}>Checking authentication{dots}</div>
        </div>
      )}
    </>
  );
};

// Styles
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: "100%",
  backgroundColor: "rgba(255, 255, 255, 0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const spinnerStyle = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#333",
  marginLeft: 250,
};

export default ProtectedRoute;
