import React from "react";
import "./../styles/styles.css";
import preLoader from "./../assets/images/3d-logo-loader.gif";

const InitialLoader = ({ text }) => {
  return (
    <div className="initialLoaderOverlay">
      <div className="initialLoaderContainer">
        <div className="preloaderImageContainer">
          <img src={preLoader} alt="" className="preloaderAnimation" />
        </div>
        <div className="loadingText">{text}</div>
      </div>
    </div>
  );
};

export default InitialLoader;
