import React, { useContext, useEffect, useState } from "react";
import "../../styles/styles.css";
import axios from "axios";
import DashBoardTopBar from "../../components/DashBoardTopBar";
import DashboardTopHeading from "../../components/DashboardTopHeading";
import PreLoader from "../../components/PreLoader";
import { AppContext } from "../../utils/context";
import { BASE_URL } from "../../utils/apiManager";
import { useNavigate } from "react-router-dom";
import { routes } from "../../utils/routes";

const MerchantSavedAgents = () => {
  const { token } = useContext(AppContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const getAgentDetails = async (agentId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/getMerchantAgainstmerchant_id`,
        JSON.stringify({ merchant_id: agentId }),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response?.data?.data || {};
    } catch (err) {
      console.error(`Failed to fetch agent details for ${agentId}:`, err);
      return {};
    }
  };

  const fetchFavorites = async () => {
    const merchantId = parseInt(localStorage.getItem("merchant_id"), 10);

    if (!merchantId) {
      setError("Please login as a merchant to view saved agents.");
      setFavorites([]);
      return;
    }

    try {
      setError("");
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}/getFavoriteAgainstMerchant`,
        { merchant_id: merchantId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data?.status) {
        const rawFavorites = response?.data?.favorites;
        const favoritesArray = Array.isArray(rawFavorites)
          ? rawFavorites
          : rawFavorites
          ? [rawFavorites]
          : [];

        const enrichedFavorites = await Promise.all(
          favoritesArray.map(async (favorite) => {
            if (!favorite?.agent_id) return favorite;
            const agentDetails = await getAgentDetails(favorite.agent_id);
            return {
              ...favorite,
              name: agentDetails?.merchant_name,
              company_name: agentDetails?.company_name,
              state: agentDetails?.state,
            };
          })
        );

        setFavorites(enrichedFavorites);

        // console.log("....................enrichedFavorites..................",enrichedFavorites);
      } else {
        setFavorites([]);
        setError("No saved agents found.");
      }
    } catch (err) {
      console.error("Failed to fetch saved agents:", err);
      setError("Unable to load saved agents. Please try again later.");
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const timestamp = Date.parse(dateString);
    if (Number.isNaN(timestamp)) return "—";
    return new Date(timestamp).toLocaleDateString();
  };

  const handleViewAgent = (agentId) => {
    if (!agentId) return;
    navigate(routes.agent_details(agentId));
  };

  return (
    <div className="userConnectedHistoryPageWrapper merchantSavedAgents">
      <DashBoardTopBar heading="Saved Agents" />

      <div className="userConnectedHistoryContainer">
        <div className="merchantContainerHeader">
          <div className="merchantHeaderTitle">
            <DashboardTopHeading text="Saved Agents" />
          </div>
        </div>

        <div className="merchantListTableSection">
          <div className="merchantListSingleTablePart">
            {/* <div className="tableTitle">Favorites</div> */}

            <div className="tableWrapper" style={{ position: "relative" }}>
              {loading && (
                <div className="tableOverlayLoader">
                  <PreLoader text="Loading saved agents..." />
                </div>
              )}

              {!loading && error && (
                <div className="infoText" style={{ padding: "1rem" }}>
                  {error}
                </div>
              )}

              {!loading && !error && favorites.length === 0 && (
                <div className="infoText" style={{ padding: "1rem" }}>
                  You have not saved any agents yet.
                </div>
              )}

              {!loading && favorites.length > 0 && (
                <table className="tableContainer">
                  <thead className="theadContainer" style={{ backgroundColor: "#71cdea" }}>
                    <tr>
                      <th className="th">Name</th>
                      <th className="th">Company</th>
                      <th className="th">State</th>
                      <th className="th">Saved On</th>
                      <th className="th" style={{ width: "120px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {favorites.map((favorite) => (
                      <tr className="tableRow" key={favorite?.agent_id}>
                        <td className="td">{favorite?.name || "—"}</td>
                        <td className="td">{favorite?.company_name || "—"}</td>
                        <td className="td">{favorite?.state || "—"}</td>
                        <td className="td">{formatDate(favorite?.created_at)}</td>
                        <td className="td">
                          <button
                            className="tableActionBtn"
                            onClick={() => handleViewAgent(favorite?.agent_id)}
                          >
                            View
                          </button>
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
    </div>
  );
};

export default MerchantSavedAgents;

