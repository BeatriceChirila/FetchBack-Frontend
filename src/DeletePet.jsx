import React from 'react';
import logo from './assets/logo.png';
import './DeletePet.css';

function DeletePet({ pets, editingId, setScreen, handleRemove }) {
  const pet = pets.find(p => p.id === editingId);

  if (!pet) {
    return <div className="main-content">Pet not found. <button onClick={() => setScreen('dashboard')}>Back</button></div>;
  }

  return (
    <div className="app-container">

      <div className="main-content delete-page-wrapper">
        <div className="delete-card">
          
          <div className="warning-icon">
            <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#e57373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>

          <h1 className="page-title text-red">Erase Record?</h1>
          <p className="delete-subtitle">
            Are you absolutely sure you want to remove <strong>{pet.species} ({pet.breed})</strong> from the system?
          </p>
          <p className="delete-warning">This action cannot be undone.</p>

          <div className="form-actions delete-actions">
            <button 
                type="button"
                className="btn-cancel" 
                onClick={() => setScreen('dashboard')}
            >
                No, Keep Record
            </button>
            
            <button 
                type="button"
                className="btn-delete-confirm" 
                onClick={() => {
                handleRemove(pet.id);
                setScreen('dashboard');
                }}
            >
                Yes, Erase Pet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeletePet;