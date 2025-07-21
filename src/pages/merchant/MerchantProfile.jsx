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

const MerchantProfile = () => {
  const [loading, setLoading] = useState(false);
  const [isUpdating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [logoutError, setLogoutError] = useState("");
  const [merchantProfileData, setMerchantProfileData] = useState(null);
  const [companyName, setCompanyName] = useState();
  const [merchantName, setMerchantName] = useState("");
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
        county: country,
        email: alternateEmail,
        phone: phone,
        industry: industry,
        type_of_service: typeOfServices,
        website: website,
        company_description: companyDescription,
      };

      const response = await axios.post(
        `${BASE_URL}/editMerchantProfile`,
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
  }, [merchantProfileData]);



  return (
    <div className="merchantProfileWrapper">

      <DashBoardTopBar heading="Profile" />

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
                    {merchantProfileData?.company_name}
                  </div>
                </div>

                <div className="merchantProfileInnerDetailsContainer">
                  <div className="profileInnerDetailsHolder">
                    <div className="merchantProfileDetailsBox">
                      <div className="merchantProfileDetailsBoxLeft">
                        <div className="merchantProfileDataTitle">User Id</div>
                        <div className="merchantProfileData">
                          {merchantProfileData?.user_id}
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
                              {merchantProfileData?.company_name}
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

                      {!editMerchantName ? (
                        <div className="merchantProfileDetailsBox">
                          <div className="merchantProfileDetailsBoxLeft">
                            <div className="merchantProfileDataTitle grayLabel">
                              Merchant Name
                            </div>
                            <div className="merchantProfileData">
                              {merchantProfileData?.merchant_name}
                            </div>
                          </div>

                          <div
                            className="editIconContainer"
                            onClick={() => setEditMerchantName(true)}
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
                              Merchant Name{" "}
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type="text"
                              name="merchantName"
                              placeholder="Enter merchant name"
                              value={merchantName}
                              onChange={(e) => setMerchantName(e.target.value)}
                              className="merchantProfileInputField"
                            />
                          </div>

                          <div
                            className="merchantInputCloseBtn"
                            onClick={() => setEditMerchantName(false)}
                          >
                            &times;
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="merchantProfileDetailsHeading">
                      Company Mailing Address
                    </div>

                    <div className="merchantProfileDetailsBoxContainer">
                      {!editStreet ? (
                        <div className="merchantProfileDetailsBox">
                          <div className="merchantProfileDetailsBoxLeft">
                            <div className="merchantProfileDataTitle grayLabel">
                              Street
                            </div>
                            <div className="merchantProfileData">
                              {merchantProfileData?.street}
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
                              {merchantProfileData?.city}
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
                              {merchantProfileData?.state}
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
                              {merchantProfileData?.zip_code}
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
                              {merchantProfileData?.county}
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

                      {!editAlternateEmail ? (
                        <div className="merchantProfileDetailsBox">
                          <div className="merchantProfileDetailsBoxLeft">
                            <div className="merchantProfileDataTitle grayLabel">
                              Alternate Email
                            </div>
                            <div className="merchantProfileData">
                              {merchantProfileData?.email}
                            </div>
                          </div>

                          <div
                            className="editIconContainer"
                            onClick={() => setEditAlternateEmail(true)}
                          >
                            <img src={editIcon} alt="" className="editIcon" />
                          </div>
                        </div>
                      ) : (
                        <div className="merchantProfileInputBox">
                          <div className="merchantInputContainer">
                            <label
                              htmlFor="alternateEmail"
                              className="merchantInputLabel"
                            >
                              Alternate Email{" "}
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type="alternateEmail"
                              placeholder="Enter alternate email"
                              value={alternateEmail}
                              onChange={(e) =>
                                setAlternateEmail(e.target.value)
                              }
                              className="merchantProfileInputField"
                            />
                          </div>

                          <div
                            className="merchantInputCloseBtn"
                            onClick={() => setEditAlternateEmail(false)}
                          >
                            &times;
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="merchantProfileDetailsBoxContainer">
                      {!editPhone ? (
                        <div className="merchantProfileDetailsBox">
                          <div className="merchantProfileDetailsBoxLeft">
                            <div className="merchantProfileDataTitle grayLabel">
                              Phone
                            </div>
                            <div className="merchantProfileData">
                              {merchantProfileData?.phone}
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

                      {!editIndustry ? (
                        <div className="merchantProfileDetailsBox">
                          <div className="merchantProfileDetailsBoxLeft">
                            <div className="merchantProfileDataTitle grayLabel">
                              Industry
                            </div>
                            <div className="merchantProfileData">
                              {merchantProfileData?.industry}
                            </div>
                          </div>

                          <div
                            className="editIconContainer"
                            onClick={() => setEditIndustry(true)}
                          >
                            <img src={editIcon} alt="" className="editIcon" />
                          </div>
                        </div>
                      ) : (
                        <div className="merchantProfileInputBox">
                          <div className="merchantInputContainer">
                            <label
                              htmlFor="industry"
                              className="merchantInputLabel"
                            >
                              Industry <span style={{ color: "red" }}>*</span>
                            </label>
                            <select
                              name="industry"
                              className="merchantProfileInputField"
                              value={industry}
                              onChange={(e) => setIndustry(e.target.value)}
                            >
                              <option value="">Option 1</option>
                              <option value="">Option 2</option>
                              <option value="">Option 3</option>
                            </select>
                          </div>

                          <div
                            className="merchantInputCloseBtn"
                            onClick={() => setEditIndustry(false)}
                          >
                            &times;
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="merchantProfileDetailsBoxContainer">
                      {!editTypeOfService ? (
                        <div className="merchantProfileDetailsBox">
                          <div className="merchantProfileDetailsBoxLeft">
                            <div className="merchantProfileDataTitle grayLabel">
                              Type of services
                            </div>
                            <div className="merchantProfileData">
                              {merchantProfileData?.type_of_service}
                            </div>
                          </div>

                          <div
                            className="editIconContainer"
                            onClick={() => setEditTypeOfService(true)}
                          >
                            <img src={editIcon} alt="" className="editIcon" />
                          </div>
                        </div>
                      ) : (
                        <div className="merchantProfileInputBox">
                          <div className="merchantInputContainer">
                            <label
                              htmlFor="typeOfServices"
                              className="merchantInputLabel"
                            >
                              Type of services{" "}
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <select
                              name="industry"
                              className="merchantProfileInputField"
                              value={typeOfServices}
                              onChange={(e) =>
                                setTypeOfServices(e.target.value)
                              }
                            >
                              <option value="Option 1">Option 1</option>
                              <option value="Option 2">Option 2</option>
                              <option value="Option 3">Option 3</option>
                            </select>
                          </div>

                          <div
                            className="merchantInputCloseBtn"
                            onClick={() => setEditTypeOfService(false)}
                          >
                            &times;
                          </div>
                        </div>
                      )}

                      {!editWebsite ? (
                        <div className="merchantProfileDetailsBox">
                          <div className="merchantProfileDetailsBoxLeft">
                            <div className="merchantProfileDataTitle grayLabel">
                              Website
                            </div>
                            <div className="merchantProfileData">
                              {merchantProfileData?.website}
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
                    </div>

                    <div className="merchantProfileDetailsBoxContainer">
                      {!editCompanyDescription ? (
                        <div className="merchantProfileDetailsBox">
                          <div className="merchantProfileDetailsBoxLeft">
                            <div className="merchantProfileDataTitle grayLabel">
                              Company Description
                            </div>
                            <div className="merchantProfileData">
                              {merchantProfileData?.company_description}
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

                    {editAlternateEmail ||
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

export default MerchantProfile;
