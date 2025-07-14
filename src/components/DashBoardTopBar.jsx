import React, { useContext, useEffect, useState } from "react";
import { FaPowerOff } from "react-icons/fa6";
import { FaCircleUser } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import axios from "axios";
import { BASE_URL } from "./../utils/apiManager.js"; 
import { AppContext } from "./../utils/context.js";
import DashboardTopHeading from "./DashboardTopHeading";
import "../styles/styles.css";
import { useNavigate } from "react-router-dom";
import { routes } from "./../utils/routes";
import ConfirmModal from "../components/ConfirmModal";


function DashBoardTopBar({ heading }) {

  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleDeleteClick = () => {
    setShowConfirmModal(true);
  };


  const {
    token,
  } = useContext(AppContext);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/logoutM`,
        {
          user_id: localStorage.getItem("user_id"),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.status) {
        // Logout successful, reload the page
        localStorage.removeItem("is_authenticated");
        localStorage.removeItem("user_id");
        window.location.reload();
      } else {
        console.error("Logout failed:", response.data.message);
        alert("Logout failed: " + response.data.message);
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Something went wrong during logout.");
    }
  };



  return (
    <>
    <div className="adminDashboardTopbar">
        <div className="adminDashboardTopbarLeft">
          <div className="adminDashboardTopTitle">
            <DashboardTopHeading text={heading} />
          </div>
        </div>
        <div className="adminDashboardTopbarRight">

          <div className="logoutIconContainer" onClick={() => {handleDeleteClick();}} style={{ cursor: "pointer" }}>
            <FaPowerOff size={24} color={"#0d64a9"} />
          </div>
          <div className="profileIconContainer" onClick={() => navigate(routes.merchant_profile())} style={{ cursor: "pointer" }}>
            <FaCircleUser size={24} color={"#0d64a9"} />
          </div>
          
        </div>
          {showConfirmModal && (
            <ConfirmModal
              title="Logout"
              message="Are you sure you want to logout?"
              onConfirm={handleLogout}
              onCancel={() => setShowConfirmModal(false)}
            />
          )}
      </div>
    </>
  )
}

export default DashBoardTopBar; 