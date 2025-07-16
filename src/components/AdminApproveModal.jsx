import React, { useContext, useEffect, useRef, useState } from "react";
import "./../styles/styles.css";
import { IoMdClose } from "react-icons/io";

const AdminApproveModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="userDetailsOverlay">
      <div className="userDetailsBoxWrapper">
        <div className="messagesWindowCloseBtn" onClick={onClose}>
          <IoMdClose color="white" size={24} />
        </div>

        <div className="userDetailsBox">
          <div className="formGroup">
            <label>Name :</label>
            <input type="text" value={user.merchant_name} readOnly />
          </div>
          <div className="formGroup">
            <label>Email :</label>
            <input type="text" value={user.user_id} readOnly />
          </div>
          <div className="formGroup">
            <label>Industry:</label>
            <input type="text" value={user.industry} readOnly />
          </div>
          <div className="formGroup">
            <label>Phone:</label>
            <input type="text" value={user.phone} readOnly />
          </div>
          <div className="formGroup">
            <label>Typ of services:</label>
            <input type="text" value={user.type_of_service} readOnly />
          </div>
          <div className="formGroup">
            <label>Address:</label>
            <textarea
              value={`${user.street}, ${user.city}, ${user.state}, ${user.zip_code}`}
              readOnly
            ></textarea>
          </div>

            <button className="approveButton">Approve</button>
            <button className="rejectButton">Reject</button>
        </div>
      </div>
    </div>
  );
};

export default AdminApproveModal;
