import React, { useState } from "react";
import "../styles/styles.css";

const AdminRejectPopup = ({ show, title, onClose, onConfirm, isSubmitting }) => {
  const [reason, setReason] = useState("");
  const isDisabled = isSubmitting || !reason.trim();
  if (!show) return null;

  const handleConfirm = () => {
    if (!reason.trim()) {
      alert("Reason for rejection is required.");
      return;
    }
    if (typeof onConfirm === "function") {
      onConfirm(reason.trim());
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <button className="popup-close chatWindowCloseBtn" onClick={onClose}> × </button>
        </div>
        <div className="popup-body">
          <h4>{title}</h4>
          <textarea
            placeholder="Write here..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="popup-footer">
            <button className="popup-btn cancelBtn" onClick={onClose}>
              Cancel
            </button>
            <button
              className="popup-btn confirmBtn"
              onClick={handleConfirm}
              disabled={isDisabled}
            >
              {isSubmitting ? "Submitting..." : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRejectPopup;
