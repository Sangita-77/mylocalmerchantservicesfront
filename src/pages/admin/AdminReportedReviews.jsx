import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import AdminDashBoardTopBar from "../../components/AdminDashBoardTopBar";
import { AppContext } from "../../utils/context";
import { BASE_URL } from "../../utils/apiManager";
import "../../styles/styles.css";

const statusCopy = {
  0: {
    label: "Pending Review",
    description: "Awaiting admin approval",
    bg: "#fff8e6",
    color: "#92400e",
  },
  1: {
    label: "Approved",
    description: "Approved and removed from listings",
    bg: "#e9f7ef",
    color: "#1e6f43",
  },
  2: {
    label: "Rejected",
    description: "Report rejected",
    bg: "#ffeaea",
    color: "#b91c1c",
  },
};

const AdminReportedReviews = () => {
  const { token } = useContext(AppContext);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      setError("");
      const response = await axios.post(
        `${BASE_URL}/getAllReportedReview`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.status) {
        const items = response.data?.data?.reports || [];
        setReports(items);
      } else {
        setError(response.data?.message || "Unable to fetch reports.");
        setReports([]);
      }
    } catch (err) {
      console.error("Failed to fetch reported reviews", err);
      setError("Connection error while fetching reported reviews.");
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [token]);

  const hasReports = reports.length > 0;

  const renderStatusBadge = (status) => {
    const copy = statusCopy[status] || statusCopy[0];
    return (
      <div
        style={{
          backgroundColor: copy.bg,
          color: copy.color,
          padding: "6px 12px",
          borderRadius: "999px",
          fontSize: "12px",
          fontWeight: 600,
          display: "inline-flex",
          gap: "6px",
          alignItems: "center",
        }}
      >
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: copy.color,
            display: "inline-block",
          }}
        />
        {copy.label}
      </div>
    );
  };

  const renderReportCard = (report) => {
    const review = report.review || {};
    const statusMeta = statusCopy[report.status] || statusCopy[0];
    return (
      <div className="reportedReviewCard" key={report.review_report_id}>
        <div className="reportedReviewCardHeader">
          <div>
            <h4>Report #{report.review_report_id}</h4>
            <p>
              Submitted on{" "}
              {new Date(report.created_at).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
          {renderStatusBadge(report.status)}
        </div>

        <div className="reportedReviewContent">
          <div className="reportedReason">
            <h5>Reported Reason</h5>
            <p>{report.reason || "—"}</p>
            <span style={{ color: statusMeta.color, fontSize: "12px" }}>
              {statusMeta.description}
            </span>
          </div>
          <div className="reportedReviewDetails">
            <div>
              <label>Merchant ID</label>
              <p>{report.merchant_id ?? "—"}</p>
            </div>
            <div>
              <label>Agent ID</label>
              <p>{report.agent_id ?? "—"}</p>
            </div>
            <div>
              <label>Review Rating</label>
              <p>{review.rating ?? "—"}</p>
            </div>
            <div>
              <label>Review Created</label>
              <p>
                {review.created_at
                  ? new Date(review.created_at).toLocaleDateString()
                  : "—"}
              </p>
            </div>
          </div>
          <div className="reportedReviewQuote">
            <label>Original Review</label>
            <p>{review.review || "Review text not available."}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="adminUserlistWrapper adminReportedReviewPage">
      <AdminDashBoardTopBar heading="Reported Reviews" />
      <div className="adminReviewListCon">
        <div className="reportedReviewActions">
          <button className="submitbtn" onClick={fetchReports} disabled={isLoading}>
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error && <div className="errorText">{error}</div>}

        {isLoading && !hasReports ? (
          <p>Loading reported reviews...</p>
        ) : hasReports ? (
          <div className="reportedReviewGrid">
            {reports.map((report) => renderReportCard(report))}
          </div>
        ) : (
          <div className="emptyState">
            <p>No reported reviews yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReportedReviews;

