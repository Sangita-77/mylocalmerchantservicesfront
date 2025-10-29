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
import Tooltip from "../components/Tooltip";
import { FaBell } from "react-icons/fa6";



function ProviderDashboardTopBar({ heading }) {

  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const [hoverTimeout, setHoverTimeout] = useState(null);

  const handleDeleteClick = () => {
    setShowConfirmModal(true);
  };


  const {
    token,
  } = useContext(AppContext);


  const handleMouseEnter = () => {
    clearTimeout(hoverTimeout);
    handleNotification(); // fetch + show
  };
  
  const handleMouseLeave = () => {
    const timeout = setTimeout(() => setShowNotifications(false), 200);
    setHoverTimeout(timeout);
  };

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

  const handleNotification = async () => {
    try {
      const agent_id = parseInt(localStorage.getItem("merchant_id"), 10);
      const response = await axios.post(
        `${BASE_URL}/getAgentNotifications`,
        { agent_id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.status) {
        const data = response.data.data.notification;
        // only show notifications where merchant_notification is not null
        const merchantNotifications = data.filter(
          (item) => item.agent_notification
        );
        setNotifications(merchantNotifications);
        setShowNotifications(true);
      } else {
        console.error("Failed to load notifications:", response.data.message);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
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
            <Tooltip text="Logout">
              <FaPowerOff size={24} color={"#0d64a9"} />
            </Tooltip>
          </div>
          <div className="profileIconContainer" onClick={() => navigate(routes.provider_profile())} style={{ cursor: "pointer" }}>
            <Tooltip text="Profile">
              <FaCircleUser size={24} color={"#0d64a9"} />
            </Tooltip>
          </div>

          <div
            className="profileIconContainer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: "pointer", position: "relative" }}
          >
            <Tooltip text="Notification">
              <FaBell size={24} color="#0d64a9" />
            </Tooltip>

            {showNotifications && (
              <div className="notificationDropdown">
                {notifications.length > 0 ? (
                  notifications.map((item, index) => (
                    <div key={index} className="notificationItem">
                      <p>{item.merchant_notification}</p>
                      <small>{new Date(item.created_at).toLocaleString()}</small>
                    </div>
                  ))
                ) : (
                  <p className="noNotification">No notifications found</p>
                )}
              </div>
            )}
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

export default ProviderDashboardTopBar; 