import React, { useContext, useState, useEffect } from "react";
import "./../../styles/styles.css";
import AdminDashBoardTopBar from "../../components/AdminDashBoardTopBar";
import axios from "axios";
import { BASE_URL } from "../../utils/apiManager";
import { AppContext } from "../../utils/context";
import { AiOutlineDelete } from "react-icons/ai";
import { PiEyeLight } from "react-icons/pi";
import PreLoader from "../../components/PreLoader";

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


  return (
    <div className="contactlistWrapper">
      <div className="adminDashboardContainer">
        <AdminDashBoardTopBar heading={"Contact  List"} />

        <div className="contactlistContainer">
          <div className="accordion" id="accordionExample">
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                  <PreLoader />
                </td>
              </tr>
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
                      {contact.name}
                    </button>
                  </h2>
                  <div
                    id={`collapse${index}`}
                    className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                    aria-labelledby={`heading${index}`}
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      <div>Email : {contact.email}</div><br></br>
                      <div>Phone : {contact.phone}</div><br></br>
                      <div>Message : {contact.message}</div>
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
  );
};

export default ContactList;
