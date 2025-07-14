import React, { useRef, useEffect, useState } from "react";
import "./../styles/styles.css";

const Tooltip = ({ children, text }) => {
  const tooltipRef = useRef(null);
  const wrapperRef = useRef(null);
  const [position, setPosition] = useState("bottom");

  useEffect(() => {
    const updateTooltipPosition = () => {
      const wrapper = wrapperRef.current;
      const tooltip = tooltipRef.current;

      if (!wrapper || !tooltip) return;

      const wrapperRect = wrapper.getBoundingClientRect();
      const tooltipHeight = tooltip.offsetHeight;

      const spaceBelow = window.innerHeight - wrapperRect.bottom;
      const spaceAbove = wrapperRect.top;

      const willOverflowBottom = wrapperRect.bottom + tooltipHeight > window.innerHeight;

      if (willOverflowBottom && spaceAbove > tooltipHeight + 10) {
        setPosition("top");
      } else {
        setPosition("bottom");
      }
    };

    updateTooltipPosition();
    window.addEventListener("scroll", updateTooltipPosition, true);
    window.addEventListener("resize", updateTooltipPosition);

    return () => {
      window.removeEventListener("scroll", updateTooltipPosition, true);
      window.removeEventListener("resize", updateTooltipPosition);
    };
  }, []);

  return (
    <div className="tooltipWrapper" ref={wrapperRef}>
      {children}
      <div className={`tooltipText ${position}`} ref={tooltipRef}>
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
