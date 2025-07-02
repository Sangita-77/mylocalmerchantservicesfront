import "./../styles/styles.css";
import blueShade from "./../assets/images/blue_shade.png";
import yellowShade from "./../assets/images/yellow_shade.png";
import productImage from "./../assets/images/product1.png";
import editIcon from "./../assets/images/product_edit_icon.png";
import { AiOutlineDelete } from "react-icons/ai";
import { IoCloudUploadOutline } from "react-icons/io5";
import { useRef, useState } from "react";

const MerchantUploadProductModal = ({ product, handleClose }) => {
  const [file, setFile] = useState(null);

  const inputFileRef = useRef();

  const handleOpenFileUploader = () => {
    inputFileRef.current.click()
  } 

  return (
    <>
      <div className="merchantUploadProductModalOverlay">
        <div
          className="uploadProductModalCloseBtnContainer"
          //   onClick={handleClose}
        >
          <div className="uploadProductModalCloseBtn"></div>
          &times;
        </div>
        <div className="merchantUploadProductModalWrapper">
          <img src={blueShade} alt="" className="loginBlueShade" />
          <img src={yellowShade} alt="" className="loginYellowShade" />

          <p className="merchantProductDetailsModalTittle">Upload Product</p>

          <div className="merchantUploadProductModalContainer">
            <div className="productUploadInputContainer">
              <label htmlFor="" className="uploadInputLabel">
                Product Name
              </label>
              <input type="text" className="uploadInputField" />
            </div>

            <div className="productUploadInputContainer">
              <label htmlFor="" className="uploadInputLabel">
                Product Description
              </label>
              <textarea
                name=""
                id=""
                className="uploadInputField"
                rows={3}
              ></textarea>
            </div>

            <div className="productUploadInputContainer">
              <label htmlFor="" className="uploadInputLabel">
                Product Name
              </label>
              <div className="uploadFileInputContainer">
                <input
                  ref={inputFileRef}
                  type="file"
                  style={{ display: "none" }}
                />
                <IoCloudUploadOutline size={48} color="#659ed0" onClick={() => handleOpenFileUploader()}/>
                <div
                  className="merchantProductDetailsModalTittle"
                  style={{ fontSize: 16 }}
                >
                  Drag files & drop here
                </div>
                <div className="uploadFileOtherOptionsLinkContainer">
                  <div className="uploadFileOtherOptionsLink">Google Drive</div>
                  <div className="verticalDivider"></div>
                  <div className="uploadFileOtherOptionsLink">Cloud</div>
                  <div className="verticalDivider"></div>
                  <div className="uploadFileOtherOptionsLink">Local File</div>
                  <div className="verticalDivider"></div>
                  <div className="uploadFileOtherOptionsLink">Dropbox</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MerchantUploadProductModal;
