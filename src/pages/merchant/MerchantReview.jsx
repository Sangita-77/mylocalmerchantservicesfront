import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./../../styles/styles.css";

import { PiEyeLight } from "react-icons/pi";
import axios from "axios";
import { BASE_URL } from "../../utils/apiManager";
import { AppContext } from "../../utils/context";
import PreLoader from "../../components/PreLoader";

import { AiOutlineDelete } from "react-icons/ai";
import DashboardTopHeading from "../../components/DashboardTopHeading";
import DashBoardTopBar from "../../components/DashBoardTopBar";
import placeholderimg from "../../assets/images/placeholderimg.jpg";
import { IMAGE_BASE_URL } from "../../utils/apiManager";
import ChatWindow from "../../components/ChatWindow";
import ConfirmModal from "../../components/ConfirmModal";
import contactlisticon from "../../assets/images/contactlisticon.png";

const MerchantReview = () => {
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [connectedHistory, setConnectedHistory] = useState([]);
  const [merchantDetails, setMerchantDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [connections, setConnections] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const [showWriteReview, setShowWriteReview] = useState(false);
  const [reviewText, setReviewText] = useState("");

  const { id } = useParams();
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
        `${BASE_URL}/getConnectedUserForMerchant`,
        { merchant_id: merchantId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        console.log("........response.data.connectedHistory............",response.data.data);
        setConnectedHistory(response.data.connectedHistory || []);
        setMerchantDetails(response.data.merchantDetails || []);
        if (response.data.data) {
          const data = response.data.data;
          setAverageRating(data.average_rating || 0);
          setTotalReviews(data.total_reviews || 0);
  
          const reviews = data.review || [];
  
          // Fetch details
          const merchantIds = [...new Set(reviews.map((r) => r.merchant_id))];
          const merchantPromises = merchantIds.map(async (merchant_id) => {
            try {
              const res = await axios.post(
                `${BASE_URL}/getMerchantAgainstmerchant_id`,
                { merchant_id },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              );
              return { merchant_id, merchant: res.data.data || {} };
            } catch (err) {
              console.error(`Error fetching merchant ${merchant_id}:`, err);
              return { merchant_id, merchant: {} };
            }
          });
  
          const merchantResults = await Promise.all(merchantPromises);
  
          const reviewsWithMerchant = reviews.map((review) => {
            const match = merchantResults.find(
              (m) => m.merchant_id === review.merchant_id
            );
            return {
              ...review,
              merchant_details: match ? match.merchant : {},
            };
          });
  
          setReviews(reviewsWithMerchant);
  
          // Calculate rating distribution
          const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
          reviews.forEach((r) => {
            const star = Math.round(r.rating);
            if (counts[star] !== undefined) counts[star]++;
          });
          setRatingStats(counts);
        }
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

  const [ratingStats, setRatingStats] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });

  const getReviews = async () => {
    try {
      setLoading(true);
      const agent_id = parseInt(id, 10);

      console.log("agent_id",id);
      // console.log("Testing...", `${BASE_URL}/getReviewRating`);

      const response = await axios.post(
        `${BASE_URL}/getReviewRating`,
        { agent_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      

      if (response.data.status && response.data.data) {
        const data = response.data.data;
        setAverageRating(data.average_rating || 0);
        setTotalReviews(data.total_reviews || 0);

        const reviews = data.review || [];

        // Fetch details
        const merchantIds = [...new Set(reviews.map((r) => r.merchant_id))];
        const merchantPromises = merchantIds.map(async (merchant_id) => {
          try {
            const res = await axios.post(
              `${BASE_URL}/getMerchantAgainstmerchant_id`,
              { merchant_id },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            return { merchant_id, merchant: res.data.data || {} };
          } catch (err) {
            console.error(`Error fetching merchant ${merchant_id}:`, err);
            return { merchant_id, merchant: {} };
          }
        });

        const merchantResults = await Promise.all(merchantPromises);

        const reviewsWithMerchant = reviews.map((review) => {
          const match = merchantResults.find(
            (m) => m.merchant_id === review.merchant_id
          );
          return {
            ...review,
            merchant_details: match ? match.merchant : {},
          };
        });

        setReviews(reviewsWithMerchant);

        // Calculate rating distribution
        const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviews.forEach((r) => {
          const star = Math.round(r.rating);
          if (counts[star] !== undefined) counts[star]++;
        });
        setRatingStats(counts);
      }

    } catch (error) {
      console.error("Connection error:", error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   getReviews();
  // }, [id]);

  const getPercentage = (count) =>
    totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

  const writeReview = () => {
    setShowWriteReview(true);
  };

  const closeReviewSection = () => {
    setShowWriteReview(false);
    setReviewText("");
  };

  return (
    <div className="userConnectedHistoryPageWrapper merchantReview">
      <DashBoardTopBar heading="Reviews" />

      <div className="userConnectedHistoryContainer">
        <div className="merchantContainerHeader">
          <div className="merchantHeaderTitle">
            <DashboardTopHeading text="Reviews List" />
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
                    <>
                      {state === "accepted" ? (
                        <div className="accordion-item" key={index}>
                          <h2
                            className="accordion-header"
                            id={`heading${index}`}
                          >
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
                                  ? new Date(
                                      history.created_at
                                    ).toLocaleString()
                                  : "—"}
                              </div>
                              <div className="td">
                                {getUserName(connection.merchant_id)}
                              </div>
                              <div className="td">
                                {getUserEmail(connection.merchant_id)}
                              </div>

                              <div className="userBtn td">
                                {state === "accepted" ? (
                                  <>
                                    <button
                                      className="viewButton"
                                      onClick={() =>
                                        handleViewClick(connection)
                                      }
                                      data-bs-toggle="tooltip"
                                      data-bs-placement="auto"
                                      title="View Details"
                                    >
                                      <PiEyeLight size={22} color="white" />
                                    </button>
                                    <button
                                      className="delButton"
                                      onClick={() =>
                                        handleDeleteClick(connection)
                                      }
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
                                  <span
                                    className={`statusText status-${state}`}
                                  >
                                    {state
                                      ? state.charAt(0).toUpperCase() +
                                        state.slice(1)
                                      : "—"}
                                  </span>
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
                                        <div className="userImg order-2">
                                          <img
                                            src={
                                              connection.logo &&
                                              connection.logo.trim() !== ""
                                                ? `${IMAGE_BASE_URL}/${connection.logo}`
                                                : placeholderimg
                                            }
                                          />
                                        </div>
                                        <div className="usercompany order-1">
                                          <div className="titleField">
                                            Company Name *
                                          </div>
                                          <div
                                            className="titleData"
                                            title={connection?.company_name}
                                          >
                                            {connection?.company_name}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="inputWrapCon company_area_details">
                                        <h3 className="titleField">
                                          Company Mailing Address *
                                        </h3>
                                        <div className="company_details_row">
                                          <h5>Street Details</h5>
                                          <div
                                            className="companydata"
                                            title={connection?.city}
                                          >
                                            {connection?.city}
                                          </div>
                                        </div>
                                        <div className="company_details_row cell_format">
                                          <div className="company_cell">
                                            <h5>City:</h5>
                                            <div
                                              className="companydata"
                                              title={connection?.city}
                                            >
                                              {connection?.city}
                                            </div>
                                          </div>
                                          <div className="company_cell">
                                            <h5>State:</h5>
                                            <div
                                              className="companydata"
                                              title={connection?.state}
                                            >
                                              {connection?.state}
                                            </div>
                                          </div>
                                          <div className="company_cell companycountry">
                                            <h5>Country:</h5>
                                            <div className="companydata">
                                              US
                                            </div>
                                          </div>
                                          <div className="company_cell companyzip">
                                            <h5>Zip:</h5>
                                            <div
                                              className="companydata"
                                              title={connection?.zip_code}
                                            >
                                              {connection?.zip_code}
                                            </div>
                                          </div>
                                          <div className="company_cell companyphone">
                                            <h5>Phone:</h5>
                                            <div
                                              className="companydata"
                                              title={connection?.phone}
                                            >
                                              {connection?.phone}
                                            </div>
                                          </div>
                                          <div className="company_cell companyemail">
                                            <h5>Email:</h5>
                                            <div
                                              className="companydata"
                                              title={getUserEmail(
                                                connection.merchant_id
                                              )}
                                            >
                                              {getUserEmail(
                                                connection.merchant_id
                                              )}
                                            </div>
                                          </div>
                                          <div className="company_cell companyweb">
                                            <h5>Website:</h5>
                                            <div
                                              className="companydata"
                                              title={connection?.website}
                                            >
                                              {connection?.website}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="inputWrapCon company_description">
                                    <div className="titleField">
                                      Company Description
                                    </div>
                                    <div
                                      className="titleData"
                                      title={connection?.company_description}
                                    >
                                      {connection?.company_description}
                                    </div>
                                  </div>

                                  <div className="inputWrapCon marketing_details">
                                    <div className="titleField">
                                      Marketing Details
                                    </div>
                                    <div className="marketing_block d-flex">
                                      <div className="marketing_cell">
                                        <h5>Bullet Point 1</h5>
                                        <div
                                          className="companydata"
                                          title={connection?.bulletOne}
                                        >
                                          {connection?.bulletOne}
                                        </div>
                                      </div>
                                      <div className="marketing_cell">
                                        <h5>Bullet Point 2</h5>
                                        <div
                                          className="companydata"
                                          title={connection?.bulletTwo}
                                        >
                                          {connection?.bulletTwo}
                                        </div>
                                      </div>
                                      <div className="marketing_cell">
                                        <h5>Bullet Point 3</h5>
                                        <div
                                          className="companydata"
                                          title={connection?.bulletThree}
                                        >
                                          {connection?.bulletThree}
                                        </div>
                                      </div>
                                      {/* <div className="marketing_cell">
                                      <h5>Bullet Point 4</h5>
                                      <div className="companydata">It is a long established fact</div>
                                  </div> */}
                                    </div>
                                  </div>
                                </div>

                                {/* --------------- */}
                                <div className="userInfoReviewsWrap">
                                  <div className="userInfoReviewsCon">
                                    <h2 className="sectionTitle">Review</h2>

                                    
                                    <div className="ratingTopSection">
                                      <div className="row">
                                        
                                        <div className="col-lg-2">
                                          <div className="ratingCol">
                                            <span>{averageRating ? averageRating.toFixed(1) : "0.0"}</span>
                                            <div className="starWrap">
                                              {[...Array(5)].map((_, index) => {
                                                const filled = index < Math.round(averageRating || 0);
                                                return (
                                                  <span
                                                    key={index}
                                                    style={{ color: filled ? "#FFD700" : "#ccc" }}
                                                  >
                                                    ★
                                                  </span>
                                                );
                                              })}
                                            </div>
                                            <div style={{ fontSize: "12px", color: "#666" }}>
                                              ({totalReviews} review{totalReviews !== 1 ? "s" : ""})
                                            </div>
                                          </div>
                                        </div>

                                        
                                        <div className="col-lg-10">
                                          {[5, 4, 3, 2, 1].map((star) => (
                                            <div className="progressBarWrap" key={star}>
                                              <progress value={getPercentage(ratingStats[star])} max="100">
                                                {getPercentage(ratingStats[star])}%
                                              </progress>
                                              <div className="reviewCount">
                                                <span>{star}★</span> {ratingStats[star]} Review
                                                {ratingStats[star] !== 1 ? "s" : ""} (
                                                {getPercentage(ratingStats[star])}%)
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>

                                    
                                    {isLoading ? (
                                      <p>Loading reviews...</p>
                                    ) : reviews.length > 0 ? (
                                      reviews.map((item, index) => (
                                        <div className="ratingBottomSection" key={item.id || index}>
                                          <div className="ratingHeaderInfo">
                                            <div className="ratingheaderInfoLeft">
                                            <div className="ratingUserImg">
                                              {item.merchant_details?.logo ? (

                                                <div
                                                style={{
                                                  width: "25px",
                                                  height: "25px",
                                                  borderRadius: "50%",
                                                  backgroundColor: "#007bff",
                                                  display: "flex",
                                                  alignItems: "center",
                                                  justifyContent: "center",
                                                  color: "white",
                                                  fontWeight: "bold",
                                                  fontSize: "16px",
                                                }}
                                              >
                                                {item.merchant_details?.merchant_name
                                                  ? item.merchant_details.merchant_name.charAt(0).toUpperCase()
                                                  : "U"}
                                              </div>
                                              ) : (
                                                <img
                                                  src={
                                                    item.merchant_details?.logo
                                                      ? `${BASE_URL}/${item.merchant_details.logo}`
                                                      : contactlisticon
                                                  }
                                                  
                                                />
                                              )}
                                            </div>

                                              <h3 className="ratingUserName">
                                                {item.merchant_details?.merchant_name
                                                  ? item.merchant_details.merchant_name
                                                  : `User #${item.merchant_id || "Anonymous"}`}
                                              </h3>

                                              <h4 className="ratingUserTime">
                                                {new Date(item.created_at).toLocaleDateString()}
                                              </h4>
                                            </div>

                                            <div className="ratingheaderInforight">
                                              <span className="avgRating">{item.rating}</span>
                                              <div className="startWrap">
                                                {[...Array(5)].map((_, i) => (
                                                  <span
                                                    key={i}
                                                    style={{
                                                      color: i < item.rating ? "#FFD700" : "#ccc",
                                                    }}
                                                  >
                                                    ★
                                                  </span>
                                                ))}
                                              </div>
                                            </div>
                                          </div>

                                          <div className="ratingConInfo">
                                            <p>{item.review}</p>
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <p>No reviews yet.</p>
                                    )}
                                  </div>                              

                                  <div className="writeReview">
                                    <a onClick={writeReview}>Write a review</a>

                                    {showWriteReview && (
                                      <div className="writeReviewSection">
                                        <div className="startadd">
                                          <span>★</span>
                                          <span>★</span>
                                          <span>★</span>
                                          <span>★</span>
                                          <span>★</span>
                                        </div>
                                        <textarea
                                          value={reviewText}
                                          onChange={(e) =>
                                            setReviewText(e.target.value)
                                          }
                                          placeholder="Write your review here..."
                                          rows={4}
                                        />

                                        <div>
                                          <button className="submitbtn">
                                            Submit
                                          </button>
                                          <button
                                            className="closebtn"
                                            onClick={closeReviewSection}
                                          >
                                            Close
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {/* ------------ */}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </>
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

export default MerchantReview;
