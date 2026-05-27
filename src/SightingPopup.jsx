import React, { useState } from 'react';
import './SightingPopup.css';

const SightingPopup = ({ isOpen, onClose, onSubmitSighting }) => {
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitSighting({ location, description, date: new Date().toISOString() });
    setLocation('');
    setDescription('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Report a Sighting</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Where did you see the pet?</label>
            <input type="text" required value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Description & Condition</label>
            <textarea required rows="4" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Submit Report</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SightingPopup;