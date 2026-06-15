'use client';

import { useState, useEffect, useRef } from 'react';
import { Trophy } from 'lucide-react';

export default function LoadingMiniGame() {
  const [score, setScore] = useState(0);
  const basketXRef = useRef(50);
  const [basketXState, setBasketXState] = useState(50);
  const [grades, setGrades] = useState([]);
  const containerRef = useRef(null);

  const setBasket = (val) => {
    let newVal = Math.max(10, Math.min(90, val)); // Keep inside bounds
    basketXRef.current = newVal;
    setBasketXState(newVal);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') setBasket(basketXRef.current - 10);
      if (e.key === 'ArrowRight') setBasket(basketXRef.current + 10);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTouchMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    const x = touch.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setBasket(percentage);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setGrades(prev => {
        let newGrades = prev.map(g => ({ ...g, y: g.y + 2.5 }));
        
        let scoreDelta = 0;
        const basketPos = basketXRef.current;
        
        const caught = [];
        newGrades.forEach(g => {
          // Collision logic
          if (g.y > 80 && g.y < 95 && Math.abs(g.x - basketPos) < 15) {
            caught.push(g.id);
            if (g.isBad) scoreDelta -= 5;
            else scoreDelta += 1;
          }
        });
        
        if (scoreDelta !== 0) {
          setScore(s => Math.max(0, s + scoreDelta));
        }
        
        // Remove caught or fallen grades
        newGrades = newGrades.filter(g => g.y <= 100 && !caught.includes(g.id));
        
        // Spawn new grades randomly
        if (Math.random() < 0.05) {
          const rand = Math.random();
          const text = rand > 0.8 ? 'F' : rand > 0.5 ? 'A+' : 'O';
          newGrades.push({
            id: Math.random().toString(),
            x: Math.random() * 80 + 10, // spawn horizontally within bounds
            y: -10,
            text,
            isBad: text === 'F'
          });
        }
        
        return newGrades;
      });
    }, 50); // 20 fps for simple rendering
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: '100%', padding: '1rem', background: 'var(--bg-primary)' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>Loading Dashboard...</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Catch the good grades to pass the time!</p>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
        <Trophy size={28} /> Score: {score}
      </div>

      <div 
        ref={containerRef}
        onTouchMove={handleTouchMove}
        onMouseMove={(e) => {
           if (e.buttons === 1) handleTouchMove(e);
        }}
        style={{
          width: '100%', maxWidth: '350px', height: '400px', 
          background: 'rgba(30, 41, 59, 0.4)', border: '1px solid var(--border-color)', 
          borderRadius: 'var(--radius-lg)', position: 'relative', overflow: 'hidden',
          cursor: 'grab', touchAction: 'none', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
        }}
      >
        {/* Falling Grades */}
        {grades.map(g => (
          <div key={g.id} style={{
            position: 'absolute', left: `${g.x}%`, top: `${g.y}%`,
            transform: 'translateX(-50%)',
            background: g.isBad ? 'var(--danger)' : 'var(--accent-primary)',
            color: '#fff', fontWeight: 'bold', fontFamily: 'var(--font-mono)',
            borderRadius: '50%', width: '45px', height: '45px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: g.isBad ? '0 0 15px rgba(239, 68, 68, 0.6)' : '0 0 15px rgba(59, 130, 246, 0.6)',
            transition: 'top 0.05s linear'
          }}>
            {g.text}
          </div>
        ))}
        
        {/* Player Basket */}
        <div style={{
          position: 'absolute', bottom: '15px', left: `${basketXState}%`,
          transform: 'translateX(-50%)', width: '90px', height: '24px',
          background: 'var(--text-primary)', borderRadius: '12px 12px 6px 6px',
          transition: 'left 0.05s linear', display: 'flex', justifyContent: 'center', alignItems: 'center',
          color: 'var(--bg-primary)', fontWeight: 'bold', fontSize: '10px'
        }}>
          BASKET
        </div>
      </div>
      <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginTop: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <span style={{ padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>Drag</span>
        or
        <span style={{ padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>←/→ Keys</span>
      </p>
    </div>
  );
}
