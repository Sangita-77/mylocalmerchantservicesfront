import React, { useContext, useState, useEffect } from "react";
import './../../styles/styles.css';
import AdminDashBoardTopBar from "../../components/AdminDashBoardTopBar";
import MerchantListComp from "../../components/MerchantListComp";
import axios from "axios";
import { BASE_URL } from "../../utils/apiManager";
import { AppContext } from "../../utils/context";
import { IoStorefrontSharp } from "react-icons/io5";


const AdminMerchantList = () => {

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
            { status: 1 , flag: "merchant services providers" },
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
      setLoading(false);
    }

  };

  const fetchpendingUsers = async () => {
    try {
        const response = await axios.post(
            `${BASE_URL}/getMerchantsList`,
            { status: 0 , flag: "merchant services providers" },
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
      setLoading(false);
    }

  };
  return (
     <div className="adminUserlistWrapper merchantListAdmin">
      
      <AdminDashBoardTopBar heading="Merchant List" />
      <div className="adminDashboardContainer">
            
              <div className='adminUserlIstContainer'>
                 <MerchantListComp Icon={IoStorefrontSharp} approvedUsers={approvedUsers} pendingUsers={pendingUsers} loading={loading} approvedHeading="Approved Merchant" pendingHeading="Pending Merchant" flag="merchant services providers" onRefresh={refreshPage}/>
               </div>
        </div>
    </div>
  )
}

export default AdminMerchantList;