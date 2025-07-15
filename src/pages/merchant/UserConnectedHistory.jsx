import React, { useContext, useState, useEffect } from "react";
import "./../../styles/styles.css";
// import axios from "axios";
// import bgEclipseImg from "./../../assets/images/merchant_list_bg_eclipse.png";
import ChatWindow from "../../components/ChatWindow";
import { PiEyeLight } from "react-icons/pi";
import axios from "axios";
import { BASE_URL } from "../../utils/apiManager";
import { AppContext } from "../../utils/context";
import PreLoader from "../../components/PreLoader";
import { CiCalendar, CiCircleInfo, CiSearch } from "react-icons/ci";
import { FaPowerOff, FaCircleUser } from "react-icons/fa6";
import { AiOutlineDelete } from "react-icons/ai";
import DashboardTopHeading from "../../components/DashboardTopHeading";
import DashBoardTopBar from "../../components/DashBoardTopBar";

const UserConnectedHistory = () => {
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [connectedHistory, setConnectedHistory] = useState([]);
  const [merchantDetails, setMerchantDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [connections, setConnections] = useState([]);

  const {
    token,
  } = useContext(AppContext);

  const toggleChatWindow = () => {
    setShowChatWindow(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const merchantId = localStorage.getItem("merchant_id");

      if (!merchantId) {
        console.error("No merchant_id in localStorage");
        return;
      }

      setLoading(true);

      try {
        const response = await axios.post(
          `${BASE_URL}/getConnectedUser`,
          { merchant_id: merchantId },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status) {
          setConnectedHistory(response.data.connectedHistory || []);
          setMerchantDetails(response.data.merchantDetails || []);
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error("API Error:", error);
      }

      setLoading(false);
    };

    fetchData();
  }, [token]);

  const getUserEmail = (merchant_id) => {
    const merchant = merchantDetails.find((m) => m.merchant_id === merchant_id);
    return merchant ? merchant.user_id : "N/A";
  };

  const getUserName = (merchant_id) => {
    const merchant = merchantDetails.find((m) => m.merchant_id === merchant_id);
    return merchant ? merchant.merchant_name : "N/A";
  };

  const getConnectedId = (merchant_id) => {
    const record = connectedHistory.find(
      (conn) => conn.user_id === merchant_id
    );
    return record ? record.connected_id : "N/A";
  };

  const handleViewClick = (connection) => {
    const connected_id = getConnectedId(connection.merchant_id);
    const enrichedConnection = { ...connection, connected_id };
    setSelectedConnection(enrichedConnection);
    setShowChatWindow(true);
  };



const handleDeleteClick = async (connection) => { 
  const confirmed = window.confirm('Are you sure you want to delete this connection?');
  const user_id = parseInt(connection.merchant_id, 10);
  const merchant_id = parseInt(localStorage.getItem("merchant_id"), 10);
  if (!confirmed) return;
  try {
    const response = await axios.post(
      `${BASE_URL}/merchantDeleteConnectedHistory`,
      {
        user_id: user_id,
        merchant_id: merchant_id, 
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log("dd.d,l,,,,,,,,,,,,,,,,,",response);

    if (response.data.status) {
        window.location.reload();
      } else {
        console.error("Deletion failed:", response.data.message);
        alert("Deletion failed: " + response.data.message);
      }
    } catch (error) {
      console.error("Deletion error:", error);
      alert("Something went wrong during Deletion.");
    }
};





  return (
    <div className="userConnectedHistoryPageWrapper">

      <DashBoardTopBar heading="User Connected History"/>

      <div className="userConnectedHistoryContainer">

        <div className="merchantContainerHeader">
          <div className="merchantHeaderTitle"><DashboardTopHeading text="User connected history Edit"/> </div>
        </div>

        <table className="tableContainer">
          <thead className="theadContainer">
            <tr>
              <th className="th">Created</th>
              <th className="th">Name</th>
              <th className="th">User email</th>
              <th className="thActions">Actions</th>
            </tr>
          </thead>
          <tbody className="tbodyContainer">
            {loading ? (
              <tr>
                <td colSpan="4" className="td" style={{ textAlign: "center", padding: "20px 0px", }}>
                  <PreLoader />
                </td>
              </tr>
            ) : merchantDetails.length === 0 ? (
              <tr>
                <td colSpan="4" className="td">
                  No connections found
                </td>
              </tr>
            ) : (
              merchantDetails.map((connection, index) => (
                <tr className="tr" key={index}>
                  <td className="td">
                    {new Date(connection.created_at).toLocaleString()}
                  </td>
                  <td className="td">
                    {getUserName(connection.merchant_id)}
                  </td>
                  <td className="td">
                    {getUserEmail(connection.merchant_id)}
                  </td>
                  <td className="actionTd">
                    <button className="viewButton" onClick={() => handleViewClick(connection)} data-bs-toggle="tooltip"
                        data-bs-placement="auto"
                        title="View Details">
                      <PiEyeLight size={22} color="white" />
                    </button>
                    <button  className="delButton" onClick={() => handleDeleteClick(connection)} data-bs-toggle="tooltip"
                        data-bs-placement="auto"
                        title="Delete">
                      <AiOutlineDelete size={22}  color="#E60E4E" style={{ cursor: "pointer" }}/>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showChatWindow && selectedConnection && (
        <ChatWindow
          onClose={toggleChatWindow}
          connection={selectedConnection}
          connectedHistory={connectedHistory}
          merchantDetails={merchantDetails}
        />
      )}
    </div>
  );
};

export default UserConnectedHistory;
