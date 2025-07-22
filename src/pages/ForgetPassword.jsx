import React, { useContext, useEffect, useRef, useState } from "react";
import "./../styles/styles.css";
import axios from "axios";
import { BASE_URL } from "../utils/apiManager";
import { AppContext } from "../utils/context";
import { apiErrorHandler } from "../utils/helper";
import { useNavigate } from "react-router-dom";
import { routes } from "../utils/routes";

const ForgetPassword = ({ initialMin = 1, initialSec = 60 }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showOtpVerificationModal, setOtpVerificationModal] = useState(false);
  const [second, setSecond] = useState(initialSec);
  const [minute, setMinute] = useState(initialMin);
  const [loading, setLoading] = useState(false);
  const [receivedOtp, setReceivedOtp] = useState("");
  const [emailError, setEmailError] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");

  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const navigate = useNavigate();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const intRegex = /^-?\d+$/;

  const { setShowToast, setMessageTitle, setMessage, setSeverity } =
    useContext(AppContext);

  const handleChangeOtp = (index, value) => {
    const prevOtpArr = [...otp];
    prevOtpArr[index] = value;
    setOtp(prevOtpArr);

    inputRefs[index + 1]?.current.focus();
  };

  const handleClickBackspace = (e, index) => {
    e.preventDefault();
    const prevOtp = [...otp];
    prevOtp[index] = "";
    setOtp(prevOtp);
    inputRefs[index - 1]?.current.focus();
  };

  const toggleOtpVerificationModal = () => {
    setMinute(initialMin);
    setSecond(initialSec);
    setOtpVerificationModal(false);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!email) {
        return setEmailError("Email is required!");
      }

      const body = { email: email };

      const token = await localStorage.getItem("accessToken");

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
      console.log("Response===>", response);

      if (response.status === 200) {
        const message = response?.data?.message;
        const otp = response?.data?.otp;
        setLoading(false);
        setReceivedOtp(otp);
        setOtpVerificationModal(true);
        setShowToast(true);
        setMessageTitle("Success");
        setMessage(message);
        setSeverity("success");
      }
    } catch (error) {
      console.log(error);
      const errMsg = apiErrorHandler(error);
      setLoading(false);
      setShowToast(true);
      setMessageTitle("Error");
      setMessage(errMsg);
      setSeverity("error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setOtpLoading(true);
      setOtpError("");

      if (enteredOtp?.length < 4) {
        return setOtpError("Otp must be 4 digit long!");
      }

      const token = await localStorage.getItem("accessToken");
      const body = { user_id: email, otp: parseInt(enteredOtp) };

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

      console.log("Verify otp response=================>", response);

      if (response?.status === 200) {
        const message = response?.data?.message;
        setShowToast(true);
        setMessageTitle("Success");
        setMessage(message);
        setSeverity("success");
        setOtpVerificationModal(false);
        navigate(routes.reset_password(), { state: { email: email } });
      }
    } catch (error) {
      const errMsg = apiErrorHandler(error);
      setShowToast(true);
      setMessageTitle("Error");
      setMessage(errMsg);
      setSeverity("error");
    } finally {
      setOtpLoading(false);
    }
  };

  console.log("loading===>", loading);

  useEffect(() => {
    inputRefs[0]?.current?.focus();
  }, [showOtpVerificationModal]);

  useEffect(() => {
    if (showOtpVerificationModal) {
      document.body.style.overflow = "hidden";
    }
  }, [showOtpVerificationModal]);

  useEffect(() => {
    if (email) {
      if (
        emailRegex.test(email) === false ||
        intRegex.test(email.split("@").reverse()[0].split(".")[0]) === true
      ) {
        setEmailError("Inavlid email!");
      } else {
        setEmailError("");
      }
    } else {
      setEmailError("");
    }
  }, [email]);

  useEffect(() => {
    let concatOtp = "";
    for (let i = 0; i < otp?.length; i++) {
      concatOtp += otp[i];
    }
    setEnteredOtp(concatOtp);
  }, [otp]);

  useEffect(() => {
    if (minute === 0 && second === 0) return;

    if (second < 0) {
      setMinute((prev) => prev - 1);
      setSecond(9);
    }

    const secondsTimer = setInterval(() => {
      setSecond((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(secondsTimer);
  }, [second]);

    const handleResend = () => {
    if (minute === 0 && second === 0) {
      setMinute(1);   // Reset values
      setSecond(30);  // or whatever your countdown is
      // Call your resend OTP logic here
      console.log("OTP resent!");
    }
  };

  console.log("OTP==========>", otp);

  return (
    <div className="forgetPasswordPageWrapper">
        <div className="forgetPasswordWrapper">
        <div className="PasswordWrapper">
      <h1>Forget Password</h1>

      <p className="forgetPasswordText">Enter your registered email for otp verification</p>
      <div>
        <label htmlFor="">Email</label>
        <input
          type="text"
          value={email}
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && <div className="errorText">{emailError}</div>}
      </div>

      <button onClick={() => handleSubmit()}>
        {loading ? "Loading..." : "Send Otp"}
      </button>

      {showOtpVerificationModal && (
        <>
          <div className="overlay" />
          <div className="otpVerificationModalContainer">
          <div className="otpVerificationModalWrap">
            <button
              className="otpModalCloseBtn"
              onClick={() => toggleOtpVerificationModal()}
            >
              &times;
            </button>

            <h2 className="otpModalHeader">Enter OTP</h2>
            <p className="lightText">
              Enter the 4-digit otp sent to test@gmail.com
            </p>
            <p className="lightText">The otp will be valid 5 miutes only.</p>

            <div className="otpInputContainer">
              {otp.map((digit, index) => (
                <input
                  ref={inputRefs[index]}
                  type="text"
                  value={digit}
                  key={index}
                  className="otpInput"
                  onChange={(e) => handleChangeOtp(index, e.target.value)}
                  maxLength={1}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace") {
                      handleClickBackspace(e, index);
                    }
                  }}
                />
              ))}
            </div>

            {emailError && <div className="errorText">{otpError}</div>}

            {/* <div style={{ fontSize: 24, fontWeight: 500 }}>{receivedOtp}</div> */}

             {(minute === 0 && second === 0) ? (
                <div className="grayText" onClick={handleResend} style={{ cursor: "pointer", color: "blue" }}>
                  Resend Otp
                </div>
              ) : (
                <div className="grayText">
                  Resend OTP in {`0${minute}`}:{second < 10 ? `0${second}` : second}
                </div>
              )}
            <button className="verifyBtn" onClick={() => handleVerifyOtp()}>
              {otpLoading ? "Loading..." : "Submit"}
            </button>
          </div>
       </div>
        </>
      )}
    </div>
    </div>
    </div>
  );
};

export default ForgetPassword;
