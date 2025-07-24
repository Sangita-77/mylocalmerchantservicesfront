import { hover } from 'framer-motion';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const ProfileImageUpload = () => {
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': []
    },
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
            <p>Drag 'n' drop an image here, or click to select one</p>
        }
      </div>
      {preview && (
        <div style={styles.previewContainer}>
          <img src={preview} alt="Preview" style={styles.previewImage} />
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif'
  },
  dropzone: {
    border: '2px dashed #aaa',
    padding: '40px 20px 20px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    background: '#dff2ff'
  },
  previewContainer: {
    marginTop: '15px'
  },
  previewImage: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '8px'
  }
};

export default ProfileImageUpload;
