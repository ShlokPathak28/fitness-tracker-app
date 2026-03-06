// Sample data generators for demo/when Supabase is not configured
import { format, subDays, subWeeks } from 'date-fns';

export function generateWeeklyActivity() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day) => ({
    day,
    workouts: Math.floor(Math.random() * 3),
  }));
}

export function generateWeightTrend(weeks = 12) {
  let weight = 78 + Math.random() * 10;
  const data = [];
  for (let i = weeks; i >= 0; i--) {
    const date = subWeeks(new Date(), i);
    weight += (Math.random() - 0.55) * 0.8;
    data.push({
      date: format(date, 'MMM d'),
      weight: Math.round(weight * 10) / 10,
    });
  }
  return data;
}

export function generateCalorieBurn(days = 14) {
  const data = [];
  for (let i = days; i >= 0; i--) {
    const date = subDays(new Date(), i);
    data.push({
      date: format(date, 'MMM d'),
      calories: Math.floor(200 + Math.random() * 500),
    });
  }
  return data;
}

export function generateWorkoutTypes() {
  return [
    { name: 'Strength', value: Math.floor(8 + Math.random() * 15) },
    { name: 'Cardio', value: Math.floor(5 + Math.random() * 12) },
    { name: 'Flexibility', value: Math.floor(2 + Math.random() * 8) },
    { name: 'Sports', value: Math.floor(1 + Math.random() * 6) },
    { name: 'Other', value: Math.floor(1 + Math.random() * 4) },
  ];
}

export function generateGoals() {
  return [
    {
      id: '1',
      title: 'Lose 5kg',
      target_value: 5,
      current_value: 3.2,
      unit: 'kg',
      category: 'weight',
      deadline: '2026-04-15',
    },
    {
      id: '2',
      title: 'Run 100km',
      target_value: 100,
      current_value: 67,
      unit: 'km',
      category: 'cardio',
      deadline: '2026-05-01',
    },
    {
      id: '3',
      title: 'Bench 100kg',
      target_value: 100,
      current_value: 82.5,
      unit: 'kg',
      category: 'strength',
      deadline: '2026-06-01',
    },
    {
      id: '4',
      title: '30 Workouts',
      target_value: 30,
      current_value: 22,
      unit: 'workouts',
      category: 'consistency',
      deadline: '2026-03-31',
    },
  ];
}

export function generateRecentWorkouts() {
  const workoutNames = [
    { name: 'Upper Body Power', type: 'strength' },
    { name: 'Morning Run', type: 'cardio' },
    { name: 'Yoga Flow', type: 'flexibility' },
    { name: 'Leg Day', type: 'strength' },
    { name: 'HIIT Session', type: 'cardio' },
    { name: 'Basketball', type: 'sports' },
    { name: 'Full Body', type: 'strength' },
    { name: 'Evening Walk', type: 'cardio' },
  ];

  return Array.from({ length: 5 }, (_, i) => {
    const workout = workoutNames[Math.floor(Math.random() * workoutNames.length)];
    return {
      id: `w-${i}`,
      name: workout.name,
      type: workout.type,
      duration_minutes: Math.floor(20 + Math.random() * 70),
      calories_burned: Math.floor(100 + Math.random() * 500),
      completed_at: subDays(new Date(), i).toISOString(),
    };
  });
}

export const typeIcons = {
  strength: '💪',
  cardio: '🏃',
  flexibility: '🧘',
  sports: '⚽',
  other: '🏋️',
};

export const typeColors = {
  strength: 'var(--chart-1)',
  cardio: 'var(--chart-4)',
  flexibility: 'var(--chart-2)',
  sports: 'var(--chart-3)',
  other: 'var(--chart-5)',
};
