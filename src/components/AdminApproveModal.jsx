import React, { useContext, useState, useEffect } from "react";
import "./../styles/styles.css";
import { IoMdClose } from "react-icons/io";
import AccordianProps from "./AccordianProps";
import { MdOutlineGroup } from "react-icons/md";
import { PiEyeLight } from "react-icons/pi";
import { GoPencil } from "react-icons/go";
import { AiOutlineDelete } from "react-icons/ai";

import UserDetailsModal from "./UserDetailsModal";

import axios from "axios";
import { BASE_URL } from "../utils/apiManager";
import { AppContext } from "../utils/context";
import ConfirmModal from "../components/ConfirmModal";
import AdminMerchantUpdate from "./AdminMerchantUpdate";
import placeholderimg from "./../assets/images/placeholderimg.jpg";

const AdminApproveModal = ({ user, onClose , flag , onRefresh}) => {
    const [isOpen, setIsOpen] = useState(false);
    // const wrapperRef = useRef(null);
    const { token } = useContext(AppContext);
    const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 100); 
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      onClose(); 
    }, 300); 
  };

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);

  const handleStatusClick = (user_id) => {
    setSelectedUserId(user_id);
    setShowConfirmModal(true);
  };

  const confirmStatus = async (user_id,status) => {
    try {
      setLoading(true);
      const body = { merchant_id: user_id, status: status };
      const res = await axios.post(
        `${BASE_URL}/updateMerchantStatus`,
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
        onClose();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
      setSelectedUserId(null);
      setSelectedStatus(null);
    }
  };

  const confirmDelete = async () => {
    try {
      const body = { user_id: selectedUserId, flag: flag };
      const res = await axios.post(
        `${BASE_URL}/sendMailToReject`,
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
        onClose();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setShowConfirmModal(false);
      setSelectedUserId(null);
    }
  };

  if (!user) return null;

  return (
    <div className="userDetailsOverlay">
      <div className={`userDetailsBoxWrapper ${isOpen ? "open" : ""}`}>
        <div className="messagesWindowCloseBtn" onClick={handleClose}>
          <IoMdClose color="#2A2626" size={24} />
        </div>

        <div className="userDetailsBox">
          <div className="userHeaderInfo">
            <div className="userImg">
              <img src={placeholderimg} alt="" />
            </div>
            <div className="formGroup">
              <input type="text" value={user.merchant_name} className="userName" readOnly />
            </div>
          </div>
          {/* <div className="formGroup">
            <label>Name :</label>
            <input type="text" value={user.merchant_name} readOnly />
          </div> */}
          <div className="formGroup">
            <label>Email :</label>
            <input type="text" value={user.user_id} readOnly />
          </div>
          <div className="formGroup">
            <label>Company Name:</label>
            <input type="text" value={user.company_name} readOnly />
          </div>
          <div className="formGroup">
            <label>Phone:</label>
            <input type="text" value={user.phone} readOnly />
          </div>
          {/* <div className="formGroup">
            <label>Typ of services:</label>
            <input type="text" value={user.type_of_service} readOnly />
          </div> */}
          <div className="formGroup">
            <label>Address:</label>
            <textarea
              value={`${user.city}, ${user.city}, ${user.state}, ${user.zip_code}`}
              readOnly
            ></textarea>
          </div>

            <button className="popButton" data-bs-toggle="tooltip" data-bs-placement="auto" title="Approve this user" onClick={() => {
                            confirmStatus(user.merchant_id , 1);
                        }}>{loading ? "Approving..." : "Approve"}</button>
            <button className="popButton" data-bs-toggle="tooltip" data-bs-placement="auto" title="Reject this user" onClick={() => {
                            handleStatusClick(user.user_id);
                        }}>Reject</button>
        </div>
      </div>
        {showConfirmModal && (
          <ConfirmModal
            title="Delete"
            message="Are you sure you want to delete this user?"
            onConfirm={confirmDelete}
            onCancel={() => setShowConfirmModal(false)}
          />
        )}
    </div>
  );
};

export default AdminApproveModal;
