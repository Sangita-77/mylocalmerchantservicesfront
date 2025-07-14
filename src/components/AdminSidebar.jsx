import React, { useState } from "react";
import "./../styles/styles.css";
import { LuLayoutDashboard } from "react-icons/lu";
import { LiaStoreAltSolid } from "react-icons/lia";
import { HiLink } from "react-icons/hi";
import { BiUser } from "react-icons/bi";
import { PiUsersThree } from "react-icons/pi";
import { PiPhoneCall } from "react-icons/pi";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineStorefront } from "react-icons/md";
import dashboardIcon from "./../assets/images/dashboard_icon.png";
import storeIcon from "./../assets/images/store_icon.png";
import userListIcon from "./../assets/images/user_list_icon.png";
import calendarIcon from "./../assets/images/calendar_icon.png";
import errorIcon from "./../assets/images/error_icon.png";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import fileIcon from "./../assets/images/file_icon.png";
import pendingIcon from "./../assets/images/pending_icon.png";
import logo from "./../assets/images/logo.png";
import { useLocation } from "react-router-dom";
import { routes } from "../utils/routes";
import { useNavigate } from "react-router-dom";
import { BASENAME } from "../config";

const AdminSidebar = () => {
  const [dashboardHover, setDashboardHover] = useState(false);
  const [profileHover, setProfileHover] = useState(false);
  const [merchantHover, setMerchantHover] = useState(false);
  const [connectHover, setConnectHover] = useState(false);

  const location = useLocation();

  const navigate = useNavigate();
  const url = window.location.pathname;

  return (
    <div className="adminSidebarWrapper">
      <div className="adminSidebarInner">
        <div className="adminSidebarTopContainer">
          <div className="adminSidebarLogoContainer">
            <img src={logo} alt="" className="adminSidebarLogo" />
          </div>
          <div className="adminSidebarDivider"></div>
        </div>

        <div className="adminSidebarContainer">
          <div
            // className={`sidebarItem ${location.pathname === routes.admin_dashboard() && "sidebarItemActive"}`}
            // onMouseEnter={() => setDashboardHover(true)}
            // onMouseLeave={() => setDashboardHover(false)}
            className={`sidebarItem ${url === `${BASENAME}/admin/dashboard` && "sidebarItemActive"}`}
            onClick={() => navigate(routes.admin_dashboard())}
          >
            <LuLayoutDashboard
              color={dashboardHover === true || location.pathname === routes.admin_dashboard() ? "#838383" : "white"}
              size={24}
            />
            <div>Dashboard</div>
          </div>

          <div
            className={`sidebarItem ${url === `${BASENAME}/admin/profile` && "sidebarItemActive"}`}
            onClick={() => navigate(routes.admin_profile())}
          >
            <BiUser
              color={"#ffffff"} size={24}
            />
            <div>Profile</div>
          </div>

          <div
            className={`sidebarItem ${url === `${BASENAME}/admin/user_list` && "sidebarItemActive"}`}
            onClick={() => navigate(routes.admin_user_list())}
          >
            <PiUsersThree
              color={"#ffffff"} size={24}
            />
            <div>User List</div>
          </div>

          <div
            className="sidebarItem"
            onMouseEnter={() => setMerchantHover(true)}
            onMouseLeave={() => setMerchantHover(false)}
          >
            <LiaStoreAltSolid
              color={merchantHover === true ? "#838383" : "white"}
              size={24}
            />
            <div>Merchant</div>
          </div>

          <div
            className={`sidebarItem ${url === `${BASENAME}/admin/usermerchant-list` && "sidebarItemActive"}`}
            onClick={() => navigate(routes. admin_user_merchant())}
          >
            <HiLink color={"#fff"} size={24}/>
            <div>Merchant</div>
          </div>

          <div
            className={`sidebarItem ${url === `${BASENAME}/admin/connect` && "sidebarItemActive"}`}
            onClick={() => navigate(routes.admin_user_connect())}
          >
            <HiLink color={"#fff"} size={24}/>
            <div>Connect</div>
          </div>

          <div
            className={`sidebarItem ${url === `${BASENAME}/admin/contact` && "sidebarItemActive"}`}
            onClick={() => navigate(routes.admin_contact())}
          >
            <PiPhoneCall color={"#fff"} size={24}/>
            <div>Contact</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;