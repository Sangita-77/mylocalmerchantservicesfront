import React, { useContext, useState, useEffect } from "react";
import "./../styles/styles.css";

const ConfirmModal = ({ title, message, onCancel }) => {
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

  return (
    <div className="modalOverlay">
      <div className={`modalContentWrap ${isOpen ? "open" : ""}`}>
        <div className="modalContent">
          <h4>{title}</h4>
          <div className="modalActions">
            <button className="confirmBtn">Submit</button>
            <button className="cancelBtn">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
