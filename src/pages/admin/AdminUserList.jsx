import React, { useContext, useState, useEffect } from "react";
import './../../styles/styles.css';

import axios from "axios";
import { BASE_URL } from "../../utils/apiManager";
import { AppContext } from "../../utils/context";
import { AiOutlineDelete } from "react-icons/ai";
import { PiEyeLight } from "react-icons/pi";
import AdminDashBoardTopBar from "../../components/AdminDashBoardTopBar";

const AdminUserList = () => {


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
                <tr className="tr">
                  <td className="td">Ronnie E. Barrett</td>
                  <td className="td"> ronnie@dreamlogodesign.com </td>
                  <td className="td"> Healthcare </td>
                  <td className="actionTd">
                    <button className="viewButton">
                      <PiEyeLight size={22} color="white" />
                    </button>
                    <button className="delButton">
                      <AiOutlineDelete size={22} color="#E60E4E" style={{ cursor: "pointer" }} />
                    </button>
                  </td>
                </tr>
                <tr className="tr">
                  <td className="td">Epstein E. Barrett</td>
                  <td className="td">epstein@dreamlogodesign.com</td>
                  <td className="td">Transportation and logistics</td>
                  <td className="actionTd">
                    <button className="viewButton">
                      <PiEyeLight size={22} color="#fff" />
                    </button>
                    <button className="delButton">
                      <AiOutlineDelete size={22} color="#E60E4E" style={{ cursor: "pointer" }} />
                    </button>
                  </td>
                </tr>
                <tr className="tr">
                  <td className="td">Christina M</td>
                  <td className="td">christina@dreamlogodesign.com</td>
                  <td className="td">Software and services</td>
                  <td className="actionTd">
                    <button className="viewButton">
                      <PiEyeLight size={22} color="#fff" />
                    </button>
                    <button className="delButton">
                      <AiOutlineDelete size={22} color="#E60E4E" style={{ cursor: "pointer" }} />
                    </button>
                  </td>
                </tr>
                

              </tbody>
            </table>
          </div>


        </div>
      </div>

    </>
  )
}

export default AdminUserList;