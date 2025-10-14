import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/styles.css";
import axios from "axios";
import { BASE_URL } from "../utils/apiManager";
import PreLoader from "../components/PreLoader";
import { AppContext } from "../utils/context";
import { IoMdClose } from "react-icons/io";
import { IMAGE_BASE_URL } from "../utils/apiManager";
import placeholderimg from "./../assets/images/placeholderimg.jpg";
// import placeholderimg from "./../assets/images/placeholderimg.jpg";
// import { IMAGE_BASE_URL } from "../utils/apiManager";

const MerchantViewDetailsModal = ({ id, handleClose }) => {
  // console.log("Modal data===>", id);
  const [data, setData] = useState(null);
  const { token } = useContext(AppContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const fetchDataToggleViewDetailsModal = async () => {
    setIsLoading(true);
    const body = {
      merchant_id: id,
    };
    try {
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
      //  console.log("Toggle response=====>", response?.data.data);
      setData(response?.data?.data);
      setIsLoading(false);
    } catch (error) {
      console.error(
        "Failed to fetch merchant details:",
        error.response || error.message
      );
    }
  };
  useEffect(() => {
    fetchDataToggleViewDetailsModal();
  }, [id]);

  const handleConnect = async () => {
    setIsLoading(true); // Start loader
    const user_id = id;
    const isAuthenticated = localStorage.getItem("is_authenticated");
    const merchant_id = parseInt(localStorage.getItem("merchant_id"), 10);

    if (!user_id || !isAuthenticated) {
      navigate("/merchant-registration");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/connectFun`,
        { user_id, merchant_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Connection failed.");
      }

      // console.log("Connection successful:", response.data);
      navigate("/merchant/user_connected_history");
    } catch (error) {
      console.error("Error while connecting:", error);
      if (error.response) {
        alert(
          `Server Error: ${
            error.response.data.message || "Check console for details."
          }`
        );
      } else if (error.request) {
        alert(
          "No response from server. Please check your internet or try again later."
        );
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false); // Stop loader
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="merchantDetailsOverlay">
        <div className={`userDetailsBoxWrapper ${isOpen ? "open" : ""}`}>
          <div className="merchantDetailsModalCloseBtnContainer">
            <div className="merchantDetailsModalCloseBtn" onClick={handleClose}>
              <IoMdClose color="#2A2626" size={24} />
            </div>
          </div>
          <div className="merchantDetailsModalWrapper">
            {isLoading && (
              <div>
                <PreLoader />{" "}
      <div className={`userDetailsBoxWrapper ${isOpen ? "open" : ""}`}>
      <div className=" " >
          <div className="merchantDetailsModalCloseBtn" onClick={handleClose}>
          <IoMdClose color="#2A2626" size={24} />
          </div>
        </div>
        <div className="merchantDetailsModalWrapper">
        
        {isLoading ? (
        // 26.06.25
        <div className="merchantDashboardLoaderWrapper">
          <div className="merchantDashboardLoaderContainer">
            <PreLoader />
            <div>Loading...</div>
          </div>
        </div>
        // 26.06.25
      ) : (
          data && 
          <div className="merchantDetailsModalContainer">
            <div className="userHeaderInfo">
              <div className="userImgWrapper">

                <div className="userImg">
                  {/* <img src={placeholderimg} alt="" /> */}
                  <img
                    src={data.logo && data.logo.trim() !== '' ? `${IMAGE_BASE_URL}/${data.logo}` : placeholderimg}
                    alt="User Logo"
                  />
                </div>
              </div>
              <div className="formGroup">
                <div className="msf_name data">{data?.first_name && data?.last_name
                  ? `${data.first_name} ${data.last_name}`
                  : data?.merchant_name}</div>
              </div>
            </div>
            {/*             
            <div className="dataRowContainer">
              <div className="dataTitle">Name : </div>
              <div className="data">{data?.first_name} {data?.merchant_name ?? data?.merchant_name}</div>
            </div> */}

            {/* <div className="dataRowContainer">
              <div className="dataTitle">Email : </div>
              <div className="data">{data?.user_id}</div>
            </div> */}

            {/* <div className="dataRowContainer">
              <div className="dataTitle">Phone : </div>
              <div className="data">{data?.phone}</div>
            </div> */}

            <div className="dataRowContainer">
              <div className="dataTitle">Full Address : </div>
              <div className="data">
                { data?.city +
                  " - " +
                  data?.zip_code +
                  ", " +
                  data?.state +
                  ", " +
                  "US"}
              </div>
            </div>

            <div className="dataRowContainer">
              <div className="dataTitle">Company Name : </div>
              <div className="data">{data?.company_name}</div>
            </div>

            <div className="dataRowContainer">
              <div className="dataTitle">Merchant Services Provides Type: </div>
              {data?.flag === "isos" && (
                <div className="data">ISO's</div>
              )}
              {data?.flag === "processors" && (
                <div className="data">Processors</div>
              )}
              {data?.flag === "agents" && (
                <div className="data">Agents</div>
              )}
            </div>

            <div className="dataRowContainer">
              <div className="dataTitle">Website : </div>
              <div className="data">{data?.website || "NA"}</div>
            </div>

            <div className="dataRowContainer">
              <div className="dataTitle">Distance Willing to Travel : </div>
              <div className="data">{data?.DistanceWilling}</div>
            </div>
            {data?.clientPublicly === "yes" && (
              <div className="dataRowContainer">
                <div className="dataTitle">Serviced Clients :</div>
                <div className="data">{data?.clientCount}</div>
              </div>
            )}
            {data && (
              <div className="merchantDetailsModalContainer">
                {/* <div className="userHeaderInfo">
                  <div className="userImg">
                    <img
                      src={
                        data.logo && data.logo.trim() !== ""
                          ? `${IMAGE_BASE_URL}/${data.logo}`
                          : placeholderimg
                      }
                      alt="User Logo"
                    />
                  </div>
                  <div className="formGroup">
                    <div className="data">
                      {data?.first_name} {data?.last_name}
                    </div>
                  </div>
                </div> */}

                <div className="dataRowContainer">
                  <div className="dataTitle">Name : </div>
                  <div className="data">
                    {data?.first_name} {data?.last_name}
                  </div>
                </div>

                <div className="dataRowContainer">
                  <div className="dataTitle">Email : </div>
                  <div className="data">{data?.user_id}</div>
                </div>

                <div className="dataRowContainer">
                  <div className="dataTitle">Phone : </div>
                  <div className="data">{data?.phone}</div>
                </div>

                <div className="dataRowContainer">
                  <div className="dataTitle">Full Address : </div>
                  <div className="data">
                    {data?.city +
                      " - " +
                      data?.zip_code +
                      ", " +
                      data?.state +
                      ", " +
                      "US"}
                  </div>
                </div>

                <div className="dataRowContainer">
                  <div className="dataTitle">Company Name : </div>
                  <div className="data">{data?.company_name}</div>
                </div>

                <div className="dataRowContainer">
                  <div className="dataTitle">Merchant Type : </div>
                  <div className="data">{data?.flag}</div>
                </div>

                <div className="dataRowContainer">
                  <div className="dataTitle">Website : </div>
                  <div className="data">{data?.website || "NA"}</div>
                </div>

                <div className="dataRowContainer">
                  <div className="dataTitle">Distance Willing to Travel : </div>
                  <div className="data">{data?.DistanceWilling}</div>
                </div>
                {data?.clientPublicly === "yes" && (
                  <div className="dataRowContainer">
                    <div className="dataTitle">Serviced Clients :</div>
                    <div className="data">{data?.clientCount}</div>
                  </div>
                )}

                {data?.volumePublicly === "yes" && (
                  <div className="dataRowContainer">
                    <div className="dataTitle">
                      Monthly Volume Processed by your merchants :
                    </div>
                    <div className="data">{data?.VolumeProcessed}</div>
                  </div>
                )}

                <button
                  className="modalConnectBtn"
                  onClick={handleConnect}
                  disabled={isLoading}
                  style={{ cursor: "pointer" }}
                >
                  {isLoading ? "Connecting..." : "Connect"}
                </button>
              </div>
            )}
          </div>
          
        )}
          
        </div>
        </div>
      </div>
    </>
  );
};

export default MerchantViewDetailsModal;
