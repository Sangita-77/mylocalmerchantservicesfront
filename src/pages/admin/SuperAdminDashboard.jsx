import React, { useContext, useState , useEffect } from "react";
import "./../../styles/styles.css";
import { FaPowerOff } from "react-icons/fa6";
import { FaCircleUser } from "react-icons/fa6";
import { CiCalendar, CiCircleInfo, CiSearch } from "react-icons/ci";
// import { FiUsers } from "react-icons/fi";
import { HiUserGroup } from "react-icons/hi";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { IoStorefrontSharp } from "react-icons/io5";
import { MdRealEstateAgent } from "react-icons/md";
import { FaLongArrowAltRight } from "react-icons/fa";
import { BiSolidBadgeDollar } from "react-icons/bi";
import { GiDividedSquare } from "react-icons/gi";
import AreaChartComponent from "../../components/AreaChartComponent";
import PreLoader from "../../components/PreLoader";
import PieChartComponent from "../../components/PieChartComponent";
import { TbArrowBigUpLineFilled } from "react-icons/tb";
import { PiEyeLight } from "react-icons/pi";
import BarChartComponent from "../../components/BarChartComponent";
import CircularProgressBar from "../../components/CircularProgressBar";
import TinyLineChartComponent from "../../components/TinyLineChartComponent";
import ChatWindow from "../../components/ChatWindow";
import MessagesWindow from "../../components/MessagesWindow";
import axios from "axios";
import { BASE_URL } from "../../utils/apiManager";
import { AppContext } from "../../utils/context";
import AdminDashBoardTopBar from "../../components/AdminDashBoardTopBar";
import DashBoardFooter from "../../components/DashBoardFooter";
import { useNavigate } from "react-router-dom";
import { routes } from "../../utils/routes";

const SuperAdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [countData, setCountData] = useState({});
  const [ConnectData, setConnectData] = useState({});
  const [graphLoading, setGraphLoading] = useState(false);
  const [dataKey, setDataKey] = useState("month");
  const [graphData, setGraphData] = useState(null);
  const [totalCount, setTotalCount] = useState("");
  const [yearlyCount, setYearlyCount] = useState("");
  const [monthlyCount, setMonthlyCount] = useState("");
  const [weeklyCount, setWeeklyCount] = useState("");
  const [showUserFilterDropdown, setShowUserFilterDropdown] = useState(false);
  const [showMerchantFilterDropdown, setShowMerchantFilterDropdown] =
    useState(false);
  const [userFilterBy, setUserFilterBy] = useState("year");
  const [merchantFilterBy, setMerchantFilterBy] = useState("year");
  const [connectedHistoryFilter, setConnectedHistoryFilter] = useState("month");
  const [error, setError] = useState(null);
  const [showWindow, setShowChatWindow] = useState(false);
  const [merchantTypeActiveTab, setMerchantTypeActiveTab] = useState(0);
  const [chatData, setChatData] = useState([]); // for storing chats
  const [selectedChatInfo, setSelectedChatInfo] = useState(null); 
  const [loadingChatId, setLoadingChatId] = useState(null);
  const [userPercentageData, setUserPercentageData] = useState(null);
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({
    userCount: 0,
    otherCount: 0,
    userPercentage: 0,
    otherPercentage: 0,
    chartData: null,
  });
  const [userChartData, setUserChartData] = useState([]);
  const [merchantGraphData, setMerchantGraphData] = useState([]);

  const getMerchantType = () => {
    switch (merchantTypeActiveTab) {
      case 0:
        return "merchant services providers";
      case 1:
        return "processors";
      case 2:
        return "ISOs";
      case 3:
        return "agents";
      default:
        return "merchant services providers";
    }
  };
  const [percentages, setPercentages] = useState(null);



  const arr = [0, 1, 2, 4, 5, 6];

  const percentage = 65;
  const radius = 50;
  const stroke = 10;

  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const { token } = useContext(AppContext);

  useEffect(() => {
    fetchCounts();
  }, []);
  
  useEffect(() => {
    fetchConnectedHistory();
  }, [connectedHistoryFilter]);  

  useEffect(() => {
    fetchUserPercentage();
  }, []);

  useEffect(() => {
    fetchUserGraphData(userFilterBy);
  }, [userFilterBy]);

  const fetchCounts = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/getAllCounts`,
        {}, // if your POST needs a body, otherwise you can keep empty object
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // make sure token is defined in your component
          },
        }
      );
  
      if (res.data.status) {
        setCountData(res.data);
      }
    } catch (error) {
      console.error("Error fetching counts:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchConnectedHistory = async () => {
    try {
      const body = { filter: connectedHistoryFilter }; // use current filter
      const res = await axios.post(
        `${BASE_URL}/getConnectedHistory`,
        JSON.stringify(body),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (res.data.status) {
        // console.log("API Response:", res.data); // check this in console
        setConnectData(res.data); // update state
      } else {
        setConnectData({ connect: [] }); // fallback in case of empty response
      }
    } catch (error) {
      console.error("Error fetching connected history:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleViewChat = async (connected_id, user_id, merchant_id) => {
    try {
      setLoadingChatId(connected_id); // show loader on the button being clicked
      const res = await axios.post(
        `${BASE_URL}/getChat`,
        {
          connected_id,
          user_id,
          merchant_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (res.data.status) {
        setChatData(res.data);
        setSelectedChatInfo({
          connected_id,
          user_id,
          merchant_id,
          merchant_name: res.data.merchant?.merchant_name,
        });
        setShowChatWindow(true);
      }
    } catch (error) {
      console.error("Error fetching chat:", error);
    } finally {
      setLoadingChatId(null); // hide button loader after chat fetch
    }
  };
  const fetchUserPercentage = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/perchantageOfUsers`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (res.data.status) {
        setUserStats({
          userCount: res.data.user_count || 0,
          otherCount: res.data.other_count || 0,
          userPercentage: res.data.user_percentage || 0,
          otherPercentage: res.data.other_percentage || 0,
          chartData: [
            {
              name: "Users",
              value: parseFloat((res.data.user_percentage || 0).toFixed(2)),
            },
            {
              name: "Others",
              value: parseFloat((res.data.other_percentage || 0).toFixed(2)),
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching user percentage data:", error);
    }
  };

  const fetchUserGraphData = async (filterType = "year") => {
    setGraphLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/merchantsGraph`,
        {
          filter: filterType,
          type: "user",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // replace with your actual token source
          },
        }
      );
  
      if (response.data.status) {
        const rawData = response.data.data || {};
        let transformedData = [];
      
        if (filterType === "month") {
          // Sort the dates like "01 May", "02 May", ...
          const sortedDates = Object.keys(rawData).sort((a, b) => {
            const dayA = parseInt(a.split(" ")[0], 10);
            const dayB = parseInt(b.split(" ")[0], 10);
            return dayA - dayB;
          });
        
          transformedData = sortedDates.map(date => ({
            month: date,   // still use "month" key because xAXisDatakey is "month"
            users: rawData[date] ?? 0
          }));
        } else if (filterType === "day") {
          // Keep hours sorted (00:00 - 23:00)
          transformedData = Array.from({ length: 24 }, (_, i) => {
            const hour = String(i).padStart(2, "0") + ":00";
            return {
              day: hour,
              users: rawData[hour] ?? 0,
            };
          });
        } else if (filterType === "year") {
          // Convert years (e.g., {2020: x, 2021: y})
          transformedData = Object.entries(rawData).map(([year, users]) => ({
            year,
            users,
          }));
        }
      
        setUserChartData(transformedData);
      }
      
    } catch (error) {
      console.error("Error fetching user graph data:", error);
    } finally {
      setGraphLoading(false);
    }
  };

  useEffect(() => {
    if (!merchantFilterBy) return;
  
    const fetchMerchantGraph = async () => {
      try {
        setGraphLoading(true);
    
        const filterType = merchantFilterBy;
        const type = getMerchantType(); // get based on active tab
    
        const response = await axios.post(
          `${BASE_URL}/merchantsGraph`,
          {
            filter: filterType,
            type: type,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        const rawData = response.data.data;
    
        let formatted = [];
    
        if (filterType === "month") {
          const sortedKeys = Object.keys(rawData).sort((a, b) => {
            const dayA = parseInt(a.split(" ")[0], 10);
            const dayB = parseInt(b.split(" ")[0], 10);
            return dayA - dayB;
          });
    
          formatted = sortedKeys.map((key) => ({
            month: key,
            merchants: rawData[key] ?? 0,
          }));
        } else {
          formatted = Object.entries(rawData).map(([key, val]) => ({
            month: key,
            merchants: val ?? 0,
          }));
        }
    
        setMerchantGraphData(formatted);
      } catch (error) {
        console.error("Error fetching merchant graph data", error);
      } finally {
        setGraphLoading(false);
      }
    };
    
  
    fetchMerchantGraph();
  }, [merchantFilterBy, merchantTypeActiveTab]);

  useEffect(() => {
    const fetchPercentages = async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}/perchantageOfAllKindOfUsers`,
          {
           
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.status) {
          setPercentages(response.data);
        }
      } catch (error) {
        console.error("Error fetching percentage data", error);
      }
    };

    fetchPercentages();
  }, []);

  const PercentageItem = ({ label, percentage, last = false }) => (
    <div
      className="percentageCountItem"
      style={last ? { borderBottom: "none" } : {}}
    >
      <div className="percentageColorBox"></div>
      <div className="percentageCountItemContent">{label}</div>
      <CircularProgressBar percentage={parseFloat(percentage.toFixed(1))} />
    </div>
  );
  // const handleLogout = async () => {
  //   try {
  //     const response = await axios.post(
  //       `${BASE_URL}/logoutM`,
  //       {
  //         user_id: localStorage.getItem("user_id"),
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  
  //     if (response.data.status) {
  //       // Logout successful, reload the page
  //       window.location.reload();
  //     } else {
  //       console.error("Logout failed:", response.data.message);
  //       alert("Logout failed: " + response.data.message);
  //     }
  //   } catch (error) {
  //     console.error("Logout error:", error);
  //     alert("Something went wrong during logout.");
  //   }
  // };
  
  
  
  
  
  
  


  const data = [
    { month: "Jan", users: 150 },
    { month: "Feb", users: 562 },
    { month: "Mar", users: 458 },
    { month: "Apr", users: 752 },
    { month: "May", users: 1556 },
    { month: "Jun", users: 1935 },
    { month: "Jul", users: 725 },
    { month: "Aug", users: 1500 },
    { month: "Sep", users: 1200 },
    { month: "Oct", users: 1236 },
    { month: "Nov", users: 600 },
    { month: "Dec", users: 700 },
  ];

  const userChartProps = {
    id: "userColorUsers",
    xAXisDatakey: userFilterBy === "day" ? "day" : userFilterBy === "month" ? "month" : "year",
    areaDatakey: "users",  // adjust this if API uses a different key
    data: userChartData,
    primaryColor: "white",
    secondaryColor: "white",
    strokeColor: "#23b7e5",
  };
  

  const toggleUserFilterDropdown = (e) => {
    e.stopPropagation();
    setShowUserFilterDropdown(!showUserFilterDropdown);
  };

  const toggleMerchantFilterDropdown = (e) => {
    e.stopPropagation();
    setShowMerchantFilterDropdown(!showMerchantFilterDropdown);
  };

  const toggleCloseAllDropdown = () => {
    setShowMerchantFilterDropdown(false);
    setShowUserFilterDropdown(false);
  };

  return (
    <div
      className="adminDashboardWrapper"
      onClick={() => toggleCloseAllDropdown()}
    >
      <AdminDashBoardTopBar heading="Super Admin Dashboard" />
      <div className="adminDashboardContainer">
        

        <div className="adminDashboardMain">
          <div className="adminDashboardCountContainer">
            <div className="adminDashboardCountPlate">
              <div className="countPlateIconContainer">
                <HiUserGroup color="gray" size={45} />
              </div>
              <div className="countPlateRightContainer">
                <div className="countPlatetHeading">Number of users</div>
                <div className="countPlateNumber">{countData?.totalUsers ?? "Loading..."}</div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(routes.admin_user_list())}
                >
                  View All <FaLongArrowAltRight />
                </div>
              </div>
            </div>

            <div className="adminDashboardCountPlate">
              <div className="countPlateIconContainer">
                <IoStorefrontSharp  color="#599CB0" size={45} />
              </div>
              <div className="countPlateRightContainer">
                <div className="countPlatetHeading">Approved Merchant</div>
                <div className="countPlateNumber">{countData?.totalMerchantApproved ?? "Loading..."}</div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(routes. admin_merchant_list())}
                >
                  View All <FaLongArrowAltRight />
                </div>
              </div>
            </div>

            <div className="adminDashboardCountPlate">
              <div className="countPlateIconContainer">
                <IoStorefrontSharp  color="#4E688C" size={45} />
              </div>
              <div className="countPlateRightContainer">
                <div className="countPlatetHeading">Pending Merchant</div>
                <div className="countPlateNumber">{countData?.totalMerchantPending ?? "Loading..."}</div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(routes. admin_merchant_list())}
                >
                  View All <FaLongArrowAltRight />
                </div>
              </div>
            </div>

            <div className="adminDashboardCountPlate">
              <div className="countPlateIconContainer">
                <MdRealEstateAgent color="#E0A54F" size={45} />
              </div>
              <div className="countPlateRightContainer">
                <div className="countPlatetHeading">Approved Agent</div>
                <div className="countPlateNumber">{countData?.totalAgentApproved ?? "Loading..."}</div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(routes. admin_agent())}
                >
                  View All <FaLongArrowAltRight />
                </div>
              </div>
            </div>

            <div className="adminDashboardCountPlate">
              <div className="countPlateIconContainer">
                <MdRealEstateAgent color="#EB7581" size={45} />
              </div>
              <div className="countPlateRightContainer">
                <div className="countPlatetHeading">Pending Agent</div>
                <div className="countPlateNumber">{countData?.totalAgentPending ?? "Loading..."}</div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(routes. admin_agent())}
                >
                  View All <FaLongArrowAltRight />
                </div>
              </div>
            </div>

            <div className="adminDashboardCountPlate">
              <div className="countPlateIconContainer">
                <BiSolidBadgeDollar color="#268BCB" size={45} />
              </div>
              <div className="countPlateRightContainer">
                <div className="countPlatetHeading">Approved ISOs</div>
                <div className="countPlateNumber">{countData?.totalISOsApproved ?? "Loading..."}</div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(routes. admin_iso())}
                >
                  View All <FaLongArrowAltRight />
                </div>
              </div>
            </div>

            <div className="adminDashboardCountPlate">
              <div className="countPlateIconContainer">
                <BiSolidBadgeDollar color="#3DB255" size={45} />
              </div>
              <div className="countPlateRightContainer">
                <div className="countPlatetHeading">Pending ISOs</div>
                <div className="countPlateNumber">{countData?.totalISOsPending ?? "Loading..."}</div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(routes. admin_iso())}
                >
                  View All <FaLongArrowAltRight />
                </div>
              </div>
            </div>

            <div className="adminDashboardCountPlate">
              <div className="countPlateIconContainer">
                <GiDividedSquare color="#4F7FBE" size={42} />
              </div>
              <div className="countPlateRightContainer">
                <div className="countPlatetHeading">Approved Processors</div>
                <div className="countPlateNumber">{countData?.totalProcessorsApproved ?? "Loading..."}</div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(routes. admin_processor())}
                >
                  View All <FaLongArrowAltRight />
                </div>
              </div>
            </div>

            <div className="adminDashboardCountPlate">
              <div className="countPlateIconContainer">
                <GiDividedSquare color="#41B9C8" size={45} />
              </div>
              <div className="countPlateRightContainer">
                <div className="countPlatetHeading">Pending Processors</div>
                <div className="countPlateNumber">{countData?.totalProcessorsPending ?? "Loading..."}</div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(routes. admin_processor())}
                >
                  View All <FaLongArrowAltRight />
                </div>
              </div>
            </div>
          </div>

          <div className="dashboardRow">
            <div className="adminDashboardUserSection">
              <div className="userStatsSection">
                <div className="userStatsTopContainer">
                  <div className="userStatsTopLeft">
                    <div className="userStatsTitle">Number of Users</div>
                    <div className="userStatsValue">{userStats.userCount ?? "Loading..."}</div>
                  </div>

                  <div className="userStatsTopRight">
                    <div className="userGraphFilterTitle">
                      Select Time Range:{" "}
                    </div>
                    <div
                      className="chartDropdownContainer"
                      onClick={(e) => toggleUserFilterDropdown(e)}
                    >
                      <div className="chartDropdown">
                        <div>
                          {userFilterBy ? userFilterBy : "Select Time ▾"}
                        </div>
                        <CiCalendar
                          size={20}
                          color="white"
                          onClick={() => setShowUserFilterDropdown(true)}
                        />
                      </div>
                      {showUserFilterDropdown === true && (
                        <div className="dropdownOptions">
                          <div
                            className="dropdownOption"
                            onClick={() => {
                              setUserFilterBy("month");
                              setShowUserFilterDropdown(false);
                            }}
                          >
                            Monthly
                          </div>
                          <div
                            className="dropdownOption"
                            onClick={() => {
                              setUserFilterBy("day");
                              setShowUserFilterDropdown(false);
                            }}
                          >
                            Daily
                          </div>
                          <div
                            className="dropdownOption"
                            onClick={() => {
                              setUserFilterBy("year");
                              setShowUserFilterDropdown(false);
                            }}
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
                        <div className="userGraphRight"></div>
                      </div>

                      <div className="graphContainer">
                        {graphLoading ? (
                          <div className="graphLoaderContainer">
                            <PreLoader />
                            <div className="graphLoadingText">Loading graph...</div>
                          </div>
                        ) : userChartData.length > 0 ? (
                          <AreaChartComponent key={userFilterBy} {...userChartProps} />
                        ) : (
                          <div className="graphLoadingText">No data available.</div>
                        )}

                      </div>

                    </>
                  )}
                </div>
              </div>
            </div>

            
            <div className="adminDashboardPieChartSection">
              <div className="adminDashboardPieChart">
              <div className="pieChartTitle">Statistics</div>

              <div className="colorDefineContainer">
                <div className="colorDefineSingleItem">
                  <div className="colorBox"></div>
                  <div className="colorBoxTitle">USER</div>
                </div>
                <div className="colorDefineSingleItem">
                  <div
                    className="colorBox"
                    style={{ backgroundColor: "#71cdea" }}
                  ></div>
                  <div className="colorBoxTitle">MERCHANT</div>
                </div>
              </div>





              {userStats.chartData && (
                <div className="userPieChartContainer">
                  <h3 className="chartTitle">User Distribution</h3>
                  <PieChartComponent
                    data={userStats.chartData}
                    dataKey="value"
                    nameKey="name"
                    colors={["#71cdea", "#bcbfc5"]}
                  />
                </div>
              )}

              <div className="bottomStatisticsCountCntainer">
                <div className="statisticsCountItem">
                  <div className="statisticsCount">{userStats.otherCount ?? "Loading..."}</div>
                  <div className="statisticsCountTitle">Total Merchant</div>
                  <div className="statisticsPercentage">
                    <TbArrowBigUpLineFilled size={12} color="#25C95F" /> {" "}
                    +{userStats.otherPercentage.toFixed(1)}%
                  </div>
                </div>
                <div className="divider"></div>
                <div className="statisticsCountItem">
                  <div className="statisticsCount">{userStats.userCount ?? "Loading..."}</div>
                  <div className="statisticsCountTitle">Total User</div>
                  <div className="statisticsPercentage">
                    <TbArrowBigUpLineFilled size={12} color="#25C95F" /> {" "}
                    +{userStats.userPercentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
         </div>
          </div>

          <div className="adminDashboardConversationHistorySection">
            <div className="adminDashboardConversationHistoryWrap">
            <div className="tableHeader">
              <div className="tableHeaderLeft">
                <div className="tableTitle">Connected History</div>
                {/* <div className="filterBy">Day list</div> */}
              </div>

              <div className="tableHeaderRight">
                <div
                  className={`tablefilter ${
                    connectedHistoryFilter === "day" && "tablefilterActive"
                  }`}
                  onClick={() => setConnectedHistoryFilter("day")}
                >
                  Day
                </div>
                <div
                  className={`tablefilter ${
                    connectedHistoryFilter === "week" && "tablefilterActive"
                  }`}
                  onClick={() => setConnectedHistoryFilter("week")}
                >
                  Week
                </div>
                <div
                  className={`tablefilter ${
                    connectedHistoryFilter === "month" && "tablefilterActive"
                  }`}
                  onClick={() => setConnectedHistoryFilter("month")}
                >
                  Month
                </div>
              </div>
            </div>

            <table className="tableContainer">
              <thead className="theadContainer">
                <tr>
                  <th className="th">User name</th>
                  <th className="th">User email</th>
                  <th className="th">Connected Merchant</th>
                  <th className="th">Merchant Email</th>
                  <th className="thActions">Actions</th>
                </tr>
              </thead>
              <tbody className="tbodyContainer">
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                      <div className="table-loader">
                        <div className="spinner" />
                          {/* <PreLoader />
                          <div>Loading data...</div> */}
                      </div>
                    </td>
                  </tr>
                ) : Array.isArray(ConnectData.connect) && ConnectData.connect.length > 0 ? (
                  ConnectData.connect.map((item, i) => (
                    <tr className="tr" key={i}>
                      <td className="td">{item.user?.merchant_name || "N/A"}</td>
                      <td className="td">{item.user?.user_id || "N/A"}</td>
                      <td className="td">{item.merchant?.merchant_name || "N/A"}</td>
                      <td className="td">{item.merchant?.user_id || "N/A"}</td>
                      <td className="actionTd">
                      <button
                          className="viewButton"
                          disabled={loadingChatId === item.connected_id}
                          onClick={() =>
                            handleViewChat(item.connected_id, item.user_id, item.merchant_id)
                          }
                        >
                          {loadingChatId === item.connected_id ? (
                            <div className="spinner" style={{ width: "16px", height: "16px" }} />
                          ) : (
                            "View"
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="tr">
                    <td className="td" colSpan="5" style={{ textAlign: "center" }}>
                      No connected history found for {connectedHistoryFilter}.
                    </td>
                  </tr>
                )}
              </tbody>


            </table>

          </div>
          </div>

          <div className="dashboardRow">
            <div className="adminDashboardMerchantSection">
              <div className="merchantSectionTopTabbar">
                <div className={`tabbarItem ${merchantTypeActiveTab === 0 && "tabbarItemActive"}`} onClick={() => setMerchantTypeActiveTab(0)}>
                  Merchant Service Providers
                </div>
                <div className={`tabbarItem ${merchantTypeActiveTab === 1 && "tabbarItemActive"}`} onClick={() => setMerchantTypeActiveTab(1)}>Processors</div>
                <div className={`tabbarItem ${merchantTypeActiveTab === 2 && "tabbarItemActive"}`} onClick={() => setMerchantTypeActiveTab(2)}>ISOs</div>
                <div className={`tabbarItem ${merchantTypeActiveTab === 3 && "tabbarItemActive"}`} onClick={() => setMerchantTypeActiveTab(3)}>Agents</div>
              </div>

              <div className="merchantStatsSection">
                <div className="userStatsTopContainer">
                  <div className="userStatsTopLeft">
                    <div className="userStatsTitle">Number of Merchant</div>
                    <div className="userStatsValue">{userStats.otherCount ?? "Loading..."}</div>
                  </div>

                  <div className="userStatsTopRight">
                    <div className="userGraphFilterTitle">
                      Select Time Range:{" "}
                    </div>
                    <div
                      className="chartDropdownContainer"
                      onClick={(e) => toggleMerchantFilterDropdown(e)}
                    >
                      <div className="chartDropdown">
                        <div>
                          {merchantFilterBy
                            ? merchantFilterBy
                            : "Select Time ▾"}
                        </div>
                        <CiCalendar
                          size={20}
                          color="white"
                          onClick={() => setShowMerchantFilterDropdown(true)}
                        />
                      </div>
                      {showMerchantFilterDropdown === true && (
                        <div className="dropdownOptions">
                          <div
                            className="dropdownOption"
                            onClick={() => setMerchantFilterBy("month")}
                          >
                            Monthly
                          </div>
                          <div
                            className="dropdownOption"
                            onClick={() => setMerchantFilterBy("day")}
                          >
                            Daily
                          </div>
                          <div
                            className="dropdownOption"
                            onClick={() => setMerchantFilterBy("year")}
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
                        <div className="userGraphRight"></div>
                      </div>

                      <div className="graphContainer">
                        <BarChartComponent data={merchantGraphData} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="dashboardMerchantStatsRight">
              <div className="percentageCountSection">
                <div className="percentageCountHeader">Percentage % Of Active</div>

                {percentages && (
                  <>
                    <PercentageItem label="% Of Users" percentage={percentages.user_percentage} />
                    <PercentageItem label="% Of Merchants" percentage={percentages.merchant_percentage} />
                    <PercentageItem label="% Of Processors" percentage={percentages.processors_percentage} />
                    <PercentageItem label="% Of ISOs" percentage={percentages.iso_percentage} />
                    <PercentageItem label="% Of Agents" percentage={percentages.agents_percentage} last />
                  </>
                )}
              </div>

              <div className="connectedGraphSection">
                <div className="connectedGraphSectionHeader">
                  <div>User connected</div>
                  <div>{userStats.userCount ?? "Loading..."}</div>
                </div>

                <div className="statisticsPercentage">
                  <TbArrowBigUpLineFilled size={12} color="#25C95F" /> {" "}
                  +{userStats.userPercentage.toFixed(1)}%
                </div>

                <div>
                  <TinyLineChartComponent />
                </div>
              </div>
            </div>
          </div>
        </div>

        <DashBoardFooter />
      </div>
      {showWindow && (
      <MessagesWindow
        chatData={chatData}
        onClose={() => setShowChatWindow(false)}
        selectedInfo={selectedChatInfo}
      />
    )}
    </div>
  );
};

export default SuperAdminDashboard;
