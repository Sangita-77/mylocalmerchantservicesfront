import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./../styles/styles.css";
import { AppContext } from "../utils/context";
import axios from "axios";
import { BASE_URL } from "../utils/apiManager";

const ConnectConfirmationModal = ({ onConfirm, onCancel }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [otherText, setOtherText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { token } = useContext(AppContext);


  const { id } = useParams();

  const connectFun = async (user_id, merchant_id,reason) => {
    try {
      setIsLoading(true);
      // const token = localStorage.getItem("token");

      const response = await axios.post(
        `${BASE_URL}/connectMerchantAgent`,
        { user_id, merchant_id,reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status) {
        console.log("Connection successful:", response.data);
        setErrors({ success: "Connection request sent successfully!" });
      } else {
        setErrors({ api: response.data.message || "Failed to connect." });
      }
    } catch (error) {
      console.error("Error calling connectFun:", error);
      setErrors({ api: "Something went wrong while connecting." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // clear old errors

    const agent_id = parseInt(id, 10);;
    const isAuthenticated = localStorage.getItem("is_authenticated");
    const merchant_id = parseInt(localStorage.getItem("merchant_id"), 10);

    let newErrors = {};

    if (!selectedOption) {
      newErrors.option = "Please choose an option.";
    }

    if (selectedOption === "others" && !otherText.trim()) {
      newErrors.otherText = "Please enter a value for 'Others'.";
    }

    if (!isAuthenticated || !merchant_id || !agent_id) {
      newErrors.auth = "Please log in before connecting.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const reason =
    selectedOption === "others"
      ? `other: ${otherText.trim()}`
      : selectedOption;


    await connectFun(agent_id, merchant_id , reason);
  };
  

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <div className="modalContentInnerWrap">
          <h2>Reason for Connection</h2>
          {/* <p>Why you are want to connect with this merchant?</p> */}

          <form className="connectForm" onSubmit={handleSubmit}>
            <div className="connectInput">
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
              {errors.option && <p className="errorText">{errors.option}</p>}
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
                {errors.otherText && <p className="errorText">{errors.otherText}</p>}
              </div>
            )}

            {errors.api && <p className="errorText">{errors.api}</p>}
            {errors.auth && <p className="errorText">{errors.auth}</p>}
            {errors.success && <p className="successText">{errors.success}</p>}

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
