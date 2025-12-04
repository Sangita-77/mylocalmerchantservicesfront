import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL, IMAGE_BASE_URL } from "../utils/apiManager";
import { trackActivity } from "../utils/activityTracker";
import PreLoader from "../components/PreLoader";
import { AppContext } from "../utils/context";
import placeholderimg from "./../assets/images/placeholderimg.jpg";
import ConnectConfirmationModal from "../components/ConnectConfirmationModal";
import BlockAgentModal from "../components/BlockAgentModal";
import contactlisticon from "../assets/images/contactlisticon.png";
import "./../styles/styles.css";
import { AiOutlineHeart } from "react-icons/ai";

const MerchantListDetails = () => {
  const { id } = useParams();
  const { token } = useContext(AppContext);
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [buttonText, setButtonText] = useState("Connect");
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isSavingFavorite, setIsSavingFavorite] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const fetchMerchantDetails = async () => {
    try {
      setIsLoading(true);
      const body = { merchant_id: id };

      const response = await axios.post(
        `${BASE_URL}/getMerchantAgainstmerchant_id`,
        JSON.stringify(body),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(response?.data?.data || null);
    } catch (error) {
      console.error("Failed to fetch merchant details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getConnectStatus();
    if (id) fetchMerchantDetails();
    if (id) fetchFavoriteStatus();
    if (id) checkBlockedStatus();
  }, [id]);

  const handleConnect = () => {
    const isAuthenticated = localStorage.getItem("is_authenticated");
    const merchant_id = parseInt(localStorage.getItem("merchant_id"), 10);

    if (!id || !isAuthenticated || !merchant_id) {
      navigate("/merchant-service-providers-registration");
    } else {
      setShowModal(true);
    }
  };

  const handleSaveFavorite = async () => {
    const merchant_id = parseInt(localStorage.getItem("merchant_id"), 10);
    const agent_id = parseInt(id, 10);

    if (!merchant_id || !agent_id) {
      alert("Please login as a merchant to save favorites.");
      return;
    }

    try {
      setIsSavingFavorite(true);
      const response = await axios.post(
        `${BASE_URL}/savedFavorite`,
        { merchant_id, agent_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data?.status) {
        const action = response?.data?.action;
        if (action === "added") {
          setIsFavorite(true);
        } else if (action === "removed") {
          setIsFavorite(false);
        }

        // fire-and-forget activity tracking
        trackActivity({
          merchant_id,
          agent_id,
          action: "favorite",
          token,
          meta: { state: action },
        }).catch((err) => console.warn("Failed to log favorite activity", err));
      } else {
        throw new Error(response?.data?.message || "Failed to save favorite.");
      }
    } catch (error) {
      console.error("Failed to save favorite:", error);
      alert("Unable to save favorite. Please try again.");
    } finally {
      setIsSavingFavorite(false);
    }
  };

  const getConnectStatus = async () => {
    try {
      setIsLoading(true);
      const merchant_id = parseInt(localStorage.getItem("merchant_id"), 10);
      const agent_id = parseInt(id, 10);

      const response = await axios.post(
        `${BASE_URL}/getConnectStatus`,
        { user_id: agent_id, merchant_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // console.log(".response.......",response.data);
      if (response.data.connect != null) {
        // console.log("ifffffffffffffffffffffffffff");
        setButtonText(response.data.connect.state || "Connect");
      } else {
        // console.log("elseeeeeeeeeeeeeeeeeeeeeeee");
        // throw new Error("Connection failed");
        setButtonText("Connect");
      }
    } catch (error) {
      console.error("Connection error:", error);
      setButtonText("Connect");
      // alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
      setShowModal(false);
    }
  };

  const fetchFavoriteStatus = async () => {
    const merchant_id = parseInt(localStorage.getItem("merchant_id"), 10);
    const agent_id = parseInt(id, 10);

    if (!merchant_id || !agent_id) {
      setIsFavorite(false);
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/getAllFavorite`,
        { merchant_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data?.status && Array.isArray(response?.data?.favorites)) {
        const match = response.data.favorites.some(
          (fav) => parseInt(fav.agent_id, 10) === agent_id
        );
        setIsFavorite(match);
      } else {
        setIsFavorite(false);
      }
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
      setIsFavorite(false);
    }
  };

  const checkBlockedStatus = async () => {
    const merchant_id = parseInt(localStorage.getItem("merchant_id"), 10);
    const agent_id = parseInt(id, 10);

    if (!merchant_id || !agent_id) {
      setIsBlocked(false);
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/getBlockedUser`,
        { blocker_id: merchant_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data?.status && response?.data?.data?.blockUser) {
        const blockedUsers = response.data.data.blockUser;
        // Check if agent is blocked (action must be "block", not "unblock")
        const isAgentBlocked = blockedUsers.some(
          (blocked) => 
            parseInt(blocked.blocked_id, 10) === agent_id &&
            blocked.action === "block"
        );
        setIsBlocked(isAgentBlocked);
      } else {
        setIsBlocked(false);
      }
    } catch (error) {
      console.error("Failed to check blocked status:", error);
      setIsBlocked(false);
    }
  };

  const handleBlockAgent = () => {
    const merchant_id = parseInt(localStorage.getItem("merchant_id"), 10);
    const agent_id = parseInt(id, 10);

    if (!merchant_id || !agent_id) {
      alert("Please login as a merchant to block agents.");
      return;
    }

    // If already blocked, unblock directly without modal
    if (isBlocked) {
      handleUnblockAgent();
      return;
    }

    // If not blocked, show modal to enter reason
    setShowBlockModal(true);
  };

  const handleUnblockAgent = async () => {
    const merchant_id = parseInt(localStorage.getItem("merchant_id"), 10);
    const agent_id = parseInt(id, 10);

    try {
      setIsBlocking(true);
      const response = await axios.post(
        `${BASE_URL}/blockUser`,
        { 
          blocker_id: merchant_id,
          blocked_id: agent_id,
          reason: "unblock",
          action: "unblock",
          blocker: "merchant",
          blocked: "agent",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data?.status) {
        // alert(response?.data?.message || "User unblocked successfully.");
        // Update blocked status after successful unblock
        setIsBlocked(false);
      } else {
        throw new Error(response?.data?.message || "Failed to unblock user.");
      }
    } catch (error) {
      console.error("Failed to unblock agent:", error);
      alert(error?.response?.data?.message || "Unable to unblock agent. Please try again.");
    } finally {
      setIsBlocking(false);
    }
  };

  const confirmBlockAgent = async (reason) => {
    const merchant_id = parseInt(localStorage.getItem("merchant_id"), 10);
    const agent_id = parseInt(id, 10);

    try {
      setIsBlocking(true);
      const response = await axios.post(
        `${BASE_URL}/blockUser`,
        { 
          blocker_id: merchant_id,
          blocked_id: agent_id,
          reason: reason,
          action: "block",
          blocker: "merchant",
          blocked: "agent",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data?.status) {
        // alert(response?.data?.message || "User blocked successfully.");
        setShowBlockModal(false);
        // Update blocked status after successful block
        setIsBlocked(true);
        // Optionally refresh or update UI
      } else {
        throw new Error(response?.data?.message || "Failed to block user.");
      }
    } catch (error) {
      console.error("Failed to block agent:", error);
      alert(error?.response?.data?.message || "Unable to block agent. Please try again.");
    } finally {
      setIsBlocking(false);
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
      setIsLoading(true);
      const agent_id = parseInt(id, 10);
  
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
    getReviews();
  }, [id]);

  const getPercentage = (count) =>
    totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
  const dataArray = [1, 2];

  return (
    <div className="agentDetailsBoxWrapper">
      <div className="agentDetailsWrapper">
        {isLoading && !showModal ? (
          <div className="merchantDashboardLoaderWrapper">
            <div className="merchantDashboardLoaderContainer">
              <PreLoader />
              <div>Loading...</div>
            </div>
          </div>
        ) : data ? (
          <div className="agentDetailsContainer">
            {/* -------- new design */}

            <div className="userHeaderInfoTopWrap">
              <div className="userImgWrapper">
                <div className="userImg">
                  <img
                    src={
                      data.logo && data.logo.trim() !== ""
                        ? `${IMAGE_BASE_URL}/${data.logo}`
                        : placeholderimg
                    }
                    alt="User Logo"
                    onError={(e) => (e.target.src = placeholderimg)}
                  />
                </div>
              </div>

              <div className="userHeaderInfoTopCon">
                <div className="agentNameWrap">
                  <div className="agentName">
                    {data.first_name && data.last_name
                      ? `${data.first_name} ${data.last_name}`
                      : data.merchant_name}
                  </div>
                  <div className="agentNameActions">
                    <button
                      className={`modalConnectBtn ${
                        buttonText === "Requested"
                          ? "btnRequested"
                          : buttonText === "Connected"
                          ? "btnConnected"
                          : ""
                      }`}
                      onClick={handleConnect}
                      disabled={
                        isLoading || buttonText !== "Connect" ||
                        !localStorage.getItem("is_authenticated") ||
                        !localStorage.getItem("merchant_id") ||
                        isLoading ||
                        buttonText === "Requested" ||
                        buttonText === "Connected"
                      } // When logged in: disabled if Requested, Connected, or loading
                    >
                      {isLoading ? "Checking..." : buttonText}
                    </button>
                    <button
                      className={`modalConnectBtn ${
                        isBlocked ? "btnBlocked" : ""
                      }`}
                      onClick={handleBlockAgent}
                      disabled={
                        !localStorage.getItem("is_authenticated") ||
                        !localStorage.getItem("merchant_id") ||
                        isBlocking
                      } // When logged in: always active, only disabled if blocking in progress
                    >
                      {isBlocking
                        ? isBlocked
                          ? "Unblocking..."
                          : "Blocking..."
                        : isBlocked
                        ? "Unblock"
                        : "Block"}
                    </button>
                    <button
                      type="button"
                      className={`heartIconBtn ${
                        isFavorite ? "heartIconBtnSaved" : ""
                      }`}
                      title="Save to favorites"
                      aria-label="Save to favorites"
                      aria-pressed={isFavorite}
                      onClick={handleSaveFavorite}
                      disabled={
                        !localStorage.getItem("is_authenticated") ||
                        !localStorage.getItem("merchant_id") ||
                        isSavingFavorite
                      }
                    >
                      <AiOutlineHeart size={20} />
                    </button>
                  </div>
                </div>

                <div className="inputWrapCon">
                  <div className="titleField">Address:</div>
                  <div className="titleData">
                    {`${data.city ?? ""} - ${data.zip_code ?? ""}, ${
                      data.state ?? ""
                    }, US`}
                  </div>
                </div>
                <div className="inputWrapCon">
                  <div className="titleField">Merchant Services Type:</div>
                  <div className="titleData">
                    {data.flag === "isos"
                      ? "ISO's"
                      : data.flag === "processors"
                      ? "Processors"
                      : data.flag === "agents"
                      ? "Agents"
                      : "N/A"}
                  </div>
                </div>

                <div className="inputWrapCon">
                  <div className="titleField">Distance Willing to Travel:</div>
                  <div className="titleData">
                    {data.DistanceWilling || "N/A"}
                  </div>
                </div>

                <div className="inputWrapCon">
                  <div className="titleField">
                    Monthly Volume Processed by your merchants:
                  </div>
                  <div className="titleData">
                    {data.VolumeProcessed || "N/A"}
                  </div>
                </div>
              </div>
            </div>

            <div className="userInfoBottomWrap">
              <div className="row">
                <div className="col-lg-3">
                  <div className="inputWrapCon">
                    <div className="titleField">Company Name:</div>
                    <div className="titleData">
                      {data.company_name || "N/A"}
                    </div>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="inputWrapCon">
                    <div className="titleField">Website:</div>
                    <div className="titleData">
                      {data.website ? (
                        <a href={data.website} target="_blank" rel="noreferrer">
                          {data.website}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="inputWrapCon">
                    <div className="titleField">Serviced Clients:</div>
                    <div className="titleData">{data.clientCount || "N/A"}</div>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="inputWrapCon">
                    <div className="titleField">Average Rating:</div>
                    <div className="titleData"><span>4.5</span></div>
                    {/* <div className="titleData">
                      <div className="ratingCol">
                          
                        <span style={{ fontWeight: "500" }}>
                          {data.average_rating ? data.average_rating.toFixed(1) : "0.0"}
                        </span>

                        <div className="starWrap">
                          {[...Array(5)].map((_, index) => {
                            const filled =
                              index < Math.round(data.average_rating || 0);
                            return (
                              <span
                                key={index}
                                style={{
                                  color: filled ? "#FFD700" : "#ccc",
                                  fontSize: "18px",
                                }}
                              >
                                ★
                              </span>
                            );
                          })}
                        </div>

                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>

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

            {/* -------- new design end*/}

            {/* <div className="userHeaderInfo">
              <div className="userImgWrapper">
                <div className="userImg">
                  <img
                    src={
                      data.logo && data.logo.trim() !== ""
                        ? `${IMAGE_BASE_URL}/${data.logo}`
                        : placeholderimg
                    }
                    alt="User Logo"
                    onError={(e) => (e.target.src = placeholderimg)}
                  />
                </div>
              </div>
              <div className="formGroup">
                <div className="agentName">
                  {data.first_name && data.last_name
                    ? `${data.first_name} ${data.last_name}`
                    : data.merchant_name}
                </div>
              </div>
            </div>
            <div className="agentDetailsInfo">
                <div className="dataRowContainer">
                  <div className="dataTitle">Full Address:</div>
                  <div className="data">
                      {`${data.city ?? ""} - ${data.zip_code ?? ""}, ${
                      data.state ?? ""
                      }, US`}
                  </div>
                </div>

                <div className="dataRowContainer">
                <div className="dataTitle">Company Name:</div>
                <div className="data">{data.company_name || "N/A"}</div>
                </div>

                <div className="dataRowContainer">
                <div className="dataTitle">Merchant Services Type:</div>
                <div className="data">
                    {data.flag === "isos"
                    ? "ISO's"
                    : data.flag === "processors"
                    ? "Processors"
                    : data.flag === "agents"
                    ? "Agents"
                    : "N/A"}
                </div>
                </div>

                <div className="dataRowContainer">
                <div className="dataTitle">Website:</div>
                <div className="data">
                    {data.website ? (
                    <a href={data.website} target="_blank" rel="noreferrer">
                        {data.website}
                    </a>
                    ) : (
                    "N/A"
                    )}
                </div>
                </div>

                <div className="dataRowContainer">
                <div className="dataTitle">Distance Willing to Travel:</div>
                <div className="data">{data.DistanceWilling || "N/A"}</div>
                </div>

                {data.clientPublicly === "yes" && (
                <div className="dataRowContainer">
                    <div className="dataTitle">Serviced Clients:</div>
                    <div className="data">{data.clientCount || "N/A"}</div>
                </div>
                )}

                {data.volumePublicly === "yes" && (
                <div className="dataRowContainer">
                    <div className="dataTitle">
                    Monthly Volume Processed by your merchants:
                    </div>
                    <div className="data">{data.VolumeProcessed || "N/A"}</div>
                </div>
                )}
            </div> */}

            {/* <button className="modalConnectBtn" onClick={handleConnect} disabled={isLoading || buttonText === "Requested" || buttonText === "Connected"}>
              {isLoading ? "Checking..." : buttonText}
            </button> */}

            {/* <button
              className={`modalConnectBtn ${
                buttonText === "Requested"
                  ? "btnRequested"
                  : buttonText === "Connected"
                  ? "btnConnected"
                  : ""
              }`}
              onClick={buttonText === "Connect" ? handleConnect : undefined} // only clickable if "Connect"
              disabled={isLoading || buttonText !== "Connect"} // disable if not "Connect"
            >
              {isLoading ? "Checking..." : buttonText}
            </button> */}
          </div>
        ) : (
          <div className="noResultFound">No Merchant Details Found</div>
        )}
      </div>

      {showModal && (
        <ConnectConfirmationModal
          onCancel={() => setShowModal(false)}
          //   onConfirm={confirmConnect}
          isLoading={isLoading}
        />
      )}

      {showBlockModal && (
        <BlockAgentModal
          onCancel={() => setShowBlockModal(false)}
          onConfirm={confirmBlockAgent}
          isLoading={isBlocking}
        />
      )}
    </div>
  );
};

export default MerchantListDetails;
