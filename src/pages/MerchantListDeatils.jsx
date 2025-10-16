import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL, IMAGE_BASE_URL } from "../utils/apiManager";
import PreLoader from "../components/PreLoader";
import { AppContext } from "../utils/context";
import placeholderimg from "./../assets/images/placeholderimg.jpg";
import ConnectConfirmationModal from "../components/ConnectConfirmationModal";
import contactlisticon from "../assets/images/contactlisticon.png";
import "./../styles/styles.css";

const MerchantListDetails = () => {
  const { id } = useParams();
  const { token } = useContext(AppContext);
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [buttonText, setButtonText] = useState("Connect");

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
    getConnectStatus();
    if (id) fetchMerchantDetails();
  }, [id]);

  const handleConnect = () => {
    const isAuthenticated = localStorage.getItem("is_authenticated");
    const merchant_id = parseInt(localStorage.getItem("merchant_id"), 10);

    if (!id || !isAuthenticated || !merchant_id) {
      navigate("/merchant-service-providers-registration");
    } else {
      setShowModal(true);
    }
  };

  const getConnectStatus = async () => {
    try {
      setIsLoading(true);
      const merchant_id = parseInt(localStorage.getItem("merchant_id"), 10);
      const agent_id = parseInt(id, 10);

      const response = await axios.post(
        `${BASE_URL}/getConnectStatus`,
        { user_id: agent_id, merchant_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // console.log(".response.......",response.data);
      if (response.data.connect != null) {
        // console.log("ifffffffffffffffffffffffffff");
        setButtonText(response.data.connect.state || "Connect");
      } else {
        // console.log("elseeeeeeeeeeeeeeeeeeeeeeee");
        // throw new Error("Connection failed");
        setButtonText("Connect");
      }
    } catch (error) {
      console.error("Connection error:", error);
      setButtonText("Connect");
      // alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
      setShowModal(false);
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

  const dataArray = [1, 2];

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
            {/* -------- new design */}

            <div className="userHeaderInfoTopWrap">
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

              <div className="userHeaderInfoTopCon">
                <div className="agentNameWrap">
                  <div className="agentName">
                    {data.first_name && data.last_name
                      ? `${data.first_name} ${data.last_name}`
                      : data.merchant_name}
                  </div>
                  <button
                    className={`modalConnectBtn ${
                      buttonText === "Requested"
                        ? "btnRequested"
                        : buttonText === "Connected"
                        ? "btnConnected"
                        : ""
                    }`}
                    onClick={
                      buttonText === "Connect" ? handleConnect : undefined
                    } // only clickable if "Connect"
                    disabled={isLoading || buttonText !== "Connect"} // disable if not "Connect"
                  >
                    {isLoading ? "Checking..." : buttonText}
                  </button>
                </div>

                <div className="inputWrapCon">
                  <div className="titleField">Address:</div>
                  <div className="titleData">
                    {`${data.city ?? ""} - ${data.zip_code ?? ""}, ${
                      data.state ?? ""
                    }, US`}
                  </div>
                </div>
                <div className="inputWrapCon">
                  <div className="titleField">Merchant Services Type:</div>
                  <div className="titleData">
                    {data.flag === "isos"
                      ? "ISO's"
                      : data.flag === "processors"
                      ? "Processors"
                      : data.flag === "agents"
                      ? "Agents"
                      : "N/A"}
                  </div>
                </div>

                <div className="inputWrapCon">
                  <div className="titleField">Distance Willing to Travel:</div>
                  <div className="titleData">
                    {data.DistanceWilling || "N/A"}
                  </div>
                </div>

                <div className="inputWrapCon">
                  <div className="titleField">
                    Monthly Volume Processed by your merchants:
                  </div>
                  <div className="titleData">
                    {data.VolumeProcessed || "N/A"}
                  </div>
                </div>
              </div>
            </div>

            <div className="userInfoBottomWrap">
              <div className="row">
                <div className="col-lg-3">
                  <div className="inputWrapCon">
                    <div className="titleField">Company Name:</div>
                    <div className="titleData">
                      {data.company_name || "N/A"}
                    </div>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="inputWrapCon">
                    <div className="titleField">Website:</div>
                    <div className="titleData">
                      {data.website ? (
                        <a href={data.website} target="_blank" rel="noreferrer">
                          {data.website}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="inputWrapCon">
                    <div className="titleField">Serviced Clients:</div>
                    <div className="titleData">{data.clientCount || "N/A"}</div>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="inputWrapCon">
                    <div className="titleField">Average Rating:</div>
                    <div className="titleData"><span>4.5</span></div>
                    {/* <div className="titleData">
                      <div className="ratingCol">
                          
                        <span style={{ fontWeight: "500" }}>
                          {data.average_rating ? data.average_rating.toFixed(1) : "0.0"}
                        </span>

                        <div className="starWrap">
                          {[...Array(5)].map((_, index) => {
                            const filled =
                              index < Math.round(data.average_rating || 0);
                            return (
                              <span
                                key={index}
                                style={{
                                  color: filled ? "#FFD700" : "#ccc",
                                  fontSize: "18px",
                                }}
                              >
                                ★
                              </span>
                            );
                          })}
                        </div>

                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>

            <div className="userInfoReviewsWrap">
              <div className="userInfoReviewsCon">
                <h2 className="sectionTitle">Review</h2>

                <div className="ratingTopSection">
                  <div className="row">
                    <div className="col-lg-2">
                      <div className="ratingCol">
                        <span>
                          {data.average_rating
                            ? data.average_rating.toFixed(1)
                            : "0.0"}
                        </span>
                        <div className="starWrap">
                          {[...Array(5)].map((_, index) => {
                            const filled =
                              index < Math.round(data.average_rating || 0);
                            return (
                              <span
                                key={index}
                                style={{
                                  color: filled ? "#FFD700" : "#ccc",
                                }}
                              >
                                ★
                              </span>
                            );
                          })}
                        </div>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          ({data.review_count || 0} review
                          {(data.review_count || 0) !== 1 ? "s" : ""})
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-10">
                      <div className="progressBarWrap">
                        <progress value="75" max="100">
                          75%
                        </progress>
                        <div className="reviewCount">
                          <span>5.0</span> 14k Reviews
                        </div>
                      </div>
                      <div className="progressBarWrap">
                        <progress value="55" max="100">
                          55%
                        </progress>
                        <div className="reviewCount">
                          <span>5.0</span> 5k Reviews
                        </div>
                      </div>
                      <div className="progressBarWrap">
                        <progress value="65" max="100">
                          65%
                        </progress>
                        <div className="reviewCount">
                          <span>5.0</span> 10k Reviews
                        </div>
                      </div>
                      <div className="progressBarWrap">
                        <progress value="80" max="100">
                          80%
                        </progress>
                        <div className="reviewCount">
                          <span>5.0</span> 3k Reviews
                        </div>
                      </div>
                      <div className="progressBarWrap">
                        <progress value="40" max="100">
                          40%
                        </progress>
                        <div className="reviewCount">
                          <span>5.0</span> 1k Reviews
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {dataArray.map((item) => (
                  <div className="ratingBottomSection" key={item}>
                    <div className="ratingHeaderInfo">
                      <div className="ratingheaderInfoLeft">
                        <div className="ratingUserImg">
                          <img src={contactlisticon} alt="User Logo" />
                        </div>
                        <h3 className="ratingUserName">Alexander Rity</h3>
                        <h4 className="ratingUserTime">2 Days Ago</h4>
                      </div>
                      <div className="ratingheaderInforight">
                        <span className="avgRating">5.0</span> 
                        <div className="startWrap">
                          <span>★</span>
                          <span>★</span>
                          <span>★</span>
                          <span>★</span>
                          <span>★</span>
                        </div>
                      </div>
                    </div>

                    <div className="ratingConInfo">
                      <p>
                        Lorem, ipsum dolor sit amet consectetur adipisicing
                        elit. Sunt quis, veniam blanditiis sequi distinctio
                        consectetur quod repudiandae culpa cumque architecto
                        repellendus! Nesciunt ex eius laborum quidem aut omnis,
                        voluptatibus ipsa dolorem unde, ab repudiandae?
                        Quibusdam culpa cupiditate itaque. Et totam neque
                        repellendus quia. Quam accusantium eveniet aliquam quo
                        dolores maxime!
                      </p>
                    </div>
                  </div>
                ))}

                <a href="#" className="allReviews">Read All Reviews</a>
              </div>
            </div>

            {/* -------- new design end*/}

            {/* <div className="userHeaderInfo">
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
            </div> */}

            {/* <button className="modalConnectBtn" onClick={handleConnect} disabled={isLoading || buttonText === "Requested" || buttonText === "Connected"}>
              {isLoading ? "Checking..." : buttonText}
            </button> */}

            {/* <button
              className={`modalConnectBtn ${
                buttonText === "Requested"
                  ? "btnRequested"
                  : buttonText === "Connected"
                  ? "btnConnected"
                  : ""
              }`}
              onClick={buttonText === "Connect" ? handleConnect : undefined} // only clickable if "Connect"
              disabled={isLoading || buttonText !== "Connect"} // disable if not "Connect"
            >
              {isLoading ? "Checking..." : buttonText}
            </button> */}
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
