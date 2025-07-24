import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { IoCameraSharp } from "react-icons/io5";
import placeholderimg from "./../assets/images/placeholderimg.jpg";

const ProfileImageUpload = (props) => {
  const [preview, setPreview] = useState(placeholderimg);

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
          <img src={preview} alt="Preview" style={styles.previewImage} />
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
