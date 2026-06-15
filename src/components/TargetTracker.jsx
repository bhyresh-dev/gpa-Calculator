'use client';

import { useState, useEffect } from 'react';
import { Target, TrendingUp, AlertCircle } from 'lucide-react';

const GRADES = { 'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'P': 4, 'F': 0 };

export default function TargetTracker({ semesters, targetCgpa, onTargetChange }) {
  const [simulatedGrade, setSimulatedGrade] = useState('A');
  const [simulatedCredits, setSimulatedCredits] = useState(20);

  // Load saved preferences on mount
  useEffect(() => {
    const savedGrade = localStorage.getItem('simulatedGrade');
    const savedCredits = localStorage.getItem('simulatedCredits');
    if (savedGrade) setSimulatedGrade(savedGrade);
    if (savedCredits) setSimulatedCredits(parseInt(savedCredits, 10));
  }, []);

  // Save preferences when they change
  useEffect(() => {
    localStorage.setItem('simulatedGrade', simulatedGrade);
    localStorage.setItem('simulatedCredits', simulatedCredits);
  }, [simulatedGrade, simulatedCredits]);

  // Calculate current totals
  let totalPoints = 0;
  let totalCredits = 0;
  semesters.forEach(sem => {
    sem.subjects.forEach(sub => {
      if (sub.grade && sub.credits > 0) {
        totalPoints += GRADES[sub.grade] * sub.credits;
        totalCredits += sub.credits;
      }
    });
  });

  const currentCgpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
  const progress = targetCgpa > 0 ? Math.min((currentCgpa / targetCgpa) * 100, 100) : 0;
  const isAchieved = currentCgpa >= (targetCgpa || 0) && targetCgpa > 0;

  // Calculate what's needed
  const calculateNeeded = () => {
    if (!targetCgpa || targetCgpa <= 0 || totalCredits === 0) return null;
    if (currentCgpa >= targetCgpa) return { achieved: true };

    const gradePoints = GRADES[simulatedGrade] || 8;
    // Formula: (totalPoints + gradePoints * X) / (totalCredits + X) = targetCgpa
    // Solving for X: X = (targetCgpa * totalCredits - totalPoints) / (gradePoints - targetCgpa)
    const numerator = targetCgpa * totalCredits - totalPoints;
    const denominator = gradePoints - targetCgpa;

    if (denominator <= 0) {
      return { impossible: true, reason: `Grade "${simulatedGrade}" (${gradePoints}) is not high enough to reach ${targetCgpa}` };
    }

    const creditsNeeded = Math.ceil(numerator / denominator);
    const semestersNeeded = Math.ceil(creditsNeeded / simulatedCredits);

    return { creditsNeeded, semestersNeeded, grade: simulatedGrade };
  };

  const prediction = calculateNeeded();

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
        <Target size={20} style={{ color: 'var(--accent-primary)' }} />
        CGPA Target Tracker
      </h3>

      {/* Target Input */}
      <div className="target-inputs">
        <div className="input-group">
          <label className="input-label">Target CGPA</label>
          <input
            type="number"
            className="input-field"
            min="0" max="10" step="0.01"
            placeholder="e.g. 8.50"
            value={targetCgpa || ''}
            onChange={(e) => onTargetChange(parseFloat(e.target.value) || null)}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          />
        </div>
        <div className="input-group">
          <label className="input-label">Expected Grade</label>
          <select
            className="input-field"
            value={simulatedGrade}
            onChange={(e) => setSimulatedGrade(e.target.value)}
            style={{ appearance: 'none' }}
          >
            {Object.entries(GRADES).map(([g, p]) => (
              <option key={g} value={g}>{g} ({p})</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label className="input-label">Credits / Sem</label>
          <input
            type="number"
            className="input-field"
            min="1" max="40"
            value={simulatedCredits}
            onChange={(e) => setSimulatedCredits(parseInt(e.target.value) || 20)}
          />
        </div>
      </div>

      {/* Progress Bar */}
      {targetCgpa > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Progress</span>
            <span style={{ color: isAchieved ? 'var(--success)' : 'var(--accent-primary)', fontWeight: 600 }}>
              {currentCgpa.toFixed(2)} / {targetCgpa.toFixed(2)}
            </span>
          </div>
          <div style={{
            height: '12px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border-color)', overflow: 'hidden'
          }}>
            <div style={{
              height: '100%', borderRadius: '6px',
              width: `${progress}%`,
              background: isAchieved
                ? 'linear-gradient(90deg, var(--success), #34d399)'
                : 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
              transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: isAchieved ? '0 0 10px rgba(16,185,129,0.4)' : '0 0 10px var(--accent-glow)',
            }} />
          </div>
        </div>
      )}

      {/* Prediction */}
      {prediction && targetCgpa > 0 && (
        <div style={{
          padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)',
          background: prediction.achieved ? 'rgba(16,185,129,0.08)' : prediction.impossible ? 'rgba(239,68,68,0.08)' : 'rgba(59,130,246,0.08)',
          border: `1px solid ${prediction.achieved ? 'rgba(16,185,129,0.2)' : prediction.impossible ? 'rgba(239,68,68,0.2)' : 'rgba(59,130,246,0.2)'}`,
        }}>
          {prediction.achieved ? (
            <p style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <TrendingUp size={18} /> 🎉 Target achieved! Your CGPA exceeds your goal.
            </p>
          ) : prediction.impossible ? (
            <p style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <AlertCircle size={18} /> {prediction.reason}
            </p>
          ) : (
            <div>
              <p style={{ color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={18} /> You need ~{prediction.creditsNeeded} more credits
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                at grade <strong>{prediction.grade}</strong> ({GRADES[prediction.grade]} points) — roughly <strong>{prediction.semestersNeeded} semester{prediction.semestersNeeded > 1 ? 's' : ''}</strong> at {simulatedCredits} credits each.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
