import React, { useMemo } from "react";
import "../styles/styles.css";
import { Accordion, Table } from "react-bootstrap";

const AdminRejectedReview = ({ reviews = [], isLoading = false }) => {
  const rejectedReviews = useMemo(
    () => reviews.filter((r) => Number(r.status) === 2 || r.status === undefined),
    [reviews]
  );

  const renderStars = (rating) => {
    const rounded = Math.round(Number(rating) || 0);
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index}>{index < rounded ? "★" : "☆"}</span>
    ));
  };

  return (
    <>
      <div className="accordionWrap rejectReviewList">
        <div className="merchantaccordian-table">
          <Accordion defaultActiveKey={["0"]} alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <div className="d-flex">
                  <div className="merchant-icon"></div>
                  <div className="merchant-heading">Rejected Review</div>
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
                        <th>Why Rejected</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td colSpan={7} className="text-center">Loading reviews...</td>
                        </tr>
                      ) : rejectedReviews.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center">No rejected reviews found.</td>
                        </tr>
                      ) : (
                        rejectedReviews.map((review) => {
                          const reviewId = review.review_id || `${review.merchant_id}-${review.agent_id}`;
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
                          const reason = review.rejected_reason || review.reason || "-";

                          return (
                            <tr className="tr" key={reviewId}>
                              <td>{reviewId}</td>
                              <td>
                                <div className="ratingCol">
                                  <span>{ratingValue}</span>
                                  <div className="starWrap">{renderStars(ratingValue)}</div>
                                </div>
                              </td>
                              <td className="reviewText">{reviewText}</td>
                              <td>{reviewer}</td>
                              <td>{merchantName}</td>
                              <td>{reason}</td>
                              <td className="actionBtn">Rejected</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </Table>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>
    </>
  );
};

export default AdminRejectedReview;
