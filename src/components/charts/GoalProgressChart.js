'use client';

import {
  RadialBarChart, RadialBar, ResponsiveContainer, Cell
} from 'recharts';

const COLORS = ['var(--chart-1)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'];

export default function GoalProgressChart({ data }) {
  const chartData = data?.map((goal, i) => ({
    name: goal.title,
    value: Math.min((goal.current_value / goal.target_value) * 100, 100),
    fill: COLORS[i % COLORS.length],
  })) || [];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <ResponsiveContainer width="45%" height={180}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="30%"
          outerRadius="100%"
          barSize={12}
          data={chartData}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar
            background={{ fill: 'var(--bg-input)' }}
            dataKey="value"
            cornerRadius={10}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </RadialBar>
        </RadialBarChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        {data?.slice(0, 4).map((goal, i) => {
          const pct = Math.round(Math.min((goal.current_value / goal.target_value) * 100, 100));
          return (
            <div key={goal.id || i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {goal.title}
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: COLORS[i % COLORS.length] }}>
                  {pct}%
                </span>
              </div>
              <div style={{
                height: 6,
                background: 'var(--bg-input)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden',
              }}>
                <div
                  style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: COLORS[i % COLORS.length],
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.8s ease',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
