import React, { useState } from 'react';
import logo from './assets/logo.png';

function UpdatePet({ setScreen, savePet, petToEdit }) {
  const [formData, setFormData] = useState({
    species: petToEdit?.species || 'Dog',
    gender: petToEdit?.gender || 'Unknown',
    coatColour: petToEdit?.coatColour || '',
    eyeColour: petToEdit?.eyeColour || '',
    traits: petToEdit?.traits || '',
    age: petToEdit?.age || '',
    microchip: petToEdit?.microchip === 'Found' ? 'yes' : 'no',
    healthState: petToEdit?.healthState || '',
    image: petToEdit?.image || '',
    status: petToEdit?.status || 'Unidentified'
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleMicrochipChange = (val) => {
    setFormData({ 
      ...formData, 
      microchip: val, 
      status: val === 'no' ? 'Unidentified' : formData.status 
    });
  };

  const onSubmit = () => {

    setErrorMessage('');

    if (!formData.image) {
      setErrorMessage("Please upload a photo of the pet.");
      return;
    }
    if (!formData.coatColour || formData.coatColour.trim() === '') {
      setErrorMessage("Please enter the coat colour of the pet.");
      return;
    }
    if (!formData.eyeColour || formData.eyeColour.trim() === '') {
      setErrorMessage("Please enter the eye colour of the pet.");
      return;
    }
    const ageNum = parseInt(formData.age, 10);
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 30) {
      setErrorMessage("Please enter a valid age between 0 and 30.");
      return;
    }

    // IF VALID, SEND TO BACKEND
    savePet({
      species: formData.species,
      gender: formData.gender,
      coatColour: formData.coatColour,
      eyeColour: formData.eyeColour,
      traits: formData.traits,
      age: formData.age,
      healthState: formData.healthState,
      status: formData.status,
      image: formData.image,
      microchip: formData.microchip === 'yes' ? 'Found' : 'None'
    });
  };

  return (
    <div className="app-container">

      <div className="main-content">
        <span className="back-link" onClick={() => setScreen('dashboard')}>&lt; Back</span>
        <h1 className="page-title">Update Pet Details</h1>

        <div className="add-pet-grid">
          <div className="upload-placeholder">
            {formData.image ? (
              <img 
                src={formData.image} 
                alt="Pet Preview" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} 
              />
            ) : (
              <span>No image uploaded</span>
            )}
          </div>

          <div className="form-container">
            <h3>Appearance:</h3>

              {errorMessage && (
                <div className="error-banner">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              )}            

            <div className="input-group">
              <label>Species:</label>
              <select 
                value={formData.species} 
                onChange={(e) => setFormData({...formData, species: e.target.value})}
                style={{ flex: 1, padding: '10px', backgroundColor: '#f1f1f1', border: 'none', borderRadius: '6px' }}
              >
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Bird">Bird</option>
                <option value="Rabbit">Rabbit</option>
                <option value="Horse">Horse</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="input-group">
              <label>Coat colour:</label>
              <input type="text" value={formData.coatColour} onChange={(e) => setFormData({...formData, coatColour: e.target.value})} />
            </div>
            
            <div className="input-group">
              <label>Eye colour:</label>
              <input type="text" value={formData.eyeColour} onChange={(e) => setFormData({...formData, eyeColour: e.target.value})} />
            </div>
            
            <div className="input-group">
              <label>Distinctive traits:</label>
              <input type="text" value={formData.traits} onChange={(e) => setFormData({...formData, traits: e.target.value})} />
            </div>
            
            <div className="input-group">
              <label>Age:</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input 
                  type="number" 
                  min="0"
                  max="30"
                  value={formData.age} 
                  onChange={(e) => setFormData({...formData, age: e.target.value})} 
                  style={{ 
                    width: '80px', 
                    padding: '10px', 
                    backgroundColor: '#f1f1f1', 
                    border: 'none', 
                    borderRadius: '6px',
                    textAlign: 'center', 
                    flex: 'none' 
                  }} 
                />
                <span style={{ color: '#888', fontSize: '14px', fontWeight: 'bold' }}>years</span>
              </div>
            </div>

            <div className='input-group'>
              <label>Gender:</label>
              <div className="radio-group">
                <button type="button" className={formData.gender === 'Unknown' ? 'active unknown-active' : ''} onClick={() => setFormData({...formData, gender: 'Unknown'})}>Unknown</button>
                <button type="button" className={formData.gender === 'Male' ? 'active' : ''} onClick={() => setFormData({...formData, gender: 'Male'})}style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="10" cy="14" r="5"></circle>
                    <line x1="13.54" y1="10.46" x2="21" y2="3"></line>
                    <polyline points="16 3 21 3 21 8"></polyline>
                  </svg></button>
                <button type="button" className={formData.gender === 'Female' ? 'active' : ''} onClick={() => setFormData({...formData, gender: 'Female'})}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="9" r="5"></circle>
                    <line x1="12" y1="14" x2="12" y2="21"></line>
                    <line x1="9" y1="18" x2="15" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>

            <h3 style={{ marginTop: '30px' }}>Health:</h3>
            <div className="input-group">
              <label>Microchip:</label>
              <div className="radio-group">
                <button type="button" className={formData.microchip === 'yes' ? 'active' : ''} onClick={() => handleMicrochipChange('yes')}>Yes</button>
                <button type="button" className={formData.microchip === 'no' ? 'active' : ''} onClick={() => handleMicrochipChange('no')}>No</button>
              </div>
            </div>
            
            <div className="input-group">
              <label>Health state after clinical exam:</label>
              <textarea rows="3" value={formData.healthState} onChange={(e) => setFormData({...formData, healthState: e.target.value})} />
            </div>

            <div className="input-group" style={{ marginBottom: '30px' }}>
              <label>Initial Status:</label>
              <div className={`status-slider-container ${formData.microchip === 'no' ? 'is-disabled' : ''}`}>
                <div className={`status-glider ${formData.status.replace(' ', '-').toLowerCase()}`}></div>
                <button type="button" className={formData.status === 'Unidentified' ? 'active' : ''} onClick={() => setFormData({...formData, status: 'Unidentified'})}>Unidentified</button>
                <button type="button" disabled={formData.microchip === 'no'} className={formData.status === 'Pending Contact' ? 'active' : ''} onClick={() => setFormData({...formData, status: 'Pending Contact'})}>Pending</button>
                <button type="button" disabled={formData.microchip === 'no'} className={formData.status === 'Owner Contacted' ? 'active' : ''} onClick={() => setFormData({...formData, status: 'Owner Contacted'})}>Contacted</button>
              </div>
            </div>

            <div className="form-actions">
              <button className="btn-upload" onClick={onSubmit}>Save Changes</button>
              <button className="btn-cancel" onClick={() => setScreen('dashboard')}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdatePet;