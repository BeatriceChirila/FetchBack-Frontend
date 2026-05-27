import React, { useState, useEffect } from 'react';
import './LoginPopup.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const LoginPopup = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLoginMode, setIsLoginMode] = useState(true); 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [role, setRole] = useState('USER'); 
  const [clinicId, setClinicId] = useState('');
  const [clinics, setClinics] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetch(`${API_URL}/api/clinics`)
        .then(res => res.json())
        .then(data => setClinics(data))
        .catch(err => console.error("Could not load clinics", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoginMode && password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const endpoint = isLoginMode 
      ? `${API_URL}/api/auth/login` 
      : `${API_URL}/api/auth/register`;
    
    const payload = isLoginMode 
        ? { email, password } 
        : { email, password, name, role, clinicId: role === 'VET' ? clinicId : null };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        onLoginSuccess(data);
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setRole('USER');
        setClinicId('');
        setIsLoginMode(true);
      } else {
        alert(data.error || 'Authentication failed');
      }
    } catch(error) {
      console.error('Error during authentication:', error);
      alert('Could not connect to the server.');
    }
  };

  return (
    <div className="login-overlay" onClick={onClose}>
      <div className="login-content" onClick={(e) => e.stopPropagation()}>
        <div className="login-header">
          <h2>{isLoginMode ? 'Log in' : 'Register'}</h2>
          <button className="login-close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {!isLoginMode && (
            <>
              <div className="form-group">
                <label>Name</label>
                <input type="text" required placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              
              <div className="form-group">
                <label>I am a...</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                  <option value="USER">Pet Owner / Finder</option>
                  <option value="VET">Veterinary Clinic</option>
                </select>
              </div>

              {role === 'VET' && (
                <div className="form-group">
                  <label>Select Clinic</label>
                  <select required value={clinicId} onChange={(e) => setClinicId(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                    <option value="">-- Choose your clinic --</option>
                    {clinics.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          <div className="form-group">
            <label>Email</label>
            <input type="email" required placeholder="jane@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {!isLoginMode && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" required placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
          )}

          <div className="toggle-container">
            {isLoginMode ? (
              <p className="toggle-text">
                Don't have an account? <span onClick={() => setIsLoginMode(false)}>Sign up!</span>
              </p>
            ) : (
              <p className="toggle-text">
                Already have an account? <span onClick={() => setIsLoginMode(true)}>Log in!</span>
              </p>
            )}
          </div>

          <div className="modal-actions" style={{ justifyContent: 'center' }}>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }}>
              {isLoginMode ? 'Sign in' : 'Sign up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPopup;