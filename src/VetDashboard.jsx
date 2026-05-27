import React from 'react';
import logo from './assets/logo.png';
import './VetDashboard.css';

function VetDashboard({ pets, setScreen, setEditingId, currentPage, setCurrentPage, totalPages, totalPets, stats, setViewingId, currentUser }) {  
  function SummaryBox({ label, count, colorClass = "text-black" }) {
    return (
      <div className="summary-box">
        <div className="summary-label">{label}</div>
        <div className={`summary-count ${colorClass}`}>{count}</div>
      </div>
    );
  }

  const IconPencil = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>);
  const IconTrash = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>);

  return (
    <div className="app-container">      

      <div className="main-content">
        <div className="header-section">
          <h1 className="page-title">Animals in clinic custody</h1>
          <button className="btn-add" onClick={() => setScreen('add-pet')} >
                 Add new
          </button>
        </div>

        {/* Summary Statistics */}
        <div className="summary-container">
          <SummaryBox label="Total Pets" count={totalPets} />
          <SummaryBox label="Unidentified" count={stats.unidentified} />
          <SummaryBox label="Owner Contacted" count={stats.contacted} colorClass="text-green" />
        </div>

        {/* The List of Pet Cards */}
        <div className="cards-container">
          {pets.map((pet) => (
            <div key={pet.id} className="pet-card" style={{ cursor: 'pointer' }} 
              onClick={() => {
                setViewingId(pet.id);
                setScreen('vet-pet-details');
              }}>
              <div className="pet-image" style={{ overflow:'hidden', borderRadius: '4px'}}>
                {pet.image ? (
                    <img
                    src={pet.image}
                    alt={pet.species}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <div style={{ width: '100%', height: '100%', backgroundColor: '#ccc' }}></div>
                )}
              </div>
              <div className="pet-details">
                <div><strong>Date Admitted:</strong> {pet.dateAdmitted}</div>
                <div><strong>Status:</strong> {pet.status}</div>
                <div><strong>Microchip:</strong> {pet.microchip}</div>
                <div style={{ marginTop: '5px', fontSize: '16px', color: '#4CAF50' }}>
                <strong>{pet.species} - {pet.breed}</strong>
                </div>
              </div>
              
              <div className={`badge ${pet.status === 'Unidentified' ? 'badge-unidentified' : pet.status === 'Owner Contacted' ? 'badge-contacted' : 'badge-pending'}`}>
                {pet.status ? pet.status.toLowerCase() : 'unknown'}
              </div>

              <div className="action-buttons" style={{ marginLeft: 'auto' }}>
                <span className="action-edit" title="update" onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(pet.id);
                    setScreen('update-pet');
                }}>
                    <IconPencil />
                </span>
                
                <span className="action-remove" title="delete" onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(pet.id);
                    setScreen('delete-pet');
                }}>
                    <IconTrash />
                </span>
              </div>
            </div>
          ))}
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
    </div>
  );
}

export default VetDashboard;