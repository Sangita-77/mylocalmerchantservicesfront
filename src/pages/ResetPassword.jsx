import React, { useContext, useEffect, useState } from "react";
import "./../styles/styles.css";
import { AppContext } from "../utils/context";
import { apiErrorHandler } from "../utils/helper";
import axios from "axios";
import { BASE_URL } from "../utils/apiManager";
import { useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa6";




const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState({
    newPasswordError: "",
    confirmPasswordError: "",
  });
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const [passwordValidationStatus, setPasswordValidationStatus] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });

  const validatePasswordRules = (newPassword) => {
    return {
      length: newPassword.length >= 8 && newPassword.length <= 12,
      lowercase: /[a-z]/.test(newPassword),
      uppercase: /[A-Z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      specialChar: /[^A-Za-z0-9]/.test(newPassword),
    };
  };

  useEffect(() => {
    setPasswordValidationStatus(validatePasswordRules(newPassword));
  }, [newPassword]);
  

  const { setShowToast, setMessageTitle, setMessage, setSeverity } =
    useContext(AppContext);

  const location = useLocation();
  const { email } = location.state || {};

  console.log("Email===>", email);

  const handleSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      if (!newPassword) {
        setPasswordError((prev) => ({
          ...prev,
          newPasswordError: "Password is required!",
        }));
      }
      if (!confirmPassword) {
        setPasswordError((prev) => ({
          ...prev,
          confirmPasswordError: "Confirm password is required!",
        }));
      }
      return;
    }

    if (newPassword !== confirmPassword) {
      return setError("Password is not matching!");
    }
    try {
      setLoading(true);

      const token = await localStorage.getItem("accessToken");
      const body = {
        user_id: email,
        password: parseInt(newPassword),
        repassword: parseInt(confirmPassword),
      };

      const response = await axios.post(
        `${BASE_URL}/resetPassword`,
        JSON.stringify(body),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Reset response===>", response);

      if (response?.status === 200) {
        const message = response?.data?.message;
        setShowToast(true);
        setMessageTitle("Success");
        setMessage(message);
        setSeverity("success");
      }
    } catch (error) {
      const errMsg = apiErrorHandler(error);
      setShowToast(true);
      setMessageTitle("Error");
      setMessage(errMsg);
      setSeverity("error");
    }
  };

  useEffect(() => {
    if (newPassword) {
      setPasswordError((prev) => ({ ...prev, newPasswordError: "" }));
    }
    if (confirmPassword) {
      setPasswordError((prev) => ({ ...prev, confirmPasswordError: "" }));
    }
    if(newPassword === confirmPassword){
      setError("");
    }
  }, [newPassword, confirmPassword]);

  return (
    <div className="forgetPasswordPageWrapper resetPasswordPageContainer">
      <div className="forgetPasswordWrapper">
      <div className="PasswordWrapper">
      <h1 className="forgetPasswordWrapper">Reset Password</h1>
      <div className="resetPasswordInner">
        <div className="inputRow">
          <label htmlFor="" className="inputLabel">
            New Password
          </label>
          <div>
            <input
              type={showPassword ? "text" : "password"}
              className="input"
              value={newPassword}
              placeholder="Enter new password"
              onChange={(e) => setNewPassword(e.target.value)}
              onFocus={() => setShowPasswordRules(true)}
              onBlur={() => setTimeout(() => setShowPasswordRules(false), 200)}
            />
            {passwordError.newPasswordError && (
              <div className="errorText">{passwordError.newPasswordError}</div>
            )}

            {showPasswordRules && (
              <div className="passwordRulesContainer">
                <ul className="passwordRulesList">
                  <li style={{ color: passwordValidationStatus.length ? "green" : "red" }}>
                    Minimum 8 & maximum 12 characters
                  </li>
                  <li style={{ color: passwordValidationStatus.lowercase ? "green" : "red" }}>
                    At least one lowercase letter
                  </li>
                  <li style={{ color: passwordValidationStatus.uppercase ? "green" : "red" }}>
                    At least one uppercase letter
                  </li>
                  <li style={{ color: passwordValidationStatus.number ? "green" : "red" }}>
                    At least one number
                  </li>
                  <li style={{ color: passwordValidationStatus.specialChar ? "green" : "red" }}>
                    At least one special character
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div className="checkBoxRow">
           <div
              type="button"
              className="eyeButton"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (<> <FaEyeSlash /> </>) : ( <>  <FaEye /> </>)}
            </div>
          </div>
        </div>

        <div className="inputRow">
          <label htmlFor="" className="inputLabel">
            Confirm Password
          </label>
          <div>
            <div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="input"
                value={confirmPassword}
                placeholder="Enter confirm password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {passwordError.confirmPasswordError && (
                <div className="errorText">
                  {passwordError.confirmPasswordError}
                </div>
              )}
              {error && <div className="errorText">{error}</div>}
            </div>
          </div>
          <div className="checkBoxRow">
           <div
              type="button"
              className="eyeButton"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (<>  <FaEye /> </>) : ( <><FaEyeSlash /> </>)}
            </div>
          </div>
        </div>

        <button
          className="resetPasswordSubmitBtn"
          onClick={() => handleSubmit()}
        >
          {loading ? "Loading..." : "Submit"}
        </button>
      </div>
      </div>
      </div>
    </div>
  );
};

export default ResetPassword;
