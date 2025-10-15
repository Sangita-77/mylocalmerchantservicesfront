import React, { useState } from "react";
import "./../styles/styles.css";

const ConnectConfirmationModal = ({ onConfirm, onCancel, isLoading }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [otherText, setOtherText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedOption === "others" && !otherText.trim()) {
      alert("Please enter a value for 'Others'");
      return;
    }
    // onConfirm({ selectedOption, otherText });
  };

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <div className="modalContentInnerWrap">
          <h2>Reason for Connection</h2>
          {/* <p>Why you are want to connect with this merchant?</p> */}

          <form className="connectForm" onSubmit={handleSubmit}>
            <div className="connectInput">
            {/* <div className="connectInputTitle">Why do you want to connect with this agent?</div> */}
              <select
                className="inputField"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <option value="">Choose an option</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
                <option value="option4">Option 4</option>
                <option value="others">Others</option>
              </select>
            </div>

            {selectedOption === "others" && (
              <div className="connectInput connectOthersInput">
                <div className="connectInputTitle">Enter Your Reason</div>
                <div className="connectInputContainer">
                  <input
                    type="text"
                    className="inputField"
                    value={otherText}
                    onChange={(e) => setOtherText(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="modalButtons">
              <button type="button" onClick={onCancel} className="cancelBtn">
                Cancel
              </button>
              <button type="submit" className="confirmBtn" disabled={isLoading}>
                {isLoading ? "Connecting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConnectConfirmationModal;
