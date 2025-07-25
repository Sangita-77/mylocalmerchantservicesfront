import React, { useContext, useState, useEffect } from "react";
import "./../../styles/styles.css";
import AdminDashBoardTopBar from "../../components/AdminDashBoardTopBar";
import axios from "axios";
import { BASE_URL } from "../../utils/apiManager";
import { AppContext } from "../../utils/context";
import { AiOutlineDelete } from "react-icons/ai";
import { PiEyeLight } from "react-icons/pi";
import PreLoader from "../../components/PreLoader";
import contactlisticon from "../../assets/images/contactlisticon.png";
import ConfirmModal from "../../components/ConfirmModal";
import Tooltip from "../../components/Tooltip";
import * as bootstrap from 'bootstrap';

const ContactList = () => {

  const [loading, setLoading] = useState(true);
  const [ContactList, setContactList] = useState({ contactList: [] });

  const { token } = useContext(AppContext);

  useEffect(() => {
    fetchContactHistory();
  }, []);


  const fetchContactHistory = async () => {
    try {
      const body = { }; 
      const res = await axios.post(
        `${BASE_URL}/getContactList`,
        JSON.stringify(body),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (res.data.status) {
        // console.log("API Response:", res.data); 
        setContactList(res.data); 
      } else {
        setContactList({ connect: [] }); 
      }
    } catch (error) {
      console.error("Error fetching connected history:", error);
    } finally {
      setLoading(false);
    }
  };

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleDeleteClick = (user_id) => {
    setSelectedUserId(user_id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      const body = { contact_id : selectedUserId };
      const res = await axios.post(
        `${BASE_URL}/deleteContact`,
        JSON.stringify(body),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (res.data.status) {
        fetchContactHistory(); // Refresh list
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setShowConfirmModal(false);
      setSelectedUserId(null);
    }
  };

  useEffect(() => {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      const existing = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
      if (!existing) {
        new bootstrap.Tooltip(tooltipTriggerEl, {
          customClass: 'custom-tooltip',
          placement: 'auto',
          fallbackPlacements: ['top'],
          boundary: 'window',
        });
      }
    });
  }, []);
  


  return (
    <div className="contactlistWrapper">
      
      <AdminDashBoardTopBar heading={"Contact  List"} />
      <div className="adminDashboardContainer">
        

        <div className="contactlistContainer">
          <div className="accordionWrap">
          <div className="accordion" id="accordionExample">
            {loading ? (
              <div>
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <PreLoader />
                </div>
              </div>
            ) : Array.isArray(ContactList.contactList) && ContactList.contactList.length > 0 ? (
              ContactList.contactList.map((contact, index) => (
                <div className="accordion-item" key={contact.contact_id}>
                  <h2 className="accordion-header" id={`heading${index}`}>
                    <button
                      className={`accordion-button ${index !== 0 ? 'collapsed' : ''}`}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse${index}`}
                      aria-expanded={index === 0 ? "true" : "false"}
                      aria-controls={`collapse${index}`}
                    >
                      <img src={contactlisticon} alt="" /> {contact.name}
                    </button>
                    <button className="delButton" onClick={() => {
                            handleDeleteClick(contact.contact_id);
                        }}    
                        data-bs-toggle="tooltip"
                        data-bs-placement="auto"
                        title="Delete">
                          <AiOutlineDelete size={22} color="#E60E4E" />
                    </button>
                  </h2>
                  <div
                    id={`collapse${index}`}
                    className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                    aria-labelledby={`heading${index}`}
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body row">
                      <div className="col-lg-3">Email :</div> <div className="col-lg-9">{contact.email}</div>
                      <div className="col-lg-3">Phone :</div> <div className="col-lg-9">{contact.phone}</div>
                      <div className="col-lg-3">Message :</div> <div className="col-lg-9">{contact.message}</div>
                      {/* <table className="table">
                        <tbody>
                          <tr>
                            <td>Email :</td>
                            <td>{contact.email}</td>
                          </tr>
                          <tr>
                            <td>Phone:</td>
                            <td>{contact.phone}</td>
                          </tr>
                          <tr>
                            <td>Message:</td>
                            <td>{contact.message}</td>
                          </tr>
                        </tbody>
                      </table> */}
                    </div>
                  </div>
                </div>
              )
              )
            ) : (
              <tr>
                <td className="td" colSpan="5" style={{ textAlign: "center" }}>
                  No User Found.
                </td>
              </tr>
            )}
          </div>
          </div>
        </div>

      </div>

      {showConfirmModal && (
        <ConfirmModal
          title="Delete Conatct"
          message="Are you sure you want to delete this Contact?"
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
};

export default ContactList;
