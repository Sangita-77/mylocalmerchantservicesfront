import React from 'react'
import './../styles/styles.css';
import { useNavigate } from "react-router-dom";
import { routes } from "./../utils/routes";

const ButtonLarge = ({title, icon}) => {

  const navigate = useNavigate();
  return (
    <div className="button_large" onClick={() => navigate(routes.merchant_list())}>
        <p className='large_button_text'>{title}</p>
        {icon}
    </div>
  )
}

export default ButtonLarge