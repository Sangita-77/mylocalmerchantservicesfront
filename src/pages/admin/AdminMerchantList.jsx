import React from 'react';
import './../../styles/styles.css';
import AdminDashBoardTopBar from "../../components/AdminDashBoardTopBar";
import MerchantList from "../../components/MerchantList";

const AdminMerchantList = () => {
  return (
     <div className="adminUserlistWrapper">
      <div className="adminDashboardContainer">
            <AdminDashBoardTopBar heading="Merchant List" />
              <div className='adminUserlIstContainer'>
                 <MerchantList/>
               </div>
        </div>
    </div>
  )
}

export default AdminMerchantList;