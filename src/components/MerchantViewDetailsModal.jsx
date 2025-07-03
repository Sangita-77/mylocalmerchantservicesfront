import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/styles.css";
import axios from "axios";
import { BASE_URL } from "../utils/apiManager";
import PreLoader from "../components/PreLoader";
import { AppContext } from "../utils/context";

const MerchantViewDetailsModal = ({ id, handleClose }) => {
  // console.log("Modal data===>", id);
  const[data,setData]=useState(null)
  const { token } = useContext(AppContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
   const fetchDataToggleViewDetailsModal=async()=>{
    setIsLoading(true)
         const body = {
         "merchant_id":id
        };
        try{
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
       setData(response?.data?.data)
       setIsLoading(false)
        }catch(error){ 
          console.error("Failed to fetch merchant details:", error.response || error.message);

        }
  
       
       
     
   }
  useEffect(()=>{
fetchDataToggleViewDetailsModal()
  },[id])

  const handleConnect = async () => {
    setIsLoading(true); // Start loader
    const user_id = id;
    const isAuthenticated = localStorage.getItem("is_authenticated");
    const merchant_id = parseInt(localStorage.getItem("merchant_id"), 10);
  
    if (!user_id || !isAuthenticated) {
      navigate("/registration");
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
        alert(`Server Error: ${error.response.data.message || "Check console for details."}`);
      } else if (error.request) {
        alert("No response from server. Please check your internet or try again later.");
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false); // Stop loader
    }
  };
  
  
  

  return (
    <>
      <div className="merchantDetailsOverlay">
        <div className="merchantDetailsModalCloseBtnContainer" onClick={handleClose}>
          <div className="merchantDetailsModalCloseBtn"></div>
          &times;
        </div>
        <div className="merchantDetailsModalWrapper">
          {isLoading&& (<div style={{display:"flex",justifyContent:"center",alignItems:"center",minHeight: "300px"}}><PreLoader/> </div>)}
          {data && 
          <div className="merchantDetailsModalContainer">
            
            <div className="dataRowContainer">
              <div className="dataTitle">Name : </div>
              <div className="data">{data?.merchant_name}</div>
            </div>

            <div className="dataRowContainer">
              <div className="dataTitle">Email : </div>
              <div className="data">{data?.user_id}</div>
            </div>

            <div className="dataRowContainer">
              <div className="dataTitle">Industry : </div>
              <div className="data">{data?.industry}</div>
            </div>

            <div className="dataRowContainer">
              <div className="dataTitle">Phone : </div>
              <div className="data">{data?.phone}</div>
            </div>

            <div className="dataRowContainer">
              <div className="dataTitle">Type of service : </div>
              <div className="data">{data?.type_of_service}</div>
            </div>

            <div className="dataRowContainer">
              <div className="dataTitle">Street : </div>
              <div className="data">{data?.street}</div>
            </div>

            <div className="dataRowContainer">
              <div className="dataTitle">City : </div>
              <div className="data">{data?.city}</div>
            </div>

            <div className="dataRowContainer">
              <div className="dataTitle">State : </div>
              <div className="data">{data?.state}</div>
            </div>

            <div className="dataRowContainer">
              <div className="dataTitle">Zip code : </div>
              <div className="data">{data?.zip_code}</div>
            </div>

            <div className="dataRowContainer">
              <div className="dataTitle">Country : </div>
              <div className="data">{data?.county}</div>
            </div>

            <div className="dataRowContainer">
              <div className="dataTitle">Full Address : </div>
              <div className="data">
                {data?.street +
                  ", " +
                  data?.city +
                  " - " +
                  data?.zip_code +
                  ", " +
                  data?.state +
                  ", " +
                  data?.county}
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
              <div className="dataTitle">Email : </div>
              <div className="data">{data?.email}</div>
            </div>

            <div className="dataRowContainer">
              <div className="dataTitle">Website : </div>
              <div className="data">{data?.website}</div>
            </div>

            <div className="dataRowContainer">
              <div className="dataTitle">Company description : </div>
              <div className="data">{data?.company_description}</div>
            </div>

            <button
              className="modalConnectBtn"
              onClick={handleConnect}
              disabled={isLoading}
              style={{ cursor: "pointer" }}
            >
              {isLoading ? "Connecting..." : "Connect"}
            </button>
          </div>
          }
          
          
        </div>
      </div>
    </>
  );
};

export default MerchantViewDetailsModal;
