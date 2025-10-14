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
import ProviderDashboardTopBar from "../../components/ProviderDashboardTopBar";
import AreaChartComponent from "../../components/AreaChartComponent";

const ProvidersDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [graphLoading, setGraphLoading] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filterBy, setFilterBy] = useState("year");
  const [showDropdown, setShowDropdown] = useState(false);
  const { token } = useContext(AppContext);
  const [personType, setPersonType] = useState("");
  const [userChartData, setUserChartData] = useState([]);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const userChartProps = {
    id: "userColorUsers",
    xAXisDatakey: filterBy === "day" ? "day" : filterBy === "month" ? "month" : "year",
    areaDatakey: "Merchants",  // adjust this if API uses a different key
    data: graphData,
    primaryColor: "white",
    secondaryColor: "white",
    strokeColor: "#23b7e5",
  };

  const formatGraphData = (data, filter) => {
    return Object.entries(data).map(([key, value]) => ({

      month: key,
      Merchant_Services_Providers : value,
    }));
  };

  const fetchDashboardData = async () => {
    try {
      setGraphLoading(true);

      const person_type = localStorage.getItem("person_type");


      const merchantId = parseInt(localStorage.getItem("merchant_id"), 10);

      // console.log("merchantId....................",merchantId);
      // console.log("merchantId....................", merchantId, typeof merchantId);

      const body = {
        filter: filterBy,
        merchant_id: merchantId,
        person_type: person_type,
      };

      const response = await axios.post(
        `${BASE_URL}/providerUsersGraph`,
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
        // const formattedData = formatGraphData(rawGraphData, filterBy);
        // setGraphData(formattedData);
        let transformedData = [];

        const rawData = response.data.data || {};

              
        if (filterBy === "month") {
          // Sort the dates like "01 May", "02 May", ...
          const sortedDates = Object.keys(rawData).sort((a, b) => {
            const dayA = parseInt(a.split(" ")[0], 10);
            const dayB = parseInt(b.split(" ")[0], 10);
            return dayA - dayB;
          });
        
          transformedData = sortedDates.map(date => ({
            month: date,   // still use "month" key because xAXisDatakey is "month"
            Merchants: rawData[date] ?? 0
          }));
        } else if (filterBy === "day") {
          // Keep hours sorted (00:00 - 23:00)
          transformedData = Array.from({ length: 24 }, (_, i) => {
            const hour = String(i).padStart(2, "0") + ":00";
            return {
              day: hour,
              Merchants: rawData[hour] ?? 0,
            };
          });
        } else if (filterBy === "year") {
          // Convert years (e.g., {2020: x, 2021: y})
          transformedData = Object.entries(rawData).map(([year, Merchants]) => ({
            year,
            Merchants,
          }));
        }
      
        setGraphData(transformedData);
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
    <div className="merchantDashboardWrapper" onClick={() => setShowDropdown(false)}>

      <ProviderDashboardTopBar heading={`${formatPersonType(personType)} Dashboard`} />

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
                    Number of Merchants connected
                  </div>
                </div>

          <div className="merchantStatsSection row">
            <div className="col-md-12">
              <div className="userStatsSection">
                <div className="userStatsTopContainer">
                  <div className="userStatsTopLeft">
                    <div className="userStatsTitle">Number of Merchants</div>
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
                      <div className="number-of-provider">Number of Merchants</div>
                      <div className="graphContainer">
                        <AreaChartComponent data={graphData} {...userChartProps}/>
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

export default ProvidersDashboard;
