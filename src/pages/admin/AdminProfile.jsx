import React, { useContext, useState, useEffect } from "react";
import "./../../styles/styles.css";

import axios from "axios";
import { BASE_URL } from "../../utils/apiManager";
import AdminDashBoardTopBar from "../../components/AdminDashBoardTopBar";

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

  // const handleClickHere = () => {
  //     setShowNewField(true);
  // };
  const handleClickHere = () => {
    setShowNewField(true);
    setStep("email");
  };

  return (
    <div className="adminProfileWrapper">
      <div className="adminDashboardContainer">
        {/* <div className="adminDashboardTopbar">
                    <div className="adminDashboardTopbarLeft">
                        <div className="adminDashboardTopTitle">Super Admin Profile</div>
                    </div>
                    <div className="adminDashboardTopbarRight">
                        <div className="logoutIconContainer" onClick={handleLogout} style={{ cursor: "pointer" }}>
                            <FaPowerOff size={24} color={"#0d64a9"} />
                        </div>
                        <div className="profileIconContainer">
                            <FaCircleUser size={24} color={"#0d64a9"} />
                        </div>
                    </div>
                </div> */}
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
              <div className="profileData">sangitaabb@dreamlogodesign.net</div>
            </div>

            <div className="profileDetailsBox">
              <div className="loginInputCol">
                <label htmlFor="" className="profileDataTitle">
                  Password
                </label>
                <input
                  type={!showPassword ? "password" : "text"}
                  className="loginFormInputField"
                  value={password}
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
                Forgot Password?
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
                      <div>
                        <button
                          className="loginBtn"
                          onClick={() => {
                            if (newFieldValue.trim() === "") {
                              alert("Please enter your email.");
                              return;
                            }
                            setStep("otp");
                          }}
                        >
                          Send OTP
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
                      <div>
                        <button
                          className="loginBtn"
                          onClick={() => {
                            if (otp.trim() === "") {
                              alert("Please enter the OTP.");
                              return;
                            }
                            setStep("reset");
                          }}
                        >
                          Submit OTP
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
                      </div>
                      <div>
                        <button
                          className="loginBtn"
                          onClick={() => {
                            if (newPassword.trim() === "") {
                              alert("Please enter a new password.");
                              return;
                            }
                            alert("Password updated successfully.");
                            setShowNewField(false);
                            setStep("email");
                            setNewFieldValue("");
                            setOtp("");
                            setNewPassword("");
                          }}
                        >
                          Update Password
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
