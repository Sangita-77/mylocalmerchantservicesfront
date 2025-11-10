import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL, IMAGE_BASE_URL } from "./../../utils/apiManager";
import PreLoader from "./../../components/PreLoader";
import { AppContext } from "./../../utils/context";
import DashboardTopHeading from '../../components/DashboardTopHeading';
import ProviderDashboardTopBar from '../../components/ProviderDashboardTopBar';



const ProvidersReview = () => {

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useContext(AppContext);


  const [ratingStats, setRatingStats] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });

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

        // console.log(".........reviewsWithMerchant..........",reviewsWithMerchant);
  
        //  Set reviews with merchant info
        setReviews(reviewsWithMerchant);
  
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


  return (
    <div className='userConnectedHistoryPageWrapper agentReviewWrap'>

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
                    reviews.map((item, index) => (
                      <div className="ratingBottomSection" key={item.id || index}>
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