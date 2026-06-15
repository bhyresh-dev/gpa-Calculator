'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { LogOut, Save, RotateCcw, Plus, Download, Cloud, CloudOff, Check } from 'lucide-react';
import { insforge } from '../lib/insforge';
import { saveUserData, loadUserData, clearUserData } from '../lib/db';
import SemesterCard from './SemesterCard';
import TargetTracker from './TargetTracker';
import GradeDistribution from './GradeDistribution';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const GRADES = {
  'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'P': 4, 'F': 0
};

export default function Dashboard({ user }) {
  const [semesters, setSemesters] = useState([]);
  const [targetCgpa, setTargetCgpa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState('saved'); // 'saved' | 'saving' | 'unsaved' | 'error'
  const autoSaveTimer = useRef(null);
  const isInitialLoad = useRef(true);

  // Load data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      const data = await loadUserData(user.id);
      if (data) {
        if (data.semesters) setSemesters(data.semesters);
        else setSemesters([{ subjects: [{ name: '', credits: 0, grade: '' }] }]);
        if (data.target_cgpa) setTargetCgpa(parseFloat(data.target_cgpa));
      } else {
        setSemesters([{ subjects: [{ name: '', credits: 0, grade: '' }] }]);
      }
      setLoading(false);
      isInitialLoad.current = false;
    };
    fetchUserData();
  }, [user]);

  // Auto-save with debounce
  const triggerAutoSave = useCallback(() => {
    if (isInitialLoad.current) return;
    setSyncStatus('unsaved');
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(async () => {
      setSyncStatus('saving');
      const success = await saveUserData(user.id, { semesters, target_cgpa: targetCgpa });
      setSyncStatus(success ? 'saved' : 'error');
    }, 2000);
  }, [user.id, semesters, targetCgpa]);

  useEffect(() => {
    triggerAutoSave();
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
  }, [semesters, targetCgpa, triggerAutoSave]);

  // Manual save
  const handleSave = async () => {
    setSyncStatus('saving');
    const success = await saveUserData(user.id, { semesters, target_cgpa: targetCgpa });
    setSyncStatus(success ? 'saved' : 'error');
  };

  const handleReset = async () => {
    if (window.confirm("Are you sure you want to delete all your data? This cannot be undone.")) {
      setLoading(true);
      await clearUserData(user.id);
      setSemesters([{ subjects: [{ name: '', credits: 0, grade: '' }] }]);
      setTargetCgpa(null);
      setLoading(false);
      setSyncStatus('saved');
    }
  };

  const addSemester = () => {
    setSemesters([...semesters, { subjects: [{ name: '', credits: 0, grade: '' }] }]);
  };

  const updateSemester = (index, newSemester) => {
    const updated = [...semesters];
    updated[index] = newSemester;
    setSemesters(updated);
  };

  const deleteSemester = (index) => {
    const updated = semesters.filter((_, i) => i !== index);
    setSemesters(updated);
  };

  const calculateCGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    semesters.forEach(semester => {
      semester.subjects.forEach(subject => {
        if (subject.grade && subject.credits > 0) {
          totalPoints += GRADES[subject.grade] * subject.credits;
          totalCredits += subject.credits;
        }
      });
    });
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  const getChartData = () => {
    let cumulativePoints = 0;
    let cumulativeCredits = 0;
    const data = [];
    semesters.forEach((semester, index) => {
      let semPoints = 0;
      let semCredits = 0;
      semester.subjects.forEach(subject => {
        if (subject.grade && subject.credits > 0) {
          semPoints += GRADES[subject.grade] * subject.credits;
          semCredits += subject.credits;
        }
      });
      if (semCredits > 0) {
        cumulativePoints += semPoints;
        cumulativeCredits += semCredits;
        data.push({
          name: `Sem ${index + 1}`,
          SGPA: parseFloat((semPoints / semCredits).toFixed(2)),
          CGPA: parseFloat((cumulativePoints / cumulativeCredits).toFixed(2))
        });
      }
    });
    return data;
  };

  // PDF Export
  const handleExportPDF = () => {
    const chartData = getChartData();
    const cgpa = calculateCGPA();
    const userName = user.profile?.name || user.email || 'Student';

    let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Academic Transcript - ${userName}</title>
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
      body { font-family: 'Segoe UI', Tahoma, sans-serif; padding: 40px; color: #1e293b; }
      h1 { font-size: 24px; color: #0f172a; margin-bottom: 4px; }
      h2 { font-size: 16px; color: #3b82f6; margin: 24px 0 12px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; }
      .header { text-align: center; margin-bottom: 32px; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; }
      .header p { color: #64748b; margin-top: 4px; }
      .cgpa-box { text-align: center; font-size: 48px; font-weight: bold; color: #3b82f6; margin: 20px 0; }
      .cgpa-label { font-size: 14px; color: #94a3b8; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
      th, td { padding: 8px 12px; text-align: left; border: 1px solid #e2e8f0; font-size: 13px; }
      th { background: #f1f5f9; font-weight: 600; color: #334155; }
      td { color: #475569; }
      .sgpa-row { background: #f8fafc; font-weight: 600; }
      .footer { margin-top: 32px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; }
      @media print { body { padding: 20px; } }
    </style></head><body>`;

    html += `<div class="header"><h1>🎓 Academic Transcript</h1><p>${userName} &bull; ${user.email}</p></div>`;
    html += `<div class="cgpa-box">${cgpa}<br><span class="cgpa-label">Cumulative GPA out of 10.00</span></div>`;

    semesters.forEach((sem, i) => {
      let semPoints = 0, semCredits = 0;
      const validSubjects = sem.subjects.filter(s => s.grade && s.credits > 0);
      if (validSubjects.length === 0) return;

      validSubjects.forEach(s => { semPoints += GRADES[s.grade] * s.credits; semCredits += s.credits; });
      const sgpa = semCredits > 0 ? (semPoints / semCredits).toFixed(2) : '0.00';

      html += `<h2>Semester ${i + 1}</h2>`;
      html += `<table><thead><tr><th>Subject</th><th>Credits</th><th>Grade</th><th>Points</th></tr></thead><tbody>`;
      validSubjects.forEach(s => {
        html += `<tr><td>${s.name || 'Unnamed'}</td><td>${s.credits}</td><td>${s.grade}</td><td>${GRADES[s.grade] * s.credits}</td></tr>`;
      });
      html += `<tr class="sgpa-row"><td colspan="3">Semester GPA</td><td>${sgpa}</td></tr>`;
      html += `</tbody></table>`;
    });

    html += `<div class="footer">Generated on ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })} &bull; CGPA Calculator</div>`;
    html += `</body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const chartData = getChartData();
  const currentCGPA = calculateCGPA();

  const SyncIndicator = () => {
    const configs = {
      saved:   { icon: <Check size={14} />, text: 'Saved', color: 'var(--success)' },
      saving:  { icon: <Cloud size={14} />, text: 'Saving...', color: 'var(--accent-primary)' },
      unsaved: { icon: <CloudOff size={14} />, text: 'Unsaved', color: 'var(--warning)' },
      error:   { icon: <CloudOff size={14} />, text: 'Error', color: 'var(--danger)' },
    };
    const c = configs[syncStatus];
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.4rem',
        fontSize: '0.8rem', color: c.color, fontWeight: 500,
        padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-sm)',
        background: `${c.color}10`, border: `1px solid ${c.color}30`,
        transition: 'all 0.3s ease',
      }}>
        {syncStatus === 'saving' ? <div className="spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }}></div> : c.icon}
        {c.text}
      </div>
    );
  };

  if (loading) return <div className="spinner" style={{ margin: 'auto', marginTop: '20vh' }}></div>;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      {/* Header */}
      <header className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {(user.profile?.avatar_url) ? (
            <img src={user.profile.avatar_url} alt={user.profile?.name || 'User'} style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid var(--accent-primary)' }} />
          ) : (
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid var(--accent-primary)', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>
              {(user.profile?.name || user.email || 'S').charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Welcome back,</h2>
            <p className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{user.profile?.name || user.email || 'Student'}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <SyncIndicator />
          <button onClick={async () => {
            await insforge.auth.signOut();
            window.location.reload();
          }} className="btn btn-secondary" title="Sign Out">
            <LogOut size={18} /> <span className="hide-mobile">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Stats & Chart Grid */}
      <div className="responsive-grid">
        {/* CGPA Display */}
        <div className="glass-panel" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.9))' }}>
          <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600', marginBottom: '1rem' }}>Cumulative GPA</p>
          <h1 className="text-gradient font-mono" style={{ fontSize: '5rem', lineHeight: '1' }}>{currentCGPA}</h1>
          <p style={{ color: 'var(--text-tertiary)', marginTop: '1rem' }}>out of 10.00</p>
        </div>

        {/* Chart */}
        <div className="glass-panel" style={{ padding: '2rem', minHeight: '300px' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Performance Trend</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="var(--text-tertiary)" />
                <YAxis domain={[0, 10]} stroke="var(--text-tertiary)" />
                <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }} />
                <Line type="monotone" dataKey="CGPA" stroke="var(--accent-primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--bg-primary)', strokeWidth: 2 }} />
                <Line type="monotone" dataKey="SGPA" stroke="var(--accent-secondary)" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
              Add subjects and grades to see your trend
            </div>
          )}
        </div>
      </div>

      {/* Target Tracker & Grade Distribution */}
      <div className="responsive-grid">
        <TargetTracker semesters={semesters} targetCgpa={targetCgpa} onTargetChange={setTargetCgpa} />
        <GradeDistribution semesters={semesters} />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={handleSave} disabled={syncStatus === 'saving'}>
          {syncStatus === 'saving' ? <div className="spinner" style={{ width: '18px', height: '18px' }}></div> : <Save size={18} />}
          {syncStatus === 'saving' ? 'Saving...' : 'Save Data'}
        </button>
        <button className="btn btn-secondary" onClick={addSemester}>
          <Plus size={18} /> Add Semester
        </button>
        <button className="btn btn-secondary" onClick={handleExportPDF}>
          <Download size={18} /> Export Transcript
        </button>
        <button className="btn btn-danger" style={{ marginLeft: 'auto' }} onClick={handleReset}>
          <RotateCcw size={18} /> Reset All
        </button>
      </div>

      {/* Semesters */}
      <div>
        {semesters.map((semester, index) => (
          <SemesterCard
            key={index}
            index={index}
            semester={semester}
            onUpdate={updateSemester}
            onDelete={deleteSemester}
          />
        ))}
      </div>
    </div>
  );
}
