import "./../styles/styles.css";
import locationIcon from "./../assets/images/location_icon_img.jpg";
import { MdOutlineMenu } from "react-icons/md";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { routes } from "../utils/routes";
import { useNavigate } from "react-router-dom";
import Toast from "./../components/Toast";
import { AppContext } from "../utils/context";
import { apiErrorHandler } from "../utils/helper";
import axios from "axios";
import { BASE_URL } from "../utils/apiManager";
import LoginModal from "../components/LoginModal";
import Dropdown from 'react-bootstrap/Dropdown';
import CookieConsent from '../components/CookieConsent';


const OnboardingPageHeader = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [personType, setPersonType] = useState("");
  const [error, setError] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  const {
    showToast,
    setShowToast,
    showHeaderDropdown,
    merchantToken,
    loggedUserId,
    token,
  } = useContext(AppContext);

  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleLogout = async () => {
    try {
      const body = { user_id: loggedUserId };
      const response = await axios.post(
        `${BASE_URL}/logoutM`,
        JSON.stringify(body),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Clear session
      localStorage.removeItem("is_authenticated");
      localStorage.removeItem("user_id");

      // Use SPA navigation so React Router (with basename) handles the redirect
      navigate(routes.msr_registration());
    } catch (error) {
      console.log(error);
      const errMsg = apiErrorHandler(error);
      setError(errMsg);
    }
  };
  

  useEffect(() => {
    if (showToast) {
      let timeout;
      timeout = setTimeout(() => {
        setShowToast(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [showToast]);

  useEffect(() => {
    // if (personType === "user") {
    // }
    if (personType === "merchant") {
      navigate(routes.merchant_registration());
      setPersonType("");
    }
  }, [personType]);

  return (
    <div className="onboardingPageHeaderWrapper">
      <div className="onboardingPageChildHeaderContainer">
        <p className="childHeaderText">
          Get Discovered by Real Local Businesses
        </p>
      </div>

      <div className="onboardingPageHeaderMainContainer" >
        <a onClick={() => navigate(routes.home_page())} style={{"cursor": "pointer"}}>
        <div className="headerLeft">
        <img
            src={locationIcon}
            alt=""
            crossOrigin="anonymous"
            className="locationIcon"
          />
          <div className="headerWebsiteTitleContainer">
            <p className="headerWebsiteTitleLight">My Local</p>
            <p className="headerWebsiteTitleDark">Merchant Services</p>
          </div>
        </div>
        </a>

        <div className="headerRight">
          <div
            className={`li_item ${
              location.pathname === routes.home_page() && `li_item_active`
            }`}
            onClick={() => navigate(routes.home_page())}
          >
            Home
          </div>

          <div
            className={`li_item ${
              location.pathname === routes.merchant_list() && `li_item_active`
            }`}
            onClick={() => navigate(routes.merchant_list())}
          >
            Merchant Services Provides
          </div>

          {localStorage.getItem("is_authenticated") && localStorage.getItem("user_id") ? (
            <div
              className="li_item"
              onClick={() => {
                handleLogout();
                localStorage.removeItem("is_authenticated");
                localStorage.removeItem("user_id");
                navigate(routes.msr_registration()); // Redirect after logout
              }}
            >
              Logout
            </div>
          ) : (
            <>
              {/* <div
                className={`li_item ${
                  location.pathname === routes.msr_registration() && `li_item_active`
                }`}
                onClick={() => navigate(routes.msr_registration())}
              >
                Registration
              </div> */}
      <Dropdown>
      <Dropdown.Toggle id="dropdown-basic"  
      className={`li_item ${ location.pathname === routes.msr_registration() && `li_item_active` }
      ${ location.pathname === routes.user_registration() && `li_item_active` }`}
      >
        Registration
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item 
         className={`li_item ${ location.pathname === routes.msr_registration() && `li_item_active` }`}
                onClick={() => navigate(routes.msr_registration())} href="">
                  Merchant Services Providers Registration
        </Dropdown.Item>
          <Dropdown.Item 
         className={`li_item ${ location.pathname === routes.user_registration() && `li_item_active` }`}
                onClick={() => navigate(routes.user_registration())}>Merchant Registration</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>

                <div
                className={`li_item ${
                  location.pathname === routes.msr_registration() && `li_item_active`
                }`}
                onClick={() => setShowLogin(true)}
                >
                Login
                </div>
              </>
          )}



          <button className="header_Btn" onClick={() => navigate(routes.contact())}>Contact</button>
        </div>

        <div className="headerRightMobileView">
          <button className="headerMenuBtn" onClick={() => toggleMenu()}>
            <MdOutlineMenu size={24} color={"#055dae"} />
          </button>
        </div>

        {showMenu && (
          <div className="mobileViewMenuModalWrapper">
            <div className="mobileViewMenuModalContainer">
              <div className="closeIcon" onClick={() => toggleMenu()}>
                &times;
              </div>
              <div className="menuModalInner">
                <p className="mobileViewMenuItem">Home</p>
                <p className="mobileViewMenuItem">Registration</p>
                <button className="menuBtn">Contact</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showToast && (
        <Toast
          severity={"success"}
          title={"Success"}
          message={"Registration successful"}
          handleClose={() => setShowToast(false)}
        />
      )}
      {showLogin && (
        <LoginModal handleClose={() => setShowLogin(false)} />
      )}

    <div className="App">
      {/* Your landing page content */}
      {/* <h1>Welcome to My Website</h1> */}

      {/* Cookie consent */}
      <CookieConsent />
    </div>
    </div>
  );
};

export default OnboardingPageHeader;
