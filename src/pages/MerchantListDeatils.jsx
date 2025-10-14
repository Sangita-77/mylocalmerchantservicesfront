import React from "react";
import "./../styles/styles.css";

function MerchantListDeatils() {
  return (
    <div>
        <div className="userDetailsBoxWrapper">
          
          <div className="merchantDetailsModalWrapper">
            {isLoading ? (
              <div className="merchantDashboardLoaderWrapper">
                <div className="merchantDashboardLoaderContainer">
                  <PreLoader />
                  <div>Loading...</div>
                </div>
              </div>
            ) : (
              data && (
                <div className="merchantDetailsModalContainer">
                  <div className="userHeaderInfo">
                    <div className="userImgWrapper">
                      <div className="userImg">
                        {/* <img src={placeholderimg} alt="" /> */}
                        <img
                          src={
                            data.logo && data.logo.trim() !== ""
                              ? `${IMAGE_BASE_URL}/${data.logo}`
                              : placeholderimg
                          }
                          alt="User Logo"
                        />
                      </div>
                    </div>
                    <div className="formGroup">
                      <div className="msf_name data">
                        {data?.first_name && data?.last_name
                          ? `${data.first_name} ${data.last_name}`
                          : data?.merchant_name}
                      </div>
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
                    <div className="dataTitle">
                      Merchant Services Provides Type:{" "}
                    </div>
                    {data?.flag === "isos" && <div className="data">ISO's</div>}
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
                    <div className="dataTitle">
                      Distance Willing to Travel :{" "}
                    </div>
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
              )
            )}
          </div>
        </div>
    </div>
  );
}

export default MerchantListDeatils;
