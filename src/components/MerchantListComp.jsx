import React from "react";
import AccordianProps from "./AccordianProps";
import { MdOutlineGroup } from "react-icons/md";
import { PiEyeLight } from "react-icons/pi";
import { GoPencil } from "react-icons/go";
import { AiOutlineDelete } from "react-icons/ai";



const MerchantListComp = ({ approvedUsers = [], pendingUsers = [] }) => {
  return (
    <div>
      <AccordianProps 
        bgColor="#71CDEA"
        Icon={MdOutlineGroup}
        Heading="Approved Merchant"
        tbody={
          <>
            {approvedUsers.map((user, index) => (
              <tr key={user.id || index}>
                <td>{user.merchant_id}</td>
                <td>{user.merchant_name}</td>
                <td>{user.street} , {user.city} , Zip - {user.zip_code}</td>
                <td>{user.type_of_service}</td>
                <td>
                  <button className="viewButton" data-bs-toggle="tooltip" data-bs-placement="auto" title="View Details">
                    <PiEyeLight size={22} color="white" />
                  </button>
                  <button className="editButton" data-bs-toggle="tooltip" data-bs-placement="auto" title="Delete">                               
                    <GoPencil />
                  </button>
                 
                </td>
              </tr>
            ))}
          </>
        }
      />
      
      <AccordianProps 
        bgColor="#71CDEA"
        Icon={MdOutlineGroup}
        Heading="Pending Merchant"
        tbody={
          <>
            {pendingUsers.map((user, index) => (
              <tr key={user.id || index}>
                <td>{user.merchant_id}</td>
                <td>{user.merchant_name}</td>
                <td>{user.street} , {user.city} , Zip - {user.zip_code}</td>
                <td>{user.type_of_service}</td>
                <td>
                  <button className="viewButton" data-bs-toggle="tooltip" data-bs-placement="auto" title="View Details">
                    <PiEyeLight size={22} color="white" />
                  </button>
                  <button className="delButton" data-bs-toggle="tooltip" data-bs-placement="auto" title="Delete">                               
                    <AiOutlineDelete size={22} color="#E60E4E" style={{ cursor: "pointer" }} />
                  </button>
                  
                </td>
              </tr>
            ))}
          </>
        }
      />
    </div>
  );
};


export default MerchantListComp;
