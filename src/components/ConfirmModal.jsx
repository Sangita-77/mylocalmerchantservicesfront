import React, { useContext, useState, useEffect } from "react";
import "./../styles/styles.css";

const ConfirmModal = ({ title, message, onConfirm, onCancel }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirmClick = async () => {
    setLoading(true);
    try {
      await onConfirm(); // assuming onConfirm returns a Promise
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h4>{title || 'Confirm'}</h4>
        <p>{message || 'Are you sure you want to proceed?'}</p>
        <div className="modalActions">
          <button className="cancelBtn" onClick={onCancel} disabled={loading}>Cancel</button>
          <button className="confirmBtn"
            onClick={handleConfirmClick}
            disabled={loading}> {loading ? "Processing..." : "Ok"}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
