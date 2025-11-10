import React from "react";
import "../styles/styles.css";

const AdminRejectPopup = ({ show, title, onClose }) => {
  if (!show) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <button className="popup-close chatWindowCloseBtn" onClick={onClose}> × </button>
        </div>
        <div className="popup-body">
          <h4>{title}</h4>
          <textarea placeholder="Write here..." />
          <div className="popup-footer">
            <button className="popup-btn cancelBtn" onClick={onClose}>
              Cancel
            </button>
            <button className="popup-btn confirmBtn">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRejectPopup;
