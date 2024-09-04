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
    setError('');
    setSuccess('');

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
      link.remove();
      setSuccess('File processed and downloaded successfully.');
    } catch (error) {
      setError('An error occurred while processing the file.');
    }
  };

  return (
    <div>
      <h1>HDF5 File Processor</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="file">Select file:</label>
          <input type="file" id="file" onChange={handleFileChange} />
        </div>
        <div>
          <label htmlFor="selectedBand">Enter band name:</label>
          <input
            type="text"
            id="selectedBand"
            value={selectedBand}
            onChange={handleBandChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}

export default App;
