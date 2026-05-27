import React, {useState} from "react";
import logo from "./assets/logo.png";
import "./Home.css";
import SightingPopup from "./SightingPopup";
import LoginPopup from "./LoginPopup";

function Home({ pets, setScreen, setViewingId, currentUser, setCurrentUser }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleSightingSubmit = (sightingData) => {
    console.log("New sighting:", sightingData);
    alert("Thank you for reporting the sighting! The information has been sent to nearby vet clinics.");
  };

  const handleLoginSuccess = (userData) => {
    setIsLoginOpen(false);
    setCurrentUser(userData.email);

    if(userData.role === 'VET') {
        setScreen('dashboard');
    } else {
        alert('Welcome back, ' + userData.email + '!');
    }
  };

  const handleLogout = () => {
    fetch(`${BASE_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' })
      .then(() => {
        setCurrentUser(null);
        setScreen('home');
      })
      .catch(err => console.error("Logout failed:", err));
  };

  return (
    <div className="app-container">

        <div className="home-content">
        {/* Hero Section */}
        <section className="hero-section">
            <div className="hero-text-content">
                <h1 className="hero-title">Rooting for <span className="text-green">care</span></h1>
                <p className="hero-tagline">
                    Every second counts when a pet is lost. Report sightings and connect with emergency vet clinics to help reunite families.
                </p>
                <div className="hero-buttons">
                    <button 
                        className="btn-pink" 
                        onClick={() => {
                            if (currentUser) {
                                setIsModalOpen(true);
                            } else {
                                setIsLoginOpen(true);
                            }
                        }}
                    >
                        Report a pet sighting
                    </button>
                    <button className="btn-green" onClick={() => setScreen('lost-pets')}>
                        Search lost pets
                    </button>
                </div>
            </div>
            
            <div className="hero-image-container">
                <img 
                    src="https://th-thumbnailer.cdn-si-edu.com/IxsNqe1QgDONDwxgPcWYTb3h3pQ=/1026x684/filters:no_upscale():focal(1061x707:1062x708)/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer_public/74/dc/74dc26a8-8ff9-4fae-8ab4-c310681cf6c4/gettyimages-1276788283.jpg" 
                    alt="Happy rescue dog" 
                    className="hero-image"
                />
                <div className="hero-blob"></div> 
            </div>
        </section>

        {/* 3 CARDS */}
        <section className="features-section">
            <div className="feature-card">
                <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                </div>
                <h3>Report Sightings</h3>
                <p>Spotted a lost pet? Quickly find the nearest vet clinic and help get them to safety.</p>
            </div>

            <div className="feature-card">
                <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <h3>Find Your Pet</h3>
                <p>Search our database of lost pets currently at vet clinics waiting to be reunited.</p>
            </div>

            <div className="feature-card">
                <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><path d="m9 22 3-3 3 3"/><path d="M12 13v6"/></svg>
                </div>
                <h3>Vet Network</h3>
                <p>Trusted veterinary clinics caring for lost pets and helping reunite them with families.</p>
            </div>
        </section>

        {/* Recent Pets Section */}
        <section className="recent-pets-section">
            <h2>Recently Reported Lost Pets</h2>
            <p className="subtitle">These pets are currently waiting at vet clinics</p>
            
            <div className="recent-grid">
            {pets.slice(0, 4).map(pet => (
                <div key={pet.id} className="recent-card"
                onClick={() => {
                                setViewingId(pet.id);
                                setScreen('pet-details');
                                }
                            }
                >
                {
                    pet.image ? (
                        <img
                        src={pet.image}
                        alt = {pet.species}
                        style = {{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <span style = {{ color: '#aaa', fontSize: '14px'}}>No Photo</span>
                        )
                }
                </div>
            ))}
            </div>

            <div className="view-all-link">
            <span className="text-green" style={{ cursor: 'pointer' }} onClick={() => setScreen('lost-pets')}>
                View all lost pets →
            </span>
            </div>
        </section>
        </div>

        <SightingPopup
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmitSighting={handleSightingSubmit}
        />

        <LoginPopup 
            isOpen={isLoginOpen} 
            onClose={() => setIsLoginOpen(false)} 
            onLoginSuccess={handleLoginSuccess}
        />                
    </div>
    );
}

export default Home;