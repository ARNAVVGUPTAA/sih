import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [selectedBand, setSelectedBand] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleBandChange = (e) => {
    setSelectedBand(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !selectedBand) {
      setError('Please select a file and enter a band name.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('selected_band', selectedBand);

    try {
      const response = await axios.post('/api/process_hdf5', formData, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${selectedBand}_COG.tif`);
      document.body.appendChild(link);
      link.click();

      setSuccess('File processed successfully!');
      setError('');
    } catch (err) {
      setError('An error occurred while processing the file.');
      setSuccess('');
    }
  };

  return (
    <div className="App">
      <h1>Upload HDF5 File and Specify Band Name</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} /><br /><br />
        <input
          type="text"
          value={selectedBand}
          onChange={handleBandChange}
          placeholder="Enter Band Name"
        /><br /><br />
        <button type="submit">Upload</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}

export default App;
