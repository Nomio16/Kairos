import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const CatGatekeeper: React.FC = () => {
  const [flashcardsDone, setFlashcardsDone] = useState(0);
  const [cards, setCards] = useState<any[]>([]);
  const target = 5;

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const decksRes = await axios.get(`${API_URL}/api/v1/decks`);
        if (decksRes.data && decksRes.data.length > 0) {
          const deckId = decksRes.data[0].id;
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
          const cardsRes = await axios.get(`${API_URL}/api/v1/decks/${deckId}/flashcards`);
          setCards(cardsRes.data);
        }
      } catch (err) {
        console.error("Error fetching gatekeeper cards:", err);
      }
    };
    fetchCards();
  }, []);

  if (flashcardsDone >= target) {
    return (
      <div className="gatekeeper-overlay" style={overlayStyle}>
        <div className="glass-panel" style={{ zIndex: 1000, position: 'relative' }}>
          <h1 style={{ fontSize: '3rem', margin: 0 }}>😸</h1>
          <h2>Your brain is warmed up!</h2>
          <p>Continue learning Korean on Kairos, or go back to doomscrolling?</p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px' }}>
            <button className="btn-primary" onClick={() => window.location.href = '/'}>Go Learn on Kairos!</button>
            <button 
                className="btn-sm" 
                style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }} 
                onClick={() => alert('Site temporarily unlocked!')}
            >
                Return to Doomscrolling
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gatekeeper-overlay" style={overlayStyle}>
      <div className="glass-panel gatekeeper-modal">
        <h1 style={{ fontSize: '4rem', margin: '0 0 10px 0' }}>😿</h1>
        <h2 style={{ color: '#ef4444' }}>Halt! You haven't practiced today!</h2>
        <p>This site is forcibly locked until you complete <strong>{target - flashcardsDone}</strong> more flashcards.</p>
        
        
        <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '15px', marginTop: '30px' }}>
          {cards.length > 0 ? (
            <>
              <h3 style={{ marginBottom: '15px', fontSize: '1.5rem' }}>{cards[flashcardsDone % cards.length].front_text}</h3>
              <button className="btn-primary" style={{ padding: '10px 20px' }} onClick={() => setFlashcardsDone(prev => prev + 1)}>
                I know this: {cards[flashcardsDone % cards.length].back_text}
              </button>
            </>
          ) : (
            <h3 style={{ marginBottom: '15px', fontSize: '1.5rem', color: 'gray' }}>Loading real intelligence...</h3>
          )}
        </div>
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
    position: 'fixed', 
    top: 0, 
    left: 0, 
    width: '100vw', 
    height: '100vh',
    background: 'rgba(15, 23, 42, 0.9)', 
    backdropFilter: 'blur(20px)',
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 9999
};
