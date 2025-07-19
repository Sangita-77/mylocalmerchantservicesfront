import React, { useContext, useEffect, useState } from "react";
import "./../../styles/styles.css";
import loginCaptcha from "./../../assets/images/Login-No-Captcha.png";
import { apiErrorHandler, middleware, textUppercase } from "../../utils/helper";
import axios from "axios";
import { BASE_URL } from "../../utils/apiManager";
import { AppContext } from "./../../utils/context";
import { FaCheck } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import LoginModal from "../../components/LoginModal";
import { routes } from "../../utils/routes";
import check from "./../../assets/images/icons8-check.gif";
import cross from "./../../assets/images/icons8-cross.gif";

const MerchantRegistration = () => {
  const [loadingData, setLoadingData] = useState(false);
  const [usersType, setUsersType] = useState([]);
  const [industriesType, setIndustriesType] = useState([]);
  const [servicesType, setServicesType] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [type, setType] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [merchantName, setMerchantName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [fetchingAddress, setFetchingAddress] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [industry, setIndustry] = useState("");
  const [typeOfServices, setTypeOfServices] = useState("");
  const [website, setWebsite] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [alternateEmail, setAlternateEmail] = useState("");
  const [isChecked, setChecked] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenFetched, setTokenFetched] = useState(false);
  const [error, setError] = useState("");
  const [rejectRegistration, setRejectRegistration] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [serverOtp, setServerOtp] = useState(null);
  const [otpMessage, setOtpMessage] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const [validationError, setValidationError] = useState({
    typeError: "",
    emailError: "",
    alternateEmailError: "",
    conpanyNameError: "",
    merchantNameError: "",
    streetError: "",
    cityError: "",
    stateError: "",
    zipCodeError: "",
    countryError: "",
    phoneError: "",
    industryError: "",
    serviceError: "",
    websiteError: "",
  });

  const {
    setShowToast,
    setMessageTitle,
    setMessage,
    setSeverity,
    setMerchantToken,
    setLoggedInUserId,
    token,
    setIsAuthenticated,
  } = useContext(AppContext);

  const navigate = useNavigate();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const intRegex = /^-?\d+$/;

  const handleChangePhone = (value) => {
    if (phone?.length === 10) return;
    setPhone(value);
  };

  const handleChangeZipCode = (value) => {
    if (zipCode?.length === 7) return;
    setZipCode(value);
  };

  const handleClickPhoneBackspace = (e) => {
    e.preventDefault();
    setPhone((prev) => prev.slice(0, -1));
  };

  const handleClickZipBackspace = (e) => {
    e.preventDefault();
    setZipCode((prev) => prev.slice(0, -1));
  };

  const fetchAllTypesData = async () => {
    setLoadingData(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/getAllTypes`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("All type response=========>", response);
      if (response?.status === 200) {
        const usersType = response?.data?.userType;
        const industriesType = response?.data?.industryType;
        const servicesType = response?.data?.servicesType;

        setUsersType(usersType);
        setIndustriesType(industriesType);
        setServicesType(servicesType);
      }
    } catch (error) {
      const errMsg = apiErrorHandler(error);
      setError(errMsg);
    }
  };

  const handleRegisterMerchant = async () => {
    if (rejectRegistration === true) {
      setShowToast(true);
      setSeverity("error");
      setMessageTitle("Invalid zipcode!");
      setMessage("Please check the zipcode!!");
      return;
    }

    if (!otpVerified) {
      console.log("OTP not verified, blocking registration.");
      setShowToast(true);
      setSeverity("error");
      setMessageTitle("OTP Required");
      setMessage("Please verify your email with the OTP before registering.");
      return;
    }
    try {
      setLoading(true);
      setError("");

      if (
        !type ||
        !email ||
        !companyName ||
        !merchantName ||
        !street ||
        !city ||
        !state ||
        !zipCode ||
        !country ||
        !phone ||
        !industry ||
        !typeOfServices
      ) {
        if (!type) {
          setValidationError((prev) => ({
            ...prev,
            typeError: "Please select type!",
          }));
        } else {
          setValidationError((prev) => ({
            ...prev,
            typeError: "",
          }));
        }
        if (!email) {
          setValidationError((prev) => ({
            ...prev,
            emailError: "Email is required!",
          }));
        }
        if (!companyName) {
          setValidationError((prev) => ({
            ...prev,
            conpanyNameError: "Company name is required!",
          }));
        }
        if (!merchantName) {
          setValidationError((prev) => ({
            ...prev,
            merchantNameError: "Merchant name is required!",
          }));
        }
        if (!street) {
          setValidationError((prev) => ({
            ...prev,
            streetError: "Street name is required!",
          }));
        }
        if (!city) {
          setValidationError((prev) => ({
            ...prev,
            cityError: "City name is required!",
          }));
        }
        if (!state) {
          setValidationError((prev) => ({
            ...prev,
            stateError: "State name is required!",
          }));
        }
        if (zipCode) {
          if (zipCode?.length < 5 || zipCode?.length > 9) {
            setValidationError((prev) => ({
              ...prev,
              zipCodeError: "Invalid zip code!",
            }));
          }
        } else {
          setValidationError((prev) => ({
            ...prev,
            zipCodeError: "Zip code is required!",
          }));
        }
        if (!country) {
          setValidationError((prev) => ({
            ...prev,
            countryError: "Country is required!",
          }));
        }
        if (phone) {
          if (phone?.length < 10 || phone?.length > 10) {
            setValidationError((prev) => ({
              ...prev,
              phoneError: "Invalid phone number!",
            }));
          }
        } else {
          setValidationError((prev) => ({
            ...prev,
            phoneError: "Phone number is required!",
          }));
        }
        if (!industry) {
          setValidationError((prev) => ({
            ...prev,
            industryError: "Type of Industry is required!",
          }));
        }
        if (!typeOfServices) {
          setValidationError((prev) => ({
            ...prev,
            serviceError: "Type of service is required!",
          }));
        }
        if (isChecked === false) {
          return setError(
            "Please verify that you are a human (check the checkbox)!"
          );
        }
        return;
      }

      if (email === alternateEmail) {
        return setValidationError((prev) => ({
          ...prev,
          alternateEmailError: "Email and Alternate email cannot be same!!",
        }));
      }

      const body = {
        flag: type,
        user_id: email,
        company_name: companyName,
        merchant_name: merchantName,
        street: street,
        city: city,
        state: state,
        zip_code: zipCode,
        county: country,
        email: alternateEmail,
        phone: phone,
        industry: industry,
        type_of_service: typeOfServices,
        website: website,
        company_description: companyDescription,
      };

      const response = await axios.post(
        `${BASE_URL}/registration`,
        JSON.stringify(body),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Registration response====>", response);

      if (response?.status === 200) {
        const flag = response?.data?.flag;
        const userId = response?.data?.data?.user_id;
        const message = response?.data?.message;
        const merchantToken = response?.data?.data?.merchant_token;

        setLoggedInUserId(userId);
        setMerchantToken(merchantToken);

        setShowToast(true);
        setSeverity("success");
        setMessageTitle("Success");
        setMessage(message);

        if (flag === "merchant") {
          localStorage.setItem("is_authenticated", JSON.stringify(true));
          localStorage.setItem("person_type", JSON.stringify(flag));
          localStorage.setItem("user_id", JSON.stringify(userId));
          navigate(routes.merchant_dashboard());
        }
      }
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.errors?.website) {
        setValidationError((prev) => ({
          ...prev,
          websiteError: error?.response?.data?.errors?.website[0],
        }));
        return;
      }
      // console.log(error);
      const errMsg = apiErrorHandler(error);
      setError(errMsg);
      setShowToast(true);
      setSeverity("error");
      setMessageTitle("Error");
      setMessage(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const searchAddressByZipcode = async () => {
    try {
      setValidationError((prev) => ({ ...prev, zipCodeError: "" }));
      setFetchingAddress(true);

      const body = { zip: zipCode };
      const response = await axios.post(
        `${BASE_URL}/zipSearch`,
        JSON.stringify(body),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("Address Response===>", response);

      if (response?.status === 200) {
        const data = response?.data?.address[0];
        if (data) {
          setValidationError((prev) => ({ ...prev, zipCodeError: "" }));
          setCity(data?.city);
          setState(data?.state_name);
          setCountry(data?.county_name);
          setRejectRegistration(false);
        } else {
          setValidationError((prev) => ({
            ...prev,
            zipCodeError: "Invalid zipcode!!",
          }));
          setCity("");
          setState("");
          setCountry("");
          setRejectRegistration(true);
        }
      }
    } catch (error) {
      // console.log(error);
      const errMsg = apiErrorHandler(error);
      setValidationError((prev) => ({ ...prev, zipCodeError: errMsg }));
      setCity("");
      setState("");
      setCountry("");
      setRejectRegistration(true);
    } finally {
      setFetchingAddress(false);
    }
  };

  const sendOtpToEmail = async () => {
    if (!email) {
      setValidationError((prev) => ({
        ...prev,
        emailError: "Please enter a valid email.",
      }));

      return;
    }
  
    try {
      const response = await axios.post(
        `${BASE_URL}/sendOtpToMail`,
        { email: email },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const data = response.data;
  
      if (data.status) {
        setOtpSent(true);
        setServerOtp(data.otp); // Store OTP if needed
        setValidationError((prev) => ({
          ...prev,
          emailError: "OTP sent to your email.",
        }));
      } else {
        // alert(data.message || "Failed to send OTP.");

        setValidationError((prev) => ({
          ...prev,
          emailError: "Failed to send OTP.",
        }));
      }
    } catch (error) {
      console.error("OTP API Error:", error);
      // alert("Error sending OTP.");

      setValidationError((prev) => ({
        ...prev,
        emailError: "Error sending OTP.",
      }));

    }
  };

  const verifyOtpFromEmail = async () => {
    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }
  
    try {
      const response = await axios.post(
        `${BASE_URL}/verifyOtpFrpmMail`,
        {
          user_id: email,
          otp: parseInt(otp), // Ensure it's a number
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const data = response.data;
  
      if (data.status) {
        alert("OTP verified successfully!");
        // You can proceed with the next step here
      } else {
        alert(data.message || "Invalid OTP.");
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
      alert("Error verifying OTP.");
    }
  };
  const handleOtpChange = async (e) => {
    const value = e.target.value;
    setOtp(value);
  
    if (value.length === 4) {
      try {
        const response = await axios.post(
          `${BASE_URL}/verifyOtpFrpmMail`,
          {
            email: email,
            otp: parseInt(value),
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        const data = response.data;
  
        if (data.status) {
          setOtpVerified(true);
          setOtpMessage(
            <>
            <img src={check} alt="" className="verificationCaptchaImg" style={{width:"20px", height:"20px"}}/> 
            <span style={{padding:"10px"}}>Verified</span>
            </>
          );
        } else {
          setOtpMessage(
             <>
            <img src={cross} alt="" className="verificationCaptchaImg" style={{width:"20px", height:"20px"}}/> 
            <span style={{padding:"10px"}}>Error</span>
            <div>Re-Enter OTP</div>
            </>
          );
        }
      } catch (error) {
        console.error("OTP Verification Error:", error);
        setOtpMessage(
             <>
            <img src={cross} alt="" className="verificationCaptchaImg" style={{width:"20px", height:"20px"}}/> 
            <span style={{padding:"10px"}}>Error</span>
            <div>Re-Enter OTP</div>
            </>
        );
      }
    } else {
      setOtpMessage(""); // Clear message if not 4 digits
    }
  };
  
  
  
  

  useEffect(() => {
    let timeout;

    timeout = setTimeout(() => {
      if (zipCode && zipCode?.length > 4) {
        searchAddressByZipcode();
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [zipCode]);

  useEffect(() => {
    setLoadingData(true);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (type) {
      setValidationError((prev) => ({ ...prev, typeError: "" }));
    }
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
    }

    if (alternateEmail) {
      if (
        emailRegex.test(alternateEmail) === false ||
        intRegex.test(alternateEmail.split("@").reverse()[0].split(".")[0]) ===
          true
      ) {
        setValidationError((prev) => ({
          ...prev,
          alternateEmailError: "Invalid email!!",
        }));
      } else {
        setValidationError((prev) => ({
          ...prev,
          alternateEmailError: "",
        }));
      }
    } else {
      setValidationError((prev) => ({
        ...prev,
        alternateEmailError: "",
      }));
    }

    if (email || alternateEmail) {
      if (email === alternateEmail) {
        setValidationError((prev) => ({
          ...prev,
          alternateEmailError: "Email and Alternate email cannot be same!!",
        }));
      } else {
        setValidationError((prev) => ({ ...prev, alternateEmailError: "" }));
      }
    } else {
      setValidationError((prev) => ({ ...prev, alternateEmailError: "" }));
    }
    if (website) setValidationError((prev) => ({ ...prev, websiteError: "" }));
    if (companyName)
      setValidationError((prev) => ({ ...prev, conpanyNameError: "" }));
    if (merchantName)
      setValidationError((prev) => ({ ...prev, merchantNameError: "" }));
    if (phone) setValidationError((prev) => ({ ...prev, phoneError: "" }));
    if (street) setValidationError((prev) => ({ ...prev, streetError: "" }));
    if (city) setValidationError((prev) => ({ ...prev, cityError: "" }));
    if (state) setValidationError((prev) => ({ ...prev, stateError: "" }));
    if (country) setValidationError((prev) => ({ ...prev, countryError: "" }));
    if (zipCode && !rejectRegistration)
      setValidationError((prev) => ({ ...prev, zipCodeError: "" }));
    if (zipCode) {
      if (zipCode?.length < 5) {
        setValidationError((prev) => ({
          ...prev,
          zipCodeError: "Invalid zip code!!",
        }));
        setCity("");
        setState("");
        setCountry("");
        setRejectRegistration(true);
      } else {
        setValidationError((prev) => ({ ...prev, zipCodeError: "" }));
        setRejectRegistration(false);
      }
    } else {
      setValidationError((prev) => ({ ...prev, zipCodeError: "" }));
      setCity("");
      setState("");
      setCountry("");
      setRejectRegistration(true);
    }
    if (industry)
      setValidationError((prev) => ({ ...prev, industryError: "" }));
    if (typeOfServices)
      setValidationError((prev) => ({ ...prev, serviceError: "" }));
  }, [
    type,
    email,
    alternateEmail,
    companyName,
    merchantName,
    street,
    city,
    state,
    zipCode,
    country,
    phone,
    industry,
    typeOfServices,
    website,
  ]);

  useEffect(() => {
    if (token) {
      fetchAllTypesData();
      setLoadingData(false);
    }
  }, [token]);

  return (
    <div className="merchantRegistrationWrapper">
      <div className="merchantRegistrationTop">
        <p className="merchantTopTitle">Merchant Company Registration </p>
      </div>

      <div className="merchantRegsitrationInnerContainer">
        <div className="merchantFormDesignTop">
          <div className="merchantDesignTextureTop"></div>
          <div className="merchantDesignTextureBottom"></div>
        </div>
        <div className="merchantFormDesignBottom">
          <div className="merchantDesignTextureTop"></div>
          <div className="merchantDesignTextureBottom"></div>
        </div>

        {/* /////////   FORM STARTS    ////////// */}
        <div className="merchantRegistrationForm">
          <div className="merchantRegistrationFormTop">
            <p className="registrationFormTitle">Registration Detail</p>

            <div className="inputRow">
              <div className="inputContainer">
                <label className="label">
                  Select type <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  className="inputField selectField"
                  style={{
                    color: type ? "black" : "rgb(183, 183, 183)",
                  }}
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  {loading ? (
                    <>Loading..</>
                  ) : (
                    <>
                      <option value="">Please select type</option>
                      {usersType?.map((user, index) => (
                        <option
                          value={user.type}
                          key={index}
                          style={{ color: "black" }}
                        >
                          {textUppercase(user?.type)}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
              {validationError.typeError && (
                <div className="errorText">{validationError?.typeError}</div>
              )}
            </div>

            <div className="inputRowContainer">
              <div className="inputRowContainer">
                <div className="inputContainer" style={{ width: "80%" }}>
                  <label htmlFor="email" className="label">
                    Email <span style={{ color: "red" }}>*</span>
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="text"
                      name="email"
                      placeholder=""
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="inputField" 
                    />
               
               {otpSent && (
                <div className="">
                    <input
                      type="text"
                      name="otp"
                      value={otp}
                      onChange={handleOtpChange}
                      className="inputField"
                      maxLength={4}
                      readOnly={otpVerified}
                      placeholder="Enter OTP"
                    />
                    {otpMessage && (
                      <p style={{ marginTop: "6px", color: otpVerified ? "#0F8CDD" : "red" }}>
                        {otpMessage}
                      </p>
                    )}
                  </div>
              )}
                    <button
                      type="button"
                      className="sendOtpButton"
                      onClick={sendOtpToEmail}
                    >
                      Send OTP
                    </button>
                  </div>
                </div>
              </div>
              {/* {otpSent && (
                <div className="inputRow">
                  <div className="inputContainer">
                    <label htmlFor="otp" className="label">
                      Enter OTP <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="otp"
                      placeholder=""
                      value={otp}
                      onChange={handleOtpChange}
                      className="inputField"
                      maxLength={4}
                      readOnly={otpVerified}
                    />
                    {otpMessage && (
                      <p style={{ marginTop: "6px", color: otpVerified ? "green" : "red" }}>
                        {otpMessage}
                      </p>
                    )}
                  </div>
                </div>
              )} */}
            </div>
          </div>

          <div className="merchantRegistrationFormTop">
            <p className="registrationFormTitle" style={{ marginTop: 36 }}>
              Merchant Mailing Address
            </p>

            <div className="inputRowContainer">
              <div className="inputRow">
                <div className="inputContainer">
                  <label htmlFor="merchantName" className="label">
                    Merchant Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="merchantName"
                    placeholder=""
                    value={merchantName}
                    onChange={(e) => setMerchantName(e.target.value)}
                    className="inputField"
                  />
                </div>
                {validationError.merchantNameError && (
                  <div className="errorText">
                    {validationError?.merchantNameError}
                  </div>
                )}
              </div>

              <div className="inputRow">
                <div className="inputContainer">
                  <label htmlFor="street" className="label">
                    Street <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="street"
                    placeholder=""
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="inputField"
                  />
                </div>
                {validationError.streetError && (
                  <div className="errorText">
                    {validationError?.streetError}
                  </div>
                )}
              </div>
            </div>

            <div className="inputRowContainer">
              <div className="inputRow">
                <div className="inputContainer">
                  <label htmlFor="zipCode" className="label">
                    Zip code <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="number"
                    name="zipCode"
                    placeholder=""
                    value={zipCode}
                    onChange={(e) => handleChangeZipCode(e.target.value)}
                    className="inputField"
                    onKeyDown={(e) => {
                      if (e.key === "Backspace") {
                        handleClickZipBackspace(e);
                      }
                    }}
                  />
                </div>
                {fetchingAddress && (
                  <div style={{ fontSize: 12 }}>
                    Please wait, while we fetch your address...
                  </div>
                )}
                {validationError.zipCodeError && (
                  <div className="errorText">
                    {validationError?.zipCodeError}
                  </div>
                )}
              </div>

              <div className="inputRow">
                <div className="inputContainer">
                  <label htmlFor="city" className="label">
                    City <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder=""
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="inputField"
                  />
                </div>
                {validationError.cityError && (
                  <div className="errorText">{validationError?.cityError}</div>
                )}
              </div>
            </div>

            <div className="inputRowContainer">
              <div className="inputRow">
                <div className="inputContainer">
                  <label htmlFor="state" className="label">
                    State <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    placeholder=""
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="inputField"
                  />
                </div>
                {validationError.stateError && (
                  <div className="errorText">{validationError?.stateError}</div>
                )}
              </div>

              <div className="inputRow">
                <div className="inputContainer">
                  <label htmlFor="country" className="label">
                    Country <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="country"
                    placeholder=""
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="inputField"
                  />
                </div>
                {validationError.countryError && (
                  <div className="errorText">
                    {validationError?.countryError}
                  </div>
                )}
              </div>
            </div>

            <div className="inputRowContainer">
              <div className="inputRow">
                <div className="inputContainer">
                  <label htmlFor="phone" className="label">
                    Phone <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="number"
                    name="phone"
                    placeholder=""
                    value={phone}
                    onChange={(e) => handleChangePhone(e.target.value)}
                    className="inputField"
                    onKeyDown={(e) => {
                      if (e.key === "Backspace") {
                        handleClickPhoneBackspace(e);
                      }
                    }}
                  />
                </div>
                {validationError.phoneError && (
                  <div className="errorText">{validationError?.phoneError}</div>
                )}
              </div>

              <div className="inputRow">
                <div className="inputContainer">
                  <label htmlFor="alternateEmail" className="label">
                    Alternate email
                  </label>
                  <input
                    type="text"
                    name="alternateEmail"
                    placeholder=""
                    value={alternateEmail}
                    onChange={(e) => setAlternateEmail(e.target.value)}
                    className="inputField"
                  />
                </div>
                {validationError.alternateEmailError && (
                  <div className="errorText">
                    {validationError?.alternateEmailError}
                  </div>
                )}
              </div>
            </div>

            <div className="inputRowContainer">
              <div className="inputRow">
                <div className="inputContainer">
                  <label className="label" style={{ width: 205 }}>
                    Industry <span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    className="inputField selectField"
                    style={{
                      color: industry ? "black" : "rgb(183, 183, 183)",
                    }}
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  >
                    <option value="" style={{ color: "rgb(183, 183, 183)" }}>
                      Select industry
                    </option>
                    {industriesType?.map((industry, i) => (
                      <option
                        key={i}
                        value={industry?.type}
                        style={{ color: "black" }}
                      >
                        {textUppercase(industry?.type)}
                      </option>
                    ))}
                  </select>
                </div>
                {validationError.industryError && (
                  <div className="errorText">
                    {validationError?.industryError}
                  </div>
                )}
              </div>

              <div className="inputRow">
                <div className="inputContainer">
                  <label className="label" style={{ width: 205 }}>
                    Type of services <span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    className="inputField selectField"
                    style={{
                      color: typeOfServices ? "black" : "rgb(183, 183, 183)",
                    }}
                    value={typeOfServices}
                    onChange={(e) => setTypeOfServices(e.target.value)}
                  >
                    <option value="" style={{ color: "rgb(183, 183, 183)" }}>
                      Select type of services
                    </option>
                    {servicesType?.map((service, i) => (
                      <option
                        key={i}
                        value={service?.type}
                        style={{ color: "black" }}
                      >
                        {textUppercase(service?.type)}
                      </option>
                    ))}
                  </select>
                </div>
                {validationError.serviceError && (
                  <div className="errorText">
                    {validationError?.serviceError}
                  </div>
                )}
              </div>
            </div>



<div className="inputRowContainer">

            <div className="inputRow">

              <div className="inputContainer">
                <label htmlFor="website" className="label">
                  Website
                </label>
                <input
                  type="text"
                  name="website"
                  placeholder=""
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="inputField"
                />
              </div>
              {validationError.websiteError && (
                <div className="errorText">{validationError?.websiteError}</div>
              )}
            </div>


               <div className="inputRow">
                <div className="inputContainer">
                  <label htmlFor="companyName" className="label">
                    Company Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    placeholder=""
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="inputField"
                  />
                </div>
                {validationError.conpanyNameError && (
                  <div className="errorText">
                    {validationError?.conpanyNameError}
                  </div>
                )}
              </div>

</div>




            <div className="inputRowContainer">
              <div className="inputContainer">
                <label htmlFor="companyDescription" className="label">
                  Company Description
                </label>
                <textarea
                  type="text"
                  name="companyDescription"
                  placeholder=""
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                  className="inputField"
                />
              </div>
            </div>

            <div className="verificationHeading">Verification</div>

            <div className="verificationBox">
              <div className="verificationBoxLeft">
                {!isChecked ? (
                  <input
                    type="checkbox"
                    className="registerVerificationCheckbox"
                    onChange={() => setChecked(true)}
                  />
                ) : (
                  <FaCheck
                    color="green"
                    size={30}
                    onClick={() => setChecked(false)}
                  />
                )}
                <div className="grayText">I m not a robot</div>
              </div>

              <div className="verificationBoxRight">
                <img
                  src={loginCaptcha}
                  alt=""
                  className="verificationCaptchaImg"
                />
                <div className="grayText">reCAPTCHA</div>
                <div className="verificationBoxRightBottom">
                  <div className="grayText">Privacy - Terms</div>
                </div>
              </div>
            </div>

            {error && <div className="errorText">{error}</div>}
            <button
              className="registerButton"
              onClick={() => handleRegisterMerchant()}
            >
              {loading ? "Please wait..." : "Register"}
            </button>

            <div className="grayText" style={{ marginTop: 28, fontSize: 16 }}>
              Already registered?{" "}
              <span onClick={() => setShowLogin(true)} className="link">
                Login
              </span>
            </div>

            {showLogin && (
              <LoginModal handleClose={() => setShowLogin(false)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantRegistration;
