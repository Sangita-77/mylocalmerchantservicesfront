import React, { useContext } from "react";
import "./../styles/styles.css";

const Tooltip = ({ children, text }) => {
  return (
    <div className="tooltipWrapper">
      {children}
      <span className="tooltipText">{text}</span>
    </div>
  );
};

export default Tooltip;
