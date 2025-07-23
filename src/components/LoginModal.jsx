import React, { useContext, useEffect, useState } from "react";
import "./../styles/styles.css";
import loginBanner from "./../assets/images/login_banner_bg.jpg";
import blueShade from "./../assets/images/blue_shade.png";
import yellowShade from "./../assets/images/yellow_shade.png";
import axios from "axios";
import { BASE_URL } from "../utils/apiManager";
import { AppContext } from "../utils/context";
import { apiErrorHandler } from "../utils/helper";
import { useNavigate } from "react-router-dom";
import { routes } from "../utils/routes";

const LoginModal = ({ handleClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [personType, setPersonType] = useState("");
  const [validationError, setValidationError] = useState({
    emailError: "",
    passwordError: "",
    flagError: "",
  });
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const [passwordValidationStatus, setPasswordValidationStatus] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });

  const validatePasswordRules = (password) => {
    return {
      length: password.length >= 8 && password.length <= 12,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[^A-Za-z0-9]/.test(password),
    };
  };

  useEffect(() => {
    setPasswordValidationStatus(validatePasswordRules(password));
  }, [password]);
  

  const navigate = useNavigate();

  const { token } = useContext(AppContext);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const intRegex = /^-?\d+$/;

  const { setShowToast, setMessageTitle, setMessage, setSeverity, setIsLoggedIn } =
    useContext(AppContext);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      if (!email) {
        setValidationError((prev) => ({
          ...prev,
          emailError: "Email is required!",
        }));
      }

      if (!password) {
        setValidationError((prev) => ({
          ...prev,
          passwordError: "Password is required!",
        }));
      }

      // if (!personType) {
      //   setValidationError((prev) => ({
      //     ...prev,
      //     flagError: "Please select person type!",
      //   }));
      // }
      // return;
    }

    // console.log("passwordddddddddddddddddddddd",password);

    try {
      setLoading(true);
      setError("");

      const body = {
        user_id: email,
        password: password,
        // flag: "merchant",
      };

      const response = await axios.post(
        `${BASE_URL}/login`,
        JSON.stringify(body),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      // console.log("Login response=====>", response);

      if (response?.status === 200) {
        const message = await response?.data?.message;
        const merchantAccessToken = await response?.data?.token;
        const merchant_id = response?.data?.merchant_id; 

        // console.log("merchant_id,...............",merchant_id)
        const flag = await response?.data?.flag;

        if (email) {
          localStorage.setItem("user_id", email);
          localStorage.setItem("merchant_id", merchant_id);
        }

        // console.log("merchantAccessToken===>", merchantAccessToken);
        localStorage.setItem("is_authenticated", merchantAccessToken);
        localStorage.setItem("person_type", flag);
        // setIsLoggedIn(true);

        // if (flag === "merchant") {
          // navigate(routes?.merchant_dashboard());
        // }
        // navigate(routes.merchant_dashboard());
        setShowToast(true);
        setMessageTitle("Success");
        setMessage(message);
        setSeverity("success");

        // console.log("Navigating toaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa: ", flag);

        if (flag === "merchant services providers") {
          navigate(routes?.merchant_dashboard());
        }else if(flag === "processors"){
          navigate(routes?.merchant_dashboard());
        }else if(flag === "ISOs"){
          navigate(routes?.merchant_dashboard());
        }else if(flag === "agents"){
          navigate(routes?.merchant_dashboard());
        }else if(flag === "user"){
          navigate(routes?.merchant_dashboard());
        }else if(flag === "admin"){
          navigate(routes?.admin_dashboard());
        }else{
          navigate(routes?.merchant_dashboard());
        }
        // navigate(routes.merchant_dashboard());
      }
    } catch (error) {
      console.log(error);
      const errMsg = apiErrorHandler(error);
      setShowToast(true);
      setMessageTitle("Error");
      setMessage(errMsg);
      setSeverity("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";

    // Clean up on unmount
    return () => {
      document.body.style.overflow = "";
    };
  });

  useEffect(() => {
    if (email) {
      if (
        emailRegex.test(email) === false ||
        intRegex.test(email.split("@").reverse()[0].split(".")[0]) === true
      ) {
        setValidationError((prev) => ({
          ...prev,
          emailError: "Invalid email!!",
        }));
      } else {
        setValidationError((prev) => ({
          ...prev,
          emailError: "",
        }));
      }
    } else {
      setValidationError((prev) => ({
        ...prev,
        emailError: "",
      }));
    }

    if (password) {
      setValidationError((prev) => ({ ...prev, passwordError: "" }));
    }

    if (personType) {
      setValidationError((prev) => ({ ...prev, flagError: "" }));
    }
  }, [email, password, personType]); 

  return (
    <>
      <div className="overlay">
        <div className="loginCloseBtnContainer" onClick={handleClose}>
          <div className="loginCloseBtn">&times;</div>
        </div>
        <div className="loginModalWrapper">
          <img src={blueShade} alt="" className="loginBlueShade" />
          <img src={yellowShade} alt="" className="loginYellowShade" />

          <p className="loginModalTitle">Login</p>
          <div className="loginModalContainer">
            <div className="loginForm">
              <div className="loginInputCol">
                <label htmlFor="">Username</label>
                <input
                  type="text"
                  className="loginFormInputField"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {validationError?.emailError && (
                  <div className="errorText" style={{ marginTop: -4 }}>
                    {validationError?.emailError}
                  </div>
                )}
              </div>

              <div className="loginInputCol">
                <label htmlFor="">Password</label>
                <input
                  type={!showPassword ? "password" : "text"}
                  className="loginFormInputField"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setShowPasswordRules(true)}
                  onBlur={() => setTimeout(() => setShowPasswordRules(false), 200)} // delay to allow click on rules
                />
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

              {validationError.passwordError && (
                <div className="errorText" style={{ marginTop: -8 }}>
                  {validationError.passwordError}
                </div>
              )}
              <div className="checkBoxRow">
                <input
                  type="checkbox"
                  className="loginCheckbox"
                  onClick={() => togglePasswordVisibility()}
                />
                <div className="showPassword">Show Password</div>
              </div>

              {/* <div className="loginRadioContainer">
                <div className="radioButtonItem">
                  <input
                    type="radio"
                    className="radioBtn"
                    value={"user"}
                    onChange={(e) => setPersonType(e.target.value)}
                    checked={
                      personType === "merchant" || personType === ""
                        ? false
                        : true
                    }
                  />
                  <div className="radioText">User</div>
                </div>

                <div className="radioButtonItem">
                  <input
                    type="radio"
                    className="radioBtn"
                    value={"merchant"}
                    onChange={(e) => setPersonType(e.target.value)}
                    checked={
                      personType === "user" || personType === "" ? false : true
                    }
                  />
                  <div className="radioText">Merchant</div>
                </div>
              </div> */}

              {validationError.flagError && (
                <div className="errorText" style={{ marginTop: -8 }}>
                  {validationError.flagError}
                </div>
              )}

              <button className="loginBtn" onClick={() => handleLogin()}>
                {loading ? "Loading..." : "Submit"}
              </button>

              <div className="forgetPassword">
                Forgot Password?{" "}
                <span
                  className="forgetPasswordLink"
                  onClick={() => navigate(routes.forget_password())}
                >
                  Click here
                </span>
              </div>
            </div> 

            <div className="loginModalBannerContainer">
              <img src={loginBanner} alt="" className="loginBannerImg" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
