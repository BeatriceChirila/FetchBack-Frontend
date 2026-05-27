import React, { useState, useEffect } from 'react';
import logo from './assets/logo.png';
import SightingPopup from './SightingPopup';
import './LostPets.css';

function LostPets({ pets, setScreen, setViewingId, currentPage, setCurrentPage, totalPages }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecies, setFilterSpecies] = useState("");
  const [filterColor, setFilterColor] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const uniqueSpecies = [...new Set(pets.map(p => p.species).filter(Boolean))];
  const uniqueColors = [...new Set(pets.map(p => p.coatColour).filter(Boolean))];

  const filteredPets = pets.filter(pet => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = 
      (pet.species || "").toLowerCase().includes(search) ||
      (pet.breed || "").toLowerCase().includes(search) ||
      (pet.coatColour || "").toLowerCase().includes(search);
    
    const matchesSpecies = filterSpecies === "" || pet.species === filterSpecies;
    const matchesColor = filterColor === "" || pet.coatColour === filterColor;
    
    return matchesSearch && matchesSpecies && matchesColor;
  });

  const handleSightingSubmit = (sightingData) => {
    console.log("New sighting from Catalog:", sightingData);
    alert("Thank you for reporting the sighting! The information has been sent to nearby vet clinics.");
  };

  return (
    <div className="app-container">

      <div className="main-content">
        <div className="catalog-header">
          <h1 className="page-title">All Lost Pets</h1>
          
          {/* --- FILTER CONTROLS --- */}
          <div className="search-container" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="Search by breed, color..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              style={{ flex: '1', minWidth: '200px' }}
            />
            
            <select 
              value={filterSpecies} 
              onChange={(e) => setFilterSpecies(e.target.value)}
              className="search-input"
              style={{ width: 'auto', cursor: 'pointer' }}
            >
              <option value="">All Species</option>
              {uniqueSpecies.map(species => (
                <option key={species} value={species}>{species}</option>
              ))}
            </select>

            <select 
              value={filterColor} 
              onChange={(e) => setFilterColor(e.target.value)}
              className="search-input"
              style={{ width: 'auto', cursor: 'pointer' }}
            >
              <option value="">All Colors</option>
              {uniqueColors.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="report-banner">
          <p>Spotted a lost pet? Help them get back home. Every minute counts.</p>
          <button className="btn-pink-small" onClick={() => setIsModalOpen(true)}>
            Report a sighting now
          </button>
        </div>

        <div className="pet-list-container">
          {filteredPets.length > 0 ? (
            // 2. WE USE filteredPets DIRECTLY NOW, BECAUSE THE SERVER ALREADY SLICED IT
            filteredPets.map(pet => {
              const safeLocation = pet.clinic?.address 
                ? pet.clinic.address.split(',').pop() 
                : "Cluj-Napoca";

              return (
                <div key={pet.id} className="pet-list-row" onClick={() => {
                  setViewingId(pet.id);
                  setScreen('pet-details');
                }}>
                  <div className="list-img-box">
                    <img src={pet.image || 'placeholder.png'} alt={pet.species || "pet"} />
                  </div>
                  
                  <div className="list-info">
                    <h3>{pet.species || "Unknown"} - {pet.breed || "Unknown Mix"}</h3>
                    <p><strong>Colour:</strong> {pet.coatColour || "Unknown"} | <strong>Eyes:</strong> {pet.eyeColour || "Unknown"}</p>
                    <p><strong>Age:</strong> {pet.age || "Unknown"} | <strong>Microchip:</strong> {pet.microchip || "Unknown"}</p>
                  </div>

                  <div className="list-city">
                     <span className="location-tag">📍 {safeLocation}</span>
                  </div>

                  <div className="list-arrow">
                    <span>View Profile &rarr;</span>
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{ textAlign: 'center', marginTop: '50px', color: '#888' }}>No pets match your search criteria.</p>
          )}
        </div>

        <div className="pagination-bar" style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px', paddingBottom: '40px' }}>
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(currentPage - 1)}
            className="btn-pagination"
          >
            Previous
          </button>
          
          <span style={{ alignSelf: 'center' }}>Page {currentPage} of {totalPages || 1}</span>

          <button 
            disabled={currentPage >= totalPages} 
            onClick={() => setCurrentPage(currentPage + 1)}
            className="btn-pagination"
          >
            Next
          </button>
        </div>

      </div>

      <SightingPopup
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitSighting={handleSightingSubmit}
      />

    </div>
  );
}

export default LostPets;