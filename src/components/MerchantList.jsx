import React from "react";
import AccordianProps from "./AccordianProps";
import { MdOutlineGroup } from "react-icons/md";



const MerchantList = ({ text }) => {

   const users = [
      { id: 1, name: 'Alice', age: 30, city: 'New York' },
      { id: 2, name: 'Bob', age: 24, city: 'London' },
      { id: 3, name: 'Charlie', age: 35, city: 'Paris' },
    ];
  return (

<div>
  <AccordianProps 
  bgColor= "#71CDEA"
  Icon={MdOutlineGroup}
  Heading="Approved Merchant"
   tbody={
    <>
     {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.age}</td>
                <td>{user.city}</td>
              </tr>
       ))}
    </>
  }
  />
</div>

  );
};

export default MerchantList;
