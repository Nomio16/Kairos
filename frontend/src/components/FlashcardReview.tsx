import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const FlashcardReview: React.FC = () => {
  const [cards, setCards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

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
        console.error("Backend not reachable or no decks found");
      }
      setLoading(false);
    };
    fetchCards();
  }, []);

  if (loading) return <div style={{color: 'white', textAlign: 'center'}}>Loading intelligence...</div>;
  if (cards.length === 0) return (
      <div className="glass-panel">
          <h2>No intelligence found</h2>
          <p>Run the backend seeding script to inject your first flashcards into Supabase!</p>
      </div>
  );

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 400); // Wait for flip animation to finish rendering before swapping text
  };

  return (
    <div className="flashcard-scene glass-panel" style={{ padding: '0', background: 'var(--bg-secondary)' }}>
      <div 
        className={`flashcard-inner ${isFlipped ? 'is-flipped' : ''}`} 
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="flashcard-face flashcard-front">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{currentCard.front_text}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Tap to flip</p>
        </div>
        
        <div className="flashcard-face flashcard-back">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '30px', background: 'linear-gradient(to right, #60a5fa, #c084fc)',  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {currentCard.back_text}
          </h2>
          <div className="quality-buttons" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button className="btn-sm btn-fail" onClick={(e) => { e.stopPropagation(); handleNext() }}>Again</button>
            <button className="btn-sm btn-hard" onClick={(e) => { e.stopPropagation(); handleNext() }}>Hard</button>
            <button className="btn-sm btn-good" onClick={(e) => { e.stopPropagation(); handleNext() }}>Good</button>
            <button className="btn-sm btn-easy" onClick={(e) => { e.stopPropagation(); handleNext() }}>Easy</button>
          </div>
        </div>
      </div>
    </div>
  );
}
