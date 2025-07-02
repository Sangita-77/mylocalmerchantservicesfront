import "./../styles/styles.css";
import blueShade from "./../assets/images/blue_shade.png";
import yellowShade from "./../assets/images/yellow_shade.png";
import productImage from "./../assets/images/product1.png";
import editIcon from "./../assets/images/product_edit_icon.png";
import { AiOutlineDelete } from "react-icons/ai";

const ProductDetailsModal = ({ product, handleClose }) => {
  return (
    <>
      <div className="merchantProductDetailsModalOverlay">
        <div
          className="productDetailsModalCloseBtnContainer"
          onClick={handleClose}
        >
          <div className="productDetailsModalCloseBtn"></div>
          &times;
        </div>
        <div className="merchantProductDetailsModalWrapper">
          <img src={blueShade} alt="" className="loginBlueShade" />
          <img src={yellowShade} alt="" className="loginYellowShade" />

          <p className="merchantProductDetailsModalTittle">Product Details</p>

          <div className="merchantProductDetailsModalContainer">
            <div className="merchantProductDetailModalLeft">
              <img src={productImage} className="productDetailsImage" />
            </div>
            <div className="merchantProductDetailModalRight">
              <div>
                <div className="merchantProductTitle">
                  {product?.product_name}
                </div>
                <div className="merchantProductDesc">{product?.product_description}</div>
              </div>
              <div className="merchantProductButtons">
                <button className="merchantProductEditBtn">
                  <img src={editIcon} alt="" className="productEditIcon" />
                  Edit
                </button>
                <button className="merchantProductDeleteBtn">
                  <AiOutlineDelete size={20} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailsModal;
