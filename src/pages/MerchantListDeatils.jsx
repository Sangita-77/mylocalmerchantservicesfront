import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL, IMAGE_BASE_URL } from "../utils/apiManager";
import PreLoader from "../components/PreLoader";
import { AppContext } from "../utils/context";
import placeholderimg from "./../assets/images/placeholderimg.jpg";
import ConnectConfirmationModal from "../components/ConnectConfirmationModal";
import "./../styles/styles.css";

const MerchantListDetails = () => {
  const { id } = useParams();
  const { token } = useContext(AppContext);
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
    if (id) fetchMerchantDetails();
  }, [id]);

  const handleConnect = () => {
    const isAuthenticated = localStorage.getItem("is_authenticated");
    const merchant_id = parseInt(localStorage.getItem("merchant_id"), 10);

    if (!id || !isAuthenticated || !merchant_id) {
      navigate("/merchant-registration");
    } else {
      setShowModal(true);
    }
  };

//   const confirmConnect = async () => {
//     try {
//       setIsLoading(true);
//       const merchant_id = parseInt(localStorage.getItem("merchant_id"), 10);

//       const response = await axios.post(
//         `${BASE_URL}/connectFun`,
//         { user_id: id, merchant_id },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.status === 200) {
//         navigate("/merchant/user_connected_history");
//       } else {
//         throw new Error("Connection failed");
//       }
//     } catch (error) {
//       console.error("Connection error:", error);
//       alert("Something went wrong. Please try again.");
//     } finally {
//       setIsLoading(false);
//       setShowModal(false);
//     }
//   };

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
            <div className="userHeaderInfo">
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
            </div>

            <button className="modalConnectBtn" onClick={handleConnect} disabled={isLoading}>
              Connect
            </button>
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
    </div>
  );
};

export default MerchantListDetails;
