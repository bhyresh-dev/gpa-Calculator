'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BarChart3 } from 'lucide-react';

const GRADE_COLORS = {
  'O': '#10b981',   // Emerald
  'A+': '#34d399',  // Green
  'A': '#3b82f6',   // Blue
  'B+': '#60a5fa',  // Light blue
  'B': '#8b5cf6',   // Violet
  'C': '#f59e0b',   // Amber
  'P': '#f97316',   // Orange
  'F': '#ef4444',   // Red
};

export default function GradeDistribution({ semesters }) {
  // Count grades
  const gradeCounts = {};
  let totalSubjects = 0;

  semesters.forEach(sem => {
    sem.subjects.forEach(sub => {
      if (sub.grade && sub.credits > 0) {
        gradeCounts[sub.grade] = (gradeCounts[sub.grade] || 0) + 1;
        totalSubjects++;
      }
    });
  });

  const data = Object.entries(gradeCounts)
    .map(([grade, count]) => ({
      name: grade,
      value: count,
      percentage: ((count / totalSubjects) * 100).toFixed(1),
    }))
    .sort((a, b) => {
      const order = ['O', 'A+', 'A', 'B+', 'B', 'C', 'P', 'F'];
      return order.indexOf(a.name) - order.indexOf(b.name);
    });

  if (totalSubjects === 0) {
    return (
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          <BarChart3 size={20} style={{ color: 'var(--accent-secondary)' }} />
          Grade Distribution
        </h3>
        <div style={{ display: 'flex', height: '200px', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
          Add graded subjects to see your distribution
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div style={{
          background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', fontSize: '0.85rem',
        }}>
          <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Grade {d.name}</p>
          <p style={{ color: 'var(--text-secondary)' }}>{d.value} subject{d.value > 1 ? 's' : ''} ({d.percentage}%)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
        <BarChart3 size={20} style={{ color: 'var(--accent-secondary)' }} />
        Grade Distribution
      </h3>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={GRADE_COLORS[entry.name] || '#64748b'} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        <div style={{ flex: 1, minWidth: '80px', textAlign: 'center', padding: '0.75rem', background: 'rgba(16,185,129,0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16,185,129,0.15)' }}>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)', fontFamily: "'JetBrains Mono', monospace" }}>
            {(gradeCounts['O'] || 0) + (gradeCounts['A+'] || 0)}
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>Top Grades</p>
        </div>
        <div style={{ flex: 1, minWidth: '80px', textAlign: 'center', padding: '0.75rem', background: 'rgba(59,130,246,0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(59,130,246,0.15)' }}>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-primary)', fontFamily: "'JetBrains Mono', monospace" }}>
            {totalSubjects}
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>Total</p>
        </div>
        <div style={{ flex: 1, minWidth: '80px', textAlign: 'center', padding: '0.75rem', background: 'rgba(239,68,68,0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--danger)', fontFamily: "'JetBrains Mono', monospace" }}>
            {gradeCounts['F'] || 0}
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>Fails</p>
        </div>
      </div>
    </div>
  );
}
