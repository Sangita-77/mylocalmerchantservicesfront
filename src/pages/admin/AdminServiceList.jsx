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
  const { token } = useContext(AppContext);
  const [servicesData, setServicesData] = useState([]);

  useEffect(() => {
    fetchServicesAndBrand();
  }, []);


  const fetchServicesAndBrand = async () => {
    try {
      const body = { }; 
      const res = await axios.post(
        `${BASE_URL}/getServicesAndBrand`,
        JSON.stringify(body),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (res.data.status) {
        console.log("API Response:", res.data);
        const apiData = res.data.data;
        setServicesData(apiData);
      } else {
        // setUserList({ connect: [] }); 
      }
    } catch (error) {
      console.error("Error fetching connected history:", error);
    } finally {
      setLoading(false);
    }
  };
 


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
          {loading ? (
            <PreLoader />
          ) : (
            <div className="accordionWrap">
              <div className="accordion" id="accordionExample">
                {servicesData.map((serviceItem, index) => (
                  <div className="accordion-item" key={serviceItem.id}>
                    <h2 className="accordion-header" id={`heading${index}`}>
                      <button
                        className={`accordion-button ${index === 0 ? "" : "collapsed"}`}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse${index}`}
                        aria-expanded={index === 0 ? "true" : "false"}
                        aria-controls={`collapse${index}`}
                      >
                        <div className="servicename">
                          {serviceItem.type || "No Type"}
                        </div>
                        <div className="servicedesc">Description (if any)</div>
                      </button>

                      <button
                        className="editButton"
                        data-bs-toggle="tooltip"
                        data-bs-placement="auto"
                        title="Edit"
                      >
                        <GoPencil color="green" />
                      </button>
                      <button
                        className="delButton"
                        data-bs-toggle="tooltip"
                        data-bs-placement="auto"
                        title="Delete"
                      >
                        <AiOutlineDelete size={22} color="#E60E4E" />
                      </button>
                    </h2>

                    <div
                      id={`collapse${index}`}
                      className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
                      aria-labelledby={`heading${index}`}
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
                            {serviceItem.services && serviceItem.services.length > 0 ? (
                              serviceItem.services.map((brandItem) => (
                                <tr className="tr" key={brandItem.id}>
                                  <td className="td">{brandItem.brand}</td>
                                  <td className="td">Brand description (optional)</td>
                                  <td className="td">
                                    <button
                                      className="editButton"
                                      data-bs-toggle="tooltip"
                                      data-bs-placement="auto"
                                      title="Edit"
                                    >
                                      <GoPencil color="green" />
                                    </button>
                                    <button
                                      className="delButton"
                                      data-bs-toggle="tooltip"
                                      data-bs-placement="auto"
                                      title="Delete"
                                    >
                                      <AiOutlineDelete size={22} color="#E60E4E" />
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="3" className="td text-center">
                                  No brands found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>

                        <div className="add_band">
                          <button>Add new</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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