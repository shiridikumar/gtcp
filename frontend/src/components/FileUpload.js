import React, { useRef } from 'react';
import axios from 'axios';
import FileUploadIcon from '@mui/icons-material/FileUpload';

const FileUpload = () => {
    const fileInputRef = useRef();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            axios.post('http://localhost:5000/dataset_upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(response => {
                    console.log(response.data);
                    alert("File upload succesfully!")
                    window.location.reload()

                })
                .catch(error => {
                    alert('There was an error uploading the file!\nPlease make sure to upload to .txt file only');
                });
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            <button onClick={handleButtonClick} className='btn btn-secondary' style={{ display: "flex", justifyContent: "flex-start", marginBottom: "20px", width: "200px", backgroundColor: "#2b5377" }}>Add new dataset<FileUploadIcon sx={{ marginLeft: "5px" }}  /></button>
        </div>
    );
};

export default FileUpload;


