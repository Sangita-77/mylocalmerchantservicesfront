import React from "react";
import AccordianProps from "./AccordianProps";
import { MdOutlineGroup } from "react-icons/md";


const MerchantList = ({ text }) => {
  return (

<div>
  /////////////
  <AccordianProps 
  Icon={MdOutlineGroup}
  Heading="Approved Merchant"
  />
</div>

  );
};

export default MerchantList;
