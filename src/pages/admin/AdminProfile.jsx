import React, { useContext, useState, useEffect } from "react";
import "./../../styles/styles.css";

import axios from "axios";
import { BASE_URL } from "../../utils/apiManager";
import AdminDashBoardTopBar from "../../components/AdminDashBoardTopBar";
import { AppContext } from "../../utils/context";
import { apiErrorHandler } from "../../utils/helper";

const AdminProfile = () => {
  // password
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Show New Email field
  const [showNewField, setShowNewField] = useState(false);
  const [newFieldValue, setNewFieldValue] = useState("");

  const [step, setStep] = useState("email");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");

  const [profileData, setProfileData] = useState({});

  const [loading, setLoading] = useState(false);
  const {
    setPageLoading,
    token,
  } = useContext(AppContext);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  const [validationError, setValidationError] = useState({
    emailError: "",
    otpError: "",
    passwordError: "",
    rePasswordError: "",
  });

  // const handleClickHere = () => {
  //     setShowNewField(true);
  // };
  const handleClickHere = () => {
    setShowNewField(true);
    setStep("email");
  };

  useEffect(() => {
    fetchMerchantProfileData();
    setEmail(profileData.user_id);
  }, []);

  const fetchMerchantProfileData = async () => {
    try {
      setLoading(true);
      setPageLoading(true);
      setError("");

      const body = { };

      const response = await axios.post(
        `${BASE_URL}/getSuperAdminProfile`,
        JSON.stringify(body),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.status && response.data.getAdmin.length > 0) {
          const admin = response.data.getAdmin[0];
          setProfileData(admin);
          setPassword(admin.not_password.toString());
          setEmail(admin.user_id);
        }
      }
    } catch (error) {
      console.log(error);
      const errMsg = apiErrorHandler(error);
      setError(errMsg);
    } finally {
      setLoading(false);
      setPageLoading(false);
    }
  };

  const handleSendOtp = async () => {
    try {
      setLoading(true);
      setPageLoading(true);
      setError("");

      if (newFieldValue.trim() === "") {
      	// alert("Please enter your email.");
        setValidationError((prev) => ({
          ...prev,
          emailError: "Email is required!",
        }));
      	return;
      }

    // console.log("Sending OTP to:", newFieldValue);

      const body = {
        email: newFieldValue,
       };

      const response = await axios.post(
        `${BASE_URL}/verifyMailsendOtpForMerchant`,
        JSON.stringify(body),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setStep("otp");
      }

    } catch (error) {
      console.log(error);
      const errMsg = apiErrorHandler(error);
      setValidationError((prev) => ({
        ...prev,
        emailError: errMsg || "Something went wrong",
      }));
      setError(errMsg);
    } finally {
      setLoading(false);
      setPageLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      setPageLoading(true);
      setError("");

      if (otp.trim() === "") {
      	// alert("Please enter your email.");
        setValidationError((prev) => ({
          ...prev,
          otpError: "Otp is required!",
        }));
      	return;
      }

      console.log("Sending OTP to:", newFieldValue);

      const body = {
        user_id : newFieldValue,
        otp: otp,
       };

      //  console.log("body=============================",body);
      //  return false;

      const response = await axios.post(
        `${BASE_URL}/verifyOtpM`,
        JSON.stringify(body),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      //  console.log("body=============================",response.status);


      if (response.status === 200) {
        setStep("reset");
      }

    } catch (error) {
      const errMsg = apiErrorHandler(error);
      console.log("API Error:", errMsg);
    
      setValidationError((prev) => ({
        ...prev,
        otpError: errMsg || "Something went wrong",
      }));
    
      setError(errMsg); 
    } finally {
      setLoading(false);
      setPageLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {

      setLoading(true);
      setPageLoading(true);
      setError("");

      if (oldPassword.trim() === "") {
      	// alert("Please enter your email.");
        setValidationError((prev) => ({
          ...prev,
          passwordError: "Please enter a new password!",
        }));
      	return;
      }

      if (newPassword.trim() === "") {
      	// alert("Please enter your email.");
        setValidationError((prev) => ({
          ...prev,
          rePasswordError: "Please re enter a new password!",
        }));
      	return;
      }

      if(oldPassword.trim() != newPassword.trim()){
        setValidationError((prev) => ({
          ...prev,
          rePasswordError: "Please enter the same password!",
        }));
      	return;
      }



      const body = {
        user_id : email,
        password : oldPassword,
        repassword : newPassword,
       };

      //  console.log("body=============================",body);
      //  return false;

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

      //  console.log("body=============================",response.status);


      if (response.status === true) {
        setShowNewField(false);
        setStep("email");
        setNewFieldValue("");
        setOtp("");
        setNewPassword("");
        setOldPassword("");
        setValidationError({
          emailError: "",
          otpError: "",
          passwordError: "",
          rePasswordError: "",
        });
      }

    } catch (error) {
      const errMsg = apiErrorHandler(error);
      console.log("API Error:", errMsg);
    
      setValidationError((prev) => ({
        ...prev,
        passwordError: errMsg || "Something went wrong",
      }));

      setValidationError((prev) => ({
        ...prev,
        rePasswordError: errMsg || "Something went wrong",
      }));

      setError(errMsg); 
    } finally {
      setLoading(false);
      setPageLoading(false);
    }
  };

  return (
    <div className="adminProfileWrapper">
      <div className="adminDashboardContainer">
        <AdminDashBoardTopBar heading="Super Admin Profile" />

        <div className="adminProfileContainer">
          <div className="adminProfileContainerHeader">
            <div className="adminProfileHeaderCompanyTitle">Profile Info</div>
          </div>
        </div>

          <div className="profileInnerDetailsContainer">
            <div className="profileDetailsBoxContainer">
              <div className="profileDetailsBox">
                <div className="profileDataTitle">User Id</div>
                <div className="profileData">{profileData.user_id ?? "Loading..."}</div>
              </div>

              <div className="profileDetailsBox">
                <div className="loginInputCol">
                  <label htmlFor="" className="profileDataTitle">
                    Password
                  </label>
                  <input
                    type={!showPassword ? "password" : "text"}
                    className="loginFormInputField"
                    value={password ?? "Loading..."}
                    readOnly
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="xxxxxxxxxx"
                  />
                </div>
                <div className="checkBoxRow">
                  <input
                    type="checkbox"
                    className="loginCheckbox"
                    onClick={() => togglePasswordVisibility()}
                  />
                  <div className="showPassword">Show Password</div>
                </div>
                <div className="forgetPassword">
                  Reset Password?
                  <span className="forgetPasswordLink" onClick={handleClickHere}>
                    Click here
                  </span>
                </div>

                {showNewField && (
                  <div className="inputColWrapper">
                    {step === "email" && (
                      <>
                        <div className="inputCol">
                          <p>Enter your registered email for OTP verification</p>
                          <input
                            type="email"
                            className="loginFormInputField"
                            value={newFieldValue}
                            onChange={(e) => setNewFieldValue(e.target.value)}
                            placeholder="Email"
                          />
                        </div>
                          {validationError?.emailError && (
                            <div className="errorText" style={{ marginTop: -4 }}>
                              {validationError?.emailError}
                            </div>
                          )}
                        <div>
                          <button
                            className="loginBtn"
                            onClick={handleSendOtp}
                          >
                            {loading ? "Sending Otp..." : "Send Otp"}
                          </button>
                        </div>
                      </>
                    )}

                    {step === "otp" && (
                      <>
                        <div className="inputCol">
                          <p>Enter the OTP sent to your email</p>
                          <input
                            type="number"
                            className="loginFormInputField"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter OTP"
                          />
                        </div>
                        {validationError?.otpError && (
                            <div className="errorText" style={{ marginTop: -4 }}>
                              {validationError?.otpError}
                            </div>
                          )}
                        <div>
                          <button
                            className="loginBtn"
                            onClick={handleVerifyOtp}
                          >
                            {loading ? "Verify Otp..." : "Verify Otp"}
                          </button>
                        </div>
                      </>
                    )}

                    {step === "reset" && (
                      <>
                        <div className="inputCol row">
                          <div className="col-lg-6">
                            <p>Enter your password</p>
                            <input
                              type="password"
                              className="loginFormInputField"
                              value={oldPassword}
                              onChange={(e) => setOldPassword(e.target.value)}
                              placeholder="Password"
                            />
                          </div>
                          {validationError?.passwordError && (
                            <div className="errorText" style={{ marginTop: -4 }}>
                              {validationError?.passwordError}
                            </div>
                          )}
                          <div className="col-lg-6">
                            <p>Enter your new password</p>
                            <input
                              type="password"
                              className="loginFormInputField"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="New Password"
                            />
                          </div>
                          {validationError?.rePasswordError && (
                            <div className="errorText" style={{ marginTop: -4 }}>
                              {validationError?.rePasswordError}
                            </div>
                          )}
                        </div>
                        <div>
                          <button
                            className="loginBtn"
                            onClick={handleResetPassword}
                          >
                            {loading ? "Updating Password..." : "Reset Password"}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>


        {/* <button className="loginBtn">Update</button> */}
      </div>
    </div>
  );
};

export default AdminProfile;
