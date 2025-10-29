import React, { useContext, useState, useEffect } from "react";
import "./../../styles/styles.css";
// import axios from "axios";
// import bgEclipseImg from "./../../assets/images/merchant_list_bg_eclipse.png";
import ProviderChatWindow from "../../components/ProviderChatWindow";
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
import ConfirmModal from "../../components/ConfirmModal";
import ProviderDashboardTopBar from "../../components/ProviderDashboardTopBar";
import ConnectionRejectModal from "../../components/ConnectionRejectModal";

const ProvidersConnectedHistory = () => {
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [connectedHistory, setConnectedHistory] = useState([]);
  const [merchantDetails, setMerchantDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [connections, setConnections] = useState([]);
  const [personType, setPersonType] = useState("");

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedState, setSelectedState] = useState("");

  const {
    token,
  } = useContext(AppContext);

  const toggleChatWindow = () => {
    setShowChatWindow(false);
  };

  useEffect(() => {


    fetchData();
  }, [token]);

  const fetchData = async () => {
    const merchantId = localStorage.getItem("merchant_id");

    if (!merchantId) {
      console.error("No merchant_id in localStorage");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/getConnectedProvider`,
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

  const getUserEmail = (merchant_id) => {
    const merchant = merchantDetails.find((m) => m.merchant_id === merchant_id);
    return merchant ? merchant.user_id : "N/A";
  };

  const getUserName = (merchant_id) => {
    const merchant = merchantDetails.find((m) => m.merchant_id === merchant_id);
    return merchant ? merchant.merchant_name : "N/A";
  };

  const getConnectedId = (merchant_id) => {

    // console.log(".connectedHistoryconnectedHistoryconnectedHistoryconnectedHistory",connectedHistory);
    const record = connectedHistory.find(
      (conn) => conn.merchant_id === merchant_id
    );
    return record ? record.connected_id : "N/A";
  };

  const handleViewClick = (connection) => {

    // console.log("connection",connection);
    const connected_id = getConnectedId(connection.merchant_id);
    const enrichedConnection = { ...connection, connected_id };
    setSelectedConnection(enrichedConnection);
    setShowChatWindow(true);
  };

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleDeleteClick = (user_id) => {
    setSelectedUserId(user_id);
    setShowConfirmModal(true);
  };
const handleDelete = async (connection) => { 
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
      fetchData();
      }
    } catch (error) {
      setShowConfirmModal(false);
      setSelectedUserId(null);
    }
};


  useEffect(() => {
    const localPersonType = localStorage.getItem("person_type");
    if (localPersonType) {
      setPersonType(localPersonType);
    }
  }, []);


  const statusChange = async (connection, state) => {
    try {
      setLoading(true);
  
      // console.log("...........connection", connection.connected_id);
  
      let reason = null;
  
      // if (state === "declined") {
      //   reason = prompt("Please enter a reason for declining this connection:");
  
      //   // If user cancels or leaves empty, stop the function
      //   if (!reason) {
      //     alert("Decline reason is required.");
      //     setLoading(false);
      //     return;
      //   }
      // }
  
      if (state === "accepted") {
        reason = null;
      }
  
      const response = await axios.post(
        `${BASE_URL}/connectionStateChange`,
        {
          connected_id: connection.connected_id,
          state: state,
          reason: reason, 
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.status) {
        console.log("Status updated successfully:", response.data);
        // optionally refresh data
        fetchData();
      } else {
        console.error("Failed to update state:", response.data.message);
      }
    } catch (err) {
      console.error("Error changing status:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectClick = (connection, state) => {
    setSelectedConnection(connection);
    setSelectedState(state);
    setShowRejectModal(true);
  };
  


  return (
    <div className="userConnectedHistoryPageWrapper">

      <ProviderDashboardTopBar heading="Connected History" />
      {/* <ProviderDashboardTopBar heading={`${personType} Connected History`} /> */}

      <div className="userConnectedHistoryContainer">

        <div className="merchantContainerHeader">
          <div className="merchantHeaderTitle"><DashboardTopHeading text="Merchants Connected History"/> </div>
        </div>

        <div className="tableContainerWrap">
        <table className="tableContainer">
          <thead className="theadContainer">
            <tr>
              <th className="th">Created</th>
              <th className="th">Name</th>
              <th className="th">E-mails</th>
              <th className="thActions">Actions</th>
            </tr>
          </thead>
          <tbody className="tbodyContainer">
            {loading ? (
              <tr>
                <td
                  colSpan="4"
                  className="td"
                  style={{ textAlign: "center", padding: "20px 0px" }}
                >
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
              merchantDetails.map((connection, index) => {
                const history = connectedHistory[index];
                const state = history?.state;

                return (
                  <tr className="tr" key={index}>
                    {/* Created Date */}
                    <td className="td">
                      {history?.created_at
                        ? new Date(history.created_at).toLocaleString()
                        : "—"}
                    </td>

                    {/* Name */}
                    <td className="td">{getUserName(connection.merchant_id)}</td>

                    {/* Email */}
                    <td className="td">{getUserEmail(connection.merchant_id)}</td>

                    {/* Actions */}
                    <td className="actionTd">
                      {state === "accepted" ? (
                        <>
                          <button
                            className="viewButton"
                            onClick={() => handleViewClick(connection)}
                            data-bs-toggle="tooltip"
                            data-bs-placement="auto"
                            title="View Details"
                          >
                            <PiEyeLight size={22} color="white" />
                          </button>
                          <button
                            className="delButton"
                            onClick={() => handleDeleteClick(connection)}
                            data-bs-toggle="tooltip"
                            data-bs-placement="auto"
                            title="Delete"
                          >
                            <AiOutlineDelete
                              size={22}
                              color="#E60E4E"
                              style={{ cursor: "pointer" }}
                            />
                          </button>
                        </>
                      ) : state === "declined" ? (
                        <span className="declinedText">Declined</span>
                      ) : (
                        <>
                          <button
                            className="cancelBtn"
                            disabled={loading}
                            onClick={() => statusChange(connectedHistory[index], "accepted")}
                          >
                            {loading ? "..." : "Approve"}
                          </button>

                          <button
                            className="confirmBtn"
                            disabled={loading}
                            onClick={() => handleRejectClick(connectedHistory[index], "declined")}
                          >
                            {loading ? "..." : "Reject"}
                          </button>
                        </>
                      )}
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        </div>
      </div>

      {showChatWindow && selectedConnection && (
        <ProviderChatWindow
          onClose={toggleChatWindow}
          connection={selectedConnection}
          connectedHistory={connectedHistory}
          merchantDetails={merchantDetails}
        />
      )}

        {showConfirmModal && (
          <ConfirmModal
            title="Delete Connection"
            message="Are you sure you want to delete this connection?"
            onConfirm={handleDelete}
            onCancel={() => setShowConfirmModal(false)}
          />
        )}

        {showRejectModal && (
          <ConnectionRejectModal
            connection={selectedConnection} // ✅ pass object with connected_id

              // statusChange(selectedConnection, "declined"); // ✅ send reason here
            onCancel={() => setShowRejectModal(false)}
          />
        )}



    </div>
  );
};

export default ProvidersConnectedHistory;
