import React, { useState } from "react";
import "./../styles/styles.css";

const BlockAgentModal = ({ onConfirm, onCancel, isLoading }) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!reason || reason.trim() === "") {
      setError("Please enter a reason for blocking this agent.");
      return;
    }

    onConfirm(reason.trim());
  };

  const handleCancel = () => {
    setReason("");
    setError("");
    onCancel();
  };

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <div className="modalContentInnerWrap">
          <h2>Block Agent</h2>
          <p>Please enter a reason for blocking this agent:</p>

          <form className="connectForm" onSubmit={handleSubmit}>
            <div className="connectInput">
              <div className="connectInputTitle">Reason</div>
              <div className="connectInputContainer">
                <textarea
                  className="inputField"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter your reason here..."
                  rows="4"
                  style={{ minHeight: "100px", resize: "vertical" }}
                />
              </div>
              {error && <p className="errorText">{error}</p>}
            </div>

            <div className="modalButtons">
              <button
                type="button"
                onClick={handleCancel}
                className="cancelBtn"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="confirmBtn"
                disabled={isLoading}
              >
                {isLoading ? "Blocking..." : "Block"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlockAgentModal;

