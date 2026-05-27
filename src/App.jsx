import { useState, useEffect } from 'react';
import Home from './Home';
import VetDashboard from './VetDashboard';
import AddPet from './AddPet';
import UpdatePet from './UpdatePet';
import DeletePet from './DeletePet';
import PetDetails from './PetDetails.jsx';
import './App.css';
import LostPets from "./LostPets";
import Navbar from './Navbar';
import LoginPopup from './LoginPopup';

function App() {
  const [pets, setPets] = useState([]);
  const [stats, setStats] = useState({unidentified: 0, contacted: 0});
  const [screen, setScreen] = useState('home'); 
  const [editingId, setEditingId] = useState(null);
  const [viewingId, setViewingId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPets, setTotalPets] = useState(0);
  const limit = 5;
  const totalPages = Math.ceil(totalPets / limit);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  const handleLoginSuccess = (userData) => {
    setCurrentUser({ email: userData.email, name:userData.name, role: userData.role, clinicName: userData.clinicName });
    setIsLoginOpen(false);
    
    if(userData.role === 'VET') {
        setScreen('dashboard');
    } else {
        setScreen('home');
    }
    refreshData();
};

  
const refreshData = () => {
    const isDashboardFlag = screen === 'dashboard' ? '&dashboard=true' : '';
    
    // 2. Attach the flag to the URL
    const url = `/api/pets?page=${currentPage}&limit=5${isDashboardFlag}`;

    fetch(url, { credentials: 'include' })
      .then(response => response.json())
      .then(result => {
        setPets(result.data || []); 
        setTotalPets(result.total || 0); 
        setStats({
            unidentified: result.unidentified || 0, 
            contacted: result.contacted || 0
        });
      })
      .catch(error => console.error('Error fetching pets:', error));
  };

  useEffect(() => {
    refreshData();
  }, [currentPage, screen, currentUser]);

  useEffect(() => {
    if(!currentUser) 
      return;

    let inactivityTimer;

    const resetTimer =() => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        alert('Session expired due to inactivity. Please log in again.');
        handleLogout();
      }, 10000 * 60); // 10 minutes
    };

    const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];

    activityEvents.forEach(event => document.addEventListener(event, resetTimer));
    
    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      activityEvents.forEach(event => document.removeEventListener(event, resetTimer));
    };
  }, [currentUser]);


const handleLogout = () => {
    fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
      .then(() => {
        setCurrentUser(null);
        setPets([]);
        setStats({ unidentified: 0, contacted: 0 });
        setTotalPets(0);
        
        setScreen('home');
      })
      .catch(err => console.error("Logout failed:", err));
  };

  const handleAddPet = (newPetData) => {
    fetch('/api/pets', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPetData)
    })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add pet');
      return data;
    })
    .then(() => {
      refreshData();
      setScreen('dashboard');
    })
    .catch(error => alert(error.message));
  };

  const handleUpdatePet = (updatedPetData) => {
    fetch(`/api/pets/${editingId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPetData)
    })
    .then(async (response) => {
      if(!response.ok) throw new Error('Failed to update pet');
      return response.json();
    })
    .then(() => {
      refreshData();
      setScreen('dashboard');
      setEditingId(null);
    })
    .catch(error => console.error('Error updating pet:', error));
  };

  const handleRemovePet = (idToRemove) => {
    fetch(`/api/pets/${idToRemove}`, { 
      method: 'DELETE',
      credentials: 'include' 
    })
    .then(async (response) => {
      if (!response.ok) throw new Error('Failed to delete pet');
      refreshData();
      setScreen('dashboard');
      setEditingId(null);
    })
    .catch(error => console.error('Error deleting pet:', error));
  };

  return (
    <div className="app-container">
      <Navbar 
            screen={screen} 
            setScreen={setScreen} 
            currentUser={currentUser} 
            handleLogout={handleLogout} 
            setIsLoginOpen={setIsLoginOpen} 
        />
      {screen === 'home' && (
        <Home 
          setScreen={setScreen} 
          pets={pets}
          setViewingId={setViewingId} 
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {screen === 'pet-details' && (
        <PetDetails pets={pets} viewingId={viewingId} setScreen={setScreen} returnScreen="lost-pets" />
      )}
      {screen === 'vet-pet-details' && (
        <PetDetails pets={pets} viewingId={viewingId} setScreen={setScreen} returnScreen="dashboard" />
      )}
      {screen === 'lost-pets' && (
        <LostPets 
          pets={pets} setScreen={setScreen} setViewingId={setViewingId} 
          currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages}
        />
      )}
      {screen === 'dashboard' && (
        <VetDashboard 
          pets={pets} setScreen={setScreen} setEditingId={setEditingId}
          currentPage={currentPage} setCurrentPage={setCurrentPage}
          totalPages={totalPages || 1} totalPets={totalPets} stats={stats}
          setViewingId={setViewingId} returnScreen="dashboard"
        />
      )}
      {screen === 'add-pet' && (
        <AddPet setScreen={setScreen} savePet={handleAddPet} />
      )}
      {screen === 'update-pet' && (
        <UpdatePet 
          setScreen={setScreen} 
          savePet={handleUpdatePet} 
          petToEdit={pets.find(p => p.id === editingId)} 
        />
      )}
      {screen === 'delete-pet' && (
        <DeletePet pets={pets} editingId={editingId} setScreen={setScreen} handleRemove={handleRemovePet} />
      )}
      <LoginPopup 
            isOpen={isLoginOpen} 
            onClose={() => setIsLoginOpen(false)} 
            onLoginSuccess={handleLoginSuccess}
        />
    </div>
  );
}

export default App;