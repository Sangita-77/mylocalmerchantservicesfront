import React, { useContext, useEffect, useState } from "react";
import "./../../styles/styles.css";
import { CiCircleInfo, CiSearch, CiCalendar } from "react-icons/ci";
import { FaCircleUser, FaPowerOff } from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";
import axios from "axios";
import { BASE_URL } from "../../utils/apiManager.js";
import { AppContext } from "../../utils/context.js";
import PreLoader from "../../components/PreLoader.jsx";
import BarChartComponent from "../../components/BarChartComponent";
import DashBoardTopBar from "../../components/DashBoardTopBar";

const MerchantDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [graphLoading, setGraphLoading] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filterBy, setFilterBy] = useState("year");
  const [showDropdown, setShowDropdown] = useState(false);
  const { token } = useContext(AppContext);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const formatGraphData = (data, filter) => {
    return Object.entries(data).map(([key, value]) => ({

      month: key,
      merchants: value,
    }));
  };

  const fetchDashboardData = async () => {
    try {
      setGraphLoading(true);

      // const merchantId = localStorage.getItem("merchant_id");


      const merchantId = parseInt(localStorage.getItem("merchant_id"), 10);

      // console.log("merchantId....................",merchantId);
      // console.log("merchantId....................", merchantId, typeof merchantId);

      const body = {
        filter: filterBy,
        merchant_id: merchantId,
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

      if (response?.data?.status) {
        const rawGraphData = response?.data?.data;
        setTotalCount(response?.data?.total_count || 0);
        const formattedData = formatGraphData(rawGraphData, filterBy);
        setGraphData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching graph data:", error);
    } finally {
      setGraphLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [filterBy]);


  return (
    <div className="merchantDashboardWrapper" onClick={() => setShowDropdown(false)}>

      <DashBoardTopBar heading="Merchant Dashboard" />

      {loading ? (
        <div className="merchantDashboardLoaderWrapper">
          <div className="merchantDashboardLoaderContainer">
            <PreLoader />
            <div>Loading...</div>
          </div>
        </div>
      ) : (
        <div className="merchantDashboardContainer">
          {/* <div className="merchantDashboardCountContainer">
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
          </div> */}

                <div className="merchantProfileContainerHeader">
                  <div className="merchantHeaderCompanyTitle">
                    Number of Merchant Services Providers connected
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
                    <div className="userGraphFilterTitle">Select Time Range:</div>
                    <div className="chartDropdownContainer" onClick={(e) => toggleDropdown(e)}>
                      <div className="chartDropdown">
                        <div>{filterBy.charAt(0).toUpperCase() + filterBy.slice(1)}</div>
                        <CiCalendar size={20} color="white" />
                      </div>
                      {showDropdown && (
                        <div className="dropdownOptions">
                          <div className="dropdownOption" onClick={() => setFilterBy("month")}>Monthly</div>
                          <div className="dropdownOption" onClick={() => setFilterBy("day")}>Day</div>
                          <div className="dropdownOption" onClick={() => setFilterBy("year")}>Yearly</div>
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
                        <BarChartComponent data={graphData} />
                      </div>
                      <div className="time-user"><span>Time</span></div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchantDashboard;
