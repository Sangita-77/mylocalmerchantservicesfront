import React, { useContext, useState, useEffect } from "react";
import "./../../styles/styles.css";
import AdminDashBoardTopBar from "../../components/AdminDashBoardTopBar";
import MerchantListComp from "../../components/MerchantListComp";
import axios from "axios";
import { BASE_URL } from "../../utils/apiManager";
import { AppContext } from "../../utils/context";
import { Accordion, Table } from "react-bootstrap";
import { MdRealEstateAgent } from "react-icons/md";
import { PiEyeLight } from "react-icons/pi";
import { GoPencil } from "react-icons/go";
import { AiOutlineDelete } from "react-icons/ai";
import AdminPendingReview from "../../components/AdminPendingReview";
import AdminApproveReview from "../../components/AdminApproveReview";
import AdminRejectedReview from "../../components/AdminRejectedReview";

const AdminReview = () => {
  const { token } = useContext(AppContext);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [rejectedUsers, setRejectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
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
  
      const response = await axios.post(
        `${BASE_URL}/getAllReviewRating`,
        { },
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
        // setAverageRating(data.average_rating || 0);
        // setTotalReviews(data.total_reviews || 0);
  
        const reviews = data.review || [];
  
        //  Get unique merchant_ids (avoid duplicate calls)
        const merchantIds = [...new Set(reviews.map((r) => r.merchant_id))];
        const agentIds = [...new Set(reviews.map((r) => r.agent_id))];
  
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

        const agentPromises = agentIds.map(async (agent_id) => {
          try {
            const res = await axios.post(
              `${BASE_URL}/getMerchantAgainstmerchant_id`,
              { merchant_id: agent_id },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            return { agent_id, agent: res.data.data || {} };
          } catch (err) {
            console.error(`Error fetching agent ${agent_id}:`, err);
            return { agent_id, agent: {} };
          }
        });
  
        const merchantResults = await Promise.all(merchantPromises);
        const agentResults = await Promise.all(agentPromises);
  
        //  Map merchant and agent details into the reviews
        const reviewsWithDetails = reviews.map((review) => {
          const merchantMatch = merchantResults.find(
            (m) => m.merchant_id === review.merchant_id
          );
          const agentMatch = agentResults.find(
            (a) => a.agent_id === review.agent_id
          );
          return {
            ...review,
            merchant_details: merchantMatch ? merchantMatch.merchant : {},
            agent_details: agentMatch ? agentMatch.agent : {},
          };
        });

        console.log(".........reviewsWithDetails..........",reviewsWithDetails);
  
        //  Set reviews with merged details
        setReviews(reviewsWithDetails);

        const pending = reviewsWithDetails.filter(
          (review) => Number(review.status) === 0
        );
        const approved = reviewsWithDetails.filter(
          (review) => Number(review.status) === 1
        );
        const rejected = reviewsWithDetails.filter(
          (review) => Number(review.status) === 2
        );

        setPendingUsers(pending);
        setApprovedUsers(approved);
        setRejectedUsers(rejected);
  
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

  return (
    <>
      <div className="adminUserlistWrapper adminReviewList">
        <AdminDashBoardTopBar heading="Review List" />

        <div className="adminReviewListCon">
          <AdminPendingReview
            reviews={pendingUsers}
            isLoading={isLoading}
          />
          <AdminApproveReview
            reviews={approvedUsers}
            isLoading={isLoading}
          />
          <AdminRejectedReview
            reviews={rejectedUsers}
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
};

export default AdminReview;
