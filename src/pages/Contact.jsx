import React, { useContext, useEffect, useRef, useState } from "react";
import "./../styles/styles.css";
import axios from "axios";
import { BASE_URL } from "../utils/apiManager";
import { AppContext } from "../utils/context";
import { apiErrorHandler } from "../utils/helper";
import { useNavigate } from "react-router-dom";
import { routes } from "../utils/routes";
import ContactImage from "./../assets/images/contactForm.png"; 

const Contact = () => {

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setUserMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [validationError, setValidationError] = useState({
        emailError: "",
        nameError: "",
        phoneError: "",
        messageError: "",
      });
    
    const { token } = useContext(AppContext);
    const { setShowToast, setMessageTitle, setMessage, setSeverity } = useContext(AppContext);


    const handleContact = async () => { 

        if (!name) {
            setValidationError((prev) => ({
                ...prev,
                nameError: "Name is required!",
            }));
        }

        if (!email) {
            setValidationError((prev) => ({
                ...prev,
                emailError: "Email is required!",
            }));
        }

        if (!phone) {
            setValidationError((prev) => ({
                ...prev,
                phoneError: "Phone is required!",
            }));
        }

        if (!message) {
            setValidationError((prev) => ({
                ...prev,
                messageError: "Message is required!",
            }));
        }

        try {   
            setLoading(true); 
            const body = {
                name : name,
                email : email,
                phone : phone,
                message : message,
            };
      
            const response = await axios.post(
              `${BASE_URL}/contactSave`,
              JSON.stringify(body),
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            // console.log("Login response=====>", response);    
            // return false;
      
            if (response?.status === 200) {
      
                console.log("Login response=====>", response.data.message);  
                const successMessage = response.data.message;  
                setShowToast(true);
                setMessageTitle("Success");
                setMessage(successMessage);
                setSeverity("success"); 


            }
        } catch (error) {
            console.log(error);
            const errMsg = apiErrorHandler(error);
            setShowToast(true);
            setMessageTitle("Error");
            setMessage(errMsg);
            setSeverity("error");

        } finally {
            setLoading(false);
        }
    };

    return (
    <div className="contactPageWrapper">
      <div className="formContainer">
        <h2>Contact Form</h2>
          <div className="row">
            <div className="inputGroup">
              <label htmlFor="name">Name</label>
              <input type="text" placeholder="" name="name" onChange={(e) => setName(e.target.value)} />
                {validationError?.nameError && (
                  <div className="errorText" style={{ marginTop: -4 }}>
                    {validationError?.nameError}
                  </div>
                )}
            </div>
            <div className="inputGroup">
              <label htmlFor="email">Email</label>
              <input type="email" placeholder="" name="email" onChange={(e) => setEmail(e.target.value)} />
                {validationError?.emailError && (
                  <div className="errorText" style={{ marginTop: -4 }}>
                    {validationError?.emailError}
                  </div>
                )}
            </div>
          </div>

          <div className="row fullWidth">
            <div className="inputGroup">
              <label htmlFor="phone">Phone</label>
              <input type="text" placeholder="" name="phone" onChange={(e) => setPhone(e.target.value)} />
                {validationError?.phoneError && (
                  <div className="errorText" style={{ marginTop: -4 }}>
                    {validationError?.phoneError}
                  </div>
                )}
            </div>
          </div>

          <div className="row fullWidth">
            <div className="inputGroup">
              <label htmlFor="message">Message</label>
              <textarea placeholder="" name="message" onChange={(e) => setUserMessage(e.target.value)} />
                {validationError?.messageError && (
                  <div className="errorText" style={{ marginTop: -4 }}>
                    {validationError?.messageError}
                  </div>
                )}
            </div>
          </div>

          <button type="submit" onClick={() => handleContact()}>{loading ? "Loading..." : "Submit"}</button>
      </div>

      <div className="imageContainer">
        <img src={ContactImage} alt="Contact Support" />
      </div>
    </div>
    );

};

export default Contact;