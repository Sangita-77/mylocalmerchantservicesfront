
import React, { useContext, useEffect, useState ,useCallback } from "react";
import { useDropzone } from 'react-dropzone';
import { IoCameraSharp } from "react-icons/io5";
import placeholderimg from "./../assets/images/placeholderimg.jpg";
import { IMAGE_BASE_URL } from "../utils/apiManager";
import axios from 'axios';
import { BASE_URL } from "../utils/apiManager";
import { AppContext } from "../utils/context";

const ProfileImageUpload = ({ data }) => {
  const initialImage =
    data?.logo && data.logo.trim() !== ''
      ? `${IMAGE_BASE_URL}/${data.logo}`
      : placeholderimg;

  const [preview, setPreview] = useState(initialImage);

  const {
    token,
  } = useContext(AppContext);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && data?.merchant_id) {
      const url = URL.createObjectURL(file);
      setPreview(url); // Show immediately

      console.log("........file",file);

      // Create FormData and send to API
      const formData = new FormData();
      formData.append('logo', file);
      formData.append('merchant_id', data.merchant_id);

      try {
        const res = await axios.post(`${BASE_URL}/updateMerchantLogo`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.status) {
          const newLogoPath = res.data.data.logo;
          setPreview(`${IMAGE_BASE_URL}/${newLogoPath}`);
        } else {
          alert("Failed to update logo.");
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("Something went wrong while uploading.");
      }
    }
  }, [data]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    multiple: false,
    onDrop
  });

  return (
    <div style={styles.container} className='profphoto'>
      <div {...getRootProps()} style={styles.dropzone}>
        <input {...getInputProps()} />
        <div className='camera'>
          <IoCameraSharp size={30} style={{ color: '#063f63ff' }} />
        </div>
      </div>

      <div style={styles.previewContainer}>
        <div className='companyLogo'>
          <img src={preview} alt="User Logo" style={styles.previewImage} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif'
  },
  dropzone: {
    cursor: 'pointer',
    display: 'inline-block'
  },
previewImage: {
  maxWidth: '90px',
  objectFit: 'cover',
  height: '90px',
}
};

export default ProfileImageUpload;