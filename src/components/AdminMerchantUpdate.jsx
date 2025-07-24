import React, { useEffect, useRef, useState, useContext } from "react";
import "./../styles/styles.css";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { BASE_URL } from "../utils/apiManager";
import { AppContext } from "../utils/context";
import ConfirmModal from "../components/ConfirmModal";
import { apiErrorHandler, middleware, textUppercase } from "../utils/helper";
import ProfileImageUpload from "../components/ProfileImageUpload";


const AdminMerchantUpdate = ({ user, onClose , onRefresh }) => {
  const { token } = useContext(AppContext);

  const [name, setName] = useState(user.merchant_name);
  const [email, setEmail] = useState(user.user_id);
  const [industry, setIndustry] = useState(user.industry);
  const [phone, setPhone] = useState(user.phone);
  const [typeOfServices, setTypeOfServices] = useState(user.type_of_service);
  const [companyName, setcompanyName] = useState(user.company_name);
  const [street, setstreet] = useState(user.city);
  const [city, setcity] = useState(user.city);
  const [state, setstate] = useState(user.state);
  const [zip_code, setzip_code] = useState(user.zip_code);

  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const [loadingData, setLoadingData] = useState(false);
  const [usersType, setUsersType] = useState([]);
  const [industriesType, setIndustriesType] = useState([]);
  const [servicesType, setServicesType] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      onClose(); 
    }, 300); 
  };


  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleUpdateClick = (user_id) => {
    setSelectedUserId(user_id);
    setShowConfirmModal(true);
  };

  useEffect(() => {
    if (token) {
      fetchAllTypesData();
      setLoadingData(false);
    }
  }, [token]);


  if (!user) return null;


  const handleUpdate = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/updateMerchantDetails`,
        {
          merchant_id: user.merchant_id,
          company_name: companyName,
          merchant_name: name,
          street: street,
          city: city,
          state: state,
          zip_code: zip_code,
          county: user.county ?? '',
          email: email,
          phone: phone,
          industry: industry,
          type_of_service: typeOfServices,
          website: user.website ?? '',
          company_description: user.company_description ?? '',
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        // alert("Merchant updated successfully");
        onRefresh();
        onClose();
      } else {
        // alert(response.data.message || "Update failed");
        onRefresh();
        onClose();
      }
    } catch (error) {
      console.error("Update error:", error);
      // alert("Something went wrong");
      setShowConfirmModal(false);
    }
  };
  const fetchAllTypesData = async () => {
    setLoadingData(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/getAllTypes`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("All type response=========>", response);
      if (response?.status === 200) {
        const usersType = response?.data?.userType;
        const industriesType = response?.data?.industryType;
        const servicesType = response?.data?.servicesType;

        setUsersType(usersType);
        setIndustriesType(industriesType);
        setServicesType(servicesType);
      }
    } catch (error) {
      const errMsg = apiErrorHandler(error);
      setError(errMsg);
    }
  };

  return (
    <div className="userDetailsOverlay updateform">
      <div className={`userDetailsBoxWrapper userUpdateBoxWrapper ${isOpen ? "open" : ""}`}>
        <div className="messagesWindowCloseBtn" onClick={handleClose}>
          <IoMdClose color="#2A2626" size={24} />
        </div>
        <div className="userDetailsBox">
          <div className="d-flex imageProf">
          <div className="pb-5"><ProfileImageUpload data={user}/></div>
          <div className="formGroup">
            <label>Name :</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          </div>
          <div className="formGroup">
            <label>Email :</label>
            <input type="text" value={email} readOnly />
          </div>
          <div className="formGroup">
            <label>Company Name:</label>
            <input type="text" value={companyName} onChange={(e) => setcompanyName(e.target.value)} />
          </div>
          {/* <div className="formGroup">
            <label>Industry:</label>
            <select
              className="inputField selectField"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            >
              <option value="" style={{ color: "rgb(183, 183, 183)" }}>
                Select industry
              </option>
              {industriesType?.map((industry, i) => (
                <option
                  key={i}
                  value={industry?.type}
                  style={{ color: "black" }}
                >
                  {textUppercase(industry?.type)}
                </option>
              ))}
            </select>
          </div> */}
          <div className="formGroup">
            <label>Phone:</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          {/* <div className="formGroup">
            <label>Type of Services:</label>
            <select
              className="inputField selectField"
              value={typeOfServices}
              onChange={(e) => setTypeOfServices(e.target.value)}
            >
              <option value="" style={{ color: "rgb(183, 183, 183)" }}>
                Select type of services
              </option>
              {servicesType?.map((service, i) => (
                <option
                  key={i}
                  value={service?.type}
                  style={{ color: "black" }}
                >
                  {textUppercase(service?.type)}
                </option>
              ))}
            </select>
          </div> */}
          <div className="formGroup">
            <label>City:</label>
            <input type="text" value={city} onChange={(e) => setcity(e.target.value)} />
          </div>
          <div className="formGroup">
            <label>State:</label>
            <input type="text" value={state} onChange={(e) => setstate(e.target.value)} />
          </div>
          <div className="formGroup">
            <label>Zip Code:</label>
            <input type="text" value={zip_code} onChange={(e) => setzip_code(e.target.value)} />
          </div>

          <button className="popButton" onClick={handleUpdateClick}>Update</button>
        </div>
      </div>
      {showConfirmModal && (
        <ConfirmModal
          title="Update Details"
          message="Are you sure you want to update this details?"
          onConfirm={handleUpdate}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
};

export default AdminMerchantUpdate;
