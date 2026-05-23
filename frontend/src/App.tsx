import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import './index.css';
import { FlashcardReview } from './components/FlashcardReview';
import { GatekeeperConfig } from './components/GatekeeperConfig';
import { CatGatekeeper } from './components/CatGatekeeper';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="app-container">
      <div className="bg-gradient-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      
      <main className="glass-panel">
        <h1>Kairos</h1>
        <p>Your gateway to mastering Korean. Built specially for Mongolian learners.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button className="btn-primary" onClick={() => navigate('/review')}>
            Start Learning Session
          </button>
          
          <button 
            onClick={() => navigate('/settings')} 
            style={{ 
              background: 'transparent', border: '1px solid #3b82f6', 
              color: '#3b82f6', padding: '15px', borderRadius: '12px', 
              cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' 
            }}
          >
            Gatekeeper Settings
          </button>
          
          <button 
             onClick={() => navigate('/blocked')} 
             style={{ 
               background: 'transparent', border: '1px solid #ef4444', 
               color: '#ef4444', padding: '15px', borderRadius: '12px', 
               cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' 
             }}
          >
            Preview App Blocker
          </button>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/review" element={
            <div className="app-container">
                <FlashcardReview />
            </div>
        } />
        <Route path="/settings" element={
            <div className="app-container">
                 <GatekeeperConfig />
            </div>
        } />
        <Route path="/blocked" element={<CatGatekeeper />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
