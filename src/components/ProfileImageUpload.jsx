import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { IoCameraSharp } from "react-icons/io5";
import placeholderimg from "./../assets/images/placeholderimg.jpg";
import { IMAGE_BASE_URL } from "../utils/apiManager";


const ProfileImageUpload = (data) => {
  const [preview, setPreview] = useState(placeholderimg);

  // console.log("propggggggggggggggggggs",data?.data?.logo);

  const imageUrl = data?.data?.logo;

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    multiple: false,
    onDrop
  });

  return (
    <div style={styles.container} className='profphoto'>
      <div {...getRootProps()} style={styles.dropzone}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop the image here ...</p> :
            <div className='camera'><IoCameraSharp size={30}  style={{ color: '#063f63ff' }}/></div>
        }
      </div>
      <div style={styles.previewContainer}>
        <div className='companyLogo'>
          {/* <img src={preview} alt="Preview" style={styles.previewImage} /> */}
          <img
                src={imageUrl && imageUrl.trim() !== '' ? `${IMAGE_BASE_URL}/${imageUrl}` : preview}
                alt="User Logo"
              />
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
