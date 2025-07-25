import React, { useContext, useState, useEffect } from "react";
import "./../../styles/styles.css";
import AdminDashBoardTopBar from "../../components/AdminDashBoardTopBar";
import MerchantListComp from "../../components/MerchantListComp";
import axios from "axios";
import { BASE_URL } from "../../utils/apiManager";
import { AppContext } from "../../utils/context";
import { BiSolidBadgeDollar } from "react-icons/bi";

const AdminIso = () => {
    const { token } = useContext(AppContext);
    const [approvedUsers, setApprovedUsers] = useState([]);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const refreshPage = () => {
      fetchapprovedUsers(); 
      fetchpendingUsers(); 
    };
  
    useEffect(() => {
      fetchapprovedUsers();
      fetchpendingUsers();
    }, [token]);
  
    const fetchapprovedUsers = async () => {
      try {
          const response = await axios.post(
              `${BASE_URL}/getMerchantsList`,
              { status: 1 , flag: "isos" },
              {
                  headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                  },
              }
          );
  
          if (response.data.status) {
            // console.log("Approveddddddddddddd",response.data);
            setApprovedUsers(response.data.getMerchantList);
          } else {
              console.error(response.data.message);
          }
      } catch (error) {
          console.error("API Error:", error);
      }
      finally {
        setLoading(false); // ✅ called once after both finish
      }
  
    };
  
    const fetchpendingUsers = async () => {
      try {
          const response = await axios.post(
              `${BASE_URL}/getMerchantsList`,
              { status: 0 , flag: "isos" },
              {
                  headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                  },
              }
          );
  
          if (response.data.status) {
            // console.log("pendinggggggggggg",response.data);
            setPendingUsers(response.data.getMerchantList);
          } else {
              console.error(response.data.message);
          }
      } catch (error) {
          console.error("API Error:", error);
      }finally {
        setLoading(false); // ✅ called once after both finish
      }
  
    };
    return (
       <div className="adminUserlistWrapper merchantListAdmin">

<AdminDashBoardTopBar heading="ISO's List" />
        <div className="adminDashboardContainer">
              
                <div className='adminUserlIstContainer'>
                   <MerchantListComp approvedUsers={approvedUsers} pendingUsers={pendingUsers} loading={loading} approvedHeading="Approved Isos" pendingHeading="Pending Isos" flag="ISOs" onRefresh={refreshPage} approvedbackcolor="#003c76" approvedborder="#032648" pendingbackcolor="#023260cf" pendingborder="#032648" approvedIcon={BiSolidBadgeDollar} approvedIconColor="#003c76" approvedIconBgColor="#fff" pendingIconColor="#fff" pendingIconBgColor="#032648"/>
                 </div>
          </div>
      </div>
    )
};

export default AdminIso;
