'use client';

import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from 'recharts';

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--bg-glass-strong)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 14px',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: 2 }}>
          {payload[0].name}
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {payload[0].value} workouts
        </p>
      </div>
    );
  }
  return null;
};

export default function WorkoutTypeChart({ data }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <ResponsiveContainer width="50%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
            strokeWidth={0}
          >
            {data?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {data?.map((entry, index) => (
          <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: COLORS[index % COLORS.length],
              flexShrink: 0,
            }} />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {entry.name}
            </span>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginLeft: 'auto' }}>
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
