import React, { useState } from 'react';
import logo from './assets/logo.png';
import './PetDetails.css';

function PetDetails({ pets, viewingId, setScreen, returnScreen }) {
    const [showModal, setShowModal] = useState(false);
    
    const pet = pets.find(p => p.id === viewingId);

    if (!pet) {
        return (
            <div className="app-container" style={{ textAlign: 'center', marginTop: '100px' }}>
                <h2>Pet not found.</h2>
                <button className="btn-cancel" onClick={() => setScreen('home')}>Go Back</button>
            </div>
        );
    }

    const handleGetDirections = (address) => {
        const query = encodeURIComponent(address || "Vet clinic");
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    };

    return (
        <div className="app-container">

            <div className="main-content details-page-wrapper">
                <span className="back-link" style={{ cursor: 'pointer' }} onClick={() => setScreen(returnScreen)}>
                    ← Go Back
                </span>

                <div className="details-card">
                    <div className="details-grid">
                        <div className="details-image-container">
                            {pet.image ? (
                                <img src={pet.image} alt={pet.species} />
                            ) : (
                                <div className="no-photo-large">No Photo Available</div>
                            )}
                        </div>

                        <div className="details-info-container">
                            <div className="info-section">
                                <h3>Appearance:</h3>
                                <ul className="info-list">
                                    <li><strong>Species:</strong> {pet.species}</li>
                                    <li><strong>Breed:</strong> {pet.breed}</li>
                                    <li><strong>Coat colour:</strong> {pet.coatColour}</li>
                                    <li><strong>Eye colour:</strong> {pet.eyeColour}</li>
                                    <li><strong>Distinctive traits:</strong> {pet.traits}</li>
                                    <li><strong>Age:</strong> {pet.age}</li>
                                    <li><strong>Gender:</strong> {pet.gender}</li>
                                </ul>
                            </div>

                            <div className="info-section">
                                <h3>Health:</h3>
                                <ul className="info-list">
                                    <li><strong>Microchip:</strong> {pet.microchip}</li>
                                    <li><strong>Conditions:</strong> {pet.health}</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="details-action-center">
                        <button className="btn-fetchback" onClick={() => setShowModal(true)}>
                            Is this your pet? Come FetchBack!
                        </button>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="location-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowModal(false)}>X</button>
                        
                        <h2 className="modal-title">
                            {pet.clinic?.name ? `${pet.clinic.name} Location` : "Pet's location"}
                        </h2>
                        
                        <div className="modal-map-container">
                            {pet.clinic?.address ? (
                                <iframe
                                    title="Clinic Location"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, borderRadius: '8px' }}
                                    loading="lazy"
                                    allowFullScreen
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(pet.clinic.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                ></iframe>
                            ) : (
                                <div className="map-placeholder">
                                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#5d9981" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                    <p>No map available</p>
                                </div>
                            )}
                        </div>

                        <div className="modal-info">
                            <p><strong>Address:</strong> {pet.clinic?.address || "Address not provided"}</p>
                            <p><strong>Phone number:</strong> {pet.clinic?.phone || "Phone number not provided"}</p>
                        </div>

                        <button 
                            className="btn-directions-popup" 
                            onClick={() => handleGetDirections(pet.clinic?.address)}
                        >
                            Get directions
                        </button>
                        <p className="modal-footer-text">Please call before going to the clinic </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PetDetails;