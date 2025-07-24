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
                  src={
                    user.logo && user.logo.trim() !== ""
                      ? `${IMAGE_BASE_URL}/${user.logo}`
                      : placeholderimg
                  }
                  alt="User Logo"
                />
              </div>
            </div>
            <div className="formGroup">
              <input
                type="text"
                value={user.merchant_name}
                className="userName"
                readOnly
              />
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
            <input
              type="text"
              value={user.phone ? user.phone : "No data"}
              readOnly
            />
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
          <div className="formGroup">
            <label>City:</label>
            <input
              type="text"
              value={user.city ? user.city : "No data"}
              readOnly
            />
          </div>
          <div className="formGroup">
            <label>State:</label>
            <input
              type="text"
              value={user.state ? user.state : "No data"}
              readOnly
            />
          </div>
          <div className="formGroup">
            <label>Zip Code:</label>
            <input
              type="text"
              value={user.zip_code ? user.zip_code : "No data"}
              readOnly
            />
          </div>
          <div className="formGroup">
            <label>Country:</label>
            <input
              type="text"
              value={user.country ? user.country : "No data"}
              readOnly
            />
          </div>
          <div className="formGroup">
            <label>Email:</label>
            <input
              type="text"
              value={user.email ? user.email : "No data"}
              readOnly
            />
          </div>
          <div className="formGroup">
            <label>Industry:</label>
            <input
              type="text"
              value={user.industry ? user.email : "No data"}
              readOnly
            />
          </div>
          <div className="formGroup">
            <label>Type of Service:</label>
            <input
              type="text"
              value={user.type_of_service ? user.type_of_service : "No data"}
              readOnly
            />
          </div>
          <div className="formGroup">
            <label>Website</label>
            <input
              type="text"
              value={user.website ? user.website : "No data"}
              readOnly
            />
          </div>
          <div className="formGroup">
            <label>Company Description</label>
            <input
              type="text"
              value={
                user.company_description ? user.company_description : "No data"
              }
              readOnly
            />
          </div>
          <div className="formGroup">
            <label>Status</label>
            <input
              type="text"
              value={user.status ? user.status : "No data"}
              readOnly
            />
          </div>
          <div className="formGroup">
            <label>Flag</label>
            <input
              type="text"
              value={user.flag ? user.flag : "No data"}
              readOnly
            />
          </div>
          <div className="formGroup">
            <label>SponsorBank</label>
            <input
              type="text"
              value={user.SponsorBank ? user.SponsorBank : "No data"}
              readOnly
            />
          </div>
          <div className="formGroup">
            <label>Primary Processing Platform</label>
            <input
              type="text"
              value={user.PPP ? user.PPP : "No data"}
              readOnly
            />
          </div>
          <div className="formGroup">
            <label>Secondary Processing Platform</label>
            <input
              type="text"
              value={user.SPP ? user.SPP : "No data"}
              readOnly
            />
          </div>
          <div className="formGroup">
            <label>Other</label>
            <input
              type="text"
              value={user.Other ? user.Other : "No data"}
              readOnly
            />
          </div>
          <div className="formGroup">
            <label>Distance Willing</label>
            <input
              type="text"
              value={user.DistanceWilling ? user.DistanceWilling : "No data"}
              readOnly
            />
          </div>
          <div className="formGroup">
            <label>Bullet One</label>
            <input
              type="text"
              value={user.bulletOne ? user.bulletOne : "No data"}
              readOnly
            />
          </div>
          <div className="formGroup">
            <label>Bullet Two</label>
            <input
              type="text"
              value={user.bulletTwo ? user.bulletTwo : "No data"}
              readOnly
            />
          </div>
          <div className="formGroup">
            <label>Bullet Three</label>
            <input
              type="text"
              value={user.bulletThree ? user.bulletThree : "No data"}
              readOnly
            />
          </div>
          <div className="formGroup">
            <label>Summary</label>
            <textarea
              type="text"
              value={user.summary ? user.summary : "No data"}
              readOnly
            ></textarea>
          </div>
          <div className="formGroup">
            <label>Sales Represenatives</label>
            <input
              type="text"
              value={
                user.salesrepresenatives ? user.salesrepresenatives : "No data"
              }
              readOnly
            />
          </div>
          <div className="formGroup">
            <label>Client Count</label>
            <input
              type="text"
              value={user.clientCount ? user.clientCount : "No data"}
              readOnly
            />
          </div>
          <div className="formGroup">
            <label>Client Publicly</label>
            <input
              type="text"
              value={user.clientPublicly ? user.clientPublicly : "No data"}
              readOnly
            />
          </div>
          <div className="formGroup">
            <label>Volume Processed</label>
            <input
              type="text"
              value={user.VolumeProcessed ? user.VolumeProcessed : "No data"}
              readOnly
            />
          </div>
          <div className="formGroup">
            <label>Volume Publicly</label>
            <input
              type="text"
              value={user.volumePublicly ? user.volumePublicly : "No data"}
              readOnly
            />
          </div>
          <div className="formGroup">
            <label>High Risk</label>
            <input
              type="text"
              value={user.HighRisk ? user.HighRisk : "No data"}
              readOnly
            />
          </div>
          <div className="formGroup">
            <label>Point of Sale</label>
            <input
              type="text"
              value={user.PointofSale ? user.PointofSale : "No data"}
              readOnly
            />
          </div>
          <div className="formGroup">
            <label>Financing</label>
            <input
              type="text"
              value={user.Financing ? user.Financing : "No data"}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
