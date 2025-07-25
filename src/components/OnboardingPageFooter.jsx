import React from "react";
import logo from "./../assets/images/location_icon_img.jpg";
import "./../styles/styles.css";
import { IoIosArrowForward } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";
import { IoMail } from "react-icons/io5";
import { IoIosCall } from "react-icons/io";
import { FaFacebookF } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";
import { FaYoutube } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";

const OnboardingPageFooter = () => {
  return (
    <div className="onboardingPageFooterContainer">
      <div className="footerLabel">
        <img src={logo} alt="" className="footerLabelImg" />

        <div>
          <p className="footerLabelTitle">My Local</p>
          <p className="footerLabelSubtitle">Merchant Services</p>
        </div>
      </div>

      <div className="footerInnerContainer">
        <div className="footerCol">
          <p className="footerColTitle">Agents and ISO's</p>
          <p className="footerColDesc">
            Register your merchant services company and increase your leads 100%
            FREE! Both ISO's and independent agents can register using the link
            below. Complete your profile and start bringing in REAL local leads
            for free.
          </p>
        </div>

        <div className="divider"></div>

        <div className="footerCol">
          <p className="footerColTitle">
            Quick links
          </p>
          <div className="footerRow">
            <div>
              <IoIosArrowForward size={16} color="#ffffff"/>
            </div>
            <p className="footerColDesc">Merchant Services Providers Registration</p>
          </div>
          <div className="footerRow">
            <div>
              <IoIosArrowForward size={16} color="#ffffff"/>
            </div>
            <p className="footerColDesc">Merchant Registration</p>
          </div>
          {/* <div className="footerRow">
            <div>
              <IoIosArrowForward size={16} color="#ffffff"/>
            </div>
            <p className="footerColDesc">Terms and Conditions</p>
          </div>
          <div className="footerRow">
            <div>
              <IoIosArrowForward size={16} color="#ffffff"/>
            </div>
            <p className="footerColDesc">Privacy Policy</p>
          </div> */}
          <div className="footerRow">
            <div>
              <IoIosArrowForward size={16} color="#ffffff"/>
            </div>
            <p className="footerColDesc">Contact</p>
          </div>
        </div>

        <div className="divider"></div>

        <div className="footerCol">
          <p className="footerColTitle">Contact us</p>
          <div className="footerRow footerLocation">
            <IoLocationSharp size={28} color="#ffffff"/>
            <p className="footerColDesc">1 Chestnut Hill Plaza #1452 <br />Newark, DE 19713 <br />United States</p>
          </div>
          <div className="footerRow">
            <IoMail size={22} color="#ffffff"/>
            <p className="footerColDesc"><a href="mailto:support@mylocalmerchantservices.com">support@mylocalmerchantservices.com</a></p>
          </div>
          <div className="footerRow">
            <IoIosCall size={24} color="#ffffff"/>
            <p className="footerColDesc"><a href="tel:13024519144">+1-302-451-9144</a></p>
          </div>

          <div className="footerRow">
            <FaFacebookF size={20} color="#ffffff"/>
            <RiTwitterXLine size={20} color="#ffffff"/>
            <FaLinkedinIn size={20} color="#ffffff"/>
            <FaYoutube size={20} color="#ffffff"/>
            <FaInstagram size={20} color="#ffffff"/>
          </div>
        </div>
      </div>

      <div className="footerChild">
        <p className="footerChildContent">
          © My Local Merchant Services - 2018-2020. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default OnboardingPageFooter;
