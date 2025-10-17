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
import ConfirmModal from "../../components/ConfirmModal";

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
        // console.log("........response.data.connectedHistory............",response.data.connectedHistory);
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





  return (
    <div className="userConnectedHistoryPageWrapper">

      <DashBoardTopBar heading="Connected History"/>

      <div className="userConnectedHistoryContainer">

        <div className="merchantContainerHeader">
          <div className="merchantHeaderTitle"><DashboardTopHeading text="Merchant Services Providers Connected History"/> </div>
        </div>

        {/* --------- old design  */}
        <div className="tableContainerWrap">
          <table className="tableContainer">
            <thead className="theadContainer">
              <tr>
                <th className="th">Created</th>
                <th className="th">Name</th>
                <th className="th">E-mails</th>
                <th className="th">Actions</th>
              </tr>
            </thead>
            <tbody className="tbodyContainer">
              {loading ? (
                <tr>
                  <td colSpan="4" className="td" style={{ textAlign: "center", padding: "20px 0px" }}>
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
                        ) : (
                          <span className={`statusText status-${state}`}>
                            {state
                              ? state.charAt(0).toUpperCase() + state.slice(1)
                              : "—"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

          </table>
        </div>
        {/* --------- old design  */}

        {/* --------- New design  */}
        <div className="tableContainerWrap">
          <table className="tableContainer">
            <thead className="theadContainer">
              <tr>
                <th className="th">Created</th>
                <th className="th">Name</th>
                <th className="th">E-mails</th>
                <th className="th">Actions</th>
              </tr>
            </thead>
            </table>
            <div className="tbodyContainer">
            <div className="accordion" id="accordionExample">
              {loading ? (
                <div>
                  <div style={{ textAlign: "center", padding: "20px 0px" }}>
                    <PreLoader />
                  </div>
                </div>
              ) : merchantDetails.length === 0 ? (
                <div>
                  <div>
                    No connections found
                  </div>
                </div>
              ) : (
                merchantDetails.map((connection, index) => {
                  const history = connectedHistory[index];
                  const state = history?.state;

                  return (
                    
                    
                    // <tr className="tr" key={index}>
                      
                    //   <td className="td">
                    //     {history?.created_at
                    //       ? new Date(history.created_at).toLocaleString()
                    //       : "—"}
                    //   </td>

                      
                    //   <td className="td">{getUserName(connection.merchant_id)}</td>

                      
                    //   <td className="td">{getUserEmail(connection.merchant_id)}</td>


                    //   <td className="actionTd">
                    //     {state === "accepted" ? (
                    //       <>
                    //         <button
                    //           className="viewButton"
                    //           onClick={() => handleViewClick(connection)}
                    //           data-bs-toggle="tooltip"
                    //           data-bs-placement="auto"
                    //           title="View Details"
                    //         >
                    //           <PiEyeLight size={22} color="white" />
                    //         </button>
                    //         <button
                    //           className="delButton"
                    //           onClick={() => handleDeleteClick(connection)}
                    //           data-bs-toggle="tooltip"
                    //           data-bs-placement="auto"
                    //           title="Delete"
                    //         >
                    //           <AiOutlineDelete
                    //             size={22}
                    //             color="#E60E4E"
                    //             style={{ cursor: "pointer" }}
                    //           />
                    //         </button>
                    //       </>
                    //     ) : (
                    //       <span className={`statusText status-${state}`}>
                    //         {state
                    //           ? state.charAt(0).toUpperCase() + state.slice(1)
                    //           : "—"}
                    //       </span>
                    //     )}
                    //   </td>
                    // </tr>

                    // <div className="accordion" id="accordionExample">
                    <div className="accordion-item">
                      <h2 className="accordion-header" id={`heading${index}`}>
                        <button className={`accordion-button ${index !== 0 ? 'collapsed' : ''}`}
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapse${index}`}
                          aria-expanded={index === 0 ? "true" : "false"}
                          aria-controls={`collapse${index}`}>
                          
                          <div className="td">
                            {history?.created_at
                              ? new Date(history.created_at).toLocaleString()
                              : "—"}
                          </div>
                          <div className="td">{getUserName(connection.merchant_id)}</div>
                          <div className="td">{getUserEmail(connection.merchant_id)}</div>
                        </button>
                      </h2>
                      <div id={`collapse${index}`}
                        className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                        aria-labelledby={`heading${index}`}
                        data-bs-parent="#accordionExample">
                        <div className="accordion-body"> 
                          <strong>This is the second item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                        </div>
                      </div>
                    </div>
                      
                    // </div> //gg
                  
                  );
                })
              )}
            </div></div>

          {/* </table> */}
        </div>
        {/* --------- New design  */}
      </div>

      {showChatWindow && selectedConnection && (
        <ChatWindow
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
    </div>
  );
};

export default UserConnectedHistory;
