import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL, IMAGE_BASE_URL } from "./../../utils/apiManager";
import PreLoader from "./../../components/PreLoader";
import { AppContext } from "./../../utils/context";
import DashboardTopHeading from '../../components/DashboardTopHeading';
import ProviderDashboardTopBar from '../../components/ProviderDashboardTopBar';
import { MdOutlineReport } from "react-icons/md";



const ProvidersReview = () => {

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useContext(AppContext);

  const [openReportReviewId, setOpenReportReviewId] = useState(null);
  const [reviewReportText, setReviewReportText] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [visibleReasonReviewId, setVisibleReasonReviewId] = useState(null);
  const [reportError, setReportError] = useState("");


  const [ratingStats, setRatingStats] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });

  const fetchReportedReviewMap = async (agent_id) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/getReportedReview`,
        { agent_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.status) {
        const reportList = response.data?.data?.report || [];
        return reportList.reduce((acc, report) => {
          const key =
            report?.review_id ?? report?.reviewId ?? report?.review_report_id;
          if (key) {
            acc[key] = {
              reason: report.reason,
              ...report,
            };
          }
          return acc;
        }, {});
      }
    } catch (error) {
      console.error("Failed to fetch reported reviews:", error);
    }
    return {};
  };

  const getReviews = async () => {
    try {
      setIsLoading(true);
      const agent_id = parseInt(localStorage.getItem("merchant_id"), 10);
  
      //  Fetch all reviews for this agent
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
        // console.log("get review............response.......", data.review);
  
        // Basic stats
        setAverageRating(data.average_rating || 0);
        setTotalReviews(data.total_reviews || 0);
  
        const reviews = data.review || [];
  
        //  Get unique merchant_ids (avoid duplicate calls)
        const merchantIds = [...new Set(reviews.map((r) => r.merchant_id))];
  
        // Fetch merchant details for each merchant_id in parallel
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
  
        //  Map merchant details into the reviews
        const reviewsWithMerchant = reviews.map((review) => {
          const match = merchantResults.find(
            (m) => m.merchant_id === review.merchant_id
          );
          return {
            ...review,
            merchant_details: match ? match.merchant : {},
          };
        });

        const reportedMap = await fetchReportedReviewMap(agent_id);

        const reviewsWithReportStatus = reviewsWithMerchant.map((review, idx) => {
          const reviewKey = getReviewKey(review, idx);
          const reportedData =
            reportedMap[review.review_id ?? reviewKey] ||
            reportedMap[reviewKey];
          if (!reportedData) return review;
          return {
            ...review,
            report_reason: reportedData.reason,
            report_details: reportedData,
          };
        });

        //  Set reviews with merchant info and reported state
        setReviews(reviewsWithReportStatus);
  
        //  Calculate star distribution
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
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (token) {
      getReviews();
    }
  }, [token]);
  

  const getPercentage = (count) =>
    totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
  const dataArray = [1, 2];

  const getReviewKey = (review, fallback) =>
    review?.id ?? review?.review_id ?? review?.reviewId ?? fallback;

  const resolveReportedReason = (review) =>
    review?.report_reason ||
    review?.reportReason ||
    review?.report_details?.reason ||
    review?.reportReview?.reason ||
    review?.report?.reason ||
    null;

  const handleReportButtonClick = (review, reviewKey, isReported) => {
    if (isReported) {
      setOpenReportReviewId(null);
      setVisibleReasonReviewId((prev) =>
        prev === reviewKey ? null : reviewKey
      );
      return;
    }
    setReportError("");
    setVisibleReasonReviewId(null);
    setOpenReportReviewId(reviewKey);
    setReviewReportText("");
  };

  const closeReportReviewSection = () => {
    setOpenReportReviewId(null);
    setReviewReportText("");
    setReportError("");
  };

  const handleReportSubmit = async (review, reviewKey = null) => {
    if (!reviewReportText.trim()) {
      setReportError("Please enter a reason before submitting.");
      return;
    }
    setReportError("");

    const agent_id = parseInt(localStorage.getItem("merchant_id"), 10);
    if (!agent_id) {
      setReportError("Unable to determine the logged-in agent.");
      return;
    }

    const review_id =
      review?.review_id ?? review?.id ?? review?.reviewId ?? null;

    if (!review_id) {
      setReportError("Unable to determine review reference.");
      return;
    }

    const targetReviewKey = reviewKey ?? review_id;

    const payload = {
      merchant_id: review.merchant_id,
      agent_id,
      reason: reviewReportText.trim(),
      status: 1,
      review_id,
    };

    try {
      setIsSubmittingReport(true);
      const response = await axios.post(
        `${BASE_URL}/reportReview`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.status) {
        setReviews((prevReviews) =>
          prevReviews.map((rev, idx) => {
            const key = getReviewKey(rev, idx);
            if (key !== targetReviewKey) return rev;
            return {
              ...rev,
              report_reason: payload.reason,
            };
          })
        );
        closeReportReviewSection();
        setVisibleReasonReviewId(targetReviewKey);
        return;
      }
      setReportError(response.data?.message || "Unable to submit report.");
    } catch (error) {
      console.error("Failed to submit report:", error);
      setReportError("Something went wrong while submitting the report.");
    } finally {
      setIsSubmittingReport(false);
    }
  };


  return (
    <div className='userConnectedHistoryPageWrapper agentReviewWrap agentreviewList'>

    <ProviderDashboardTopBar heading="Reviews" />

    <div className="userConnectedHistoryContainer">
        <div className="merchantContainerHeader">
            <div className="merchantHeaderTitle"><DashboardTopHeading text="Reviews List"/> </div>
        </div>


        <div className="agentReviewWrap">
          <div className="adminDashboardConversationHistorySection">
              <div className="adminDashboardConversationHistoryWrap">

              {/* ----------------------------- */}

              <div className="userInfoReviewsWrap">
                <div className="userInfoReviewsCon">
                  <h2 className="sectionTitle">Review</h2>

                  {/* --- Top Summary Section --- */}
                  <div className="ratingTopSection">
                    <div className="row">
                      {/* --- Average Rating Left Column --- */}
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

                      {/* --- Dynamic Progress Bars (Manual calc) --- */}
                      <div className="col-lg-10">
                        {[5, 4, 3, 2, 1].map((star) => (
                          <div className="progressBarWrap" key={star}>
                            <progress value={getPercentage(ratingStats[star])} max="100">
                              {getPercentage(ratingStats[star])}%
                            </progress>
                            <div className="reviewCount">
                              <span>{star}★</span>{" "}
                              {ratingStats[star]} Review
                              {ratingStats[star] !== 1 ? "s" : ""} (
                              {getPercentage(ratingStats[star])}%)
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* --- Review List Section --- */}
                  {isLoading ? (
                    <p>Loading reviews...</p>
                  ) : reviews.length > 0 ? (
                    reviews.map((item, index) => {
                      const reviewKey = getReviewKey(item, index);
                      const reportedReason = resolveReportedReason(item);
                      const isReported = Boolean(reportedReason);

                      return (
                        <div className="ratingBottomSection" key={reviewKey}>
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
                                {item.merchant_details?.merchant_name
                                  ? item.merchant_details.merchant_name
                                  : `User #${item.merchant_id || "Anonymous"}`}
                              </h3>

                              <h4 className="ratingUserTime">
                                {new Date(item.created_at).toLocaleDateString()}
                              </h4>
                              <div
                                className={`reportBtnWrap ${
                                  isReported ? "reported" : ""
                                }`}
                                style={
                                  isReported
                                    ? {
                                        backgroundColor: "#fdecec",
                                        color: "#c53030",
                                        borderColor: "#f5b5b5",
                                      }
                                    : undefined
                                }
                                onClick={() =>
                                  handleReportButtonClick(item, reviewKey, isReported)
                                }
                              >
                                <span>
                                  <MdOutlineReport />
                                </span>{" "}
                                {isReported ? "Reported" : "Report"}
                              </div>
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

                            <div className="writeReview">
                              {isReported && visibleReasonReviewId === reviewKey && (
                                <div
                                  className="reportReasonMessage"
                                  style={{
                                    border: "1px solid #f5b5b5",
                                    backgroundColor: "#fff5f5",
                                    borderRadius: "8px",
                                    padding: "12px",
                                    color: "#742a2a",
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: "13px",
                                      fontWeight: 600,
                                      textTransform: "uppercase",
                                      letterSpacing: "0.05em",
                                      marginBottom: "6px",
                                    }}
                                  >
                                    Reported Reason
                                  </div>
                                  <div style={{ lineHeight: 1.5 }}>{reportedReason}</div>
                                </div>
                              )}
                              {!isReported && openReportReviewId === reviewKey && (
                                <div className="writeReviewSection">
                                  <textarea
                                    value={reviewReportText}
                                    onChange={(e) => setReviewReportText(e.target.value)}
                                    placeholder="Write Report here..."
                                    rows={4}
                                  />
                                  {reportError && (
                                    <div className="reportErrorText">{reportError}</div>
                                  )}
                                  <div style={{ marginTop: "10px" }}>
                                    <button
                                      className="submitbtn"
                                      disabled={isSubmittingReport}
                                  onClick={() => handleReportSubmit(item, reviewKey)}
                                    >
                                      {isSubmittingReport ? "Submitting..." : "Submit"}
                                    </button>
                                    <button
                                      className="closebtn"
                                      onClick={closeReportReviewSection}
                                    >
                                      Close
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p>No reviews yet.</p>
                  )}

                  {/* <a href="#" className="allReviews">
                    Read All Reviews
                  </a> */}
                </div>
              </div>



              {/* --------------------------------- */}

            </div>
          </div>
        </div>


    </div>

    </div>
  )
}

export default ProvidersReview;