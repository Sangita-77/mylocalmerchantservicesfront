import React from 'react'
import './../styles/styles.css';

const ButtonLarge = ({title, icon , onClick }) => {

  return (
    <div className="button_large" onClick={onClick}>
        <p className='large_button_text'>{title}</p>
        {icon}
    </div>
  )
}

export default ButtonLarge