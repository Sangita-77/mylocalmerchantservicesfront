import React, { useContext, useState, useEffect } from "react";
import './../../styles/styles.css';

import { FaPowerOff, FaCircleUser } from "react-icons/fa6";
import { CiCalendar, CiCircleInfo, CiSearch } from "react-icons/ci";
import axios from "axios";
import { BASE_URL } from "../../utils/apiManager";
import { AppContext } from "../../utils/context";



const AdminProfile = () => {

    const { token } = useContext(AppContext);
    const handleLogout = async () => {
        try {
            const response = await axios.post(
                `${BASE_URL}/logoutM`,
                {
                    user_id: localStorage.getItem("user_id"),
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.status) {
                // Logout successful, reload the page
                window.location.reload();
            } else {
                console.error("Logout failed:", response.data.message);
                alert("Logout failed: " + response.data.message);
            }
        } catch (error) {
            console.error("Logout error:", error);
            alert("Something went wrong during logout.");
        }
    };


    // password 
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Show New Email field
    const [showNewField, setShowNewField] = useState(false);
    const [newFieldValue, setNewFieldValue] = useState("");
    

    const handleClickHere = () => {
        setShowNewField(true);
    };


    

    return (
        <div className='adminProfileWrapper'>
            <div className='adminDashboardContainer'>

                {/* Header  */}
                <div className="adminDashboardTopbar">
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
                </div>

                <div className="adminProfileContainer">
                    <div className="adminProfileContainerHeader">
                        <div className="adminProfileHeaderCompanyTitle">
                            Profile Info
                        </div>
                    </div>
                </div>


                <div className="profileInnerDetailsContainer">
                    <div className="profileDetailsBoxContainer">
                        <div className="profileDetailsBox">
                            <div className="profileDataTitle">
                                User Id
                            </div>
                            <div className="profileData">
                                sangitaabb@dreamlogodesign.net
                            </div>
                        </div>

                        <div className="profileDetailsBox">

                            <div className="loginInputCol">
                                <label htmlFor="" className="profileDataTitle">Password</label>
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
                                <span
                                    className="forgetPasswordLink"
                                    onClick={handleClickHere}
                                >
                                    Click here
                                </span>
                            </div>

                            {showNewField && (
                                <div className="inputColWrapper">
                                    <div className="inputCol">
                                        <p>Enter your registered email for otp verification</p>
                                        <input
                                            type="text"
                                            className="loginFormInputField"
                                            value={newFieldValue}
                                            onChange={(e) => setNewFieldValue(e.target.value)}
                                            placeholder="Email"
                                        />
                                    </div>
                                    <div>
                                        <button className="loginBtn">
                                            Send Otp
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                {/* <button className="loginBtn">Update</button> */}




            </div>
        </div>
    )
}

export default AdminProfile;