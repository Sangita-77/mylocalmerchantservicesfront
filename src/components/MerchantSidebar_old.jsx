import "./../styles/styles.css";
import dashboardIcon from "./../assets/images/dashboard_icon.png";
import profileIcon from "./../assets/images/profile_icon.png";
import { useNavigate } from "react-router-dom";
import { routes } from "./../utils/routes";
import eclipse from "./../assets/images/Ellipse 12.png";
import connectedIcon from "./../assets/images/connected_icon.png";

const MerchantSidebar = () => {
  const navigate = useNavigate();
  const url = window.location.pathname;

  return (
    <div className="merchantSidebarWrapper">
      <img src={eclipse} alt="" className="sidebarEclipse" />
      <div className="merchantSidebarContainer">
        <div
          className={`sidebarItem ${
            url === "/mylocalmerchantservicesfront/merchant/dashboard" &&
            "sidebarItemActive"
          }`}
          onClick={() => navigate(routes.merchant_dashboard())}
        >
          <img src={dashboardIcon} alt="" className="sidebarIcon" />
          <div className="sidebarItemTitle">Dashboard</div>
        </div>

        <div
          className={`sidebarItem ${
            url === "/mylocalmerchantservicesfront/merchant/profile" &&
            "sidebarItemActive"
          }`}
          onClick={() => navigate(routes.merchant_profile())}
        >
          <img src={profileIcon} alt="" className="sidebarIcon" />
          <div className="sidebarItemTitle">My Profile</div>
        </div>

        <div
          className={`sidebarItem ${
            url === "/mylocalmerchantservicesfront/merchant/user_connected_history" &&
            "sidebarItemActive"
          }`}
          onClick={() => navigate(routes.merchant_user_history())}
        >
          <img src={connectedIcon} alt="" className="sidebarIcon" />
          <div className="sidebarItemTitle">User Connected History</div>
        </div>
      </div>
    </div>
  );
};

export default MerchantSidebar;
