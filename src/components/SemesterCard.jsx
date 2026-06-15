'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const GRADES = {
  'O': 10,
  'A+': 9,
  'A': 8,
  'B+': 7,
  'B': 6,
  'C': 5,
  'P': 4,
  'F': 0
};

export default function SemesterCard({ semester, index, onUpdate, onDelete }) {
  const calculateSGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    
    semester.subjects.forEach(subject => {
      if (subject.grade && subject.credits > 0) {
        totalPoints += GRADES[subject.grade] * subject.credits;
        totalCredits += subject.credits;
      }
    });
    
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  const updateSubject = (subIndex, field, value) => {
    const newSubjects = [...semester.subjects];
    newSubjects[subIndex] = { ...newSubjects[subIndex], [field]: value };
    onUpdate(index, { ...semester, subjects: newSubjects });
  };

  const addSubject = () => {
    onUpdate(index, {
      ...semester,
      subjects: [...semester.subjects, { name: '', credits: 0, grade: '' }]
    });
  };

  const removeSubject = (subIndex) => {
    const newSubjects = semester.subjects.filter((_, i) => i !== subIndex);
    onUpdate(index, { ...semester, subjects: newSubjects });
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '2rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>Semester {index + 1}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>
            SGPA: {calculateSGPA()}
          </div>
          {onDelete && (
             <button onClick={() => onDelete(index)} className="btn btn-danger" style={{ padding: '0.5rem' }}>
               <Trash2 size={18} />
             </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {semester.subjects.map((sub, subIndex) => (
          <div key={subIndex} className="subject-row">
            <div className="input-group">
              <label className="input-label">Subject Name</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. Data Structures" 
                value={sub.name}
                onChange={(e) => updateSubject(subIndex, 'name', e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Credits</label>
              <input 
                type="number" 
                min="1" 
                max="10" 
                className="input-field" 
                placeholder="0"
                value={sub.credits || ''}
                onChange={(e) => updateSubject(subIndex, 'credits', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Grade</label>
              <select 
                className="input-field"
                value={sub.grade}
                onChange={(e) => updateSubject(subIndex, 'grade', e.target.value)}
                style={{ appearance: 'none' }}
              >
                <option value="">Select</option>
                {Object.entries(GRADES).map(([grade, points]) => (
                  <option key={grade} value={grade}>{grade} ({points})</option>
                ))}
              </select>
            </div>
            <button className="btn btn-danger" onClick={() => removeSubject(subIndex)}>
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <button className="btn btn-secondary" onClick={addSubject} style={{ marginTop: '1.5rem', width: '100%', borderStyle: 'dashed' }}>
        <Plus size={18} /> Add Subject
      </button>
    </div>
  );
}
