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
import placeholderimg from "../../assets/images/placeholderimg.jpg";
import { IMAGE_BASE_URL } from "../../utils/apiManager";

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
  // const [selectedUserId, setSelectedUserId] = useState(null);

  // const handleDeleteClick = (connection) => {
  //   setSelectedUserId(connection);
  //   setShowConfirmModal(true);
  // };

  const handleDeleteClick = (connection) => {
    setSelectedConnection(connection);  // ✅ correct state
    setShowConfirmModal(true);
  };
// const handleDelete = async (connection) => { 
//   const confirmed = window.confirm('Are you sure you want to delete this connection?');
//   const user_id = parseInt(connection.merchant_id, 10);
//   const merchant_id = parseInt(localStorage.getItem("merchant_id"), 10);
//   if (!confirmed) return;
//   try {
//     const response = await axios.post(
//       `${BASE_URL}/merchantDeleteConnectedHistory`,
//       {
//         user_id: user_id,
//         merchant_id: merchant_id, 
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     // console.log("dd.d,l,,,,,,,,,,,,,,,,,",response);

//     if (response.data.status) {
//       fetchData();
//       }
//     } catch (error) {
//       setShowConfirmModal(false);
//       setSelectedUserId(null);
//     }
// };

const handleDelete = async () => {
  if (!selectedConnection) return;

  const user_id = parseInt(selectedConnection.merchant_id, 10);
  const merchant_id = parseInt(localStorage.getItem("merchant_id"), 10);

  try {
    const response = await axios.post(
      `${BASE_URL}/merchantDeleteConnectedHistory`,
      {
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

    if (response.data.status) {
      fetchData();
      setShowConfirmModal(false);
      setSelectedConnection(null);
    }
  } catch (error) {
    console.error(error);
    setShowConfirmModal(false);
    setSelectedConnection(null);
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
        </table>

        <div className="tbodyContainer">
          <div className="accordion" id="accordionExample">
            {loading ? (
              <div>
                <div style={{ textAlign: "center", padding: "20px 0px" }}><PreLoader /></div>
              </div>
            ) : merchantDetails.length === 0 ? (
              <div>
                <div>No connections found</div>
              </div>
            ) : (
              merchantDetails.map((connection, index) => {
                const history = connectedHistory[index];
                const state = history?.state;
                // console.log("..........connection.........",connection);
                return (
                  <div className="accordion-item" key={index}>

                  	<h2 className="accordion-header" id={`heading${index}`}>
                        <div
                          className={`accordion-button ${
                            index !== 0 ? "collapsed" : ""
                          }`}
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapse${index}`}
                          aria-expanded={index === 0 ? "true" : "false"}
                          aria-controls={`collapse${index}`}
                        >
                          <div className="td">
                            {history?.created_at
		                        ? new Date(history.created_at).toLocaleString()
		                        : "—"}
                          </div>
                          <div className="td">
                            {getUserName(connection.merchant_id)}
                          </div>
                          <div className="td">
                            {getUserEmail(connection.merchant_id)}
                          </div>

                          <div className="userBtn">
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
                          </div>
                        </div>
                      </h2>


                      <div
                        id={`collapse${index}`}
                        className={`accordion-collapse collapse ${
                          index === 0 ? "show" : ""
                        }`}
                        aria-labelledby={`heading${index}`}
                        data-bs-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          <div className="merchantContainerHeader">
                              <div className="merchantHeaderTitle">
                                <DashboardTopHeading text="Company Information" />{" "}
                              </div>
                            </div>
                          <div className="profileDetailsCon">
                            <div className="profileDetailsConHead">
                              <div className="userHeaderInfoTopWrap d-flex">

                                

                                <div className="userHeaderInfoTopCon">
                                  

                                  <div className="inputWrapCon company_area">
                                    <div className="userImg order-2"><img src={
                                      connection.logo && connection.logo.trim() !== ""
                                        ? `${IMAGE_BASE_URL}/${connection.logo}`
                                        : placeholderimg
                                    } /></div>
                                    <div className="usercompany order-1">
                                      <div className="titleField">Company Name *</div>
                                      <div className="titleData" title={connection?.company_name}>{connection?.company_name}</div>
                                    </div>
                                  </div>

                                  <div className="inputWrapCon company_area_details">  
                                    <h3 className="titleField">Company Mailing Address *</h3>
                                    <div className="company_details_row">
                                      <h5>Street Details</h5>
                                      <div className="companydata" title={connection?.city}>{connection?.city}</div>
                                    </div>
                                    <div className="company_details_row cell_format">
                                      <div className="company_cell">
                                        <h5>City:</h5>
                                        <div className="companydata" title={connection?.city}>{connection?.city}</div>
                                      </div>
                                      <div className="company_cell">
                                        <h5>State:</h5>
                                        <div className="companydata" title={connection?.state}>{connection?.state}</div>
                                      </div>                                      
                                      <div className="company_cell companycountry">
                                        <h5>Country:</h5>
                                        <div className="companydata">US</div>
                                      </div>                                      
                                      <div className="company_cell companyzip">
                                        <h5>Zip:</h5>
                                        <div className="companydata" title={connection?.zip_code}>{connection?.zip_code}</div>
                                      </div>                                      
                                      <div className="company_cell companyphone">
                                        <h5>Phone:</h5>
                                        <div className="companydata" title={connection?.phone}>{connection?.phone}</div>
                                      </div>                                      
                                      <div className="company_cell companyemail">
                                        <h5>Email:</h5>
                                        <div className="companydata" title={getUserEmail(connection.merchant_id)}>{getUserEmail(connection.merchant_id)}</div>
                                      </div>                                      
                                      <div className="company_cell companyweb">
                                        <h5>Website:</h5>
                                        <div className="companydata" title={connection?.website}>{connection?.website}</div>
                                      </div>
                                    </div>
                                  </div>

                                </div>
                              </div>

                              <div className="inputWrapCon company_description">
                                <div className="titleField">Company Description</div>
                                <div className="titleData" title={connection?.company_description}>{connection?.company_description}</div>
                              </div>

                            </div>
                          </div>
                        </div>
                      </div>


                    

                  </div>
                );
              })
            )}
          </div>
        </div>






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
