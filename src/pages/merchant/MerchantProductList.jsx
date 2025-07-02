import React, { useContext, useEffect, useState } from "react";
import { apiErrorHandler } from "../../utils/helper";
import axios from "axios";
import { BASE_URL, SERVER_URL } from "../../utils/apiManager";
import { AppContext } from "../../utils/context";
import "./../../styles/styles.css";
import { IoCloudUploadOutline } from "react-icons/io5";
import productImg from "./../../assets/images/product1.png";
import ProductDetailsModal from "../../components/ProductDetailsModal";
import MerchantUploadProductModal from "../../components/MerchantUploadProductModal";

const MerchantProductList = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [merchantProductList, setMerchantProductList] = useState(null);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productImage, setProductImage] = useState("");
  const [totalPages, setTotalPages] = useState(5);
  const [activePage, setActivePage] = useState(1);
  const [showProductDetailsModal, setShowProductDetailsModal] = useState(false);
  const [showUploadProductModal, setShowUploadProductModal] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);

  const arr = [0, 1, 2, 3, 4, 5, 6, 7];

  const {
    loggedInUserId,
    setShowToast,
    setMessageTitle,
    setMessage,
    setSeverity,
  } = useContext(AppContext);

  const fetchMerchantProductList = async () => {
    try {
      setLoading(true);
      setError("");

      const body = { user_id: "souvik@dreamlogodesign.net" };
      const token = await localStorage.getItem("accessToken");

      const response = await axios.post(
        `${BASE_URL}/getAllProductMerchant`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);

      if (response.status === 200) {
        const data = response.data.data;
        setMerchantProductList(data);
      }
    } catch (error) {
      console.log(error);
      const errMsg = apiErrorHandler(error);
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  console.log("merchantProductList===>", merchantProductList);
  
  const toggleMerchantProductDetailsModal = (product) => {
    setShowProductDetailsModal(true);
    setViewProduct(product)
  }

  const uploadProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const token = await localStorage.getItem("accessToken");
      const body = {
        user_id: loggedInUserId,
        product_name: productName,
        product_description: productDescription,
        product_img: productImage,
      };
    } catch (error) {
      console.log(error);
      const errMsg = apiErrorHandler(error);
      setError(errMsg);
    }
  };

  useEffect(() => {
    fetchMerchantProductList();
  }, []);

  return (
    <div className="merchantProductListWrapper">
      <div className="merchantListContainer">
        <div className="merchantListTop">
          <div className="merchantProductPageHeading">Product</div>
          <button className="productUploadButton" onClick={() => setShowUploadProductModal(true)}>
            <IoCloudUploadOutline color="#0f8cdd" size={32} />
            <div className="">Upload Product</div>
          </button>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="merchantListInnerContainer">
            <div className="merchantProductListContainer">
              {merchantProductList?.map((product, index) => (
                <div className="productContainer" key={index}>
                  <div className="productImageContainer">
                  <img src={`${SERVER_URL}${product?.product_img}`} alt="" className="productImage" />
                  </div>
                  <div className="productDetailsContainer"> 
                    <div className="productName">{product?.product_name}</div>
                    <div className="productDescription">
                      {product?.product_description}
                    </div>
                    <button className="productViewBtn" onClick={() => toggleMerchantProductDetailsModal(product)}>View details</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="paginationContainer">
              <div className="prevBtn">Previous</div>
              <div className="pageNoBox">1</div>
              <div className="pageNoBox">2</div>
              <div className="pageNoBox">3</div>
              <div className="pageNoBox">4</div>
              <div className="pageNoBox">5</div>
              <div className="nextBtn">Next</div>
            </div>
          </div>
        )}
      </div>

      {showProductDetailsModal && <ProductDetailsModal product={viewProduct} handleClose={() => setShowProductDetailsModal(false)} />}

      {showUploadProductModal && <MerchantUploadProductModal />}
    </div>
  );
};

export default MerchantProductList;
