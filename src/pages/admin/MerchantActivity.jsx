import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/styles.css";
import { BASE_URL } from "../../utils/apiManager";
import { AppContext } from "../../utils/context";
import AdminDashBoardTopBar from "../../components/AdminDashBoardTopBar";
import PreLoader from "../../components/PreLoader";
import DashBoardFooter from "../../components/DashBoardFooter";
import { routes } from "../../utils/routes";
import { FiDownload } from "react-icons/fi";

const MerchantActivity = () => {
  const { merchantId } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AppContext);

  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const parsedMerchantId = useMemo(
    () => (merchantId ? Number(merchantId) : null),
    [merchantId]
  );

  useEffect(() => {
    if (!parsedMerchantId || !token) {
      setError("Missing merchant id or authentication token.");
      setLoading(false);
      return;
    }
    fetchActivity(parsedMerchantId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedMerchantId, token]);

  const fetchActivity = async (merchant_id) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${BASE_URL}/getAllTrackActivity`,
        { merchant_id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.status) {
        setActivity(response?.data?.favorites || []);
      } else {
        setActivity([]);
        setError(response?.data?.message || "No activity found.");
      }
    } catch (err) {
      console.error("Failed to fetch merchant activity", err);
      setActivity([]);
      setError("Unable to fetch merchant activity. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderPayload = (payload) => {
    if (!payload || typeof payload !== "object") return "—";
    return Object.entries(payload).map(([key, value]) => (
      <div key={key} className="activityPayloadItem">
        <strong>{key}:</strong>&nbsp;
        <span>{value === null || value === "" ? "—" : String(value)}</span>
      </div>
    ));
  };

  // Helper function to escape CSV values
  const escapeCSV = (value) => {
    if (value === null || value === undefined) return "";
    const stringValue = String(value);
    if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  // Helper function to format payload for CSV
  const formatPayloadForCSV = (payload) => {
    if (!payload || typeof payload !== "object") return "";
    try {
      // Convert object to formatted string (key: value pairs)
      const entries = Object.entries(payload)
        .map(([key, value]) => {
          const val = value === null || value === "" ? "—" : String(value);
          return `${key}: ${val}`;
        })
        .join("; ");
      return entries || "";
    } catch (error) {
      return JSON.stringify(payload);
    }
  };

  const handleDownloadCSV = () => {
    if (!Array.isArray(activity) || activity.length === 0) {
      alert("No activity data available to download");
      return;
    }

    // CSV headers
    const headers = ["Action", "Agent ID", "Source", "Payload", "Timestamp"];
    
    // Convert data to CSV rows
    const csvRows = activity.map((item) => {
      const action = item.action || "—";
      const agentId = item.agent_id ?? "—";
      const source = item.source_model 
        ? item.source_model.split("\\").pop() 
        : "—";
      const payload = formatPayloadForCSV(item.payload);
      const timestamp = item.created_at
        ? new Date(item.created_at).toLocaleString()
        : "—";
      
      return [
        escapeCSV(action),
        escapeCSV(agentId),
        escapeCSV(source),
        escapeCSV(payload),
        escapeCSV(timestamp)
      ].join(",");
    });
    
    // Combine headers and rows
    const csvContent = [headers.join(","), ...csvRows].join("\n");
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `merchant_activity_${parsedMerchantId}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="adminUserlistWrapper merchantActivityPage">
      <AdminDashBoardTopBar heading="Merchant Activity" />

      <div className="adminDashboardContainer">
        <div className="merchantActivityHeader">
          <div>
            <h2>Activity Timeline</h2>
            <p>Merchant ID: {parsedMerchantId ?? "N/A"}</p>
          </div>
          <div className="merchantActivityHeaderActions">
            <button
              className="tableActionBtn"
              onClick={handleDownloadCSV}
              disabled={loading || !Array.isArray(activity) || activity.length === 0}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "8px",
                padding: "10px 20px",
                minWidth: "150px",
                justifyContent: "center",
                marginTop: "100px"
              }}
            >
              <FiDownload size={18} />
              Download CSV
            </button>
            <button
              className="tableActionBtn"
              onClick={() => navigate(routes.admin_user_list())}
              style={{ 
                padding: "10px 20px",
                marginTop: "100px"
              }}
            >
              Back to Merchant List
            </button>
          </div>
        </div>

        <div className="merchantListTableSection">
          <div className="merchantListSingleTablePart">
            <div className="tableWrapper" style={{ position: "relative" }}>
              {loading && (
                <div className="tableOverlayLoader">
                  <PreLoader text="Fetching activity..." />
                </div>
              )}

              {!loading && error && (
                <div className="infoText" style={{ padding: "1rem" }}>
                  {error}
                </div>
              )}

              {!loading && !error && activity.length === 0 && (
                <div className="infoText" style={{ padding: "1rem" }}>
                  No activity recorded yet.
                </div>
              )}

              {!loading && activity.length > 0 && (
                <table className="tableContainer">
                  <thead className="theadContainer">
                    <tr>
                      <th className="th">Action</th>
                      <th className="th">Agent ID</th>
                      <th className="th">Source</th>
                      <th className="th">Payload</th>
                      <th className="th">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activity.map((item) => (
                      <tr key={item.id} className="tableRow">
                        <td className="td">{item.action || "—"}</td>
                        <td className="td">{item.agent_id ?? "—"}</td>
                        <td className="td">
                          {item.source_model ? (
                            <span title={item.source_model}>
                              {item.source_model.split("\\").pop()}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="td activityPayloadCell">
                          {renderPayload(item.payload)}
                        </td>
                        <td className="td">
                          {item.created_at
                            ? new Date(item.created_at).toLocaleString()
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* <DashBoardFooter /> */}
    </div>
  );
};

export default MerchantActivity;


