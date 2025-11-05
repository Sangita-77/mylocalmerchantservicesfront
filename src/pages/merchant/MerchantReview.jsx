import React, { useContext, useState, useEffect } from "react";
import "./../../styles/styles.css";


import { PiEyeLight } from "react-icons/pi";
import axios from "axios";
import { BASE_URL } from "../../utils/apiManager";
import { AppContext } from "../../utils/context";
import PreLoader from "../../components/PreLoader";

import { AiOutlineDelete } from "react-icons/ai";
import DashboardTopHeading from "../../components/DashboardTopHeading";
import DashBoardTopBar from "../../components/DashBoardTopBar";
import placeholderimg from "../../assets/images/placeholderimg.jpg";
import { IMAGE_BASE_URL } from "../../utils/apiManager";

const MerchantReview = () => {
  const [loading, setLoading] = useState(true);


  

  return (
    <div className="userConnectedHistoryPageWrapper reviews_section">
      <DashBoardTopBar heading="Reviews" />

      <div className="userConnectedHistoryContainer">
        <div className="merchantContainerHeader">
          <div className="merchantHeaderTitle">
            <DashboardTopHeading text="Review Details" />{" "}
          </div>
        </div>

        {/* --------- New design  */}
        <div className="tableContainerWrap">
          <table className="tableContainer">
            <thead className="theadContainer">
              <tr>
                <th className="th">Created</th>
                <th className="th">Name</th>
                <th className="th">E-mails</th>
                <th className="th">Actions</th>
              </tr>
            </thead>
          </table>
          <div className="tbodyContainer">
            <div className="accordion" id="accordionExample">
              <div className="accordion-item">
              <h2 className="accordion-header" id="heading1">
                <div className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1" aria-expanded="true" aria-controls="collapse1">
                  <div className="td">Created</div>
                  <div className="td">Name</div>
                  <div className="td">Email</div>

                  <div className="userBtn">
                    
                      <>
                        <button className="viewButton" data-bs-toggle="tooltip" data-bs-placement="auto" title="View Details" ><PiEyeLight size={22} color="white" /></button>
                        <button className="delButton" data-bs-toggle="tooltip" data-bs-placement="auto" title="Delete"><AiOutlineDelete size={22} color="#E60E4E" style={{ cursor: "pointer" }} /></button>
                      </>
                    
                  </div>
                </div>
              </h2>
              <div id="collapse1" className="accordion-collapse collapse show" aria-labelledby="heading1" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  <div className="merchantContainerHeader">
                      <div className="merchantHeaderTitle">
                        <DashboardTopHeading text="Company Information" />{" "}
                      </div>
                    </div>
                  <div className="profileDetailsCon">
                    <div className="profileDetailsConHead">
                      <div className="userHeaderInfoTopWrap d-flex">                                

                        <div className="userHeaderInfoTopCon">
                          
                          <div className="inputWrapCon company_area">
                            <div className="userImg order-2"><img src={ placeholderimg } /></div>
                            <div className="usercompany order-1">
                              <div className="titleField">Company Name *</div>
                              <div className="titleData">Company_name</div>
                            </div>
                          </div>

                          <div className="inputWrapCon company_area_details">  
                            <h3 className="titleField">Company Mailing Address *</h3>
                            <div className="company_details_row">
                              <h5>Street Details</h5>
                              <div className="companydata">connection?.city</div>
                            </div>
                            <div className="company_details_row cell_format">
                              <div className="company_cell">
                                <h5>City:</h5>
                                <div className="companydata">connection?.city</div>
                              </div>
                              <div className="company_cell">
                                <h5>State:</h5>
                                <div className="companydata">connection?.state</div>
                              </div>                                      
                              <div className="company_cell companycountry">
                                <h5>Country:</h5>
                                <div className="companydata">US</div>
                              </div>                                      
                              <div className="company_cell companyzip">
                                <h5>Zip:</h5>
                                <div className="companydata">connection?.zip_code</div>
                              </div>                                      
                              <div className="company_cell companyphone">
                                <h5>Phone:</h5>
                                <div className="companydata">connection?.phone</div>
                              </div>                                      
                              <div className="company_cell companyemail">
                                <h5>Email:</h5>
                                <div className="companydata">connection.merchant_id</div>
                              </div>                                      
                              <div className="company_cell companyweb">
                                <h5>Website:</h5>
                                <div className="companydata">connection?.website</div>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>

                      <div className="inputWrapCon company_description">
                        <div className="titleField">Company Description</div>
                        <div className="titleData">connection?.company_description</div>
                      </div>

                      <div className="inputWrapCon marketing_details">
                        <div className="titleField">Marketing Details</div>
                        <div className="marketing_block d-flex">
                          <div className="marketing_cell">
                              <h5>Bullet Point 1</h5>
                              <div className="companydata">connection?.bulletOne</div>
                          </div>
                          <div className="marketing_cell">
                              <h5>Bullet Point 2</h5>
                              <div className="companydata">connection?.bulletTwo</div>
                          </div>
                          <div className="marketing_cell">
                              <h5>Bullet Point 3</h5>
                              <div className="companydata">connection?.bulletThree</div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="heading2">
                <div className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2" aria-expanded="false" aria-controls="collapse2">
                  <div className="td">Created</div>
                  <div className="td">Name</div>
                  <div className="td">Email</div>

                  <div className="userBtn">
                    
                      <>
                        <button className="viewButton" data-bs-toggle="tooltip" data-bs-placement="auto" title="View Details" ><PiEyeLight size={22} color="white" /></button>
                        <button className="delButton" data-bs-toggle="tooltip" data-bs-placement="auto" title="Delete"><AiOutlineDelete size={22} color="#E60E4E" style={{ cursor: "pointer" }} /></button>
                      </>
                    
                  </div>
                </div>
              </h2>
              <div id="collapse2" className="accordion-collapse collapse" aria-labelledby="heading2" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  <div className="merchantContainerHeader">
                      <div className="merchantHeaderTitle">
                        <DashboardTopHeading text="Company Information" />{" "}
                      </div>
                    </div>
                  <div className="profileDetailsCon">
                    <div className="profileDetailsConHead">
                      <div className="userHeaderInfoTopWrap d-flex">                                

                        <div className="userHeaderInfoTopCon">
                          
                          <div className="inputWrapCon company_area">
                            <div className="userImg order-2"><img src={ placeholderimg } /></div>
                            <div className="usercompany order-1">
                              <div className="titleField">Company Name *</div>
                              <div className="titleData">Company_name</div>
                            </div>
                          </div>

                          <div className="inputWrapCon company_area_details">  
                            <h3 className="titleField">Company Mailing Address *</h3>
                            <div className="company_details_row">
                              <h5>Street Details</h5>
                              <div className="companydata">connection?.city</div>
                            </div>
                            <div className="company_details_row cell_format">
                              <div className="company_cell">
                                <h5>City:</h5>
                                <div className="companydata">connection?.city</div>
                              </div>
                              <div className="company_cell">
                                <h5>State:</h5>
                                <div className="companydata">connection?.state</div>
                              </div>                                      
                              <div className="company_cell companycountry">
                                <h5>Country:</h5>
                                <div className="companydata">US</div>
                              </div>                                      
                              <div className="company_cell companyzip">
                                <h5>Zip:</h5>
                                <div className="companydata">connection?.zip_code</div>
                              </div>                                      
                              <div className="company_cell companyphone">
                                <h5>Phone:</h5>
                                <div className="companydata">connection?.phone</div>
                              </div>                                      
                              <div className="company_cell companyemail">
                                <h5>Email:</h5>
                                <div className="companydata">connection.merchant_id</div>
                              </div>                                      
                              <div className="company_cell companyweb">
                                <h5>Website:</h5>
                                <div className="companydata">connection?.website</div>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>

                      <div className="inputWrapCon company_description">
                        <div className="titleField">Company Description</div>
                        <div className="titleData">connection?.company_description</div>
                      </div>

                      <div className="inputWrapCon marketing_details">
                        <div className="titleField">Marketing Details</div>
                        <div className="marketing_block d-flex">
                          <div className="marketing_cell">
                              <h5>Bullet Point 1</h5>
                              <div className="companydata">connection?.bulletOne</div>
                          </div>
                          <div className="marketing_cell">
                              <h5>Bullet Point 2</h5>
                              <div className="companydata">connection?.bulletTwo</div>
                          </div>
                          <div className="marketing_cell">
                              <h5>Bullet Point 3</h5>
                              <div className="companydata">connection?.bulletThree</div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="heading3">
                <div className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse3" aria-expanded="false" aria-controls="collapse3">
                  <div className="td">Created</div>
                  <div className="td">Name</div>
                  <div className="td">Email</div>

                  <div className="userBtn">
                    
                      <>
                        <button className="viewButton" data-bs-toggle="tooltip" data-bs-placement="auto" title="View Details" ><PiEyeLight size={22} color="white" /></button>
                        <button className="delButton" data-bs-toggle="tooltip" data-bs-placement="auto" title="Delete"><AiOutlineDelete size={22} color="#E60E4E" style={{ cursor: "pointer" }} /></button>
                      </>
                    
                  </div>
                </div>
              </h2>
              <div id="collapse3" className="accordion-collapse collapse" aria-labelledby="heading3" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  <div className="merchantContainerHeader">
                      <div className="merchantHeaderTitle">
                        <DashboardTopHeading text="Company Information" />{" "}
                      </div>
                    </div>
                  <div className="profileDetailsCon">
                    <div className="profileDetailsConHead">
                      <div className="userHeaderInfoTopWrap d-flex">                                

                        <div className="userHeaderInfoTopCon">
                          
                          <div className="inputWrapCon company_area">
                            <div className="userImg order-2"><img src={ placeholderimg } /></div>
                            <div className="usercompany order-1">
                              <div className="titleField">Company Name *</div>
                              <div className="titleData">Company_name</div>
                            </div>
                          </div>

                          <div className="inputWrapCon company_area_details">  
                            <h3 className="titleField">Company Mailing Address *</h3>
                            <div className="company_details_row">
                              <h5>Street Details</h5>
                              <div className="companydata">connection?.city</div>
                            </div>
                            <div className="company_details_row cell_format">
                              <div className="company_cell">
                                <h5>City:</h5>
                                <div className="companydata">connection?.city</div>
                              </div>
                              <div className="company_cell">
                                <h5>State:</h5>
                                <div className="companydata">connection?.state</div>
                              </div>                                      
                              <div className="company_cell companycountry">
                                <h5>Country:</h5>
                                <div className="companydata">US</div>
                              </div>                                      
                              <div className="company_cell companyzip">
                                <h5>Zip:</h5>
                                <div className="companydata">connection?.zip_code</div>
                              </div>                                      
                              <div className="company_cell companyphone">
                                <h5>Phone:</h5>
                                <div className="companydata">connection?.phone</div>
                              </div>                                      
                              <div className="company_cell companyemail">
                                <h5>Email:</h5>
                                <div className="companydata">connection.merchant_id</div>
                              </div>                                      
                              <div className="company_cell companyweb">
                                <h5>Website:</h5>
                                <div className="companydata">connection?.website</div>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>

                      <div className="inputWrapCon company_description">
                        <div className="titleField">Company Description</div>
                        <div className="titleData">connection?.company_description</div>
                      </div>

                      <div className="inputWrapCon marketing_details">
                        <div className="titleField">Marketing Details</div>
                        <div className="marketing_block d-flex">
                          <div className="marketing_cell">
                              <h5>Bullet Point 1</h5>
                              <div className="companydata">connection?.bulletOne</div>
                          </div>
                          <div className="marketing_cell">
                              <h5>Bullet Point 2</h5>
                              <div className="companydata">connection?.bulletTwo</div>
                          </div>
                          <div className="marketing_cell">
                              <h5>Bullet Point 3</h5>
                              <div className="companydata">connection?.bulletThree</div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>

        </div>
        {/* --------- New design  */}
      </div>

    </div>
  );
};

export default MerchantReview;
