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
  const [first_name, setfirst_name] = useState(user.first_name);
  const [last_name, setlast_name] = useState(user.last_name);
  const [email, setEmail] = useState(user.user_id);
  const [industry, setIndustry] = useState(user.industry);
  const [phone, setPhone] = useState(user.phone);
  const [typeOfServices, setTypeOfServices] = useState(user.type_of_service);
  const [companyName, setcompanyName] = useState(user.company_name);
  const [street, setstreet] = useState(user.city);
  const [city, setcity] = useState(user.city);
  const [state, setstate] = useState(user.state);
  const [zip_code, setzip_code] = useState(user.zip_code);
  const [country, setCountry] = useState(user.country);
  const [website, setWebsite] = useState(user.website);
  const [company_description, setCompany_description] = useState(user.company_description);
  const [status, setStatus] = useState(user.status);
  const [flag, setFlag] = useState(user.flag);
  const [SponsorBank, setSponsorBank] = useState(user.SponsorBank);
  const [PPP, setPPP] = useState(user.PPP);
  const [SPP, setSPP] = useState(user.SPP);
  const [Other, setOther] = useState(user.Other);
  const [DistanceWilling, setDistanceWilling] = useState(user.DistanceWilling);
  const [bulletOne, setBulletOne] = useState(user.bulletOne);
  const [bulletTwo, setBulletTwo] = useState(user.bulletTwo);
  const [bulletThree, setBulletThree] = useState(user.bulletThree);
  const [summary, setSummary] = useState(user.summary);
  const [salesrepresenatives, setSalesrepresenatives] = useState(user.salesrepresenatives);
  const [VolumeProcessed, setVolumeProcessed] = useState(user.VolumeProcessed);
  const [volumePublicly, setvolumePublicly] = useState(user.volumePublicly);
  const [HighRisk, setHighRisk] = useState(user.HighRisk);
  const [PointofSale, setPointofSale] = useState(user.PointofSale);
  const [Financing, setFinancing] = useState(user.Financing);
  const [clientPublicly, setclientPublicly] = useState(user.clientPublicly);
  const [clientCount, setclientCount] = useState(user.clientCount);
  

  

  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const [loadingData, setLoadingData] = useState(false);
  const [usersType, setUsersType] = useState([]);
  const [industriesType, setIndustriesType] = useState([]);
  const [servicesType, setServicesType] = useState([]);
  const [flagType, setFlagsType] = useState([]);

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

  useEffect(() => {
    setFlag(user.flag);
  }, [user.flag]);


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
          country: country,
          email: email,
          phone: phone,
          industry: industry,
          type_of_service: typeOfServices,
          website: website,
          company_description: company_description,
          status: status,
          flag: flag,
          SponsorBank: SponsorBank,
          DistanceWilling: DistanceWilling,
          summary:summary,
          clientPublicly : clientPublicly,
          VolumeProcessed : VolumeProcessed,
          volumePublicly : volumePublicly,
          HighRisk : HighRisk,
          PointofSale : PointofSale,
          Financing : Financing,
          bulletThree : bulletThree,
          bulletTwo : bulletTwo,
          bulletOne : bulletOne,
          PPP : PPP,
          clientCount : clientCount,
          first_name : first_name,
          last_name : last_name,
          salesrepresenatives : salesrepresenatives,

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

          <div className="formGroup">
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
          </div>
          <div className="formGroup">
            <label>Phone:</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
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

          <div className="formGroup">
            <label>Country:</label>
            <input type="text" value={country} onChange={(e) => setCountry(e.target.value)}/>
          </div>
          <div className="formGroup">
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
          </div>
          <div className="formGroup">
            <label>Website</label>
            <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)}/>
          </div>
          <div className="formGroup">
            <label>Company Description</label>
            <input type="text" value={company_description} onChange={(e) => setCompany_description(e.target.value)} />
          </div>
          <div className="formGroup">
            <label>Status</label>
            <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} />
          </div>

          {/* <div className="formGroup">
            <label>SponsorBank</label>
            <input type="text" value={SponsorBank} onChange={(e) => setSponsorBank(e.target.value)} />
          </div> */}

          {flag !== "processors" && flag !== "agents" && (
            <div className="formGroup">
              <label>SponsorBank</label>
              <input
                type="text"
                value={SponsorBank}
                onChange={(e) => setSponsorBank(e.target.value)}
              />
            </div>
          )}


          {/* <div className="formGroup">
            <label>Primary Processing Platform</label>
            <input type="text" value={PPP} onChange={(e) => setPPP(e.target.value)} />
          </div> */}

          {flag !== "processors" && flag !== "isos" && (
            <div className="formGroup">
              <label>Primary Processing Platform</label>
              <input
                type="text"
                value={PPP}
                onChange={(e) => setPPP(e.target.value)}
              />
            </div>
          )}

          {/* <div className="formGroup">
            <label>Secondary Processing Platform</label>
            <input type="text" value={SPP} onChange={(e) => setSPP(e.target.value)} />
          </div> */}

          {flag !== "processors" && flag !== "isos" && (
            <div className="formGroup">
              <label>Secondary Processing Platform</label>
              <input
                type="text"
                value={SPP}
                onChange={(e) => setSPP(e.target.value)}
              />
            </div>
          )}


          {/* <div className="formGroup">
            <label>Other</label>
            <input type="text" value={Other} onChange={(e) => setOther(e.target.value)} />
          </div> */}

          {flag !== "processors" && flag !== "isos" && (
            <div className="formGroup">
              <label>Other</label>
              <input
                type="text"
                value={Other}
                onChange={(e) => setOther(e.target.value)}
              />
            </div>
          )}



          <div className="formGroup">
            <label>Distance Willing</label>
            {/* <input type="text" value={DistanceWilling} onChange={(e) => setDistanceWilling(e.target.value)} /> */}

            <select
              className="inputField selectField"
              value={DistanceWilling}
              onChange={(e) => setDistanceWilling(e.target.value)}
            >
              <option value="5">   &lt; 5 miles  </option>
              <option value="10">  &lt; 10 miles </option>
              <option value="25">  &lt; 25 miles </option>
              <option value="50">  &lt; 50 miles </option>
              <option value="100"> &lt; 100 miles </option>
            </select>
          </div>
          <div className="formGroup">
            <label>Bullet One</label>
            <input type="text" value={bulletOne} onChange={(e) => setBulletOne(e.target.value)} />
          </div>
          <div className="formGroup">
            <label>Bullet Two</label>
            <input type="text" value={bulletTwo} onChange={(e) => setBulletTwo(e.target.value)} />
          </div>
          <div className="formGroup">
            <label>Bullet Three</label>
            <input type="text" value={bulletThree} onChange={(e) => setBulletThree(e.target.value)} />
          </div>
          <div className="formGroup">
            <label>Summary</label>
            <textarea type="text" value={summary} onChange={(e) => setSummary(e.target.value)} ></textarea>
          </div>
          
          <div className="formGroup">
            <label>Sales Represenatives</label>
            {/* <input type="text" value={salesrepresenatives}  /> */}
            <select
              className="inputField selectField"
              value={salesrepresenatives}
              onChange={(e) => setSalesrepresenatives(e.target.value)}
            >
               <option value="100K">   &lt; $100K  </option>
                <option value="100K<250K"> 100K &lt; 250K </option>
                <option value="250K<1MM"> 250k &lt; 1MM </option>
                <option value="1MM<5MM">  1MM &lt; 5MM </option>
                <option value="5MM<10MM"> 5MM &lt; 10MM </option>
                <option value="10MM<25MM"> 10MM &lt; 25MM </option>
                <option value="25MM+"> 25MM+ </option>
            </select>
          </div>
          <div className="formGroup">
            <label>Client Count</label>
            <input type="number" value={clientCount}  onChange={(e) => setclientCount(e.target.value)} />
          </div>
          <div className="formGroup">
            <label>Client Publicly</label>
            {/* <input type="text" value={clientPublicly}  onChange={(e) => setclientPublicly(e.target.value)} /> */}
            <select
              className="inputField selectField"
              value={clientPublicly}
              onChange={(e) => setclientPublicly(e.target.value)}
            >
              <option value="yes">  Yes  </option>
              <option value="no"> No </option>
            </select>
          </div>
          <div className="formGroup">
            <label>Volume Processed</label>
            {/* <input type="text" value={user.VolumeProcessed} readOnly /> */}
            <select
              className="inputField selectField"
              value={VolumeProcessed}
              onChange={(e) => setVolumeProcessed(e.target.value)}
            >
              <option value="100K">   &lt; $100K  </option>
              <option value="100K<250K"> 100K &lt; 250K </option>
              <option value="250K<1MM"> 250k &lt; 1MM </option>
              <option value="1MM<5MM">  1MM &lt; 5MM </option>
              <option value="5MM<10MM"> 5MM &lt; 10MM </option>
              <option value="10MM<25MM"> 10MM &lt; 25MM </option>
              <option value="25MM+"> 25MM+ </option>
            </select>
          </div>
          <div className="formGroup">
            <label>Volume Publicly</label>
            <select
              className="inputField selectField"
              value={volumePublicly}
              onChange={(e) => setvolumePublicly(e.target.value)}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div className="formGroup">
            <label>High Risk</label>
            {/* <input type="text" value={user.HighRisk} readOnly /> */}
            <select
              className="inputField selectField"
              value={HighRisk}
              onChange={(e) => setHighRisk(e.target.value)}
            >
              <option value="yes">  Yes  </option>
              <option value="no"> No </option>
            </select>
          </div>
          <div className="formGroup">
            <label>Point of Sale</label>
            {/* <input type="text" value={user.PointofSale} readOnly /> */}
            <select
              className="inputField selectField"
              value={PointofSale}
              onChange={(e) => setPointofSale(e.target.value)}
            >
              <option value="yes">  Yes  </option>
              <option value="no"> No </option>
            </select>
          </div>
          <div className="formGroup">
            <label>Financing</label>
            {/* <input type="text" value={user.Financing} readOnly /> */}
            <select
              className="inputField selectField"
              value={Financing}
              onChange={(e) => setFinancing(e.target.value)}
            >
              <option value="yes">  Yes  </option>
              <option value="no"> No </option>
            </select>
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
