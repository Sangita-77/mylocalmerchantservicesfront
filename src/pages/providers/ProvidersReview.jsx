import React from 'react'
import DashboardTopHeading from '../../components/DashboardTopHeading';
import ProviderDashboardTopBar from '../../components/ProviderDashboardTopBar';



const ProvidersReview = () => {
  return (
    <div className='userConnectedHistoryPageWrapper agentReviewWrap'>

    <ProviderDashboardTopBar heading="Reviews" />

    <div className="userConnectedHistoryContainer">
        <div className="merchantContainerHeader">
            <div className="merchantHeaderTitle"><DashboardTopHeading text="Reviews List"/> </div>
        </div>


        <div className="agentReviewWrap">

        </div>


    </div>

    </div>
  )
}

export default ProvidersReview;