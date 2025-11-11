import React, { useMemo } from "react";
import "../styles/styles.css";
import { Accordion, Table } from "react-bootstrap";

const AdminApproveReview = ({ reviews = [], isLoading = false }) => {
  const approvedReviews = useMemo(
    () => reviews.filter((r) => Number(r.status) === 1 || r.status === undefined),
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
      <div className="accordionWrap approveReviewList">
        <div className="merchantaccordian-table">
          <Accordion defaultActiveKey={["0"]} alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <div className="d-flex">
                  <div className="merchant-icon"></div>
                  <div className="merchant-heading">Approved Review</div>
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
                      {isLoading ? (
                        <tr>
                          <td colSpan={6} className="text-center">Loading reviews...</td>
                        </tr>
                      ) : approvedReviews.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center">No approved reviews found.</td>
                        </tr>
                      ) : (
                        approvedReviews.map((review) => {
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

                          return (
                            <tr className="tr" key={reviewId}>
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
                              <td className="actionBtn">Approved</td>
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

export default AdminApproveReview;
