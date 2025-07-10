import React from 'react';
import "./../styles/styles.css";

const ConfirmModal = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h4>{title || 'Confirm'}</h4>
        <p>{message || 'Are you sure you want to proceed?'}</p>
        <div className="modalActions">
          <button className="cancelBtn" onClick={onCancel}>Cancel</button>
          <button className="confirmBtn" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
