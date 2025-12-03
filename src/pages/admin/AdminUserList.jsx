import React, { useContext, useState, useEffect } from "react";
import './../../styles/styles.css';

import axios from "axios";
import { BASE_URL } from "../../utils/apiManager";
import { AppContext } from "../../utils/context";
import { AiOutlineDelete } from "react-icons/ai";
import { PiEyeLight } from "react-icons/pi";
import { FiDownload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import AdminDashBoardTopBar from "../../components/AdminDashBoardTopBar";
import PreLoader from "../../components/PreLoader";
import ConfirmModal from "../../components/ConfirmModal";
import UserDetailsModal from "../../components/UserDetailsModal"; 
import Tooltip from "../../components/Tooltip";
import DashBoardFooter from "../../components/DashBoardFooter";
import { routes } from "../../utils/routes";

const AdminUserList = () => {

  const [loading, setLoading] = useState(true);
  const [userList, setUserList] = useState({ contactList: [] });

  const { token } = useContext(AppContext);
  const navigate = useNavigate();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

const handleDeleteClick = (user_id) => {
  setSelectedUserId(user_id);
  setShowConfirmModal(true);
};

const [selectedUserDetails, setSelectedUserDetails] = useState(null);

// Function to handle view
const handleViewClick = (user) => {
  setSelectedUserDetails(user);
};

const resolveMerchantId = (user) =>
  user?.merchant_id ?? user?.id ?? user?.merchantId ?? null;

const handleTrackActivity = (user) => {
  const merchantId = resolveMerchantId(user);
  if (!merchantId) {
    alert("Unable to determine merchant for this row.");
    return;
  }
  navigate(routes.admin_merchant_activity(merchantId));
};

const confirmDelete = async () => {
  try {
    const body = { user_id: selectedUserId, flag: 'user' };
    const res = await axios.post(
      `${BASE_URL}/deleteUser`,
      JSON.stringify(body),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.data.status) {
      fetchConnectedHistory(); // Refresh list
    }
  } catch (error) {
    console.error("Error deleting user:", error);
  } finally {
    setShowConfirmModal(false);
    setSelectedUserId(null);
  }
};


  useEffect(() => {
    fetchConnectedHistory();
  }, []);


  const fetchConnectedHistory = async () => {
    try {
      const body = { }; 
      const res = await axios.post(
        `${BASE_URL}/getUserList`,
        JSON.stringify(body),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (res.data.status) {
        // console.log("API Response:", res.data); 
        setUserList(res.data); 
      } else {
        setUserList({ connect: [] }); 
      }
    } catch (error) {
      console.error("Error fetching connected history:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to escape CSV values
  const escapeCSV = (value) => {
    if (value === null || value === undefined) return "";
    const stringValue = String(value);
    if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const handleDownloadCSV = () => {
    if (!Array.isArray(userList.contactList) || userList.contactList.length === 0) {
      alert("No data available to download");
      return;
    }

    // CSV headers
    const headers = ["Email", "Headline", "City", "State", "Services"];
    
    // Convert data to CSV rows
    const csvRows = userList.contactList.map((user) => {
      const email = user.email || user.user_id || "";
      const headline = user.company_description || "";
      const city = user.city || "";
      const state = user.state || "";
      const services = user.type_of_service || "";
      
      return [
        escapeCSV(email),
        escapeCSV(headline),
        escapeCSV(city),
        escapeCSV(state),
        escapeCSV(services)
      ].join(",");
    });
    
    // Combine headers and rows
    const csvContent = [headers.join(","), ...csvRows].join("\n");
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `merchants_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSingleMerchantCSV = (user) => {
    if (!user) {
      alert("No merchant data available to download");
      return;
    }

    // CSV headers
    const headers = ["Email", "Headline", "City", "State", "Services"];
    
    // Extract merchant data
    const email = user.email || user.user_id || "";
    const headline = user.company_description || "";
    const city = user.city || "";
    const state = user.state || "";
    const services = user.type_of_service || "";
    
    // Create CSV row
    const csvRow = [
      escapeCSV(email),
      escapeCSV(headline),
      escapeCSV(city),
      escapeCSV(state),
      escapeCSV(services)
    ].join(",");
    
    // Combine headers and row
    const csvContent = [headers.join(","), csvRow].join("\n");
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    // Generate filename from merchant name or email
    const merchantName = (user.company_name || user.merchant_name || email || "merchant")
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase()
      .substring(0, 50);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `${merchantName}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <>
      <div className='adminUserlistWrapper'>
      <AdminDashBoardTopBar heading="Merchants List" />
        <div className='adminDashboardContainer'>

          

     <div className="adminUserlIstContainer">
      <div style={{ marginBottom: "15px", display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={handleDownloadCSV}
          className="tableActionBtn"
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "8px",
            padding: "10px 20px"
          }}
          disabled={loading || !Array.isArray(userList.contactList) || userList.contactList.length === 0}
        >
          <FiDownload size={18} />
          Download CSV
        </button>
      </div>
      <div className="tableContainerWrap">
            <table className="tableContainer">
              <thead className="theadContainer">
                <tr>
                  <th className="th">Name</th>
                  <th className="th">E-mail</th>
                  <th className="th">Industry</th>
                  <th className="th">Track Activity</th>
                  <th className="thActions">Actions</th>
                </tr>
              </thead>
              <tbody className="tbodyContainer">
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                      <div>Loading data...</div>
                    </td>
                  </tr>
                ) : Array.isArray(userList.contactList) && userList.contactList.length > 0 ? (
                  userList.contactList.map((user, index) => (
                    <tr key={index} className="tr">
                      <td className="td">{user.company_name}</td>
                      <td className="td">{user.user_id}</td>
                      <td className="td">{user.industry || "N/A"}</td>
                      <td className="td">
                        <button
                          className="tableActionBtn"
                          style={{ minWidth: 140 }}
                          onClick={() => handleTrackActivity(user)}
                        >
                          Track Activity
                        </button>
                      </td>
                      <td className="actionTd">
                        <button className="viewButton" onClick={() => handleViewClick(user)} data-bs-toggle="tooltip"
                        data-bs-placement="auto"
                        title="View Details">
                          <PiEyeLight size={22} color="white" />
                        </button>
                        <button 
                          className="viewButton" 
                          onClick={() => handleDownloadSingleMerchantCSV(user)} 
                          data-bs-toggle="tooltip"
                          data-bs-placement="auto"
                          title="Download CSV"
                          style={{ backgroundColor: "#28a745" }}
                        >
                          <FiDownload size={22} color="white" />
                        </button>
                        <button className="delButton" onClick={() => {
                            handleDeleteClick(user.user_id);
                        }} data-bs-toggle="tooltip"
                        data-bs-placement="auto"
                        title="Delete">
                          <AiOutlineDelete size={22} color="#E60E4E" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="td" colSpan="5" style={{ textAlign: "center" }}>
                      No User Found.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
            </div>
          </div>


        </div>

        {showConfirmModal && (
          <ConfirmModal
            title="Delete User"
            message="Are you sure you want to delete this user?"
            onConfirm={confirmDelete}
            onCancel={() => setShowConfirmModal(false)}
          />
        )}

        {selectedUserDetails && (
          <UserDetailsModal
            user={selectedUserDetails}
            onClose={() => setSelectedUserDetails(null)}
          />
        )}
      </div>
      

    </>
  )
}

export default AdminUserList;