import React, { useContext, useEffect, useState } from "react";
import "./../../styles/styles.css";
import eclipse from "./../../assets/images/Ellipse 12.png";
import userGroup from "./../../assets/images/user_group.png";
import circle from "./../../assets/images/circle.png";
import { CiCircleInfo, CiSearch } from "react-icons/ci";
import { CiCalendar } from "react-icons/ci";
import AreaChartComponent from "../../components/AreaChartComponent.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../utils/apiManager.js";
import {
  findMaxValue,
  formatChartDataByMonth,
  formatChartDataByWeek,
  sortedChatDataByMonth,
} from "../../utils/helper.js";
import { AppContext } from "../../utils/context.js";
import PreLoader from "../../components/PreLoader.jsx";
import DashBoardTopBar from "../../components/DashBoardTopBar.jsx";
import { FaCircleUser, FaPowerOff } from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";
import BarChartComponent from "../../components/BarChartComponent";

const MerchantDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [graphLoading, setGraphLoading] = useState(false);
  const [dataKey, setDataKey] = useState("month");
  const [graphData, setGraphData] = useState(null);
  const [totalCount, setTotalCount] = useState("");
  const [yearlyCount, setYearlyCount] = useState("");
  const [monthlyCount, setMonthlyCount] = useState("");
  const [weeklyCount, setWeeklyCount] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filterBy, setFilterBy] = useState("yearly");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const { token } = useContext(AppContext);


// Demo data 
const merchantChartProps = [
{month: "Jan",  merchants: 6800, },
{month: "Feb",  merchants: 7800, },
{month: "Mar",  merchants: 5800,  },
{month: "Apr",  merchants: 6100, },
{month: "May",  merchants: 4500, },
{month: "Jun",  merchants: 3800, },
{month: "Jul",  merchants: 4300, },
{month: "Aug",  merchants: 3300, },
{month: "Sept", merchants: 9315, },
{month: "Oct",  merchants: 7250, },
{month: "Nov",  merchants: 4150, },
{month: "Dec",  merchants: 8000, },
 ];

const pieChartData = [
  { name: "Total User", value: 200 },
];


  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const fetchDashboardData = async () => {
    try {
      setGraphLoading(true);
      setError(null);

      const body = 
      {     
        filter : "year",
        merchant_id : 20 
      };
      const response = await axios.post(
        `${BASE_URL}/merchantUsersGraph`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Dashboard graph response=======>", response);
      return false;

      if (response?.status === 200) {
        if (filterBy === "yearly") {
          const chartData = response?.data?.data?.monthly_breakdown;
          setGraphData(formatChartDataByMonth(chartData));
          console.log("chartData===>", chartData);
          // setDataKey("month");
        } else if (filterBy === "monthly") {
          const chartData = response?.data?.data?.weekly_breakdown;
          setGraphData(formatChartDataByWeek(chartData));
          setDataKey("week");
          console.log("chartData===>", chartData);
        }

        // const yMax = Math.min(Object.values(response?.data?.data?.monthly_breakdown));
        // console.log("YMax===>", yMax);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setGraphLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [filterBy]);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/logoutM`,
        {
          user_id: localStorage.getItem("user_id"),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.status) {
        // Logout successful, reload the page
        window.location.reload();
      } else {
        console.error("Logout failed:", response.data.message);
        alert("Logout failed: " + response.data.message);
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Something went wrong during logout.");
    }
  };

  return (
    <div
      className="merchantDashboardWrapper"
      onClick={() => setShowDropdown(false)}
    >

<div className="adminDashboardTopbar">
        <div className="adminDashboardTopbarLeft">
          <h3 className="adminDashboardTopTitle">Merchant Dashboard</h3>
        </div>
        <div className="adminDashboardTopbarRight">
          <div className="adminDashboardTopSearchInputContainer">
            <input className="adminSearchInput" placeholder="Search" />
            <div className="inputSearchIconContainer">
              <CiSearch size={20} color="white" />
            </div>
          </div>

          <div className="logoutIconContainer" onClick={handleLogout} style={{ cursor: "pointer" }}>
            <FaPowerOff size={24} color={"#0d64a9"} />
          </div>
          <div className="profileIconContainer">
            <FaCircleUser size={24} color={"#0d64a9"} />
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="merchantDashboardLoaderWrapper">
          <div className="merchantDashboardLoaderContainer">
            <PreLoader />
            <div>Loading...</div>
          </div>
        </div>
      ) : (
        <>

          <div className="merchantDashboardContainer">
            <div className="merchantDashboardCountContainer">
              <div className="merchantDashboardCountPlate">
                <div className="countPlateIconContainer">
                  <FiUsers color="gray" size={24} />
                </div>
                <div className="countPlateRightContainer">
                  <div>Merchant</div>
                  <div className="merchant-prof">Profile</div>
                </div>
              </div>

              <div className="merchantDashboardCountPlate">
                <div className="countPlateIconContainer">
                  <FiUsers color="gray" size={24} />
                </div>
                <div className="countPlateRightContainer">
                  <div>User connected</div>
                  <div className="merchant-prof">Connected</div>  
                </div>
              </div>
            </div>

            <div className="merchantStatsSection row">
              <div className="col-md-12">
                <div className="userStatsSection">
                  <div className="userStatsTopContainer">
                    <div className="userStatsTopLeft">
                        <div className="userStatsTitle">Number of Merchant</div>
                        <div className="userStatsValue">{totalCount}</div>
                    </div>
                          <div className="userGraphRight">
                            <div className="userGraphFilterTitle">
                              Select Time Range:{" "}
                            </div>
                            <div
                              className="chartDropdownContainer"
                              onClick={(e) => toggleDropdown(e)}
                            >
                              <div className="chartDropdown">
                                <div>
                                  {filterBy ? filterBy : "Select Time ▾"}
                                </div>
                                <CiCalendar
                                  size={20}
                                  color="white"
                                />
                              </div>
                              {showDropdown === true && (
                                <div className="dropdownOptions">
                                  <div
                                    className="dropdownOption"
                                    onClick={() => setFilterBy("month")}
                                  >
                                    Monthly
                                  </div>
                                  <div
                                    className="dropdownOption"
                                    onClick={() => setFilterBy("day")}
                                  >
                                    Day
                                  </div>
                                  <div
                                    className="dropdownOption"
                                    onClick={() => setFilterBy("year")}
                                  >
                                    Yearly
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                  </div>

                  <div className="userStatsContainer">
                    {graphLoading ? (
                      <div className="graphLoaderContainer">
                        <PreLoader />
                        <div className="graphLoadingText">Loading graph...</div>
                      </div>
                    ) : (
                      <>
                        <div className="userGraphTop">
                          <div className="userGraphLeft">
                            <div className="userGraphLeftTitle">Analytics</div>
                            <CiCircleInfo size={24} color="white" />
                          </div>
                        </div>

                        <div className="number-of-user">Number of users</div>
                        <div className="graphContainer">
                          <BarChartComponent data={merchantChartProps} />
                        </div>
                        <div className="time-user"><span>Time</span></div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default MerchantDashboard;
