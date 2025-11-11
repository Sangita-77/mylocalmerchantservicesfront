import React, { useMemo, useState } from "react";
import "../styles/styles.css";
import { Accordion, Table } from "react-bootstrap";
import AdminRejectPopup from "./AdminRejectPopup";
import { IoMdCheckmark } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

const AdminPendingReview = ({
  reviews = [],
  isLoading = false,
  onApprove,
  onReject,
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const pendingReviews = useMemo(
    () => reviews.filter((review) => Number(review.status) === 0 || review.status === undefined),
    [reviews]
  );

  const handleRejectClick = (review) => {
    setSelectedReview(review);
    setShowPopup(true);
  };

  const handleApproveClick = (review) => {
    if (typeof onApprove === "function") {
      onApprove(review);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedReview(null);
  };

  const renderStars = (rating) => {
    const rounded = Math.round(Number(rating) || 0);
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index}>{index < rounded ? "★" : "☆"}</span>
    ));
  };

  const renderBodyContent = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={6} className="text-center">
            Loading reviews...
          </td>
        </tr>
      );
    }

    if (!pendingReviews.length) {
      return (
        <tr>
          <td colSpan={6} className="text-center">
            No pending reviews found.
          </td>
        </tr>
      );
    }

    return pendingReviews.map((review) => {
      const reviewId = review.id || `${review.merchant_id}-${review.agent_id}`;
      const ratingValue = Number(review.rating) || 0;
      const reviewText = review.review || "-";
      const merchantName =
        review.agent_details?.merchant_name ||
        review.agent_name ||
        review.agent_email ||
        review.agent_id ||
        "-";
      const reviewer =
        review.merchant_details?.merchant_name ||
        review.merchant_details?.company_name ||
        review.merchant_details?.first_name ||
        review.merchant_details?.last_name ||
        review.merchant_name ||
        "-";

      return (
        <tr key={reviewId}>
          <td className="reviewId">{reviewId}</td>
          <td>
            <div className="ratingCol">
              <span>{ratingValue}</span>
              <div className="starWrap">{renderStars(ratingValue)}</div>
            </div>
          </td>
          <td className="reviewText">{reviewText}</td>
          <td>{reviewer}</td>
          <td>{merchantName}</td>
          <td className="actionBtn">
            <button
              className="approveBtn"
              type="button"
              onClick={() => handleApproveClick(review)}
            >
              <IoMdCheckmark /> Approve
            </button>
            <button
              className="rejectBtn"
              type="button"
              onClick={() => handleRejectClick(review)}
            >
              <RxCross2 /> Reject
            </button>
          </td>
        </tr>
      );
    });
  };

  return (
    <>
      <div className="accordionWrap">
        <div className="merchantaccordian-table">
          <Accordion defaultActiveKey={["0"]} alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <div className="d-flex">
                  <div className="merchant-icon"></div>
                  <div className="merchant-heading">Pending Review</div>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <div className="accordianTableWrap">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Id</th>
                        <th>Rating</th>
                        <th>Review</th>
                        <th>Review From</th>
                        <th>Review To</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {renderBodyContent()}
                    </tbody>
                  </Table>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>


      {/* Popup */}
      <AdminRejectPopup
        show={showPopup}
        title="Reject Review"
        onClose={handleClosePopup}
        review={selectedReview}
      />
      
    </>
  );
};

export default AdminPendingReview;
