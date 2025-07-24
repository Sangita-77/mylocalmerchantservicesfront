import React, { useContext, useEffect, useRef, useState } from "react";
import "./../styles/styles.css";
import { IoMdClose } from "react-icons/io";
import placeholderimg from "./../assets/images/placeholderimg.jpg";
import { IMAGE_BASE_URL } from "../utils/apiManager";

const UserDetailsModal = ({ user, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // console.log("user..............................",user);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 20);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      onClose(); 
    }, 300); 
  };

  
  if (!user) return null;

  return (
    <div className="userDetailsOverlay">
      <div className={`userDetailsBoxWrapper ${isOpen ? "open" : ""}`}>
        <div className="messagesWindowCloseBtn" onClick={handleClose}>
          <IoMdClose color="#2A2626" size={24} />
        </div>

        <div className="userDetailsBox">
          <div className="userHeaderInfo">
          <div className="userImgWrapper">
            <div className="userImg">
              {/* <img src={placeholderimg} alt="" /> */}
              <img
                src={user.logo && user.logo.trim() !== '' ? `${IMAGE_BASE_URL}/${user.logo}` : placeholderimg}
                alt="User Logo"
              />
            </div>
            </div>
            <div className="formGroup">
              <input type="text" value={user.merchant_name} className="userName" readOnly />
            </div>
          </div>

          {/* <div className="formGroup">
            <label>Name :</label>
            <input type="text" value={user.merchant_name} readOnly />
          </div> */}
          <div className="formGroup">
            <label>Email :</label>
            <input type="text" value={user.user_id} readOnly />
          </div>
          <div className="formGroup">
            <label>Company Name:</label>
            <input type="text" value={user.company_name} readOnly />
          </div>
          <div className="formGroup">
            <label>Phone:</label>
            <input type="text" value={user.phone} readOnly />
          </div>
          {/* <div className="formGroup">
            <label>Typ of services:</label>
            <input type="text" value={user.type_of_service} readOnly />
          </div> */}
          <div className="formGroup">
            <label>Address:</label>
            <textarea
              value={`${user.city}, ${user.city}, ${user.state}, ${user.zip_code}`}
              readOnly
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
