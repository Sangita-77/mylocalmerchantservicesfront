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
import placeholderimg from "../../assets/images/placeholderimg.jpg";
import { IMAGE_BASE_URL } from "../../utils/apiManager";

const UserConnectedHistory = () => {
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [connectedHistory, setConnectedHistory] = useState([]);
  const [merchantDetails, setMerchantDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [connections, setConnections] = useState([]);

  const { token } = useContext(AppContext);

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
        // console.log("........response.data.connectedHistory............",response.data);
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

  // const getUserCompanyname = (merchant_id) => {
  //   const merchant = merchantDetails.find((m) => m.merchant_id == merchant_id); // use == here
  //   return merchant ? merchant.company_name : "N/A";
  // };

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
    const confirmed = window.confirm(
      "Are you sure you want to delete this connection?"
    );
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
      <DashBoardTopBar heading="Connected History" />

      <div className="userConnectedHistoryContainer">
        <div className="merchantContainerHeader">
          <div className="merchantHeaderTitle">
            <DashboardTopHeading text="Merchant Services Providers Connected History" />{" "}
          </div>
        </div>

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
                  <div>No connections found</div>
                </div>
              ) : (
                merchantDetails.map((connection, index) => {
                  const history = connectedHistory[index];
                  const state = history?.state;
                  const company_name = connection?.company_name;
                  // console.log("........connection...........",connection);

                  return (
                    <div className="accordion-item" key={index}>
                      <h2 className="accordion-header" id={`heading${index}`}>
                        <button
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
                            ) : (
                              <span className={`statusText status-${state}`}>
                                {state
                                  ? state.charAt(0).toUpperCase() +
                                    state.slice(1)
                                  : "—"}
                              </span>
                            )}
                          </div>
                        </button>
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

                                {/* <div className="userImgWrapper">
                                  <div className="userImg">
                                    <img src={placeholderimg} />
                                  </div>
                                </div> */}

                                <div className="userHeaderInfoTopCon">
                                  {/* <div className="inputWrapCon">
                                    <div className="titleDataUserName">
                                      Demo1
                                    </div>
                                  </div> */}

                                  <div className="inputWrapCon company_area">
<<<<<<< HEAD
                                    <div className="userImg order-2"><img src={placeholderimg} /></div>
                                    <div className="usercompany order-1">
                                      <div className="titleField">Company Name *</div>
                                      <div className="titleData">Abc</div>
=======
                                    <div className="userImg order-2"><img src={
                                      connection.logo && connection.logo.trim() !== ""
                                        ? `${IMAGE_BASE_URL}/${connection.logo}`
                                        : placeholderimg
                                    } /></div>
                                    <div className="usercompany order-1">
                                      <div className="titleField">Company Name *</div>
                                      <div className="titleData" title={connection?.company_name}>{connection?.company_name}</div>
>>>>>>> 5247827e581bceb873eb11f5430e2888d1071926
                                    </div>
                                  </div>

                                  <div className="inputWrapCon company_area_details">  
                                    <h3 className="titleField">Company Mailing Address *</h3>
                                    <div className="company_details_row">
                                      <h5>Street Details</h5>
<<<<<<< HEAD
                                      <div className="companydata">1115 Lyndon Street</div>
                                    </div>
                                    <div className="company_details_row cell_format">
                                      <div className="company_cell">
                                        <h5>City:</h5>
                                        <div className="companydata">Marlow</div>
                                      </div>
                                      <div className="company_cell">
                                        <h5>State:</h5>
                                        <div className="companydata">Oklahoma</div>
                                      </div>                                      
                                      <div className="company_cell companycountry">
                                        <h5>Country:</h5>
                                        <div className="companydata">US</div>
                                      </div>                                      
                                      <div className="company_cell companyzip">
                                        <h5>Zip:</h5>
                                        <div className="companydata">73055</div>
                                      </div>                                      
                                      <div className="company_cell companyphone">
                                        <h5>Phone:</h5>
                                        <div className="companydata">580-658-5178</div>
                                      </div>                                      
                                      <div className="company_cell companyemail">
                                        <h5>Email:</h5>
                                        <div className="companydata" title={getUserEmail(connection.merchant_id)}>{getUserEmail(connection.merchant_id)}</div>
                                      </div>                                      
                                      <div className="company_cell companyweb">
                                        <h5>Website:</h5>
                                        <div className="companydata">www.abc.com</div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* <div className="inputWrapCon">
                                    <div className="titleField">Phone:</div>
                                    <div className="titleData">
                                      580-658-5178
                                    </div>
                                  </div> */}
                                </div>
                              </div>
                              {/* <div className="inputWrapCon">
                                <div className="titleField">Email:</div>
                                <div className="titleData">
                                  {getUserEmail(connection.merchant_id)}
                                </div>
                              </div>

                              <div className="inputWrapCon">
                                <div className="titleField">Website</div>
                                <div className="titleData">www.abc.com</div>
                              </div> */}
                              <div className="inputWrapCon company_description">
                                <div className="titleField">Company Description</div>
                                <div className="titleData">The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, </div>
=======
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
>>>>>>> 5247827e581bceb873eb11f5430e2888d1071926
                              </div>

                              <div className="inputWrapCon marketing_details">
                                <div className="titleField">Marketing Details</div>
                                <div className="marketing_block d-flex">
                                  <div className="marketing_cell">
                                      <h5>Bullet Point 1</h5>
<<<<<<< HEAD
                                      <div className="companydata">It is a long established fact</div>
                                  </div>
                                  <div className="marketing_cell">
                                      <h5>Bullet Point 2</h5>
                                      <div className="companydata">It is a long established fact</div>
                                  </div>
                                  <div className="marketing_cell">
                                      <h5>Bullet Point 3</h5>
                                      <div className="companydata">It is a long established fact</div>
                                  </div>
                                  <div className="marketing_cell">
                                      <h5>Bullet Point 4</h5>
                                      <div className="companydata">It is a long established fact</div>
                                  </div>
=======
                                      <div className="companydata" title={connection?.bulletOne}>{connection?.bulletOne}</div>
                                  </div>
                                  <div className="marketing_cell">
                                      <h5>Bullet Point 2</h5>
                                      <div className="companydata" title={connection?.bulletTwo}>{connection?.bulletTwo}</div>
                                  </div>
                                  <div className="marketing_cell">
                                      <h5>Bullet Point 3</h5>
                                      <div className="companydata" title={connection?.bulletThree}>{connection?.bulletThree}</div>
                                  </div>
                                  {/* <div className="marketing_cell">
                                      <h5>Bullet Point 4</h5>
                                      <div className="companydata">It is a long established fact</div>
                                  </div> */}
>>>>>>> 5247827e581bceb873eb11f5430e2888d1071926
                                </div>
                              </div>

                            </div>
<<<<<<< HEAD

                            {/* <div className="userInfoCenterSec">
                              <h2>Company Mailing Address</h2>

                              <div className="row">
                                <div className="col-lg-3">
                                  <div className="inputWrapCon">
                                    <div className="titleField">
                                      Distance Willing to Travel:
                                    </div>
                                    <div className="titleData">10</div>
                                  </div>
                                </div>
                                <div className="col-lg-3">
                                  <div className="inputWrapCon">
                                    <div className="titleField">Street:</div>
                                    <div className="titleData">Marlow</div>
                                  </div>
                                </div>
                                <div className="col-lg-3">
                                  <div className="inputWrapCon">
                                    <div className="titleField">City:</div>
                                    <div className="titleData">Marlow</div>
                                  </div>
                                </div>
                                <div className="col-lg-3">
                                  <div className="inputWrapCon">
                                    <div className="titleField">State:</div>
                                    <div className="titleData">Oklahoma</div>
                                  </div>
                                </div>
                                <div className="col-lg-3">
                                  <div className="inputWrapCon">
                                    <div className="titleField">Zip Code</div>
                                    <div className="titleData">73055</div>
                                  </div>
                                </div>
                                <div className="col-lg-3">
                                  <div className="inputWrapCon">
                                    <div className="titleField">
                                      Country Name:
                                    </div>
                                    <div className="titleData">US</div>
                                  </div>
                                </div>
                              </div>
                            </div> */}

                            {/* <div className="userInfoCenterSec">
                              <h2>Marketing Details</h2>

                              <div className="row">
                                <div className="col-lg-6">
                                  <div className="inputWrapCon">
                                    <div className="titleField">
                                      Bullet Point 1
                                    </div>
                                    <div className="titleData">demo 1</div>
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="inputWrapCon">
                                    <div className="titleField">
                                      Bullet Point 2
                                    </div>
                                    <div className="titleData">demo 1</div>
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="inputWrapCon">
                                    <div className="titleField">
                                      Bullet Point 3
                                    </div>
                                    <div className="titleData">demo 1</div>
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="inputWrapCon">
                                    <div className="titleField">Summary</div>
                                    <div className="titleData">summary</div>
                                  </div>
                                </div>
                              </div>
                            </div> */}

                            {/* <div className="userInfoCenterSec">
                              <h2>Merchant Processing Features</h2>

                              <div className="row">
                                <div className="col-lg-12">
                                  <div className="inputWrapCon">
                                    <div className="titleField">
                                      Select type
                                    </div>
                                    <div className="titleData">agents</div>
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="inputWrapCon">
                                    <div className="titleField">
                                      Primary Processing Platform / Partner
                                    </div>
                                    <div className="titleData">demo</div>
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="inputWrapCon">
                                    <div className="titleField">
                                      Secondary Processing Platform / Partner
                                    </div>
                                    <div className="titleData">NA</div>
                                  </div>
                                </div>
                                <div className="col-lg-12">
                                  <div className="inputWrapCon">
                                    <div className="titleField">Other</div>
                                    <div className="titleData">NA</div>
                                  </div>
                                </div>
                                <div className="col-lg-12">
                                  <div className="inputWrapCon">
                                    <div className="titleField">
                                      How many merchant services sales
                                      represenatives are in your office ?
                                    </div>
                                    <div className="titleData"> 100K 250K </div>
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="inputWrapCon">
                                    <div className="titleField">
                                      How many clients do you service?
                                    </div>
                                    <div className="titleData">2</div>
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="inputWrapCon">
                                    <div className="titleField">
                                      Share publicly?
                                    </div>
                                    <div className="titleData">no</div>
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="inputWrapCon">
                                    <div className="titleField">
                                      Monthly Volume Processed by your merchants
                                    </div>
                                    <div className="titleData">250K 1MM</div>
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="inputWrapCon">
                                    <div className="titleField">
                                      Share publicly?
                                    </div>
                                    <div className="titleData">Yes</div>
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="inputWrapCon">
                                    <div className="titleField">
                                      Do you offer High Risk?
                                    </div>
                                    <div className="titleData">No</div>
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="inputWrapCon">
                                    <div className="titleField">
                                      Do you offer Point of Sale?
                                    </div>
                                    <div className="titleData">Yes</div>
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="inputWrapCon">
                                    <div className="titleField">
                                      Do you offer Merchant Cash Advance or
                                      Financing?
                                    </div>
                                    <div className="titleData">Yes</div>
                                  </div>
                                </div>
                              </div>
                            </div> */}
=======
>>>>>>> 5247827e581bceb873eb11f5430e2888d1071926
                          </div>
                        </div>
                      </div>
                    </div>

                    // </div> //gg
                  );
                })
              )}
            </div>
          </div>

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
