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



    return (
    <div className="contactPageWrapper">
      <div className="formContainer">
        <h2>Contact Form</h2>
        <form>
          <div className="row">
            <div className="inputGroup">
              <label htmlFor="name">Name</label>
              <input type="text" placeholder="Enter your name" name="name" />
            </div>
            <div className="inputGroup">
              <label htmlFor="email">Email</label>
              <input type="email" placeholder="Enter your email" name="email" />
            </div>
          </div>

          <div className="row fullWidth">
            <div className="inputGroup">
              <label htmlFor="phone">Phone</label>
              <input type="text" placeholder="Enter your phone" name="phone" />
            </div>
          </div>

          <div className="row fullWidth">
            <div className="inputGroup">
              <label htmlFor="message">Message</label>
              <textarea placeholder="Type your message..." name="message" />
            </div>
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>

      <div className="imageContainer">
        <img src={ContactImage} alt="Contact Support" />
      </div>
    </div>
    );

};

export default Contact;