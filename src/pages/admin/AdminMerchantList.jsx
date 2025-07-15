import React from 'react';
import './../../styles/styles.css';
import AdminDashBoardTopBar from "../../components/AdminDashBoardTopBar";
import MerchantListComp from "../../components/MerchantListComp";

const AdminMerchantList = () => {
  return (
     <div className="adminUserlistWrapper merchantListAdmin">
      <div className="adminDashboardContainer">
            <AdminDashBoardTopBar heading="Merchant List" />
              <div className='adminUserlIstContainer'>
                 <MerchantListComp/>
               </div>
        </div>
    </div>
  )
}

export default AdminMerchantList;