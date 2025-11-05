import "./../styles/styles.css";
import dashboardIcon from "./../assets/images/dashboard_icon.png";
import profileIcon from "./../assets/images/profile_icon.png";
import { useNavigate } from "react-router-dom";
import { routes } from "./../utils/routes";
// import eclipse from "./../assets/images/Ellipse 12.png";
import connectedIcon from "./../assets/images/connected_icon.png";
import logo from "./../assets/images/logo.png";
import { LuLayoutDashboard } from "react-icons/lu";
import { BiUser } from "react-icons/bi";
import { GoLink } from "react-icons/go";
import { GoSearch } from "react-icons/go";
import { FaRegCommentDots } from "react-icons/fa";
import { BASENAME } from "../config";

const MerchantSidebar = () => {
  const navigate = useNavigate();
  const url = window.location.pathname;

  return (
    <div className="merchantSidebarWrapper">
      <div className="merchantSidebarTopContainer">
        <div className="merchantSidebarLogoContainer">
          <a onClick={() => navigate(routes.home_page())} style={{"cursor": "pointer"}}>
            <img src={logo} alt="" className="merchantSidebarLogo" />
          </a>
        </div>
        <div className="merchantSidebarDivider"></div>
      </div>
      <div className="merchantSidebarContainer">
        <div
          className={`sidebarItem ${
            url === `${BASENAME}/merchant/dashboard` && "sidebarItemActive"
          }`}
          onClick={() => navigate(routes.merchant_dashboard())}
        >
          {/* <img src={dashboardIcon} alt="" className="sidebarIcon" /> */}
          <LuLayoutDashboard color={"#ffffff"} size={24} />
          <div className="sidebarItemTitle">Dashboard</div>
        </div>

        <div
          className={`sidebarItem ${
            url === `${BASENAME}/merchant/profile` && "sidebarItemActive"
          }`}
          onClick={() => navigate(routes.merchant_profile())}
        >
          {/* <img src={profileIcon} alt="" className="sidebarIcon" /> */}
          <BiUser color={"#ffffff"} size={24} />
          <div className="sidebarItemTitle">My Profile</div>
        </div>

        <div
          className={`sidebarItem ${
            url === `${BASENAME}/merchant/user_connected_history` &&
            "sidebarItemActive"
          }`}
          onClick={() => navigate(routes.merchant_user_history())}
        >
          {/* <img src={connectedIcon} alt="" className="sidebarIcon" /> */}
          <GoLink color={"#ffffff"} size={24} />
          <div className="sidebarItemTitle">Agent Connected History</div>
        </div>

        <div
          className={`sidebarItem ${
            url === `${BASENAME}/merchant/agent_list` &&
            "sidebarItemActive"
          }`}
          onClick={() => navigate(routes.merchant_agent_list())}
        >
          <GoSearch color={"#ffffff"} size={24} />
          <div className="sidebarItemTitle">Find Agents</div>
        </div>

        <div
          className={`sidebarItem ${
            url === `${BASENAME}/merchant/review_list` &&
            "sidebarItemActive"
          }`}
          onClick={() => navigate(routes.merchant_add_review())}
        >
          <FaRegCommentDots color={"#ffffff"} size={24} />
          <div className="sidebarItemTitle">Reviews</div>
        </div>

      </div>
    </div>
  );
};

export default MerchantSidebar;
