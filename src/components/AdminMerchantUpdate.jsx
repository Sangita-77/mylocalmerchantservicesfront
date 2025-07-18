import React, { useEffect, useRef, useState } from "react";
import "./../styles/styles.css";
import { IoMdClose } from "react-icons/io";

const AdminMerchantUpdate = ({ user, onClose }) => {

  const [name, setName] = useState(user.merchant_name);
  const [email, setEmail] = useState(user.user_id);
  const [industry, setIndustry] = useState(user.industry);
  const [phone, setPhone] = useState(user.phone);
  const [serviceType, setServiceType] = useState(user.type_of_service);
  // const [companyName, setcompanyName] = useState(user.company_name);
  const [address, setAddress] = useState(
    `${user.street}, ${user.city}, ${user.state}, ${user.zip_code}`
  );

    const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 100); 
    return () => clearTimeout(timer);
  }, []);
  if (!user) return null;

  return (
    <div className="userDetailsOverlay updateform">
      <div className={`userDetailsBoxWrapper ${isOpen ? "open" : ""}`}>
        <div className="messagesWindowCloseBtn" onClick={onClose}>
          <IoMdClose color="#2A2626" size={24} />
        </div>

        <div className="userDetailsBox">
          <div className="formGroup">
            <label>Name :</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
          </div>
          <div className="formGroup">
            <label>Email :</label>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} readOnly/>
          </div>
          {/* <div className="formGroup">
            <label>company_name:</label>
            <input type="text" value={companyName} onChange={(e) => setIndustry(e.target.value)} />
          </div> */}
          <div className="formGroup">
            <label>Industry:</label>
            <input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)} />
          </div>
          <div className="formGroup">
            <label>Phone:</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="formGroup">
            <label>Typ of services:</label>
            <input type="text" value={serviceType} onChange={(e) => setServiceType(e.target.value)} />
          </div>
          <div className="formGroup">
            <label>Address:</label>
            <textarea
              value={address} onChange={(e) => setAddress(e.target.value)}
            ></textarea>
          </div>

            <button className="popButton">Update</button>
        </div>
      </div>
    </div>
  );
};

export default AdminMerchantUpdate;
