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
            <input type="text" value={user.phone ? user.phone : "No data"} readOnly />
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
          <div className="formGroup">
            <label>City:</label>
            <input type="text" value={user.city ? user.city : "No data"} readOnly />
          </div>
          <div className="formGroup">
            <label>State:</label>
            <input type="text" value={user.state ? user.state : "No data"} readOnly />
          </div>
          <div className="formGroup">
            <label>Zip Code:</label>
            <input type="text" value={user.zip_code ? user.zip_code : "No data"} readOnly />
          </div>
          <div className="formGroup">
            <label>Country:</label>
            <input type="text" value={user.country ? user.country : "No data"} readOnly />
          </div>
          <div className="formGroup">
            <label>Email:</label>
            <input type="text" value={user.email ? user.email : "No data"} readOnly />
          </div>
          <div className="formGroup">
            <label>Industry:</label>
            <input type="text" value={user.industry ? user.email : "No data"} readOnly />
          </div>
          <div className="formGroup">
            <label>Type of Service:</label>
            <input type="text" value={user.type_of_service ? user.type_of_service : "No data"} readOnly />
          </div>
          <div className="formGroup">
            <label>Website</label>
            <input type="text" value={user.website ? user.website : "No data"} readOnly />
          </div>
          <div className="formGroup">
            <label>Company Description</label>
            <input type="text" value={user.company_description ? user.company_description : "No data"} readOnly />
          </div>
          <div className="formGroup">
            <label>Status</label>
            <input type="text" value={user.status ? user.status : "No data"} readOnly />
          </div>
          <div className="formGroup">
            <label>Flag</label>
            <input type="text" value={user.flag ? user.flag : "No data"} readOnly />
          </div>
          <div className="formGroup">
            <label>SponsorBank</label>
            <input type="text" value={user.SponsorBank ? user.SponsorBank : "No data"} readOnly />
          </div>
          <div className="formGroup">
            <label>Primary Processing Platform</label>
            <input type="text" value={user.PPP ? user.PPP : "No data"} readOnly />
          </div>
          <div className="formGroup">
            <label>Secondary Processing Platform</label>
            <input type="text" value={user.SPP ? user.SPP : "No data"} readOnly />
          </div>
          <div className="formGroup">
            <label>Other</label>
            <input type="text" value={user.Other ? user.Other : "No data"} readOnly />
          </div>
          <div className="formGroup">
            <label>Distance Willing</label>
            <input type="text" value={user.DistanceWilling ? user.DistanceWilling : "No data"} readOnly />
          </div>
          <div className="formGroup">
            <label>Bullet One</label>
            <input type="text" value={user.bulletOne ? user.bulletOne : "No data"} readOnly />
          </div>
          <div className="formGroup">
            <label>Bullet Two</label>
            <input type="text" value={user.bulletTwo ? user.bulletTwo : "No data"} readOnly />
          </div>
          <div className="formGroup">
            <label>Bullet Three</label>
            <input type="text" value={user.bulletThree ? user.bulletThree : "No data"} readOnly />
          </div>
          <div className="formGroup">
            <label>Summary</label>
            <textarea type="text" value={user.summary ? user.summary : "No data"} readOnly ></textarea>
          </div>
          <div className="formGroup">
            <label>Sales Represenatives</label>
            <input type="text" value={user.salesrepresenatives ? user.salesrepresenatives : "No data"} readOnly />
          </div>
          <div className="formGroup">
            <label>Client Count</label>
            <input type="text" value={user.clientCount ? user.clientCount : "No data"} readOnly />
          </div>
          <div className="formGroup">
            <label>Client Publicly</label>
            <input type="text" value={user.clientPublicly ? user.clientPublicly : "No data"} readOnly />
          </div>
          <div className="formGroup">
            <label>Volume Processed</label>
            <input type="text" value={user.VolumeProcessed ? user.VolumeProcessed : "No data"} readOnly />
          </div>
          <div className="formGroup">
            <label>Volume Publicly</label>
            <input type="text" value={user.volumePublicly ? user.volumePublicly : "No data"} readOnly />
          </div>
          <div className="formGroup">
            <label>High Risk</label>
            <input type="text" value={user.HighRisk ? user.HighRisk : "No data"} readOnly />
          </div>
          <div className="formGroup">
            <label>Point of Sale</label>
            <input type="text" value={user.PointofSale ? user.PointofSale : "No data"} readOnly />
          </div>
          <div className="formGroup">
            <label>Financing</label>
            <input type="text" value={user.Financing ? user.Financing : "No data"} readOnly />
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
