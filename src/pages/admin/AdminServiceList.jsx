import React, { useContext, useState, useEffect } from "react";
import './../../styles/styles.css';

import axios from "axios";
import { BASE_URL } from "../../utils/apiManager";
import { AppContext } from "../../utils/context";
import { AiOutlineDelete } from "react-icons/ai";
import { GoPencil } from "react-icons/go";
import AdminDashBoardTopBar from "../../components/AdminDashBoardTopBar";
import PreLoader from "../../components/PreLoader";
import ConfirmModal from "../../components/ConfirmModal";
import UserDetailsModal from "../../components/UserDetailsModal"; 
import Tooltip from "../../components/Tooltip";
import DashBoardFooter from "../../components/DashBoardFooter";

const AdminServiceList = () => {

  const [loading, setLoading] = useState(true);
 


  return (
    <>
      <div className="contactlistWrapper">
      
      <AdminDashBoardTopBar heading={"Service  List"} />
      <div className="adminDashboardContainer">
        

        <div className="contactlistContainer servicelist">
          <div className="accordionWrap_title">
            <div className="title_td">Service Name</div>
            <div className="desc_td">Description</div>
            <div className="action_td">Actions</div>
          </div>
          <div className="accordionWrap">
          <div className="accordion" id="accordionExample">
            <div className="accordion-item" key="">
                  <h2 className="accordion-header" id="heading1">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapse1"
                      aria-expanded="true"
                      aria-controls="collapse1"
                    >
                      <div className="servicename">Service Name</div><div className="servicedesc">Description</div>
                    </button>
                    <button className="editButton" onClick="" data-bs-toggle="tooltip" data-bs-placement="auto" title="Edit"><GoPencil color="green" /></button>
                    <button className="delButton" onClick=""    
                        data-bs-toggle="tooltip"
                        data-bs-placement="auto"
                        title="Delete">
                          <AiOutlineDelete size={22} color="#E60E4E" />
                    </button>
                  </h2>
                  <div
                    id="collapse1"
                    className="accordion-collapse collapse show"
                    aria-labelledby="heading1"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      <table className="tableContainer">
                        <thead className="theadContainer">
                          <tr>
                            <th className="th">Brand Name</th>
                            <th className="th">Description</th>
                            <th className="thActions">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="tbodyContainer">
                          <tr className="tr">
                            <td className="td">Name1</td>
                            <td className="td">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.</td>
                            <td className="td">
                              <button className="editButton" onClick="" data-bs-toggle="tooltip" data-bs-placement="auto" title="Edit"><GoPencil color="green" /></button>
                              <button className="delButton" onClick=""    
                                  data-bs-toggle="tooltip"
                                  data-bs-placement="auto"
                                  title="Delete">
                                    <AiOutlineDelete size={22} color="#E60E4E" />
                              </button>
                            </td>
                          </tr>
                          <tr className="tr">
                            <td className="td">Name2</td>
                            <td className="td">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.</td>
                            <td className="td">
                              <button className="editButton" onClick="" data-bs-toggle="tooltip" data-bs-placement="auto" title="Edit"><GoPencil color="green" /></button>
                              <button className="delButton" onClick=""    
                                  data-bs-toggle="tooltip"
                                  data-bs-placement="auto"
                                  title="Delete">
                                    <AiOutlineDelete size={22} color="#E60E4E" />
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="add_band">
                        <button>Add new</button>
                      </div>


                    </div>
                  </div>
                </div>

                <div className="accordion-item" key="">
                  <h2 className="accordion-header" id="heading2">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapse2"
                      aria-expanded="false"
                      aria-controls="collapse2"
                    >
                      <div className="servicename">Service Name 2</div><div className="servicedesc">Description2</div>
                    </button>
                    <button className="editButton" onClick="" data-bs-toggle="tooltip" data-bs-placement="auto" title="Edit"><GoPencil color="green" /></button>
                    <button className="delButton" onClick=""    
                        data-bs-toggle="tooltip"
                        data-bs-placement="auto"
                        title="Delete">
                          <AiOutlineDelete size={22} color="#E60E4E" />
                    </button>
                  </h2>
                  <div
                    id="collapse2"
                    className="accordion-collapse collapse"
                    aria-labelledby="heading2"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      <table className="tableContainer">
                        <thead className="theadContainer">
                          <tr>
                            <th className="th">Brand Name</th>
                            <th className="th">Description</th>
                            <th className="thActions">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="tbodyContainer">
                          <tr className="tr">
                            <td className="td">Name1</td>
                            <td className="td">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.</td>
                            <td className="td">
                              <button className="editButton" onClick="" data-bs-toggle="tooltip" data-bs-placement="auto" title="Edit"><GoPencil color="green" /></button>
                              <button className="delButton" onClick=""    
                                  data-bs-toggle="tooltip"
                                  data-bs-placement="auto"
                                  title="Delete">
                                    <AiOutlineDelete size={22} color="#E60E4E" />
                              </button>
                            </td>
                          </tr>
                          <tr className="tr">
                            <td className="td">Name2</td>
                            <td className="td">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.</td>
                            <td className="td">
                              <button className="editButton" onClick="" data-bs-toggle="tooltip" data-bs-placement="auto" title="Edit"><GoPencil color="green" /></button>
                              <button className="delButton" onClick=""    
                                  data-bs-toggle="tooltip"
                                  data-bs-placement="auto"
                                  title="Delete">
                                    <AiOutlineDelete size={22} color="#E60E4E" />
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="add_band">
                        <button>Add new</button>
                      </div>
                    </div>
                  </div>
                </div>




          </div>
          </div>
        </div>

      </div>

      {/* {showConfirmModal && (
        <ConfirmModal
          title="Delete Conatct"
          message="Are you sure you want to delete this Contact?"
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirmModal(false)}
        />
      )} */}
    </div>
      

    </>
  )
}

export default AdminServiceList;