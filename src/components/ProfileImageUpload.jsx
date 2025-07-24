import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { MdCameraEnhance } from "react-icons/md";
import placeholderimg from "./../assets/images/placeholderimg.jpg";

const ProfileImageUpload = () => {
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
    <div style={styles.container}>
      <div {...getRootProps()} style={styles.dropzone}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop the image here ...</p> :
            <div className='company-logo'><MdCameraEnhance size={30} /></div>
        }
      </div>
      <div style={styles.previewContainer}>
        <img src={preview} alt="Preview" style={styles.previewImage} />
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
    borderRadius: '8px',
    display: 'inline-block'
  },
  previewContainer: {
    marginTop: '15px'
  },
previewImage: {
  maxWidth: '95px',
  objectFit: 'cover',
  height: '95px',
  borderRadius: '8px'
}
};

export default ProfileImageUpload;
