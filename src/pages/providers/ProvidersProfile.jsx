import React, { useContext, useEffect, useState } from "react";
import "./../../styles/styles.css";
import { apiErrorHandler } from "../../utils/helper";
import axios from "axios";
import { BASE_URL } from "../../utils/apiManager";
import { AppContext } from "../../utils/context";
import editIcon from "./../../assets/images/product_edit_icon.png";
import InitialLoader from "../../components/InitialLoader";
import eclipse from "./../../assets/images/Ellipse 12.png";
import userGroup from "./../../assets/images/user_group.png";
import circle from "./../../assets/images/circle.png";
import PreLoader from "../../components/PreLoader";
import { FaPowerOff } from "react-icons/fa6";
import { FaCircleUser } from "react-icons/fa6";
import { CiCalendar, CiCircleInfo, CiSearch } from "react-icons/ci";
import DashboardTopHeading from "../../components/DashboardTopHeading";
import DashBoardTopBar from "../../components/DashBoardTopBar";
import ProviderDashboardTopBar from "../../components/ProviderDashboardTopBar";
import ProfileImageUpload from "../../components/ProfileImageUpload";
import { useNavigate } from "react-router-dom";
import { routes } from "../../utils/routes";


const ProvidersProfile = () => {
  const [loading, setLoading] = useState(false);
  const [isUpdating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [logoutError, setLogoutError] = useState("");
  const [merchantProfileData, setMerchantProfileData] = useState(null);
  const [companyName, setCompanyName] = useState();
  const [merchantName, setMerchantName] = useState("");
  const [merchant_id, setmerchant_id] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [alternateEmail, setAlternateEmail] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [industry, setIndustry] = useState("");
  const [typeOfServices, setTypeOfServices] = useState("");
  const [website, setWebsite] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [editAlternateEmail, setEditAlternateEmail] = useState("");
  const [editCompanyName, setEditCompanyName] = useState(false);
  const [editMerchantName, setEditMerchantName] = useState(false);
  const [editStreet, setEditStreet] = useState(false);
  const [editCity, setEditCity] = useState(false);
  const [editState, setEditState] = useState(false);
  const [editZipCode, setEditZipCode] = useState(false);
  const [editCountry, setEditCountry] = useState(false);
  const [editPhone, setEditPhone] = useState(false);
  const [editIndustry, setEditIndustry] = useState(false);
  const [editTypeOfService, setEditTypeOfService] = useState(false);
  const [editWebsite, setEditWebsite] = useState(false);
  const [editCompanyDescription, setEditCompanyDescription] = useState(false);
  const [personType, setPersonType] = useState("");

  const [DWtoTravel, setDWtoTravel] = useState("");
  const [editDWtoTravel, setEditDWtoTravel] = useState(false);

  const [addressone, setaddressone] = useState("");
  const [editaddressone, setEditaddressone] = useState(false);

  const [addresstwo, setaddresstwo] = useState("");
  const [editaddresstwo, setEditaddresstwo] = useState(false);

  const [bulletOne, setbulletOne] = useState("");
  const [editbulletOne, setEditbulletOne] = useState(false); 

  const [bulletTwo, setbulletTwo] = useState("");
  const [editbulletTwo, setEditbulletTwo] = useState(false); 

  const [bulletThree, setbulletThree] = useState("");
  const [editbulletThree, setEditbulletThree] = useState(false); 

  const [summary, setsummary] = useState("");
  const [editsummary, setEditsummary] = useState(false);  

  const [flag, setflag] = useState("");
  const [editflag, setEditflag] = useState(false);    

  const [sponsorBank, setsponsorBank] = useState("");
  const [editsponsorBank, setEditsponsorBank] = useState(false); 
  
  const [primaryPP, setprimaryPP] = useState("");
  const [editprimaryPP, setEditprimaryPP] = useState(false);   

  const [secondaryPP, setsecondaryPP] = useState("");
  const [editsecondaryPP, setEditsecondaryPP] = useState(false);  
  
  const [other, setother] = useState("");
  const [editother, setEditother] = useState(false);  

  const [salesRep, setsalesRep] = useState("");
  const [editsalesRep, setEditsalesRep] = useState(false); 

  const [clientCount, setclientCount] = useState("");
  const [editclientCount, setEditclientCount] = useState(false); 

  const [volumeProcessed, setvolumeProcessed] = useState("");
  const [editvolumeProcessed, setEditvolumeProcessed] = useState(false);  

  const [clientPublicly, setclientPublicly] = useState("");
  const [editclientPublicly, setEditclientPublicly] = useState(false); 

  const [volumePublicly, setvolumePublicly] = useState("");
  const [editvolumePublicly, setEditvolumePublicly] = useState(false); 

  const [highRisk, sethighRisk] = useState("");
  const [edithighRisk, setEdithighRisk] = useState(false);  

  const [pointOfSale, setpointOfSale] = useState("");
  const [editpointOfSale, setEditpointOfSale] = useState(false);  

  const [financing, setfinancing] = useState("");
  const [editfinancing, setEditfinancing] = useState(false);    

  const [first_name, setfirst_name] = useState("");
  const [editfirst_name, setEditfirst_name] = useState(false);  

  const [last_name, setlast_name] = useState("");
  const [editlast_name, setEditlast_name] = useState(false);  


  const {
    setShowToast,
    setMessageTitle,
    setMessage,
    setSeverity,
    merchantToken,
    setMerchantToken,
    setPageLoading,
    token,
    loggedInUserId
  } = useContext(AppContext);

  const navigate = useNavigate();

  const fetchMerchantProfileData = async () => {
    try {
      setLoading(true);
      setPageLoading(true);
      setError("");

      console.log("loggedInUserId from profile====>", loggedInUserId);
      // console.log("userId===>", userId);
      // console.log("Auth token===>", token);

      const userId = localStorage.getItem("user_id");

      // console.log("...........localStorage.getItem",userId);

      const body = { user_id: userId };

      const response = await axios.post(
        `${BASE_URL}/getMerchantProfile`,
        JSON.stringify(body),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Profile Response==========>", response);

      if (response.status === 200) {
        const data = response?.data?.merchant;
        const merchantDataToken = response?.data?.merchant?.merchant_token;
        setMerchantToken(merchantDataToken);
        setMerchantProfileData(data);
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

  const handleUpdateMerchantFormData = async () => {
    try {
      setUpdating(true);
      setError("");

      const body = {
        user_id: email,
        merchant_token: merchantToken,
        company_name: companyName,
        merchant_name: merchantName,
        street: street,
        city: city,
        state: state,
        zip_code: zipCode,
        country: "US",
        email: alternateEmail,
        phone: phone,
        industry: industry,
        type_of_service: typeOfServices,
        website: website,
        company_description: companyDescription,
        merchant_id : merchant_id,
        flag : personType,
        first_name : first_name,
        last_name : last_name,
        SponsorBank: sponsorBank,
        DistanceWilling: DWtoTravel,
        summary:summary,
        clientPublicly : clientPublicly,
        VolumeProcessed : volumeProcessed,
        volumePublicly : volumePublicly,
        HighRisk : highRisk,
        PointofSale : pointOfSale,
        Financing : financing,
        bulletThree : bulletThree,
        bulletTwo : bulletTwo,
        bulletOne : bulletOne,
        PPP : primaryPP,
        clientCount : clientCount,
        salesrepresenatives : salesRep,
      };

      const response = await axios.post(
        `${BASE_URL}/updateMerchantDetails`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log("Update response===>", response);

      if (response.status === 200) {
        const message = response?.data?.message;
        setShowToast(true);
        setMessageTitle("Success");
        setMessage(message);
        setSeverity("success");
      }
    } catch (error) {
      // console.log(error);
      const errMsg = apiErrorHandler(error);
      setError(errMsg);
      setShowToast(true);
      setMessageTitle("Error");
      setMessage(errMsg);
      setSeverity("error");
    } finally {
      handleResetPage();
      setUpdating(false);
      fetchMerchantProfileData();
    }
  };

  const handleResetPage = () => {
    setEditAlternateEmail(false);
    setEditCity(false);
    setEditCompanyDescription(false);
    setEditCompanyName(false);
    setEditCountry(false);
    setEditIndustry(false);
    setEditMerchantName(false);
    setEditPhone(false);
    setEditState(false);
    setEditStreet(false);
    setEditTypeOfService(false);
    setEditWebsite(false);
    setEditZipCode(false);
    setEditlast_name(false);
    setEditfirst_name(false);
    setEditfinancing(false);
    setEditpointOfSale(false);
    setEdithighRisk(false);
    setEditvolumePublicly(false);
    setEditclientPublicly(false);
    setEditvolumeProcessed(false);
    setEditclientCount(false);
    setEditsalesRep(false);
    setEditother(false);
    setEditsecondaryPP(false);
    setEditprimaryPP(false);
    setEditsponsorBank(false);
    setEditflag(false);
    setEditsummary(false);
    setEditbulletThree(false);
    setEditbulletTwo(false);
    setEditbulletOne(false);
    setEditaddresstwo(false);
    setEditaddressone(false);
    setEditDWtoTravel(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchMerchantProfileData();
  }, []);

  useEffect(() => {
    setCompanyName(merchantProfileData?.company_name);
    setEmail(merchantProfileData?.user_id);
    setAlternateEmail(merchantProfileData?.email);
    setCity(merchantProfileData?.city);
    setState(merchantProfileData?.state);
    setCompanyDescription(merchantProfileData?.company_description);
    setCountry(merchantProfileData?.county);
    setIndustry(merchantProfileData?.industry);
    setMerchantName(merchantProfileData?.merchant_name);
    setPhone(merchantProfileData?.phone);
    setStreet(merchantProfileData?.street);
    setTypeOfServices(merchantProfileData?.type_of_service);
    setWebsite(merchantProfileData?.website);
    setZipCode(merchantProfileData?.zip_code);
    setmerchant_id(merchantProfileData?.merchant_id);

    setDWtoTravel(merchantProfileData?.DistanceWilling);
    setaddressone(merchantProfileData?.city);
    setaddresstwo(merchantProfileData?.address2);
    setbulletOne(merchantProfileData?.bulletOne);
    setbulletTwo(merchantProfileData?.bulletTwo);
    setbulletThree(merchantProfileData?.bulletThree);
    setsummary(merchantProfileData?.summary);
    setsponsorBank(merchantProfileData?.SponsorBank);
    setprimaryPP(merchantProfileData?.PPP);
    setsecondaryPP(merchantProfileData?.SPP);
    setother(merchantProfileData?.Other);
    setsalesRep(merchantProfileData?.salesrepresenatives);
    setclientCount(merchantProfileData?.clientCount);
    setvolumeProcessed(merchantProfileData?.VolumeProcessed);
    setclientPublicly(merchantProfileData?.clientPublicly);
    setvolumePublicly(merchantProfileData?.volumePublicly);
    sethighRisk(merchantProfileData?.HighRisk);
    setpointOfSale(merchantProfileData?.PointofSale);
    setfinancing(merchantProfileData?.Financing);
    setfirst_name(merchantProfileData?.first_name);
    setlast_name(merchantProfileData?.last_name);
    setflag(merchantProfileData?.flag);


    // setStreet(merchantProfileData?.street);
  }, [merchantProfileData]);

  useEffect(() => {
    const localPersonType = localStorage.getItem("person_type");
    if (localPersonType) {
      setPersonType(localPersonType);
    }
  }, []);
  const formatPersonType = (type) => {
    if (!type) return "Merchant";
    if (type.toLowerCase() === "isos") return "ISO's";
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };



  return (
    <div className="merchantProfileWrapper providerProfileWrapper">

      <ProviderDashboardTopBar heading={`${formatPersonType(personType)} Dashboard`} />

      {loading ? (
        // 26.06.25
        <div className="merchantDashboardLoaderWrapper">
          <div className="merchantDashboardLoaderContainer">
            <PreLoader />
            <div>Loading...</div>
          </div>
        </div>
        // 26.06.25
      ) : (
        <>
          {/* <img src={eclipse} alt="" className="merchantProfileEclipseImage" /> */}

          {/* <div className="merchantProfileTitle">Merchant Profile</div> */}

          {error ? (
            <div
              className="merchantProfileContainer"
              style={{
                paddingTop: 100,
                paddingBottom: 100,
                textAlign: "center",
              }}
            >
              <div className="errorText">{error}</div>
            </div>
          ) : (
            <div className="merchantProfileContainer">
              {/* <div className="merchantProfileCountContainer">
                <div className="countCardItem">
                  <div className="cardIconContainer">
                    <img src={userGroup} alt="" className="cardIcon" />
                  </div>

                  <div className="cardContentContainer">
                    <div className="cardTitle">User connect</div>
                    <div className="cardValue">Connected</div>
                  </div>

                </div>
              </div> */}

              <div className="merchantProfileForm">
                <div className="merchantProfileContainerHeader">
                  <div className="merchantHeaderCompanyTitle">
                    {merchantProfileData?.company_name ?? 'NA'}
                  </div>
                </div>

                <div className="merchantProfileInnerDetailsContainer">
                  <div className="profileInnerDetailsHolder">
                    <div className="merchantProfileDetailsHeading" style={{color:"#0052a4"}}>
                      General Info
                    </div>
                    <div className="merchantProfileDetailsBox">
                      <div className="merchantProfileDetailsLeft">
                        <div className="merchantProfileDataTitle">User Id</div>
                        <div className="merchantProfileData">
                          {merchantProfileData?.user_id ?? 'NA'}
                        </div>
                      </div>
                       <div className="merchantProfileDetailsRight">
                        <ProfileImageUpload data={merchantProfileData}/>
                        <div className="merchantProfileData" preview= "">
                        </div>
                      </div>
                    </div>

                    <div className="merchantProfileDetailsBoxContainer">
                      {!editCompanyName ? (
                        <div className="merchantProfileDetailsBox">
                          <div className="merchantProfileDetailsBoxLeft">
                            <div className="merchantProfileDataTitle grayLabel">
                              Company Name
                            </div>
                            <div className="merchantProfileData">
                              {merchantProfileData?.company_name ?? 'NA'}
                            </div>
                          </div>

                          <div
                            className="editIconContainer"
                            onClick={() => setEditCompanyName(true)}
                          >
                            <img src={editIcon} alt="" className="editIcon" />
                          </div>
                        </div>
                      ) : (
                        <div className="merchantProfileInputBox">
                          <div className="merchantInputContainer">
                            <label
                              htmlFor="companyName"
                              className="merchantInputLabel"
                            >
                              Company Name{" "}
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type="text"
                              name="companyName"
                              placeholder="Enter company name"
                              value={companyName}
                              onChange={(e) => setCompanyName(e.target.value)}
                              className="merchantProfileInputField"
                              required
                            />
                          </div>

                          <div
                            className="merchantInputCloseBtn"
                            onClick={() => setEditCompanyName(false)}
                          >
                            &times;
                          </div>
                        </div>
                      )}


                      {!editPhone ? (
                        <div className="merchantProfileDetailsBox">
                          <div className="merchantProfileDetailsBoxLeft">
                            <div className="merchantProfileDataTitle grayLabel">
                              Phone
                            </div>
                            <div className="merchantProfileData">
                              {merchantProfileData?.phone ?? 'NA'}
                            </div>
                          </div>

                          <div
                            className="editIconContainer"
                            onClick={() => setEditPhone(true)}
                          >
                            <img src={editIcon} alt="" className="editIcon" />
                          </div>
                        </div>
                      ) : (
                        <div className="merchantProfileInputBox">
                          <div className="merchantInputContainer">
                            <label
                              htmlFor="phone"
                              className="merchantInputLabel"
                            >
                              Phone <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type="text"
                              name="phone"
                              placeholder="Enter phone"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="merchantProfileInputField"
                              required
                            />
                          </div>

                          <div
                            className="merchantInputCloseBtn"
                            onClick={() => setEditPhone(false)}
                          >
                            &times;
                          </div>
                        </div>
                      )}

                    </div>

                    <div className="merchantProfileDetailsBoxContainer">
                      {!editfirst_name ? (
                        <div className="merchantProfileDetailsBox">
                          <div className="merchantProfileDetailsBoxLeft">
                            <div className="merchantProfileDataTitle grayLabel">
                              First Name
                            </div>
                            <div className="merchantProfileData">
                              {merchantProfileData?.first_name ?? 'NA'}
                            </div>
                          </div>

                          <div
                            className="editIconContainer"
                            onClick={() => setEditfirst_name(true)}
                          >
                            <img src={editIcon} alt="" className="editIcon" />
                          </div>
                        </div>
                      ) : (
                        <div className="merchantProfileInputBox">
                          <div className="merchantInputContainer">
                            <label
                              htmlFor="merchantName"
                              className="merchantInputLabel"
                            >
                              First Name{" "}
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type="text"
                              name="merchantName"
                              placeholder="Enter first name"
                              value={first_name}
                              onChange={(e) => setfirst_name(e.target.value)}
                              className="merchantProfileInputField"
                              required
                            />
                          </div>

                          <div
                            className="merchantInputCloseBtn"
                            onClick={() => setEditfirst_name(false)}
                          >
                            &times;
                          </div>
                        </div>
                      )}

                      {!editlast_name ? (
                        <div className="merchantProfileDetailsBox">
                          <div className="merchantProfileDetailsBoxLeft">
                            <div className="merchantProfileDataTitle grayLabel">
                              Last Name
                            </div>
                            <div className="merchantProfileData">
                              {merchantProfileData?.last_name ?? 'NA'}
                            </div>
                          </div>

                          <div
                            className="editIconContainer"
                            onClick={() => setEditlast_name(true)}
                          >
                            <img src={editIcon} alt="" className="editIcon" />
                          </div>
                        </div>
                      ) : (
                        <div className="merchantProfileInputBox">
                          <div className="merchantInputContainer">
                            <label
                              htmlFor="merchantName"
                              className="merchantInputLabel"
                            >
                              Last Name{" "}
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type="text"
                              name="merchantName"
                              placeholder="Enter merchant name"
                              value={last_name}
                              onChange={(e) => setlast_name(e.target.value)}
                              className="merchantProfileInputField"
                              required
                            />
                          </div>

                          <div
                            className="merchantInputCloseBtn"
                            onClick={() => setEditlast_name(false)}
                          >
                            &times;
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="merchantProfileDetailsBoxContainer">

                      {!editWebsite ? (
                        <div className="merchantProfileDetailsBox">
                          <div className="merchantProfileDetailsBoxLeft">
                            <div className="merchantProfileDataTitle grayLabel">
                              Website
                            </div>
                            <div className="merchantProfileData">
                              {merchantProfileData?.website ?? 'NA'}
                            </div>
                          </div>

                          <div
                            className="editIconContainer"
                            onClick={() => setEditWebsite(true)}
                          >
                            <img src={editIcon} alt="" className="editIcon" />
                          </div>
                        </div>
                      ) : (
                        <div className="merchantProfileInputBox">
                          <div className="merchantInputContainer">
                            <label
                              htmlFor="website"
                              className="merchantInputLabel"
                            >
                              Website <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type="text"
                              name="website"
                              placeholder="Enter website address"
                              value={website}
                              onChange={(e) => setWebsite(e.target.value)}
                              className="merchantProfileInputField"
                            />
                          </div>

                          <div
                            className="merchantInputCloseBtn"
                            onClick={() => setEditWebsite(false)}
                          >
                            &times;
                          </div>
                        </div>
                      )}

                      {!editCompanyDescription ? (
                        <div className="merchantProfileDetailsBox">
                          <div className="merchantProfileDetailsBoxLeft">
                            <div className="merchantProfileDataTitle grayLabel">
                              Company Description
                            </div>
                            <div className="merchantProfileData">
                              {merchantProfileData?.company_description ?? 'NA'}
                            </div>
                          </div>

                          <div
                            className="editIconContainer"
                            onClick={() => setEditCompanyDescription(true)}
                          >
                            <img src={editIcon} alt="" className="editIcon" />
                          </div>
                        </div>
                      ) : (
                        <div className="merchantProfileInputBox">
                          <div className="merchantInputContainer">
                            <label
                              htmlFor="companyDescription"
                              className="merchantInputLabel"
                            >
                              Company description{" "}
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <textarea
                              name="companyDescription"
                              placeholder="Enter company description"
                              value={companyDescription}
                              onChange={(e) =>
                                setCompanyDescription(e.target.value)
                              }
                              className="merchantProfileInputField"
                            ></textarea>
                          </div>

                          <div
                            className="merchantInputCloseBtn"
                            onClick={() => setEditCompanyDescription(false)}
                          >
                            &times;
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="merchantProfileDetailsHeading" style={{color:"#0052a4"}}>
                      Company Mailing Address
                    </div>

                    <div className="merchantProfileDetailsBoxContainer">
                      {!editDWtoTravel ? (
                        <div className="merchantProfileDetailsBox">
                          <div className="merchantProfileDetailsBoxLeft">
                            <div className="merchantProfileDataTitle grayLabel">
                              Distance Willing to Travel
                            </div>
                            <div className="merchantProfileData">
                              {DWtoTravel}
                            </div>
                          </div>

                          <div
                            className="editIconContainer"
                            onClick={() => setEditDWtoTravel(true)}
                          >
                            <img src={editIcon} alt="" className="editIcon" />
                          </div>
                        </div>
                      ) : (
                        <div className="merchantProfileInputBox">
                          <div className="merchantInputContainer">
                            <label
                              htmlFor="street"
                              className="merchantInputLabel"
                            >
                              Distance Willing to Travel <span style={{ color: "red" }}>*</span>
                            </label>
                            {/* <input
                              type="text"
                              name="street"
                              placeholder="Enter street name"
                              value={DWtoTravel}
                              onChange={(e) => setDWtoTravel(e.target.value)}
                              className="merchantProfileInputField"
                            /> */}

                            <select
                              className="inputField selectField"
                              value={DWtoTravel}
                              onChange={(e) => setDWtoTravel(e.target.value)}
                            >
                              <option value="5">   &lt; 5 miles  </option>
                              <option value="10">  &lt; 10 miles </option>
                              <option value="25">  &lt; 25 miles </option>
                              <option value="50">  &lt; 50 miles </option>
                              <option value="100"> &lt; 100 miles </option>
                            </select>
                          </div>

                          <div
                            className="merchantInputCloseBtn"
                            onClick={() => setEditDWtoTravel(false)}
                          >
                            &times;
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="merchantProfileDetailsBoxContainer">
                      {!editStreet ? (
                        <div className="merchantProfileDetailsBox">
                          <div className="merchantProfileDetailsBoxLeft">
                            <div className="merchantProfileDataTitle grayLabel">
                              Street
                            </div>
                            <div className="merchantProfileData">
                              {merchantProfileData?.street ?? 'NA'}
                            </div>
                          </div>

                          <div
                            className="editIconContainer"
                            onClick={() => setEditStreet(true)}
                          >
                            <img src={editIcon} alt="" className="editIcon" />
                          </div>
                        </div>
                      ) : (
                        <div className="merchantProfileInputBox">
                          <div className="merchantInputContainer">
                            <label
                              htmlFor="street"
                              className="merchantInputLabel"
                            >
                              Street <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type="text"
                              name="street"
                              placeholder="Enter street name"
                              value={street}
                              onChange={(e) => setStreet(e.target.value)}
                              className="merchantProfileInputField"
                              required
                            />
                          </div>

                          <div
                            className="merchantInputCloseBtn"
                            onClick={() => setEditStreet(false)}
                          >
                            &times;
                          </div>
                        </div>
                      )}

                      {!editCity ? (
                        <div className="merchantProfileDetailsBox">
                          <div className="merchantProfileDetailsBoxLeft">
                            <div className="merchantProfileDataTitle grayLabel">
                              City
                            </div>
                            <div className="merchantProfileData">
                              {merchantProfileData?.city ?? 'NA'}
                            </div>
                          </div>

                          <div
                            className="editIconContainer"
                            onClick={() => setEditCity(true)}
                          >
                            <img src={editIcon} alt="" className="editIcon" />
                          </div>
                        </div>
                      ) : (
                        <div className="merchantProfileInputBox">
                          <div className="merchantInputContainer">
                            <label
                              htmlFor="email"
                              className="merchantInputLabel"
                            >
                              City <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type="text"
                              name="city"
                              placeholder="Enter city name"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              className="merchantProfileInputField"
                              required
                            />
                          </div>

                          <div
                            className="merchantInputCloseBtn"
                            onClick={() => setEditCity(false)}
                          >
                            &times;
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="merchantProfileDetailsBoxContainer">
                      {!editState ? (
                        <div className="merchantProfileDetailsBox">
                          <div className="merchantProfileDetailsBoxLeft">
                            <div className="merchantProfileDataTitle grayLabel">
                              State
                            </div>
                            <div className="merchantProfileData">
                              {merchantProfileData?.state ?? 'NA'}
                            </div>
                          </div>

                          <div
                            className="editIconContainer"
                            onClick={() => setEditState(true)}
                          >
                            <img src={editIcon} alt="" className="editIcon" />
                          </div>
                        </div>
                      ) : (
                        <div className="merchantProfileInputBox">
                          <div className="merchantInputContainer">
                            <label
                              htmlFor="state"
                              className="merchantInputLabel"
                            >
                              State <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type="text"
                              name="state"
                              placeholder="Enter state name"
                              value={state}
                              onChange={(e) => setState(e.target.value)}
                              className="merchantProfileInputField"
                              required
                            />
                          </div>

                          <div
                            className="merchantInputCloseBtn"
                            onClick={() => setEditState(false)}
                          >
                            &times;
                          </div>
                        </div>
                      )}

                      {!editZipCode ? (
                        <div className="merchantProfileDetailsBox">
                          <div className="merchantProfileDetailsBoxLeft">
                            <div className="merchantProfileDataTitle grayLabel">
                              Zip Code
                            </div>
                            <div className="merchantProfileData">
                              {merchantProfileData?.zip_code ?? 'NA'}
                            </div>
                          </div>

                          <div
                            className="editIconContainer"
                            onClick={() => setEditZipCode(true)}
                          >
                            <img src={editIcon} alt="" className="editIcon" />
                          </div>
                        </div>
                      ) : (
                        <div className="merchantProfileInputBox">
                          <div className="merchantInputContainer">
                            <label
                              htmlFor="zipCode"
                              className="merchantInputLabel"
                            >
                              Zip code <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type="text"
                              name="zipCode"
                              placeholder="Enter zip code"
                              value={zipCode}
                              onChange={(e) => setZipCode(e.target.value)}
                              className="merchantProfileInputField"
                              required
                            />
                          </div>

                          <div
                            className="merchantInputCloseBtn"
                            onClick={() => setEditZipCode(false)}
                          >
                            &times;
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="merchantProfileDetailsBoxContainer">
                      {!editCountry ? (
                        <div className="merchantProfileDetailsBox">
                          <div className="merchantProfileDetailsBoxLeft">
                            <div className="merchantProfileDataTitle grayLabel">
                              Country Name
                            </div>
                            <div className="merchantProfileData">
                              {merchantProfileData?.country ?? 'NA'}
                            </div>
                          </div>

                          <div
                            className="editIconContainer"
                            onClick={() => setEditCountry(true)}
                          >
                            <img src={editIcon} alt="" className="editIcon" />
                          </div>
                        </div>
                      ) : (
                        <div className="merchantProfileInputBox">
                          <div className="merchantInputContainer">
                            <label
                              htmlFor="country"
                              className="merchantInputLabel"
                            >
                              Country Name{" "}
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type="text"
                              name="country"
                              placeholder="Enter country name"
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                              className="merchantProfileInputField"
                              required
                            />
                          </div>

                          <div
                            className="merchantInputCloseBtn"
                            onClick={() => setEditCountry(false)}
                          >
                            &times;
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="merchantProfileDetailsHeading" style={{color:"#0052a4"}}>
                      Marketing Details
                    </div>

                    <div className="merchantProfileDetailsBoxContainer">
                      {!editbulletOne ? (
                        <div className="merchantProfileDetailsBox">
                          <div className="merchantProfileDetailsBoxLeft">
                            <div className="merchantProfileDataTitle grayLabel">
                              Bullet Point 1
                            </div>
                            <div className="merchantProfileData">
                              {merchantProfileData?.bulletOne ?? 'NA'}
                            </div>
                          </div>

                          <div
                            className="editIconContainer"
                            onClick={() => setEditbulletOne(true)}
                          >
                            <img src={editIcon} alt="" className="editIcon" />
                          </div>
                        </div>
                      ) : (
                        <div className="merchantProfileInputBox">
                          <div className="merchantInputContainer">
                            <label
                              htmlFor="merchantName"
                              className="merchantInputLabel"
                            >
                              Bullet Point 1{" "}
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type="text"
                              name="merchantName"
                              placeholder="Enter Bullet Point 1"
                              value={bulletOne}
                              onChange={(e) => setbulletOne(e.target.value)}
                              className="merchantProfileInputField"
                              required
                            />
                          </div>

                          <div
                            className="merchantInputCloseBtn"
                            onClick={() => setEditbulletOne(false)}
                          >
                            &times;
                          </div>
                        </div>
                      )}

                      {!editbulletTwo ? (
                        <div className="merchantProfileDetailsBox">
                          <div className="merchantProfileDetailsBoxLeft">
                            <div className="merchantProfileDataTitle grayLabel">
                              Bullet Point 2
                            </div>
                            <div className="merchantProfileData">
                              {merchantProfileData?.bulletTwo ?? 'NA'}
                            </div>
                          </div>

                          <div
                            className="editIconContainer"
                            onClick={() => setEditbulletTwo(true)}
                          >
                            <img src={editIcon} alt="" className="editIcon" />
                          </div>
                        </div>
                      ) : (
                        <div className="merchantProfileInputBox">
                          <div className="merchantInputContainer">
                            <label
                              htmlFor="merchantName"
                              className="merchantInputLabel"
                            >
                              Bullet Point 2{" "}
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type="text"
                              name="merchantName"
                              placeholder="Enter Bullet Point 2"
                              value={bulletTwo}
                              onChange={(e) => setbulletTwo(e.target.value)}
                              className="merchantProfileInputField"
                              required
                            />
                          </div>

                          <div
                            className="merchantInputCloseBtn"
                            onClick={() => setEditbulletTwo(false)}
                          >
                            &times;
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="merchantProfileDetailsBoxContainer">
                      {!editbulletThree ? (
                        <div className="merchantProfileDetailsBox">
                          <div className="merchantProfileDetailsBoxLeft">
                            <div className="merchantProfileDataTitle grayLabel">
                              Bullet Point 3
                            </div>
                            <div className="merchantProfileData">
                              {merchantProfileData?.bulletThree ?? 'NA'}
                            </div>
                          </div>

                          <div
                            className="editIconContainer"
                            onClick={() => setEditbulletThree(true)}
                          >
                            <img src={editIcon} alt="" className="editIcon" />
                          </div>
                        </div>
                      ) : (
                        <div className="merchantProfileInputBox">
                          <div className="merchantInputContainer">
                            <label
                              htmlFor="merchantName"
                              className="merchantInputLabel"
                            >
                              Bullet Point 3{" "}
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type="text"
                              name="merchantName"
                              placeholder="Enter Bullet Point 3"
                              value={bulletThree}
                              onChange={(e) => setbulletThree(e.target.value)}
                              className="merchantProfileInputField"
                              required
                            />
                          </div>

                          <div
                            className="merchantInputCloseBtn"
                            onClick={() => setEditbulletThree(false)}
                          >
                            &times;
                          </div>
                        </div>
                      )}

                      {!editsummary ? (
                        <div className="merchantProfileDetailsBox">
                          <div className="merchantProfileDetailsBoxLeft">
                            <div className="merchantProfileDataTitle grayLabel">
                              Summary
                            </div>
                            <div className="merchantProfileData">
                              {merchantProfileData?.summary ?? 'NA'}
                            </div>
                          </div>

                          <div
                            className="editIconContainer"
                            onClick={() => setEditsummary(true)}
                          >
                            <img src={editIcon} alt="" className="editIcon" />
                          </div>
                        </div>
                      ) : (
                        <div className="merchantProfileInputBox">
                          <div className="merchantInputContainer">
                            <label
                              htmlFor="merchantName"
                              className="merchantInputLabel"
                            >
                              Bullet Point 2{" "}
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <textarea
                              type="text"
                              name="merchantName"
                              placeholder="Enter Summary"
                              value={summary}
                              onChange={(e) => setsummary(e.target.value)}
                              className="merchantProfileInputField"
                              required
                            />
                          </div>

                          <div
                            className="merchantInputCloseBtn"
                            onClick={() => setEditsummary(false)}
                          >
                            &times;
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="merchantProfileDetailsHeading" style={{color:"#0052a4"}}>
                      Merchant Processing Features
                    </div>

                    <div className="merchantProfileDetailsBoxContainer">
                        <div className="merchantProfileDetailsBox">
                          <div className="merchantProfileDetailsBoxLeft">
                            <div className="merchantProfileDataTitle grayLabel">
                              Select type
                            </div>
                            <div className="merchantProfileData">
                              {merchantProfileData?.flag ?? 'NA'}
                            </div>
                          </div>
                        </div>
                    </div>

                    {/* SponsorBank - hidden for "processors" and "agents" */}
                    {flag !== "processors" && flag !== "agents" && (
                      <div className="merchantProfileDetailsBoxContainer">
                        {!editsponsorBank ? (
                          <div className="merchantProfileDetailsBox">
                            <div className="merchantProfileDetailsBoxLeft">
                              <div className="merchantProfileDataTitle grayLabel">
                                What is your Sponsor Bank
                              </div>
                              <div className="merchantProfileData">
                                {merchantProfileData?.SponsorBank ?? 'NA'}
                              </div>
                            </div>
                            <div className="editIconContainer" onClick={() => setEditsponsorBank(true)}>
                              <img src={editIcon} alt="" className="editIcon" />
                            </div>
                          </div>
                        ) : (
                          <div className="merchantProfileInputBox">
                            <div className="merchantInputContainer">
                              <label htmlFor="merchantName" className="merchantInputLabel">
                                What is your Sponsor Bank <span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                type="text"
                                name="merchantName"
                                placeholder="Enter What is your Sponsor Bank"
                                value={sponsorBank}
                                onChange={(e) => setsponsorBank(e.target.value)}
                                className="merchantProfileInputField"
                              />
                            </div>
                            <div className="merchantInputCloseBtn" onClick={() => setEditsponsorBank(false)}>
                              &times;
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Primary & Secondary Processing Platform - hidden for "processors" and "isos" */}
                    {flag !== "processors" && flag !== "isos" && (
                      <div className="merchantProfileDetailsBoxContainer">
                        {/* Primary */}
                        {!editprimaryPP ? (
                          <div className="merchantProfileDetailsBox">
                            <div className="merchantProfileDetailsBoxLeft">
                              <div className="merchantProfileDataTitle grayLabel">
                                Primary Processing Platform / Partner
                              </div>
                              <div className="merchantProfileData">{merchantProfileData?.PPP ?? 'NA'}</div>
                            </div>
                            <div className="editIconContainer" onClick={() => setEditprimaryPP(true)}>
                              <img src={editIcon} alt="" className="editIcon" />
                            </div>
                          </div>
                        ) : (
                          <div className="merchantProfileInputBox">
                            <div className="merchantInputContainer">
                              <label htmlFor="merchantName" className="merchantInputLabel">
                                Primary Processing Platform / Partner <span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                type="text"
                                name="merchantName"
                                placeholder="Enter Primary Processing Platform / Partner"
                                value={primaryPP}
                                onChange={(e) => setprimaryPP(e.target.value)}
                                className="merchantProfileInputField"
                              />
                            </div>
                            <div className="merchantInputCloseBtn" onClick={() => setEditprimaryPP(false)}>
                              &times;
                            </div>
                          </div>
                        )}

                        {/* Secondary */}
                        {!editsecondaryPP ? (
                          <div className="merchantProfileDetailsBox">
                            <div className="merchantProfileDetailsBoxLeft">
                              <div className="merchantProfileDataTitle grayLabel">
                                Secondary Processing Platform / Partner
                              </div>
                              <div className="merchantProfileData">{merchantProfileData?.SPP ?? 'NA'}</div>
                            </div>
                            <div className="editIconContainer" onClick={() => setEditsecondaryPP(true)}>
                              <img src={editIcon} alt="" className="editIcon" />
                            </div>
                          </div>
                        ) : (
                          <div className="merchantProfileInputBox">
                            <div className="merchantInputContainer">
                              <label htmlFor="merchantName" className="merchantInputLabel">
                                Secondary Processing Platform / Partner
                              </label>
                              <input
                                type="text"
                                name="merchantName"
                                placeholder="Secondary Processing Platform / Partner"
                                value={secondaryPP}
                                onChange={(e) => setsecondaryPP(e.target.value)}
                                className="merchantProfileInputField"
                              />
                            </div>
                            <div className="merchantInputCloseBtn" onClick={() => setEditsecondaryPP(false)}>
                              &times;
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Other - hidden for "processors" and "isos" */}
                    {flag !== "processors" && flag !== "isos" && (
                      <div className="merchantProfileDetailsBoxContainer">
                        {!editother ? (
                          <div className="merchantProfileDetailsBox">
                            <div className="merchantProfileDetailsBoxLeft">
                              <div className="merchantProfileDataTitle grayLabel">Other</div>
                              <div className="merchantProfileData">{merchantProfileData?.Other ?? 'NA'}</div>
                            </div>
                            <div className="editIconContainer" onClick={() => setEditother(true)}>
                              <img src={editIcon} alt="" className="editIcon" />
                            </div>
                          </div>
                        ) : (
                          <div className="merchantProfileInputBox">
                            <div className="merchantInputContainer">
                              <label htmlFor="merchantName" className="merchantInputLabel">
                                Other
                              </label>
                              <textarea
                                type="text"
                                name="merchantName"
                                placeholder="Enter Other"
                                value={other}
                                onChange={(e) => setother(e.target.value)}
                                className="merchantProfileInputField"
                              />
                            </div>
                            <div className="merchantInputCloseBtn" onClick={() => setEditother(false)}>
                              &times;
                            </div>
                          </div>
                        )}
                      </div>
                    )}


                    <div className="merchantProfileDetailsBoxContainer">
                      {!editsalesRep ? (
                        <div className="merchantProfileDetailsBox">
                          <div className="merchantProfileDetailsBoxLeft">
                            <div className="merchantProfileDataTitle grayLabel">
                              How many merchant services sales represenatives are in your office ? 
                            </div>
                            <div className="merchantProfileData">
                              {salesRep}
                            </div>
                          </div>

                          <div
                            className="editIconContainer"
                            onClick={() => setEditsalesRep(true)}
                          >
                            <img src={editIcon} alt="" className="editIcon" />
                          </div>
                        </div>
                      ) : (
                        <div className="merchantProfileInputBox">
                          <div className="merchantInputContainer">
                            <label
                              htmlFor="merchantName"
                              className="merchantInputLabel"
                            >
                              How many merchant services sales represenatives are in your office ? {" "}
                            </label>

                            <select
                              className="inputField selectField"
                              value={salesRep}
                              onChange={(e) => setsalesRep(e.target.value)}
                            >
                              <option value="100K">   &lt; $100K  </option>
                                <option value="100K<250K"> 100K &lt; 250K </option>
                                <option value="250K<1MM"> 250k &lt; 1MM </option>
                                <option value="1MM<5MM">  1MM &lt; 5MM </option>
                                <option value="5MM<10MM"> 5MM &lt; 10MM </option>
                                <option value="10MM<25MM"> 10MM &lt; 25MM </option>
                                <option value="25MM+"> 25MM+ </option>
                            </select>
                          </div>

                          <div
                            className="merchantInputCloseBtn"
                            onClick={() => setEditsalesRep(false)}
                          >
                            &times;
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="merchantProfileDetailsBoxContainer">
                      {!editclientCount ? (
                        <div className="merchantProfileDetailsBox">
                          <div className="merchantProfileDetailsBoxLeft">
                            <div className="merchantProfileDataTitle grayLabel">
                              How many clients do you service? 
                            </div>
                            <div className="merchantProfileData">
                              {merchantProfileData?.clientCount ?? 'NA'}
                            </div>
                          </div>

                          <div
                            className="editIconContainer"
                            onClick={() => setEditclientCount(true)}
                          >
                            <img src={editIcon} alt="" className="editIcon" />
                          </div>
                        </div>
                      ) : (
                        <div className="merchantProfileInputBox">
                          <div className="merchantInputContainer">
                            <label
                              htmlFor="merchantName"
                              className="merchantInputLabel"
                            >
                              How many clients do you service? {" "}
                            </label>
                            <input
                              type="number"
                              name="merchantName"
                              placeholder="Enter How many clients do you service? "
                              value={clientCount}
                              onChange={(e) => setclientCount(e.target.value)}
                              className="merchantProfileInputField"
                            />
                          </div>

                          <div
                            className="merchantInputCloseBtn"
                            onClick={() => setEditclientCount(false)}
                          >
                            &times;
                          </div>
                        </div>
                      )}
                      {!editclientPublicly ? (
                        <div className="merchantProfileDetailsBox">
                          <div className="merchantProfileDetailsBoxLeft">
                            <div className="merchantProfileDataTitle grayLabel">
                              Share publicly? 
                            </div>
                            <div className="merchantProfileData">
                              {clientPublicly}
                            </div>
                          </div>

                          <div
                            className="editIconContainer"
                            onClick={() => setEditclientPublicly(true)}
                          >
                            <img src={editIcon} alt="" className="editIcon" />
                          </div>
                        </div>
                      ) : (
                        <div className="merchantProfileInputBox">
                          <div className="merchantInputContainer">
                            <label
                              htmlFor="merchantName"
                              className="merchantInputLabel"
                            >
                              Share publicly? {" "}
                            </label>
                            {/* <input
                              type="text"
                              name="merchantName"
                              placeholder="Enter Share publicly? "
                              value={clientPublicly}
                              onChange={(e) => setclientPublicly(e.target.value)}
                              className="merchantProfileInputField"
                            /> */}

                            <select
                              className="inputField selectField"
                              value={clientPublicly}
                              onChange={(e) => setclientPublicly(e.target.value)}
                            >
                              <option value="yes">  Yes  </option>
                              <option value="no"> No </option>
                            </select>
                          </div>

                          <div
                            className="merchantInputCloseBtn"
                            onClick={() => setEditclientPublicly(false)}
                          >
                            &times;
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="merchantProfileDetailsBoxContainer">
                      {!editvolumeProcessed ? (
                        <div className="merchantProfileDetailsBox">
                          <div className="merchantProfileDetailsBoxLeft">
                            <div className="merchantProfileDataTitle grayLabel">
                              Monthly Volume Processed by your merchants 
                            </div>
                            <div className="merchantProfileData">
                              {merchantProfileData?.VolumeProcessed ?? 'NA'}
                            </div>
                          </div>

                          <div
                            className="editIconContainer"
                            onClick={() => setEditvolumeProcessed(true)}
                          >
                            <img src={editIcon} alt="" className="editIcon" />
                          </div>
                        </div>
                      ) : (
                        <div className="merchantProfileInputBox">
                          <div className="merchantInputContainer">
                            <label
                              htmlFor="merchantName"
                              className="merchantInputLabel"
                            >
                              Monthly Volume Processed by your merchants {" "}
                            </label>
                            <select
                              className="inputField selectField"
                              value={volumeProcessed}
                              onChange={(e) => setvolumeProcessed(e.target.value)}
                            >
                              <option value="100K">   &lt; $100K  </option>
                              <option value="100K<250K"> 100K &lt; 250K </option>
                              <option value="250K<1MM"> 250k &lt; 1MM </option>
                              <option value="1MM<5MM">  1MM &lt; 5MM </option>
                              <option value="5MM<10MM"> 5MM &lt; 10MM </option>
                              <option value="10MM<25MM"> 10MM &lt; 25MM </option>
                              <option value="25MM+"> 25MM+ </option>
                            </select>
                          </div>

                          <div
                            className="merchantInputCloseBtn"
                            onClick={() => setEditvolumeProcessed(false)}
                          >
                            &times;
                          </div>
                        </div>
                      )}
                      {!editvolumePublicly ? (
                        <div className="merchantProfileDetailsBox">
                          <div className="merchantProfileDetailsBoxLeft">
                            <div className="merchantProfileDataTitle grayLabel">
                              Share publicly? 
                            </div>
                            <div className="merchantProfileData">
                              {merchantProfileData?.volumePublicly ?? 'NA'}
                            </div>
                          </div>

                          <div
                            className="editIconContainer"
                            onClick={() => setEditvolumePublicly(true)}
                          >
                            <img src={editIcon} alt="" className="editIcon" />
                          </div>
                        </div>
                      ) : (
                        <div className="merchantProfileInputBox">
                          <div className="merchantInputContainer">
                            <label
                              htmlFor="merchantName"
                              className="merchantInputLabel"
                            >
                              Share publicly? {" "}
                            </label>
                            <select
                              className="inputField selectField"
                              value={volumePublicly}
                              onChange={(e) => setvolumePublicly(e.target.value)}
                            >
                              <option value="yes">Yes</option>
                              <option value="no">No</option>
                            </select>
                          </div>

                          <div
                            className="merchantInputCloseBtn"
                            onClick={() => setEditvolumePublicly(false)}
                          >
                            &times;
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="merchantProfileDetailsBoxContainer">
                      {!edithighRisk ? (
                        <div className="merchantProfileDetailsBox">
                          <div className="merchantProfileDetailsBoxLeft">
                            <div className="merchantProfileDataTitle grayLabel">
                              Do you offer High Risk? 
                            </div>
                            <div className="merchantProfileData">
                              {merchantProfileData?.HighRisk ?? 'NA'}
                            </div>
                          </div>

                          <div
                            className="editIconContainer"
                            onClick={() => setEdithighRisk(true)}
                          >
                            <img src={editIcon} alt="" className="editIcon" />
                          </div>
                        </div>
                      ) : (
                        <div className="merchantProfileInputBox">
                          <div className="merchantInputContainer">
                            <label
                              htmlFor="merchantName"
                              className="merchantInputLabel"
                            >
                              Do you offer High Risk? {" "}
                            </label>
                            <select
                              className="inputField selectField"
                              value={highRisk}
                              onChange={(e) => sethighRisk(e.target.value)}
                            >
                              <option value="yes">  Yes  </option>
                              <option value="no"> No </option>
                            </select>
                          </div>

                          <div
                            className="merchantInputCloseBtn"
                            onClick={() => setEdithighRisk(false)}
                          >
                            &times;
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="merchantProfileDetailsBoxContainer">

                      {!editpointOfSale ? (
                        <div className="merchantProfileDetailsBox">
                          <div className="merchantProfileDetailsBoxLeft">
                            <div className="merchantProfileDataTitle grayLabel">
                              Do you offer Point of Sale? 
                            </div>
                            <div className="merchantProfileData">
                              {merchantProfileData?.PointofSale ?? 'NA'}
                            </div>
                          </div>

                          <div
                            className="editIconContainer"
                            onClick={() => setEditpointOfSale(true)}
                          >
                            <img src={editIcon} alt="" className="editIcon" />
                          </div>
                        </div>
                      ) : (
                        <div className="merchantProfileInputBox">
                          <div className="merchantInputContainer">
                            <label
                              htmlFor="merchantName"
                              className="merchantInputLabel"
                            >
                              Do you offer Point of Sale? {" "}
                            </label>
                            <select
                              className="inputField selectField"
                              value={pointOfSale}
                              onChange={(e) => setpointOfSale(e.target.value)}
                            >
                              <option value="yes">  Yes  </option>
                              <option value="no"> No </option>
                            </select>
                          </div>

                          <div
                            className="merchantInputCloseBtn"
                            onClick={() => setEditpointOfSale(false)}
                          >
                            &times;
                          </div>
                        </div>
                      )}

                    </div>
                    <div className="merchantProfileDetailsBoxContainer">

                      {!editfinancing ? (
                        <div className="merchantProfileDetailsBox">
                          <div className="merchantProfileDetailsBoxLeft">
                            <div className="merchantProfileDataTitle grayLabel">
                              Do you offer Merchant Cash Advance or Financing?
                            </div>
                            <div className="merchantProfileData">
                              {merchantProfileData?.Financing ?? 'NA'}
                            </div>
                          </div>

                          <div
                            className="editIconContainer"
                            onClick={() => setEditfinancing(true)}
                          >
                            <img src={editIcon} alt="" className="editIcon" />
                          </div>
                        </div>
                      ) : (
                        <div className="merchantProfileInputBox">
                          <div className="merchantInputContainer">
                            <label
                              htmlFor="merchantName"
                              className="merchantInputLabel"
                            >
                              Do you offer Merchant Cash Advance or Financing? {" "}
                            </label>

                            <select
                              className="inputField selectField"
                              value={financing}
                              onChange={(e) => setfinancing(e.target.value)}
                            >
                              <option value="yes">  Yes  </option>
                              <option value="no"> No </option>
                            </select>
                          </div>

                          <div
                            className="merchantInputCloseBtn"
                            onClick={() => setEditfinancing(false)}
                          >
                            &times;
                          </div>
                        </div>
                      )}

                    </div>

                    {editAlternateEmail ||
                      editDWtoTravel ||
                      editaddressone ||
                      editaddresstwo ||
                      editbulletOne ||
                      editbulletTwo ||
                      editbulletThree ||
                      editsummary ||
                      editflag ||
                      editsponsorBank ||
                      editprimaryPP ||
                      editsecondaryPP ||
                      editother ||
                      editsalesRep ||
                      editclientCount ||
                      editvolumeProcessed ||
                      editclientPublicly ||
                      editvolumePublicly ||
                      edithighRisk ||
                      editpointOfSale ||
                      editfinancing ||
                      editfirst_name ||
                      editlast_name ||
                      editCity ||
                      editCompanyDescription ||
                      editCompanyName ||
                      editCountry ||
                      editIndustry ||
                      editMerchantName ||
                      editPhone ||
                      editState ||
                      editStreet ||
                      editTypeOfService ||
                      editWebsite ||
                      editZipCode ? (
                      <button
                        className="merchantProfileUpdateButton"
                        onClick={() => handleUpdateMerchantFormData()}
                      >
                        {isUpdating ? "Updating..." : "Update"}
                      </button>
                    ) : (
                      ""
                    )}
                    <div className="merchantProfileDetailsBoxContainer">
                      <div className="forgetPassword">
                        Reset Password?{" "}
                        <span
                          className="forgetPasswordLink"
                          onClick={() => navigate(routes.forget_password())}
                        >
                          Click here
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProvidersProfile;
