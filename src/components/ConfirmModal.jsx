import React, { useContext, useState, useEffect } from "react";
import "./../styles/styles.css";

const ConfirmModal = ({ title, message, onConfirm, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 100); 
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      onCancel(); 
    }, 300); 
  };

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
      <div className={`modalContentWrap ${isOpen ? "open" : ""}`}>
        <div className="modalContent">
          <h4>{title || 'Confirm'}</h4>
          <p>{message || 'Are you sure you want to proceed?'}</p>
          <div className="modalActions">
            <button className="cancelBtn" onClick={handleClose} disabled={loading}>Cancel</button>
            <button className="confirmBtn"
              onClick={handleConfirmClick}
              disabled={loading}> {loading ? "..." : "Ok"}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
