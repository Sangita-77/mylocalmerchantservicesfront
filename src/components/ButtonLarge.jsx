import React from 'react'
import './../styles/styles.css';

const ButtonLarge = ({title, icon}) => {

  return (
    <div className="button_large">
        <p className='large_button_text'>{title}</p>
        {icon}
    </div>
  )
}

export default ButtonLarge