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
import ImageUploader from "../../components/ImageUploader";
import ModalPopup from "../../components/ModalPopup";

const MerchantRegistration = () => {
  const [loadingData, setLoadingData] = useState(false);
  const [usersType, setUsersType] = useState([]);
  const [industriesType, setIndustriesType] = useState([]);
  const [servicesType, setServicesType] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [type, setType] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [merchantName, setMerchantName] = useState("");
  const [DWtoTravel, setDWtoTravel] = useState("5");
  const [addressone, setAddressOne] = useState("");
  const [addresstwo, setAddressTwo] = useState("");
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
  const [primaryPP, setPrimaryPP] = useState("");
  const [secondaryPP, setSecondaryPP] = useState("");
  const [other, setOther] = useState("");
  const [clientPublicly, setclientPublicly] = useState("yes");
  const [volumePublicly, setvolumePublicly] = useState("yes");
  const [highRisk, sethighRisk] = useState("yes");
  const [pointOfSale, setpointOfSale] = useState("yes");
  const [financing, setfinancing] = useState("yes");
  const [sponsorBank, setsponsorBank] = useState("");
  const [bulletOne, setbulletOne] = useState("");
  const [bulletTwo, setbulletTwo] = useState("");
  const [bulletThree, setbulletThree] = useState("");
  const [summary, setsummary] = useState("");
  const [websiteTouched, setWebsiteTouched] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [clientCount, setclientCount] = useState("");
  const [salesRep, setSalesRep] = useState("1");
  const [volumeProcessed, setVolumeProcessed] = useState("100K");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [logoFile, setLogoFile] = useState(null);

  const messageBody=`Please Check Your Registered E-mail: ${email}`;



  const [validationError, setValidationError] = useState({
    typeError: "",
    emailError: "",
    alternateEmailError: "",
    conpanyNameError: "",
    merchantNameError: "",
    DWtoTravelError: "",
    firstNameError: "",
    lastNameError: "",
    addressoneError: "",
    cityError: "",
    stateError: "",
    zipCodeError: "",
    countryError: "",
    phoneError: "",
    industryError: "",
    serviceError: "",
    websiteError: "",
    companyNameError: "",
    websiteNameError: "",
    autoFirstNameError: "",
    autoLastNameError: "",
    autoEmailError: "",
    autophoneError: "",
    autoaddressoneError: "",
    bulletOneError: "",
    bulletTwoError: "",
    bulletThreeError: "",
    summaryError: "",
    clientCountError: "",
    salesRepError:"",
    clientPubliclyError : "",
    volumeProcessedError : "",
    volumePubliclyError : "",
    highRiskError : "",
    pointOfSaleError : "",
    financingError : "",
    primaryPPError : "",
    sponsorBankError : "",
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

  const isAgent = type === "agents";
  const isISO = type === "isos";
  const isProcessor = type === "processors";

  const navigate = useNavigate();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const intRegex = /^-?\d+$/;

  const handleChangePhone = (value) => {
    setPhone(value);
    const error = validateUSPhoneNumber(value);
    setValidationError((prev) => ({
      ...prev,
      autophoneError: error,
    }));
  };
  
  

  const handleChangeZipCode = (value) => {
    if (zipCode?.length === 5) return;
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

  // const validateForm = () => {
  //   const errors = {};
  //   const typeLower = type.toLowerCase();
  
  //   // Basic required field validation
  //   if (!type) errors.typeError = "Please select a user type";
  //   if (!email) errors.autoEmailError = "Email is required {format - abc@gmail.com / abc@domainname.com} ";
  //   if (!companyName) errors.companyNameError = "Company name is required";
  //   if (!firstName) errors.autoFirstNameError = "First name is required";
  //   if (!lastName) errors.autoLastNameError = "Last name is required";
  //   if (!merchantName) errors.merchantNameError = "Merchant name is required";
  //   if (!DWtoTravel) errors.DWtoTravelError = "Distance is required";
  //   if (!addressone) errors.autoaddressoneError = "Address is required";
  //   if (!city) errors.cityError = "City is required";
  //   if (!state) errors.stateError = "State is required";
  //   if (!zipCode) errors.zipCodeError = "Zip Code is required";
  //   if (!country) errors.countryError = "Country is required";
  //   if (!phone) errors.autophoneError = "Phone is required {format - 1234567890}";
  //   if (!industry) errors.industryError = "Industry is required";
  //   if (!typeOfServices) errors.serviceError = "Type of Service is required";
  
  //   if (!website) errors.websiteError = "Website is required";
  //   else {
  //     const websiteErr = validateWebsite(website);
  //     if (websiteErr) errors.websiteError = websiteErr;
  //   }
  
  //   if (!alternateEmail) {
  //     errors.alternateEmailError = "Alternate email is required";
  //   } else if (alternateEmail === email) {
  //     errors.alternateEmailError = "Email and Alternate email cannot be the same";
  //   }
  
  //   if (!bulletOne) errors.bulletOneError = "Bullet point 1 is required";
  //   if (!bulletTwo) errors.bulletTwoError = "Bullet point 2 is required";
  //   if (!bulletThree) errors.bulletThreeError = "Bullet point 3 is required";
  //   if (!summary) errors.summaryError = "Summary is required";
  //   if (!salesRep) errors.salesRepError = "Sales representative is required";
  //   if (!clientCount) errors.clientCountError = "Client count is required";
  //   if (!clientPublicly) errors.clientPubliclyError = "Client publicity is required";
  //   if (!volumeProcessed) errors.volumeProcessedError = "Volume processed is required";
  //   if (!volumePublicly) errors.volumePubliclyError = "Volume publicity is required";
  //   if (!highRisk) errors.highRiskError = "High risk selection is required";
  //   if (!pointOfSale) errors.pointOfSaleError = "Point of sale selection is required";
  //   if (!financing) errors.financingError = "Financing selection is required";

  //   // if (typeLower === "ISOs") {
  //   //   if (!sponsorBank) errors.sponsorBankError = "Sponsor bank is required for ISOs";
  //   // } else if (typeLower === "agents") {
  //   //   if (!primaryPP) errors.primaryPPError = "Primary processing platform is required for agents";
  //   // } else if (typeLower === "processors") {
  //   // } else {
  //   //   // if (!sponsorBank) errors.sponsorBankError = "Sponsor bank is required";
  //   //   // if (!primaryPP) errors.primaryPPError = "Primary processing platform is required";
  //   // }
  
  //   setValidationError((prev) => ({
  //     ...prev,
  //     ...errors,
  //   }));
  
  //   return Object.keys(errors).length === 0;
  // };
  

  const validateForm = () => {
    const errors = {};
  
    const requiredFields = [
      { field: type, key: "typeError", message: "Please select a user type" },
      { field: email, key: "autoEmailError", message: "Email is required {format - abc@gmail.com / abc@domainname.com}" },
      { field: companyName, key: "companyNameError", message: "Company name is required" },
      { field: firstName, key: "autoFirstNameError", message: "First name is required" },
      { field: lastName, key: "autoLastNameError", message: "Last name is required" },
      // { field: merchantName, key: "merchantNameError", message: "Merchant name is required" },
      { field: addressone, key: "autoaddressoneError", message: "Address is required" },
      // { field: city, key: "cityError", message: "City is required" },
      // { field: state, key: "stateError", message: "State is required" },
      { field: zipCode, key: "zipCodeError", message: "Zip Code is required" },
      { field: phone, key: "autophoneError", message: "Phone is required {format - 1234567890}" },
      { field: bulletOne, key: "bulletOneError", message: "Bullet point 1 is required" },
      { field: bulletTwo, key: "bulletTwoError", message: "Bullet point 2 is required" },
      { field: bulletThree, key: "bulletThreeError", message: "Bullet point 3 is required" },
      { field: summary, key: "summaryError", message: "Summary is required" },
      { field: salesRep, key: "salesRepError", message: "Sales representative is required" },
      { field: clientCount, key: "clientCountError", message: "Client count is required" },
      { field: clientPublicly, key: "clientPubliclyError", message: "Client publicity is required" },
      { field: volumeProcessed, key: "volumeProcessedError", message: "Volume processed is required" },
      { field: volumePublicly, key: "volumePubliclyError", message: "Volume publicity is required" },
      { field: highRisk, key: "highRiskError", message: "High risk selection is required" },
      { field: pointOfSale, key: "pointOfSaleError", message: "Point of sale selection is required" },
      { field: financing, key: "financingError", message: "Financing selection is required" }
    ];
  
    // Run generic validations
    requiredFields.forEach(({ field, key, message }) => {
      if (!field) errors[key] = message;
    });
  
    // Conditional type-specific validation
    const typeLower = type?.toLowerCase();
    switch (typeLower) {
      case "agents":
        if (!primaryPP) errors.primaryPPError = "Primary Processing Platform is required for agents";
        break;
      case "isos":
        if (!sponsorBank) errors.sponsorBankError = "Sponsor Bank is required for ISOs";
        break;
      case "processors":
        // No additional required fields
        break;
      default:
        errors.typeError = "Invalid user type selected";
    }
  
    setValidationError((prev) => ({
      ...prev,
      ...errors,
    }));
  
    // console.log("Validation Errors:", errors);
    return Object.keys(errors).length === 0;
  };
  
  

  const handleRegisterMerchant = async () => {
    if (!otpVerified) {
      setShowToast(true);
      setSeverity("error");
      setMessageTitle("OTP Required");
      setMessage("Please verify your email with the OTP before registering.");
      return;
    }
  
    if (!validateForm()) {
      setShowToast(true);
      setSeverity("error");
      setMessageTitle("Validation Error");
      const allErrors = Object.values(validationError).join(", ");
      setMessage(allErrors || "Please fill the required field in the form.");
      return;
    }

    // console.log("logoFile.............",logoFile);

    // return false;
  
    try {
      setLoading(true);
      setError("");
  
      const formData = new FormData();
      formData.append("flag", type);
      formData.append("user_id", email);
      formData.append("company_name", companyName);
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("merchant_name", merchantName);
      formData.append("DistanceWilling", DWtoTravel);
      formData.append("address1", addressone);
      formData.append("address2", addresstwo);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("zip_code", zipCode);
      formData.append("country", country);
      formData.append("email", alternateEmail);
      formData.append("phone", phone);
      formData.append("website", website);
      formData.append("SponsorBank", sponsorBank);
      formData.append("PPP", primaryPP);
      formData.append("bulletOne", bulletOne);
      formData.append("bulletTwo", bulletTwo);
      formData.append("bulletThree", bulletThree);
      formData.append("summary", summary);
      formData.append("salesrepresenatives", salesRep);
      formData.append("clientCount", clientCount);
      formData.append("clientPublicly", clientPublicly);
      formData.append("VolumeProcessed", volumeProcessed);
      formData.append("volumePublicly", volumePublicly);
      formData.append("HighRisk", highRisk);
      formData.append("PointofSale", pointOfSale);
      formData.append("Financing", financing);
  
      if (logoFile) {
        formData.append("logo", logoFile);
      }
  
      const response = await axios.post(`${BASE_URL}/registration`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response?.status === 200) {
        const { flag, data, message } = response.data;
        setLoggedInUserId(data?.user_id);
        setMerchantToken(data?.merchant_token);
        setShowToast(true);
        setSeverity("success");
        setMessageTitle("Success");
        setMessage(message);
        setShowSuccessModal(true);
      }
    } catch (error) {
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

    // if (alternateEmail) {
    //   if (
    //     emailRegex.test(alternateEmail) === false ||
    //     intRegex.test(alternateEmail.split("@").reverse()[0].split(".")[0]) ===
    //       true
    //   ) {
    //     setValidationError((prev) => ({
    //       ...prev,
    //       alternateEmailError: "Invalid email!!",
    //     }));
    //   } else {
    //     setValidationError((prev) => ({
    //       ...prev,
    //       alternateEmailError: "",
    //     }));
    //   }
    // } else {
    //   setValidationError((prev) => ({
    //     ...prev,
    //     alternateEmailError: "",
    //   }));
    // }

    // if (email || alternateEmail) {
    //   if (email === alternateEmail) {
    //     setValidationError((prev) => ({
    //       ...prev,
    //       alternateEmailError: "Email and Alternate email cannot be same!!",
    //     }));
    //   } else {
    //     setValidationError((prev) => ({ ...prev, alternateEmailError: "" }));
    //   }
    // } else {
    //   setValidationError((prev) => ({ ...prev, alternateEmailError: "" }));
    // }
    // if (website) setValidationError((prev) => ({ ...prev, websiteError: "" }));
    // if (companyName) setValidationError((prev) => ({ ...prev, conpanyNameError: "" }));
    // if (firstName) setValidationError((prev) => ({ ...prev, firstNameError: "" }));
    // if (lastName) setValidationError((prev) => ({ ...prev, lastNameError: "" }));
    // if (merchantName) setValidationError((prev) => ({ ...prev, merchantNameError: "" }));
    // if (DWtoTravel) setValidationError((prev) => ({ ...prev, DWtoTravelError: "" }));
    // if (phone) setValidationError((prev) => ({ ...prev, phoneError: "" }));
    // if (addressone) setValidationError((prev) => ({ ...prev, addressoneError: "" }));
    // if (city) setValidationError((prev) => ({ ...prev, cityError: "" }));
    // if (state) setValidationError((prev) => ({ ...prev, stateError: "" }));
    // if (country) setValidationError((prev) => ({ ...prev, countryError: "" }));
    // if (zipCode && !rejectRegistration)setValidationError((prev) => ({ ...prev, zipCodeError: "" }));
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
    if (industry)setValidationError((prev) => ({ ...prev, industryError: "" }));
    if (typeOfServices)setValidationError((prev) => ({ ...prev, serviceError: "" }));
  }, [
    type,
    email,
    alternateEmail,
    companyName,
    firstName,
    lastName,
    merchantName,
    DWtoTravel,
    addressone,
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

  useEffect(() => {
    if (isAgent) {
      setsponsorBank("");
    }
    if (isISO || isProcessor) {
      setPrimaryPP("");
      setSecondaryPP("");
      setOther("");
    }
    if (isProcessor) {
      setsponsorBank("");
    }
  }, [type]);

  const validateCompanyName = (name) => {
    if (!name.trim()) {
      return "Company Name is required";
    }
    if (name.length < 3) {
      return "Company Name must be at least 3 characters long";
    }
    return "";
  };

  const validateWebsite = (url) => {
    const pattern = /^(www\.)[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    if (url.trim() !== "" && !pattern.test(url)) {
      return "Enter a valid website (e.g., www.abc.com)";
    }
    return "";
  };

  const validateFirstName = (value) => {
    if (!value.trim()) {
      return "First Name is required";
    }
    if (!/^[A-Za-z]+$/.test(value)){ 
      return "Only letters allowed"; 
    }
    return "";
  };
  
  const validateLastName = (value) => {
    if (!value.trim()) {
      return "Last Name is required";
    }
    if (!/^[A-Za-z]+$/.test(value)) {
      return "Only letters allowed";
    }
    return "";
  };

  const validateEmail = (value) => {
    if (!value.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Email format abc@gmail.com / abc@domainname.com";
    return "";
  };

  const validateUSPhoneNumber = (value) => {
    const pattern = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!value) return "Phone number is required.";
    if (!pattern.test(value)) return "Invalid US phone number format.";
    return "";
  };

  const handleCheckboxChange = (e) => {
    setShowUploader(e.target.checked);
  };

  const validateAddressOne = (value) => {
    if (!value.trim()) return "Address is required.";
    if (value.trim().length < 3) return "Address must be at least 3 characters.";
    return "";
  };

  const handleAddressOneChange = (e) => {
    const value = e.target.value;
    setAddressOne(value);
  
    const error = validateAddressOne(value);
    setValidationError((prev) => ({
      ...prev,
      autoaddressoneError: error,
    }));
  };

  const handleClientCountChange = (e) => {
    const value = e.target.value;
    setclientCount(value);
  
    // Validation logic
    if (!value) {
      setValidationError(prev => ({
        ...prev,
        clientCountError: "This field is required."
      }));
    } else if (parseInt(value) <= 0 || isNaN(value)) {
      setValidationError(prev => ({
        ...prev,
        clientCountError: "Please enter a number greater than 0."
      }));
    } else {
      setValidationError(prev => ({
        ...prev,
        clientCountError: ''
      }));
    }
  };
  
  
  
  

  return (
    <div className="merchantRegistrationWrapper">
      <div className="merchantRegistrationTop">
        <h1 className="merchantTopTitle">Merchant Services Providers Registration</h1>
        <p>Please complete the form below to become a registered Merchant Services Provider in our system.</p>
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
            <p className="registrationFormTitle">General Info</p>

            <div className="inputRowContainer">
              <div className="inputRow">
                <div className="inputContainer">
                  <label htmlFor="companyName" className="label">
                    Company Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    

                    name="companyName"
                    placeholder="Company Name"
                    value={companyName}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCompanyName(value);
                      const error = validateCompanyName(value);
                      setValidationError((prev) => ({ ...prev, companyNameError: error }));
                    }}
                    className="inputField"
                  />
                </div>
                {validationError.companyNameError && (
                    <div className="errorText">
                      {validationError.companyNameError}
                    </div>
                  )}
              </div>
              <div className="inputRow">
                <div className="inputContainer">
                  <label htmlFor="website" className="label">
                    Website
                  </label>
                  <input
                    type="text"
                    name="website"
                    placeholder="Contact Website"
                    value={website}
                    onChange={(e) => {
                      const value = e.target.value;
                      setWebsite(value);
                      const error = validateWebsite(value);
                      setValidationError((prev) => ({ ...prev, websiteNameError: error }));
                    }}
                    className="inputField"
                  />

                </div>
                {validationError.websiteNameError && (
                  <div className="errorText">{validationError.websiteNameError}</div> 
                )}

              </div>
            </div>

            <div className="inputRowContainer">
              <div className="inputRow">
                <div className="inputContainer">
                  <label htmlFor="firstName" className="label">
                    First Name<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFirstName(value);
                      const error = validateFirstName(value);
                      setValidationError((prev) => ({
                        ...prev,
                        autoFirstNameError: error,
                      }));
                    }}
                    className="inputField"
                  />
                  {validationError.autoFirstNameError && (
                    <div className="errorText">{validationError.autoFirstNameError}</div>
                  )}
                </div>
              </div>

              <div className="inputRow">
                <div className="inputContainer">
                  <label htmlFor="lastName" className="label">
                    Last Name<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => {
                      const value = e.target.value;
                      setLastName(value);
                      const error = validateLastName(value);
                      setValidationError((prev) => ({
                        ...prev,
                        autoLastNameError: error,
                      }));
                    }}
                    className="inputField"
                  />
                  {validationError.autoLastNameError && (
                    <div className="errorText">{validationError.autoLastNameError}</div>
                  )}
                </div>
              </div>
            </div>



            <div className="inputRowContainer">

                    <div className="inputRow">
                      <div className="inputContainer" >
                        <label htmlFor="email" className="label">
                          Email <span style={{ color: "red" }}>*</span>
                        </label>
                        <div style={{ display: "flex", gap: "8px" }}>
                        <input
                          type="text"
                          name="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => {
                            const value = e.target.value;
                            setEmail(value);

                            // validate on typing
                            const error = validateEmail(value);
                            setValidationError((prev) => ({
                              ...prev,
                              autoEmailError: error,
                            }));
                          }}
                          className="inputField"
                        />
                    
                    {otpSent ? (
                      <>
                        <div className="otp-feild">
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

                        <button
                          type="button"
                          className={`sendOtpButton disable ${otpVerified ? "d-none" : ""}`}
                          onClick={sendOtpToEmail}
                        >
                          Resend OTP
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="sendOtpButton"
                        onClick={sendOtpToEmail}
                      >
                        Send OTP
                      </button>
                    )}

                          
                        </div>
                        {validationError.autoEmailError && (
                          <div className="errorText">{validationError.autoEmailError}</div>
                        )}

                      </div>
                    </div>

                    <div className="inputRow">
                      <div className="inputContainer">
                        <label htmlFor="phone" className="label">
                          Phone <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="phone"
                          placeholder="Phone"
                          value={phone}
                          onChange={(e) => handleChangePhone(e.target.value)}
                          className="inputField"
                        />
                      </div>
                      {validationError.autophoneError && (
                        <div className="errorText">{validationError.autophoneError}</div>
                      )}
                    </div>
            </div>  

            <div className="inputRowContainer">  
              <div className="inputRow">
                <div className="inputContainer">
                  <input 
                    type="checkbox"
                    id="uploadLogo"
                    name="uploadLogo"
                    value="yes"
                    checked={showUploader}
                    onChange={handleCheckboxChange}
                  />
                  <label className="label" htmlFor="uploadLogo" style={{ paddingLeft: "4px" }}>
                    Do you wish to upload a logo for your agency?
                  </label>
                  {showUploader && <ImageUploader onImageSelect={(file) => setLogoFile(file)} />}
                </div>
              </div>
            </div>

          <div>
         
        </div>

      </div>     


         
          <div  className={`merchantRegistrationFormTop disable ${otpVerified ? "enablewrapper" : ""}`} >
            <p className="registrationFormTitle" style={{ marginTop: 36 }}>
              Address Details
            </p>    
              
              <div className="inputRowContainer">
              <div className="inputRow">
                <div className="inputContainer">
                  <label htmlFor="DWtoTravel" className="label">
                    Distance Willing to Travel <span style={{ color: "red" }}>*</span>
                  </label>
                  <select name="cars" id="cars" className="inputField selectField" value={DWtoTravel} onChange={(e) => setDWtoTravel(e.target.value)}>
                      <option value="5">   &lt; 5 miles  </option>
                      <option value="10">  &lt; 10 miles </option>
                      <option value="25">  &lt; 25 miles </option>
                      <option value="50">  &lt; 50 miles </option>
                      <option value="100"> &lt; 100 miles </option>

                  </select>
                </div>
                {validationError.DWtoTravelError && (
                  <div className="errorText">
                    {validationError?.DWtoTravelError}
                  </div>
                )}
              </div>

              <div className="inputRow">
                <div className="inputContainer">
                  <label htmlFor="addressone" className="label">
                    Address 1: <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="addressone"
                    placeholder=""
                    value={addressone}
                    onChange={handleAddressOneChange}
                    className="inputField"
                  />
                </div>
                {validationError.autoaddressoneError && (
                  <div className="errorText">{validationError.autoaddressoneError}</div>
                )}
              </div>

            </div>

              <div className="inputRowContainer">
                <div className="inputContainer">
                 <label htmlFor="addresstwo" className="label">
                  Address 2
                 </label>
                 <input
                  type="text"
                  name="addresstwo"
                  placeholder=""
                  value={addresstwo}
                  onChange={(e) => setAddressTwo(e.target.value)}
                  className="inputField"
                 />
                </div>
                {validationError.DWtoTravelError && (
                  <div className="errorText">
                    {validationError?.DWtoTravelError}
                  </div>
                )}
              </div>


           <div className="inputRowContainer">

           <div className="inputRow">
                  <div className="inputContainer">
                    <label htmlFor="zipCode" className="label">
                      Zip <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="number"
                      name="zipCode"
                      max="5"
                      placeholder="Zip Code"
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
                    disabled
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
                    disabled
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
                      placeholder="US"
                      value="US"
                      onChange={(e) => setCountry("US")}
                      className="inputField"
                      disabled
                    />
                  </div>
                  {/* {validationError.countryError && (
                    <div className="errorText">
                      {validationError?.countryError}
                    </div>
                  )} */}
                </div>
              </div>



          </div>

          <div className={`merchantRegistrationFormTop disable ${otpVerified ? "enablewrapper" : ""}`}>
            <p className="registrationFormTitle" style={{ marginTop: 36 }}>
              Marketing Details
            </p>
            <p style={{ color: "#4d627b" }}>Please enter up to three bullet points you want potential customers to see about you. These are limited to 50 characters.</p>

            <div className="inputRowContainer">
              <div className="inputContainer">
                  <label htmlFor="merchantName" className="label">
                    Bullet Point 1: <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="bulletOne"
                    placeholder="Bullet 1"
                    value={bulletOne}
                    onChange={(e) => {
                      const value = e.target.value;
                      setbulletOne(value);
                      setValidationError((prev) => ({
                        ...prev,
                        bulletOneError: value.length > 50 ? "Maximum 50 characters allowed." : ""
                      }));
                    }}
                    className="inputField"
                  />

                  {validationError.bulletOneError && (
                    <div className="errorText">{validationError.bulletOneError}</div>
                  )}
              </div>
            </div>
             <div className="inputRowContainer">
              <div className="inputContainer">
                  <label htmlFor="merchantName" className="label">
                    Bullet Point 2: <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="bulletTwo"
                    placeholder="Bullet 2"
                    value={bulletTwo}
                    onChange={(e) => {
                      const value = e.target.value;
                      setbulletTwo(value);
                      setValidationError((prev) => ({
                        ...prev,
                        bulletTwoError: value.length > 50 ? "Maximum 50 characters allowed." : ""
                      }));
                    }}
                    className="inputField"
                  />
                  {validationError.bulletTwoError && (
                    <div className="errorText">{validationError.bulletTwoError}</div>
                  )}

              </div>
            </div>
             <div className="inputRowContainer">
              <div className="inputContainer">
                  <label htmlFor="merchantName" className="label">
                    Bullet Point 3: <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="bulletThree"
                    placeholder="Bullet 3"
                    value={bulletThree}
                    onChange={(e) => {
                      const value = e.target.value;
                      setbulletThree(value);
                      setValidationError((prev) => ({
                        ...prev,
                        bulletThreeError: value.length > 50 ? "Maximum 50 characters allowed." : ""
                      }));
                    }}
                    className="inputField"
                  />
                  {validationError.bulletThreeError && (
                    <div className="errorText">{validationError.bulletThreeError}</div>
                  )}


              </div>
            </div>
            <p style={{ color: "#4d627b" }}>Please enter a 500 character or less summary about your business and services provided.</p>
             <div className="inputRowContainer">
              <div className="inputContainer">
                  <label htmlFor="merchantName" className="label">
                    Summary <span style={{ color: "red" }}>*</span>
                  </label>
                  <textarea
                    name="summary"
                    placeholder="Summary"
                    value={summary}
                    onChange={(e) => {
                      const value = e.target.value;
                      setsummary(value);
                      setValidationError((prev) => ({
                        ...prev,
                        summaryError: value.length > 500 ? "Maximum 500 characters allowed." : ""
                      }));
                    }}
                    className="inputField"
                  />
                  {validationError.summaryError && (
                    <div className="errorText">{validationError.summaryError}</div>
                  )}

              </div>
            </div>
          </div>


          <div className={`merchantRegistrationFormTop disable ${otpVerified ? "enablewrapper" : ""}`}>
             <p className="registrationFormTitle" style={{ marginTop: 36 }}>
              Merchant Processing Features
            </p>

            <div className="inputRowContainer">
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
                        {usersType
                          ?.filter(
                            (user) =>
                              user.type !== "user" &&
                              user.type !== "merchant services providers"
                          )
                          .map((user, index) => (
                            <option value={user.type} key={index} style={{ color: "black" }}>
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

            </div>

            {/* Sponsor Bank: only show if not agent or processor */}
            {!isAgent && !isProcessor && (
              <div className="inputRowContainer">
                <div className="inputRow">
                  <div className="inputContainer">
                    <label htmlFor="sponsorBank" className="label">
                      What is your Sponsor Bank <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="sponsorBank"
                      placeholder=""
                      value={sponsorBank}
                      onChange={(e) => setsponsorBank(e.target.value)}
                      className="inputField"
                    />
                  </div>
                  {validationError.sponsorBankError && (
                    <div className="errorText">
                      {validationError.sponsorBankError}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Primary + Secondary PP: only show if not ISO or processor */}
            {!isISO && !isProcessor && (
              <div className="inputRowContainer">
                <div className="inputRow">
                  <div className="inputContainer">
                    <label htmlFor="primaryPP" className="label">
                      Primary Processing Platform / Partner <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="primaryPP"
                      placeholder="Primary"
                      value={primaryPP}
                      onChange={(e) => setPrimaryPP(e.target.value)}
                      className="inputField"
                    />
                  </div>
                  {validationError.primaryPPError && (
                    <div className="errorText">
                      {validationError.primaryPPError}
                    </div>
                  )}
                </div>
                <div className="inputRow">
                  <div className="inputContainer">
                    <label htmlFor="secondaryPP" className="label">
                      Secondary Processing Platform / Partner
                    </label>
                    <input
                      type="text"
                      name="secondaryPP"
                      placeholder="Secondary"
                      value={secondaryPP}
                      onChange={(e) => setSecondaryPP(e.target.value)}
                      className="inputField"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Other: only show if not ISO or processor */}
            {!isISO && !isProcessor && (
              <div className="inputRowContainer">
                <div className="inputContainer">
                  <label htmlFor="companyDescription" className="label">
                    Other
                  </label>
                  <textarea
                    name="companyDescription"
                    placeholder="Other"
                    value={other}
                    onChange={(e) => setOther(e.target.value)}
                    className="inputField"
                  />
                </div>
              </div>
            )}


            <div className="inputRowContainer">
              <div className="inputRow">
                <div className="inputContainer">
                  <label htmlFor="merchantName" className="label">
                  How many merchant services sales represenatives are in your office ? <span style={{ color: "red" }}>*</span>
                  </label>
                  <select name="cars" id="" className="inputField selectField" value={salesRep} onChange={(e) => setSalesRep(e.target.value)}>
                    <option value="1">   1  </option>
                    <option value="2-5">  2-5 </option>
                    <option value="6-10">  6-10 </option>
                    <option value="11-25">  11-25 </option>
                    <option value="25+"> 25+ </option>

                  </select>
                </div>
              </div>
            </div>
            <div className="inputRowContainer">
              <div className="inputRow">
                <div className="inputContainer">
                  <label htmlFor="merchantName" className="label">
                  How many clients do you service? <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="number"
                    name="merchantName"
                    placeholder="Clients"
                    value={clientCount}
                    onChange={handleClientCountChange}
                    className="inputField"
                  />
                </div>
                {validationError.clientCountError && (
                  <div className="errorText">
                    {validationError.clientCountError}
                  </div>
                )}
              </div>

              <div className="inputRow">
                <div className="inputContainer">
                  <label className="label">
                    Share publicly? <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="radioGroup">
                    <label className="radioLabel">
                      <input
                        type="radio"
                        name="sharePublicly"
                        value="yes"
                        checked={clientPublicly === "yes"}
                        onChange={(e) => setclientPublicly(e.target.value)}
                        className="radioInput"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="radioLabel">
                      <input
                        type="radio"
                        name="sharePublicly"
                        value="no"
                        checked={clientPublicly === "no"}
                        onChange={(e) => setclientPublicly(e.target.value)}
                        className="radioInput"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              </div>

            </div>

            <div className="inputRowContainer">
              <div className="inputRow">
                <div className="inputContainer">
                  <label htmlFor="merchantName" className="label">
                  Monthly Volume Processed by your merchants <span style={{ color: "red" }}>*</span>
                  </label>
                  <select name="cars" id="" className="inputField selectField" value={volumeProcessed} onChange={(e) => setVolumeProcessed(e.target.value)}>
                      <option value="100K">   &lt; $100K  </option>
                      <option value="100K<250K"> 100K &lt; 250K </option>
                      <option value="250K<1MM"> 250k &lt; 1MM </option>
                      <option value="1MM<5MM">  1MM &lt; 5MM </option>
                      <option value="5MM<10MM"> 5MM &lt; 10MM </option>
                      <option value="10MM<25MM"> 10MM &lt; 25MM </option>
                      <option value="25MM+"> 25MM+ </option>

                  </select>
                </div>
              </div>

              <div className="inputRow">
                <div className="inputContainer">
                  <label className="label">
                    Share publicly? <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="radioGroup">
                    <label className="radioLabel">
                      <input
                        type="radio"
                        name="clientPublicly"
                        value="yes"
                        checked={volumePublicly === "yes"}
                        onChange={(e) => setvolumePublicly(e.target.value)}
                        className="radioInput"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="radioLabel">
                      <input
                        type="radio"
                        name="clientPublicly"
                        value="no"
                        checked={volumePublicly === "no"}
                        onChange={(e) => setvolumePublicly(e.target.value)}
                        className="radioInput"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              </div>

            </div>
            <div className="inputRowContainer">
              <div className="inputRow">
                <div className="inputContainer">
                  <label className="label">
                  Do you offer High Risk? <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="radioGroup">
                    <label className="radioLabel">
                      <input
                        type="radio"
                        name="volumePublicly"
                        value="yes"
                        checked={highRisk === "yes"}
                        onChange={(e) => sethighRisk(e.target.value)}
                        className="radioInput"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="radioLabel">
                      <input
                        type="radio"
                        name="volumePublicly"
                        value="no"
                        checked={highRisk === "no"}
                        onChange={(e) => sethighRisk(e.target.value)}
                        className="radioInput"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="inputRowContainer">
              <div className="inputRow">
                <div className="inputContainer">
                  <label className="label">
                  Do you offer Point of Sale? <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="radioGroup">
                    <label className="radioLabel">
                      <input
                        type="radio"
                        name="highRisk"
                        value="yes"
                        checked={pointOfSale === "yes"}
                        onChange={(e) => setpointOfSale(e.target.value)}
                        className="radioInput"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="radioLabel">
                      <input
                        type="radio"
                        name="highRisk"
                        value="no"
                        checked={pointOfSale === "no"}
                        onChange={(e) => setpointOfSale(e.target.value)}
                        className="radioInput"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="inputRowContainer">
              <div className="inputRow">
                <div className="inputContainer">
                  <label className="label">
                  Do you offer Merchant Cash Advance or Financing? <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="radioGroup">
                    <label className="radioLabel">
                      <input
                        type="radio"
                        name="financing"
                        value="yes"
                        checked={financing === "yes"}
                        onChange={(e) => setfinancing(e.target.value)}
                        className="radioInput"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="radioLabel">
                      <input
                        type="radio"
                        name="financing"
                        value="no"
                        checked={financing === "no"}
                        onChange={(e) => setfinancing(e.target.value)}
                        className="radioInput"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
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
      {showSuccessModal && (
        <ModalPopup
          title="Registration Successful!"
          message={messageBody}
          buttonText="Go to Dashboard"
          onClose={() => {
            setShowSuccessModal(false);
            navigate(routes.home_page());
          }}
        />
      )}
    </div>
  );
};

export default MerchantRegistration;
