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
  const [actionState, setActionState] = useState({
    loadingId: null,
    error: "",
  });

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

  const updateReportStatus = async (reportId, status) => {
    if (!reportId || token == null) return;
    try {
      setActionState({ loadingId: reportId, error: "" });
      const response = await axios.post(
        `${BASE_URL}/ReportReviewStatusUpdate`,
        {
          review_report_id: reportId,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.status) {
        const updated = response.data?.data;
        setReports((prev) =>
          prev.map((report) =>
            report.review_report_id === reportId
              ? { ...report, ...updated, status }
              : report
          )
        );
      } else {
        setActionState({
          loadingId: null,
          error: response.data?.message || "Unable to update status.",
        });
        return;
      }
      setActionState({ loadingId: null, error: "" });
    } catch (err) {
      console.error("Failed to update report status", err);
      setActionState({
        loadingId: null,
        error: "Connection error while updating status.",
      });
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
        {actionState.error && (
          <div className="errorText" style={{ marginTop: "10px" }}>
            {actionState.error}
          </div>
        )}

        {isLoading && !hasReports ? (
          <p>Loading reported reviews...</p>
        ) : hasReports ? (
          <div
            className="reportedReviewTableWrapper"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <table
              className="reportedReviewTable"
              style={{ maxWidth: "1200px", width: "90%" }}
            >
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Submitted On</th>
                  <th>Merchant</th>
                  <th>Agent</th>
                  <th>Rating</th>
                  <th>Reason</th>
                  <th>Review</th>
                  <th>Status</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => {
                  const review = report.review || {};
                  const isPending = Number(report.status) === 0;
                  const rowLoading = actionState.loadingId === report.review_report_id;
                  return (
                    <tr key={report.review_report_id}>
                      <td>{report.review_report_id}</td>
                      <td>
                        {new Date(report.created_at).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                      <td>{report.merchant_id ?? "—"}</td>
                      <td>{report.agent_id ?? "—"}</td>
                      <td>{review.rating ?? "—"}</td>
                      <td>
                        <div className="reasonCell">
                          <strong>{report.reason || "—"}</strong>
                          <div className="reasonMeta">
                            {(statusCopy[report.status] || statusCopy[0])
                              .description}
                          </div>
                        </div>
                      </td>
                      <td className="reviewCell">
                        {review.review || "Review text not available."}
                      </td>
                      <td>{renderStatusBadge(report.status)}</td>
                      <td>
                        {isPending ? (
                          <div className="reportedActionBtns">
                            <button
                              className="submitbtn"
                              disabled={rowLoading}
                              onClick={() =>
                                updateReportStatus(report.review_report_id, 1)
                              }
                            >
                              {rowLoading ? "Updating..." : "Approve"}
                            </button>
                            <button
                              className="closebtn"
                              disabled={rowLoading}
                              onClick={() =>
                                updateReportStatus(report.review_report_id, 2)
                              }
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: "12px", color: "#666" }}>
                            {Number(report.status) === 1
                              ? "Approved"
                              : "Rejected"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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

