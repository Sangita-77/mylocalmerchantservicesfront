import React, { useContext, useState, useEffect } from "react";
import AccordianProps from "./AccordianProps";
import { MdOutlineGroup } from "react-icons/md";
import { PiEyeLight } from "react-icons/pi";
import { GoPencil } from "react-icons/go";
import { AiOutlineDelete } from "react-icons/ai";
import { IoStorefrontSharp } from "react-icons/io5";

import UserDetailsModal from "./UserDetailsModal";

import axios from "axios";
import { BASE_URL } from "../utils/apiManager";
import { AppContext } from "../utils/context";
import ConfirmModal from "../components/ConfirmModal";
import AdminApproveModal from "./AdminApproveModal";
import AdminMerchantUpdate from "./AdminMerchantUpdate";



const MerchantListComp = ({ approvedUsers = [], pendingUsers = [] , loading , approvedHeading , pendingHeading , flag , onRefresh}) => {

  const { token } = useContext(AppContext);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleDeleteClick = (user_id) => {
    setSelectedUserId(user_id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      const body = { user_id: selectedUserId, flag: flag };
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
        onRefresh();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setShowConfirmModal(false);
      setSelectedUserId(null);
    }
  };


  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [selectedUserApprove, setSelectedUserApprove] = useState(null);
  const [editUserDetails, setEditUserDetails] = useState(null);

// Function to handle view
const handleViewClick = (user) => {
  setSelectedUserDetails(user);
};

// Function to handle view
const handleApproveClick = (user) => {
  setSelectedUserApprove(user);
};

// Function to Edit
const handleEditClick = (user) => {
  setEditUserDetails(user);
};


  return (
    <div>
      <AccordianProps 
        bgColor="#71CDEA"
        borderColor="#23B7E5"
        Icon={IoStorefrontSharp}
        Heading={approvedHeading}
        tbody={
          <>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                  <div>Loading data...</div>
                </td>
              </tr>
            ) : Array.isArray(approvedUsers) && approvedUsers.length > 0 ? (
            approvedUsers.map((user, index) => (
              <tr key={user.id || index}>
                <td>{user.merchant_id}</td>
                <td>{user.merchant_name}</td>
                <td>{user.street} , {user.city} , Zip - {user.zip_code}</td>
                <td>{user.type_of_service}</td>
                <td>
                  <button className="viewButton" onClick={() => handleViewClick(user)} data-bs-toggle="tooltip" data-bs-placement="auto" title="View Details">
                    <PiEyeLight size={22} color="white" />
                  </button>
                  <button className="editButton" onClick={() => handleEditClick(user)} data-bs-toggle="tooltip" data-bs-placement="auto" title="Edit">                               
                    <GoPencil color="green" />
                  </button>
                  <button className="delButton" data-bs-toggle="tooltip" data-bs-placement="auto" title="Delete" onClick={() => {
                            handleDeleteClick(user.user_id);
                        }}>                               
                    <AiOutlineDelete size={22} color="#E60E4E" style={{ cursor: "pointer" }} />
                  </button>
                
                </td>
              </tr>
            )) ) : (
              <tr>
                <td className="td" colSpan="5" style={{ textAlign: "center" }}>
                  No User Found.
                </td>
              </tr>
            )}
          </>
        }
      />
      
      <AccordianProps 
        bgColor="#6586B3"
        borderColor="#4A70A4"
        Icon={MdOutlineGroup}
        Heading={pendingHeading}
        tbody={
          <>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                  <div>Loading data...</div>
                </td>
              </tr>
            ) : Array.isArray(pendingUsers) && pendingUsers.length > 0 ? (
              pendingUsers.map((user, index) => (
                <tr key={user.id || index}>
                  <td>{user.merchant_id}</td>
                  <td>{user.merchant_name}</td>
                  <td>{user.street} , {user.city} , Zip - {user.zip_code}</td>
                  <td>{user.type_of_service}</td>
                  <td>
                    <button className="viewButton" onClick={() => handleApproveClick(user)} data-bs-toggle="tooltip" data-bs-placement="auto" title="View Details">
                      <PiEyeLight size={22} color="white" />
                    </button>
                    <button className="delButton" data-bs-toggle="tooltip" data-bs-placement="auto" title="Delete" onClick={() => {
                            handleDeleteClick(user.user_id);
                        }}>                               
                      <AiOutlineDelete size={22} color="#E60E4E" style={{ cursor: "pointer" }} />
                    </button>
                    
                  </td>
                </tr>
            ))) : (
              <tr>
                <td className="td" colSpan="5" style={{ textAlign: "center" }}>
                  No User Found.
                </td>
              </tr>
            )}
          </>
        }
      />
      {selectedUserDetails && (
          <UserDetailsModal
            user={selectedUserDetails}
            onClose={() => setSelectedUserDetails(null)}
          />
        )}
      {selectedUserApprove && (
          <AdminApproveModal
            user={selectedUserApprove}
            onClose={() => setSelectedUserApprove(null)}
            flag={flag}
            onRefresh={onRefresh}
          />
        )}
      {editUserDetails && (
          <AdminMerchantUpdate
            user={editUserDetails}
            onClose={() => setEditUserDetails(null)}
          />
        )}
      {showConfirmModal && (
        <ConfirmModal
          title="Delete User"
          message="Are you sure you want to delete this merchant?"
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
};


export default MerchantListComp;
