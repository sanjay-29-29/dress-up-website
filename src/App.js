import React, { useState, useRef } from 'react';
import axios from 'axios';
import { FiUpload, FiLoader } from 'react-icons/fi';
import './App.css';

function App() {
  const [selectedFile1, setSelectedFile1] = useState(null);
  const [selectedFile2, setSelectedFile2] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInput1 = useRef();
  const fileInput2 = useRef();

  const handleFileUpload1 = event => {
    const file = event.target.files[0];
    const fileURL = URL.createObjectURL(file);

    const img = new Image();
    img.onload = () => {
      setSelectedFile1({ file, url: fileURL });
    };
    img.onerror = () => {
      console.error("Error loading cloth image"); 
    };
    img.src = fileURL;
  };
  
  const handleFileUpload2 = event => {
    const file = event.target.files[0];
    const fileURL = URL.createObjectURL(file);
    
    const img = new Image();
    img.onload = () => {
      setSelectedFile2({ file, url: fileURL });
    };
    img.onerror = () => {
      console.error("Error loading cloth image"); 
    };
    img.src = fileURL;
  };

const handleApiCall = async () => {
  if (!selectedFile1 || !selectedFile2) {
    alert("Please upload both image and cloth.");
    return;
  }
  setLoading(true);
  const formData = new FormData();
  formData.append('cloth', selectedFile1.file); 
  formData.append('image', selectedFile2.file); 

  try {
    const response = await axios.post('https://glowing-polite-porpoise.ngrok-free.app/change_cloth', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    setResultImage(`data:image/jpeg;base64, ${response.data}`);
    console.log("API Response (typeof):", response.data, typeof response.data); 
    console.log("API Response Data:", response.data);
  } catch (error) {
    console.error('Error while making API call', error);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="App" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <header className="App-header" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}> 
        <div style={{ border: '2px dotted #000', padding: '10px', borderRadius: '10px', flex: 1, height: '75vh', margin: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          {!selectedFile1 && <><FiUpload size={50} onClick={() => fileInput1.current.click()} /><p>Upload Cloth</p></>}
          <input type="file" style={{ display: 'none' }} ref={fileInput1} onChange={handleFileUpload1} />
          {selectedFile1 && <img src={selectedFile1.url} alt="Selected" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}

        </div>
        <div style={{ border: '2px dotted #000', padding: '10px', borderRadius: '10px', flex: 1, height: '75vh', margin: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          {!selectedFile2 && <><FiUpload size={50} onClick={() => fileInput2.current.click()} /><p>Upload Image</p></>}
          <input type="file" style={{ display: 'none' }} ref={fileInput2} onChange={handleFileUpload2} />
          {selectedFile2 && <img src={selectedFile2.url} alt="Selected" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
        </div>
        <div style={{ border: '2px dotted #000', padding: '10px', borderRadius: '10px', flex: 1, height: '75vh', margin: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        {loading ? <FiLoader className="FiLoader" size={50} /> : resultImage ? <img src={resultImage} alt="Result" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <button style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', outline: 'none' }} onClick={handleApiCall}>Send</button>}        </div>
      </header>
    </div>
  );
}

export default App;
