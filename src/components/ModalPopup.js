import React, { useContext, useState, useEffect } from "react";
import "./../styles/styles.css";

const ModalPopup = ({ title, message, buttonText, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modalContentWrapper">
        <div className="modal-content">
          <h2>{title}</h2>
          <p>{message}</p>
          <button className="modal-button" onClick={onClose}>
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalPopup;
