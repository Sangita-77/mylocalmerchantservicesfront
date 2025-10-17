import React, { useContext, useState } from "react";
import { AppContext } from "../utils/context";
import axios from "axios";
import { BASE_URL } from "../utils/apiManager";

const ConnectionRejectModal = ({ connection, onConfirm, onCancel }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [otherText, setOtherText] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useContext(AppContext);

  const handleSubmit = async () => {

    try {
      setIsLoading(true);
      setErrors({});

      let newErrors = {};

      if (!selectedOption) {
        newErrors.option = "Please choose a reason.";
      }
      if (selectedOption === "others" && !otherText.trim()) {
        newErrors.otherText = "Please enter your reason.";
      }
  
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
  
      let reason = null;
      reason =
        selectedOption === "others" ? otherText.trim() : selectedOption;

        console.log()
  
      const response = await axios.post(
        `${BASE_URL}/connectionStateChange`,
        {
          connected_id: connection?.connected_id, 
          state: "declined",
          reason: reason, 
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        if (onConfirm) onConfirm(reason);

        if (onCancel) onCancel();
      } else {
        setErrors({
          api: response.data.message || "Failed to decline connection.",
        });
      }
    } catch (error) {
      console.error("API Error:", error);
      setErrors({
        api:
          error.response?.data?.message ||
          "Something went wrong while submitting.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <div className="modalContentInnerWrap">
          <h2>Reason for Rejection</h2>

          <div className="connectForm">
            {/* --- Dropdown --- */}
            <div className="connectInput">
              <select
                className="inputField"
                value={selectedOption}
                onChange={(e) => {
                  setSelectedOption(e.target.value);
                  setErrors((prev) => ({ ...prev, option: "" }));
                }}
              >
                <option value="">Choose a reason</option>
                <option value="Duplicate request">Duplicate request</option>
                <option value="Irrelevant service">Irrelevant service</option>
                <option value="Incomplete information">
                  Incomplete information
                </option>
                <option value="Not interested">Not interested</option>
                <option value="others">Others</option>
              </select>
              {errors.option && <p className="errorText">{errors.option}</p>}
            </div>

            {/* --- If “Others” selected --- */}
            {selectedOption === "others" && (
              <div className="connectInput connectOthersInput">
                <div className="connectInputTitle">Enter your reason</div>
                <div className="connectInputContainer">
                  <input
                    type="text"
                    className="inputField"
                    value={otherText}
                    onChange={(e) => {
                      setOtherText(e.target.value);
                      setErrors((prev) => ({ ...prev, otherText: "" }));
                    }}
                    placeholder="Type your reason here..."
                  />
                </div>
                {errors.otherText && (
                  <p className="errorText">{errors.otherText}</p>
                )}
              </div>
            )}

            {/* --- API Error --- */}
            {errors.api && <p className="errorText">{errors.api}</p>}

            {/* --- Buttons --- */}
            <div className="modalButtons">
              <button type="button" onClick={onCancel} className="cancelBtn">
                Cancel
              </button>
              <button
                type="button"
                className="confirmBtn"
                disabled={isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionRejectModal;
