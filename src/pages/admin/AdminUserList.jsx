import React, { useContext, useState, useEffect } from "react";
import './../../styles/styles.css';

import axios from "axios";
import { BASE_URL } from "../../utils/apiManager";
import { AppContext } from "../../utils/context";
import { AiOutlineDelete } from "react-icons/ai";
import { PiEyeLight } from "react-icons/pi";
import AdminDashBoardTopBar from "../../components/AdminDashBoardTopBar";
import PreLoader from "../../components/PreLoader";
import ConfirmModal from "../../components/ConfirmModal";
import UserDetailsModal from "../../components/UserDetailsModal"; 
import Tooltip from "../../components/Tooltip";

const AdminUserList = () => {

  const [loading, setLoading] = useState(true);
  const [userList, setUserList] = useState({ contactList: [] });

  const { token } = useContext(AppContext);

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


  return (
    <>
      <div className='adminUserlistWrapper'>
      <AdminDashBoardTopBar heading="User List" />
        <div className='adminDashboardContainer'>

          

     <div className="adminUserlIstContainer">
            <table className="tableContainer">
              <thead className="theadContainer">
                <tr>
                  <th className="th">Name</th>
                  <th className="th">Email</th>
                  <th className="th">Industry</th>
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
                      <td className="actionTd">
                        <button className="viewButton" onClick={() => handleViewClick(user)} data-bs-toggle="tooltip"
                        data-bs-placement="auto"
                        title="View Details">
                          <PiEyeLight size={22} color="white" />
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