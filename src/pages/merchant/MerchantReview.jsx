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
  const [selectedRating, setSelectedRating] = useState(0);
  const [isEditingOwnReview, setIsEditingOwnReview] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);

  const { id } = useParams();
  const { token } = useContext(AppContext);
  const merchantId =
    typeof window !== "undefined" ? localStorage.getItem("merchant_id") : null;

  const toggleChatWindow = () => {
    setShowChatWindow(false);
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
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
        // console.log("........response.data.connectedHistory............",response.data);
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


  const getPercentage = (count) =>
    totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

  const writeReview = () => {
    setIsEditingOwnReview(false);
    setReviewText("");
    setSelectedRating(0);
    setShowWriteReview(true);
    setEditingReviewId(null);
  };

  const startEditOwnReview = (review) => {
    setIsEditingOwnReview(true);
    setReviewText(review?.review || "");
    setSelectedRating(review?.rating || 0);
    setShowWriteReview(true);
    setEditingReviewId(review?.review_id || review?.id || null);
  };

  const closeReviewSection = () => {
    setShowWriteReview(false);
    setReviewText("");
    setSelectedRating(0);
    setIsEditingOwnReview(false);
    setEditingReviewId(null);
  };

  const SaveReview = async (agent_id) => {

    const merchant_id = parseInt(localStorage.getItem("merchant_id"), 10);
    if (!selectedRating) {
      alert("Please select a rating before submitting.");
      return;
    }
  
    // Check if a review already exists for this merchant-agent pair
    const existingReview = reviews.find(
      (review) =>
        review.agent_id === agent_id &&
        merchantId &&
        String(review.merchant_id) === String(merchantId)
    );

    // If review exists and is approved (status 1), prevent creating/editing
    if (existingReview && !isEditingOwnReview) {
      const status = existingReview.status;
      const isApproved = status === 1 || status === "1";
      if (isApproved) {
        alert("You have already submitted a review for this merchant. Approved reviews cannot be edited.");
        return;
      }
    }

    // If review exists but we're not in edit mode, switch to edit mode
    if (existingReview && !isEditingOwnReview) {
      const status = existingReview.status;
      const isPending = status === 0 || status === "0" || status === null || status === undefined;
      if (isPending) {
        // Update the existing pending review instead of creating a new one
        const reviewId = existingReview.review_id || existingReview.id;
        if (reviewId) {
          setIsEditingOwnReview(true);
          setEditingReviewId(reviewId);
        }
      }
    }
  
    if (isEditingOwnReview && !editingReviewId) {
      alert("Unable to determine which review to update. Please try again.");
      return;
    }
  
    try {
      setIsLoading(true);
  
      let response;

      // If editing or if review exists, update it
      if ((isEditingOwnReview && editingReviewId) || existingReview) {
        const reviewId = editingReviewId || existingReview?.review_id || existingReview?.id;
        if (!reviewId) {
          alert("Unable to determine which review to update. Please try again.");
          setIsLoading(false);
          return;
        }

        const body = {
          review_id: reviewId,
          review: reviewText,
          rating: selectedRating,
        };

        response = await axios.post(`${BASE_URL}/updateReview`, body, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // Create new review only if none exists
        const body = {
          merchant_id: merchant_id,
          agent_id: agent_id,
          rating: selectedRating,
          review: reviewText,
        };

        response = await axios.post(`${BASE_URL}/reviewRating`, body, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      if (response?.data?.status) {
        closeReviewSection();
        fetchData();
      } else {
        alert(response?.data?.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert("Error submitting review.");
    } finally {
      setIsLoading(false);
    }
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
                  // console.log("........connection...........",connection.merchant_id);

                  const merchantReviews = reviews.filter(
                    (review) => review.agent_id === connection.merchant_id
                  );
                  const ownReviews = merchantReviews.filter(
                    (review) =>
                      merchantId &&
                      String(review.merchant_id) === String(merchantId)
                  );
                  
                  // Separate pending (status 0) and approved (status 1) reviews
                  // Handle status as string "0", number 0, null, or undefined
                  const pendingOwnReviews = ownReviews.filter(
                    (review) => {
                      const status = review.status;
                      // Check if status is 0 (handles string "0", number 0, null, undefined)
                      const isPending = status === 0 || status === "0" || status === null || status === undefined;
                      return isPending;
                    }
                  );
                  const approvedOwnReviews = ownReviews.filter(
                    (review) => {
                      const status = review.status;
                      return status === 1 || status === "1";
                    }
                  );
                  // Only one review per merchant per agent - get the existing review (pending or approved)
                  const primaryOwnReview = pendingOwnReviews[0] || approvedOwnReviews[0];
                  const existingReview = ownReviews[0]; // Get the first (and should be only) review

                  // Include all reviews except pending own reviews (pending ones show in ownReviewSection)
                  // Approved own reviews should appear in the main list
                  const merchantReviewsForDisplay = merchantReviews.filter(
                    (review) => {
                      const isOwnReview = merchantId && String(review.merchant_id) === String(merchantId);
                      const status = review.status;
                      const isPending = status === 0 || status === "0" || status === null || status === undefined;
                      // Exclude pending own reviews (they show in ownReviewSection)
                      return !(isOwnReview && isPending);
                    }
                  );

                  // Calculate review status for UI
                  const existingReviewStatus = existingReview ? existingReview.status : null;
                  const isExistingReviewPending = existingReviewStatus === 0 || existingReviewStatus === "0" || existingReviewStatus === null || existingReviewStatus === undefined;
                  const isExistingReviewApproved = existingReviewStatus === 1 || existingReviewStatus === "1";

                  const handleReviewButtonClick = () => {
                    // If there's an existing review, always edit it (if pending) or show message (if approved)
                    if (existingReview) {
                      if (isExistingReviewPending) {
                        // Can edit pending reviews
                        startEditOwnReview(existingReview);
                      } else {
                        // Approved reviews cannot be edited
                        alert("You have already submitted a review for this merchant. Approved reviews cannot be edited.");
                      }
                    } else {
                      // No review exists, create a new one
                      writeReview();
                    }
                  };

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

                                    {/* Optional: recalculate avg for this merchant */}
                                    <div className="ratingTopSection">
                                      <div className="row">
                                        <div className="col-lg-2">
                                          <div className="ratingCol">
                                            <span>
                                              {merchantReviewsForDisplay.length > 0
                                                ? (
                                                    merchantReviewsForDisplay.reduce(
                                                      (sum, r) => sum + r.rating,
                                                      0
                                                    ) / merchantReviewsForDisplay.length
                                                  ).toFixed(1)
                                                : "0.0"}
                                            </span>
                                            <div className="starWrap">
                                              {[...Array(5)].map((_, i) => {
                                                const avg =
                                                  merchantReviewsForDisplay.length > 0
                                                    ? merchantReviewsForDisplay.reduce(
                                                        (sum, r) => sum + r.rating,
                                                        0
                                                      ) / merchantReviewsForDisplay.length
                                                    : 0;
                                                return (
                                                  <span
                                                    key={i}
                                                    style={{
                                                      color: i < Math.round(avg) ? "#FFD700" : "#ccc",
                                                    }}
                                                  >
                                                    ★
                                                  </span>
                                                );
                                              })}
                                            </div>
                                            <div style={{ fontSize: "12px", color: "#666" }}>
                                              ({merchantReviewsForDisplay.length} review
                                              {merchantReviewsForDisplay.length !== 1 ? "s" : ""})
                                            </div>
                                          </div>
                                        </div>

                                        <div className="col-lg-10">
                                          {[5, 4, 3, 2, 1].map((star) => {
                                            // Count how many reviews have this star for the current merchant
                                            const count = merchantReviewsForDisplay.filter(
                                              (r) => Math.round(r.rating) === star
                                            ).length;

                                            // Calculate percentage of total reviews
                                            const percentage =
                                              merchantReviewsForDisplay.length > 0
                                                ? Math.round((count / merchantReviewsForDisplay.length) * 100)
                                                : 0;

                                            return (
                                              <div className="progressBarWrap" key={star}>
                                                <progress value={percentage} max="100">
                                                  {percentage}%
                                                </progress>
                                                <div className="reviewCount">
                                                  <span>{star}★</span>{" "}
                                                  {count} Review{count !== 1 ? "s" : ""} ({percentage}%)
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>

                                      </div>
                                    </div>

                                    {/* Own review Section - Only show pending reviews (status 0) */}
                                    <div className="ratingBottomSection ownReviewSection">
                                      {merchantId ? (
                                        pendingOwnReviews.length > 0 ? (
                                          pendingOwnReviews.map((item, ownIndex) => (
                                            <div key={item.id || ownIndex}>
                                              <div className="ratingHeaderInfo">
                                                <div className="ratingheaderInfoLeft">
                                                  <div className="ratingUserImg">
                                                    {item.merchant_details?.logo ? (
                                                      <img
                                                        src={`${IMAGE_BASE_URL}/${item.merchant_details.logo}`}
                                                        alt="merchant"
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
                                                      />
                                                    ) : (
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
                                                          ? item.merchant_details.merchant_name
                                                              .charAt(0)
                                                              .toUpperCase()
                                                          : "U"}
                                                      </div>
                                                    )}
                                                  </div>
                                                  <h3 className="ratingUserName">
                                                    {item.merchant_details?.merchant_name || "You"}
                                                  </h3>
                                                  <h4 className="ratingUserTime">
                                                    {new Date(item.created_at).toLocaleDateString()}
                                                  </h4>
                                                </div>
                                                <div className="ratingheaderInforight">
                                                  <div className="starRationCol">
                                                    <span className="avgRating">{item.rating}</span>
                                                    <div className="startWrap">
                                                      {[...Array(5)].map((_, starIndex) => (
                                                        <span
                                                          key={starIndex}
                                                          style={{
                                                            color:
                                                              starIndex < Number(item.rating)
                                                                ? "#FFD700"
                                                                : "#ccc",
                                                          }}
                                                        >
                                                          ★
                                                        </span>
                                                      ))}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="ratingConInfo">
                                                <p>{item.review}</p>
                                                {(() => {
                                                  const status = item.status;
                                                  const isPending = status === 0 || status === "0" || status === null || status === undefined;
                                                  return isPending && (
                                                    <div style={{ marginTop: "10px" }}>
                                                      <button
                                                        onClick={() => startEditOwnReview(item)}
                                                        style={{
                                                          padding: "6px 12px",
                                                          backgroundColor: "#007bff",
                                                          color: "white",
                                                          border: "none",
                                                          borderRadius: "4px",
                                                          cursor: "pointer",
                                                          fontSize: "14px",
                                                        }}
                                                      >
                                                        Edit Review & Rating
                                                      </button>
                                                      <div
                                                        style={{
                                                          fontSize: "12px",
                                                          color: "#ff9800",
                                                          marginTop: "8px",
                                                          fontStyle: "italic",
                                                        }}
                                                      >
                                                        ⚠ Pending - You can edit this review
                                                      </div>
                                                    </div>
                                                  );
                                                })()}
                                              </div>
                                            </div>
                                          ))
                                        ) : approvedOwnReviews.length > 0 ? (
                                          approvedOwnReviews.map((item, ownIndex) => (
                                            <div key={item.id || ownIndex}>
                                              <div className="ratingHeaderInfo">
                                                <div className="ratingheaderInfoLeft">
                                                  <div className="ratingUserImg">
                                                    {item.merchant_details?.logo ? (
                                                      <img
                                                        src={`${IMAGE_BASE_URL}/${item.merchant_details.logo}`}
                                                        alt="merchant"
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
                                                      />
                                                    ) : (
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
                                                          ? item.merchant_details.merchant_name
                                                              .charAt(0)
                                                              .toUpperCase()
                                                          : "U"}
                                                      </div>
                                                    )}
                                                  </div>
                                                  <h3 className="ratingUserName">
                                                    {item.merchant_details?.merchant_name || "You"}
                                                  </h3>
                                                  <h4 className="ratingUserTime">
                                                    {new Date(item.created_at).toLocaleDateString()}
                                                  </h4>
                                                </div>
                                                <div className="ratingheaderInforight">
                                                  <div className="starRationCol">
                                                    <span className="avgRating">{item.rating}</span>
                                                    <div className="startWrap">
                                                      {[...Array(5)].map((_, starIndex) => (
                                                        <span
                                                          key={starIndex}
                                                          style={{
                                                            color:
                                                              starIndex < Number(item.rating)
                                                                ? "#FFD700"
                                                                : "#ccc",
                                                          }}
                                                        >
                                                          ★
                                                        </span>
                                                      ))}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="ratingConInfo">
                                                <p>{item.review}</p>
                                                <div
                                                  style={{
                                                    fontSize: "12px",
                                                    color: "#28a745",
                                                    marginTop: "8px",
                                                    fontStyle: "italic",
                                                  }}
                                                >
                                                  ✓ Approved - This review cannot be edited
                                                </div>
                                              </div>
                                            </div>
                                          ))
                                        ) : (
                                          <div className="ratingConInfo">
                                            <p>
                                              You have not submitted a review for this merchant yet.
                                            </p>
                                          </div>
                                        )
                                      ) : (
                                        <div className="ratingConInfo">
                                          <p>Merchant information is not available.</p>
                                        </div>
                                      )}
                                    </div>

                                    {/* Show merchant-specific reviews */}
                                    {merchantReviewsForDisplay.length > 0 ? (
                                      merchantReviewsForDisplay.map((item, i) => (
                                        <div className="ratingBottomSection" key={item.id || i}>
                                          <div className="ratingHeaderInfo">
                                            <div className="ratingheaderInfoLeft">
                                              <div className="ratingUserImg">
                                                {item.merchant_details?.logo ? (
                                                  <img
                                                    src={`${IMAGE_BASE_URL}/${item.merchant_details.logo}`}
                                                    alt="merchant"
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
                                                  />
                                                ) : (
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
                                                      ? item.merchant_details.merchant_name
                                                          .charAt(0)
                                                          .toUpperCase()
                                                      : "U"}
                                                  </div>
                                                )}
                                              </div>
                                              <h3 className="ratingUserName">
                                                {item.merchant_details?.merchant_name ||
                                                  `User #${item.merchant_id}`}
                                              </h3>
                                              <h4 className="ratingUserTime">
                                                {new Date(item.created_at).toLocaleDateString()}
                                              </h4>
                                            </div>
                                            <div className="ratingheaderInforight">
                                              <span className="avgRating">{item.rating}</span>
                                              <div className="startWrap">
                                                {[...Array(5)].map((_, j) => (
                                                  <span
                                                    key={j}
                                                    style={{
                                                      color: j < item.rating ? "#FFD700" : "#ccc",
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
                                      <p>No reviews yet for this merchant.</p>
                                    )}
                                  </div>
                                    <div className="writeReview">
                                    <a
                                      onClick={
                                        existingReview && isExistingReviewPending
                                          ? handleReviewButtonClick
                                          : existingReview && isExistingReviewApproved
                                          ? undefined
                                          : handleReviewButtonClick
                                      }
                                      style={
                                        existingReview && isExistingReviewPending
                                          ? { cursor: "pointer" }
                                          : existingReview && isExistingReviewApproved
                                          ? { cursor: "not-allowed", opacity: 0.5 }
                                          : { cursor: "pointer" }
                                      }
                                    >
                                      {existingReview
                                        ? isExistingReviewPending
                                          ? "Edit your review"
                                          : "Review approved (cannot edit)"
                                        : "Write a review"}
                                    </a>
                                    {existingReview && isExistingReviewApproved && (
                                      <div
                                        style={{
                                          fontSize: "12px",
                                          color: "#888",
                                          marginTop: "4px",
                                        }}
                                      >
                                        You can only submit one review per merchant. Approved reviews cannot be edited.
                                      </div>
                                    )}

                                    {showWriteReview && (
                                      <div className="writeReviewSection">
                                        <div className="startadd">
                                          {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                              key={star}
                                              onClick={() => setSelectedRating(star)}
                                              style={{
                                                cursor: "pointer",
                                                color: star <= selectedRating ? "#FFD700" : "#ccc",
                                                fontSize: "24px",
                                                marginRight: "4px",
                                              }}
                                            >
                                              ★
                                            </span>
                                          ))}
                                        </div>

                                        <textarea
                                          value={reviewText}
                                          onChange={(e) => setReviewText(e.target.value)}
                                          placeholder="Write your review here..."
                                          rows={4}
                                        />

                                        <div style={{ marginTop: "10px" }}>
                                          <button
                                            className="submitbtn"
                                            onClick={() => SaveReview(connection.merchant_id)}
                                            disabled={isLoading}
                                          >
                                            {isEditingOwnReview
                                              ? isLoading
                                                ? "Updating..."
                                                : "Update review"
                                              : isLoading
                                              ? "Submitting..."
                                              : "Submit"}
                                          </button>
                                          <button className="closebtn" onClick={closeReviewSection}>
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
