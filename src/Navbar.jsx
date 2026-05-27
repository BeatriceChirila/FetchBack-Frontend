import React from 'react';
import logo from './assets/logo.png';




function Navbar({ screen, setScreen, currentUser, handleLogout, setIsLoginOpen }) {
    let displayName = "";
    if(currentUser) {
        const rawName = currentUser.name || currentUser.email.split('@')[0];
        displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    }
    return (

        <nav className="navbar">
            <div className="brand-section" onClick={() => setScreen('home')} style={{ cursor: 'pointer' }}>
                <img src={logo} alt="FetchBack Logo" className="logo" style={{ width: '100px', height: '100px', objectFit: 'contain' }} />
                <span className="brand-text text-black">Fetch</span>
                <span className="brand-text text-green">Back</span>
            </div>

            <div className="nav-links">
                <span className="nav-item" style={{ fontSize: '17px', cursor: 'pointer', fontWeight: screen === 'lost-pets' ? 'bold' : 'normal' }} onClick={() => setScreen('lost-pets')}>
                    Lost Pets
                </span>
                
                {/* Conditional Rendering based on ROLE now! */}
                {currentUser ? (
                    <>
                        {currentUser.role === 'VET' && (
                            <span className="nav-item" onClick={() => setScreen('dashboard')} style={{ fontSize: '17px', cursor: 'pointer', fontWeight: screen === 'dashboard' ? 'bold' : 'normal' }}>
                                Vet Dashboard
                            </span>
                        )}
                        
                        <span className="nav-item text-green" style={{ fontSize: '17px' }}>
                            {currentUser.role === 'VET' 
                                ? `Dr. ${displayName} - ${currentUser.clinicName || 'Clinic'}` 
                                : displayName
                            }
                        </span>

                        <span className="nav-item" onClick={handleLogout} style={{ fontSize: '17px', cursor: 'pointer', color: '#e63946', fontWeight: 'bold' }}>
                            Log out
                        </span>
                    </>
                ) : (
                    <span className="nav-item" style={{ fontSize: '17px', cursor: 'pointer' }} onClick={() => setIsLoginOpen(true)}>
                        Log in
                    </span>
                )}
            </div>
        </nav>
    );
}

export default Navbar;