import React from "react";
import "./../styles/styles.css";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";
import { IoMail } from "react-icons/io5";
import { IoIosCall } from "react-icons/io";
import { FaFacebookF } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";
import { FaYoutube } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";

const MerchantFooter = () => {
  return (
    <div className="merchantFooterWrapper">
      <div className="merchantFooterInner">
        <div className="merchantFooterRow">
          <FaLocationDot color="white" size={24} />
          <div className="merchantFooterText">1 Chestnut Hill Plaza #1452 Newark, DE 19713 United States</div>
        </div>
        <div className="footerRowDivider"></div>
        <div className="merchantFooterRow">
          <IoMail color="white" size={24} />
          <div className="merchantFooterText">support@mylocalmerchantservices.com</div>
        </div>
        <div className="footerRowDivider"></div>
        <div className="merchantFooterRow">
          <IoIosCall color="white" size={24} />
          <div className="merchantFooterText">+1-302-451-9144</div>
        </div>
        <div className="footerRowDivider"></div>
        <div className="merchantFooterRow">
          <FaFacebookF color="white" size={14}/>
          <RiTwitterXLine color="white" size={14}/>
          <FaLinkedinIn color="white" size={14}/>
          <FaYoutube color="white" size={14}/>
          <FaInstagram color="white" size={14}/>
        </div>
      </div>
      <div className="merchantChildFooter">
        © My Local Merchant Services - 2018-2020. All Rights Reserved.
      </div>
    </div>
  );
};

export default MerchantFooter;
