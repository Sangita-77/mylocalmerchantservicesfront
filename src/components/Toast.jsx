import React, { useContext } from "react";
import "./../styles/styles.css";
import { motion } from "framer-motion";
import { AppContext } from "../utils/context";
import { MdErrorOutline } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";

const Toast = () => {
  const { messageTitle, message, severity, setShowToast } = useContext(AppContext);

  const containerVariants = {
    hidden: { opacity: 0, x: 50 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.2, // delay between each item
      },
    },
  };

  return (
    <motion.div
      className="toastContainer"
      style={{
        backgroundColor: severity === "success" ? "#4aa325" : "#db242a",
        top: 40,
        right: 20,
      }}
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.3 }} // triggers when 30% is in view
    >
      <div className="toastLeft">
        {severity === "success" ? <FaCheck size={24} color={"white"} /> : <MdErrorOutline size={24} color={"white"} />}
        <div>
          <div className="toastTitle">{messageTitle}</div>
          <div className="toastMessage">{message}</div>
        </div>
      </div>
      <div className="toastCloseBtn" onClick={() => setShowToast(false)}>&times;</div>
    </motion.div>
  );
};

export default Toast;
