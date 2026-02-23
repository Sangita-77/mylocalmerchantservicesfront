import React, { useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import AdminDashBoardTopBar from "../../components/AdminDashBoardTopBar";
import { AppContext } from "../../utils/context";
import { BASE_URL } from "../../utils/apiManager";
import { Accordion, Table } from "react-bootstrap";
import { IoMdCheckmark } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import "../../styles/styles.css";

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

  const pendingReports = useMemo(
    () => reports.filter((report) => Number(report.status) === 0),
    [reports]
  );

  const approvedReports = useMemo(
    () => reports.filter((report) => Number(report.status) === 1),
    [reports]
  );

  const rejectedReports = useMemo(
    () => reports.filter((report) => Number(report.status) === 2),
    [reports]
  );

  const renderStars = (rating) => {
    const rounded = Math.round(Number(rating) || 0);
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index}>{index < rounded ? "★" : "☆"}</span>
    ));
  };

  const renderPendingReports = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={8} className="text-center">
            Loading reported reviews...
          </td>
        </tr>
      );
    }

    if (pendingReports.length === 0) {
      return (
        <tr>
          <td colSpan={8} className="text-center">
            No pending reported reviews found.
          </td>
        </tr>
      );
    }

    return pendingReports.map((report) => {
      const review = report.review || {};
      const rowLoading = actionState.loadingId === report.review_report_id;
      const ratingValue = Number(review.rating) || 0;

      return (
        <tr key={report.review_report_id}>
          <td className="reviewId">{report.review_report_id}</td>
          <td>
            {new Date(report.created_at).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </td>
          <td>{report.merchant_id ?? "—"}</td>
          <td>{report.agent_id ?? "—"}</td>
          <td>
            <div className="ratingCol">
              <span>{ratingValue}</span>
              <div className="starWrap">{renderStars(ratingValue)}</div>
            </div>
          </td>
          <td className="reviewText">{report.reason || "—"}</td>
          <td className="reviewText">{review.review || "Review text not available."}</td>
          <td className="actionBtn">
            <button
              className="approveBtn"
              type="button"
              onClick={() => updateReportStatus(report.review_report_id, 1)}
              disabled={rowLoading}
            >
              <IoMdCheckmark /> {rowLoading ? "..." : "Approve"}
            </button>
            <button
              className="rejectBtn"
              type="button"
              onClick={() => updateReportStatus(report.review_report_id, 2)}
              disabled={rowLoading}
            >
              <RxCross2 /> Reject
            </button>
          </td>
        </tr>
      );
    });
  };

  const renderApprovedReports = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={8} className="text-center">
            Loading reported reviews...
          </td>
        </tr>
      );
    }

    if (approvedReports.length === 0) {
      return (
        <tr>
          <td colSpan={8} className="text-center">
            No approved reported reviews found.
          </td>
        </tr>
      );
    }

    return approvedReports.map((report) => {
      const review = report.review || {};
      const ratingValue = Number(review.rating) || 0;

      return (
        <tr className="tr" key={report.review_report_id}>
          <td className="reviewId">{report.review_report_id}</td>
          <td>
            {new Date(report.created_at).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </td>
          <td>{report.merchant_id ?? "—"}</td>
          <td>{report.agent_id ?? "—"}</td>
          <td>
            <div className="ratingCol">
              <span>{ratingValue}</span>
              <div className="starWrap">{renderStars(ratingValue)}</div>
            </div>
          </td>
          <td className="reviewText">{report.reason || "—"}</td>
          <td className="reviewText">{review.review || "Review text not available."}</td>
          <td className="actionBtn">Approved</td>
        </tr>
      );
    });
  };

  const renderRejectedReports = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={8} className="text-center">
            Loading reported reviews...
          </td>
        </tr>
      );
    }

    if (rejectedReports.length === 0) {
      return (
        <tr>
          <td colSpan={8} className="text-center">
            No rejected reported reviews found.
          </td>
        </tr>
      );
    }

    return rejectedReports.map((report) => {
      const review = report.review || {};
      const ratingValue = Number(review.rating) || 0;

      return (
        <tr className="tr" key={report.review_report_id}>
          <td className="reviewId">{report.review_report_id}</td>
          <td>
            {new Date(report.created_at).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </td>
          <td>{report.merchant_id ?? "—"}</td>
          <td>{report.agent_id ?? "—"}</td>
          <td>
            <div className="ratingCol">
              <span>{ratingValue}</span>
              <div className="starWrap">{renderStars(ratingValue)}</div>
            </div>
          </td>
          <td className="reviewText">{report.reason || "—"}</td>
          <td className="reviewText">{review.review || "Review text not available."}</td>
          <td className="actionBtn">Rejected</td>
        </tr>
      );
    });
  };

  return (
    <>
      <div className="adminUserlistWrapper adminReviewList">
        <AdminDashBoardTopBar heading="Reported Reviews" />

        <div className="adminReviewListCon">
          {error && <div className="errorText">{error}</div>}
          {actionState.error && (
            <div className="errorText" style={{ marginTop: "10px" }}>
              {actionState.error}
            </div>
          )}

          {/* Pending Reported Reviews */}
          <div className="accordionWrap">
            <div className="merchantaccordian-table">
              <Accordion defaultActiveKey={["0"]} alwaysOpen>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <div className="d-flex">
                      <div className="merchant-icon"></div>
                      <div className="merchant-heading">Pending Reported Review</div>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="accordianTableWrap">
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Report ID</th>
                            <th>Submitted On</th>
                            <th>Merchant</th>
                            <th>Agent</th>
                            <th>Rating</th>
                            <th>Reason</th>
                            <th>Review</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>{renderPendingReports()}</tbody>
                      </Table>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </div>

          {/* Approved Reported Reviews */}
          <div className="accordionWrap approveReviewList">
            <div className="merchantaccordian-table">
              <Accordion defaultActiveKey={["0"]} alwaysOpen>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <div className="d-flex">
                      <div className="merchant-icon"></div>
                      <div className="merchant-heading">Approved Reported Review</div>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="accordianTableWrap">
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Report ID</th>
                            <th>Submitted On</th>
                            <th>Merchant</th>
                            <th>Agent</th>
                            <th>Rating</th>
                            <th>Reason</th>
                            <th>Review</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>{renderApprovedReports()}</tbody>
                      </Table>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </div>

          {/* Rejected Reported Reviews */}
          <div className="accordionWrap rejectReviewList">
            <div className="merchantaccordian-table">
              <Accordion defaultActiveKey={["0"]} alwaysOpen>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <div className="d-flex">
                      <div className="merchant-icon"></div>
                      <div className="merchant-heading">Rejected Reported Review</div>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="accordianTableWrap">
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Report ID</th>
                            <th>Submitted On</th>
                            <th>Merchant</th>
                            <th>Agent</th>
                            <th>Rating</th>
                            <th>Reason</th>
                            <th>Review</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>{renderRejectedReports()}</tbody>
                      </Table>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminReportedReviews;

