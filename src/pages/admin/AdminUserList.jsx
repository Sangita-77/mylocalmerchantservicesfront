import React, { useContext, useState, useEffect } from "react";
import './../../styles/styles.css';

import axios from "axios";
import { BASE_URL } from "../../utils/apiManager";
import { AppContext } from "../../utils/context";
import { AiOutlineDelete } from "react-icons/ai";
import { PiEyeLight } from "react-icons/pi";
import AdminDashBoardTopBar from "../../components/AdminDashBoardTopBar";
import PreLoader from "../../components/PreLoader";

const AdminUserList = () => {

  const [loading, setLoading] = useState(true);
  const [userList, setUserList] = useState({ contactList: [] });

  const { token } = useContext(AppContext);

  useEffect(() => {
    fetchConnectedHistory();
  }, []);


  const fetchConnectedHistory = async () => {
    try {
      const body = { }; 
      const res = await axios.post(
        `${BASE_URL}/getUserList`,
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
        setUserList(res.data); 
      } else {
        setUserList({ connect: [] }); 
      }
    } catch (error) {
      console.error("Error fetching connected history:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <div className='adminUserlistWrapper'>
        <div className='adminDashboardContainer'>

          <AdminDashBoardTopBar heading="User List" />

          <div className="adminUserlIstContainer">
            <table className="tableContainer">
              <thead className="theadContainer">
                <tr>
                  <th className="th">Name</th>
                  <th className="th">Email</th>
                  <th className="th">Industry</th>
                  <th className="thActions">Actions</th>
                </tr>
              </thead>
              <tbody className="tbodyContainer">
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                      <div>Loading data...</div>
                    </td>
                  </tr>
                ) : Array.isArray(userList.contactList) && userList.contactList.length > 0 ? (
                  userList.contactList.map((user, index) => (
                    <tr key={index} className="tr">
                      <td className="td">{user.company_name}</td>
                      <td className="td">{user.user_id}</td>
                      <td className="td">{user.industry || "N/A"}</td>
                      <td className="actionTd">
                        <button className="viewButton">
                          <PiEyeLight size={22} color="white" />
                        </button>
                        <button className="delButton">
                          <AiOutlineDelete size={22} color="#E60E4E" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="td" colSpan="5" style={{ textAlign: "center" }}>
                      No User Found.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>


        </div>
      </div>

    </>
  )
}

export default AdminUserList;