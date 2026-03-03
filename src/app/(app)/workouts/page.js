'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  Plus, Search, Filter, Clock, Flame, Dumbbell,
  ChevronDown, Trash2, X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import Modal from '@/components/Modal';
import { generateRecentWorkouts, typeIcons, typeColors } from '@/lib/sampleData';
import styles from './workouts.module.css';

const workoutTypes = ['strength', 'cardio', 'flexibility', 'sports', 'other'];
const moodOptions = ['great', 'good', 'okay', 'tired', 'exhausted'];
const moodEmojis = { great: '🔥', good: '😊', okay: '😐', tired: '😴', exhausted: '😵' };

export default function WorkoutsPage() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  // Form state
  const [form, setForm] = useState({
    name: '',
    type: 'strength',
    duration_minutes: '',
    calories_burned: '',
    mood: 'good',
    notes: '',
    exercises: [{ name: '', sets: '', reps: '', weight_kg: '' }],
  });

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const { data } = await supabase
        .from('workouts')
        .select('*, exercises(*)')
        .order('completed_at', { ascending: false });

      if (data && data.length > 0) {
        setWorkouts(data);
      } else {
        // Sample data
        setWorkouts(generateRecentWorkouts().map((w, i) => ({
          ...w,
          exercises: [
            { name: 'Bench Press', sets: 4, reps: 10, weight_kg: 60 },
            { name: 'Rows', sets: 3, reps: 12, weight_kg: 50 },
          ],
          mood: moodOptions[i % moodOptions.length],
          notes: 'Great session!',
        })));
      }
    } catch {
      setWorkouts(generateRecentWorkouts());
    } finally {
      setLoading(false);
    }
  };

  const handleAddExercise = () => {
    setForm({
      ...form,
      exercises: [...form.exercises, { name: '', sets: '', reps: '', weight_kg: '' }],
    });
  };

  const handleRemoveExercise = (index) => {
    setForm({
      ...form,
      exercises: form.exercises.filter((_, i) => i !== index),
    });
  };

  const handleExerciseChange = (index, field, value) => {
    const updated = [...form.exercises];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, exercises: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: workout, error } = await supabase
        .from('workouts')
        .insert({
          user_id: user.id,
          name: form.name,
          type: form.type,
          duration_minutes: parseInt(form.duration_minutes) || null,
          calories_burned: parseInt(form.calories_burned) || null,
          mood: form.mood,
          notes: form.notes,
        })
        .select()
        .single();

      if (error) throw error;

      if (workout && form.exercises.some((ex) => ex.name)) {
        const exercises = form.exercises
          .filter((ex) => ex.name)
          .map((ex, i) => ({
            workout_id: workout.id,
            name: ex.name,
            sets: parseInt(ex.sets) || null,
            reps: parseInt(ex.reps) || null,
            weight_kg: parseFloat(ex.weight_kg) || null,
            order_index: i,
          }));

        await supabase.from('exercises').insert(exercises);
      }

      setShowModal(false);
      setForm({
        name: '',
        type: 'strength',
        duration_minutes: '',
        calories_burned: '',
        mood: 'good',
        notes: '',
        exercises: [{ name: '', sets: '', reps: '', weight_kg: '' }],
      });
      loadWorkouts();
    } catch (err) {
      console.error('Error logging workout:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await supabase.from('workouts').delete().eq('id', id);
      setWorkouts(workouts.filter((w) => w.id !== id));
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  const filtered = workouts.filter((w) => {
    const matchesType = selectedType === 'all' || w.type === selectedType;
    const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className={styles.workouts}>
      <div className={styles.header}>
        <div>
          <h1>Workouts</h1>
          <p>Log and track all your workouts</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Log Workout
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search workouts..."
            className="input-field"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '42px' }}
          />
        </div>
        <div className={styles.typeTabs}>
          <button
            className={`${styles.typeTab} ${selectedType === 'all' ? styles.activeTab : ''}`}
            onClick={() => setSelectedType('all')}
          >
            All
          </button>
          {workoutTypes.map((type) => (
            <button
              key={type}
              className={`${styles.typeTab} ${selectedType === type ? styles.activeTab : ''}`}
              onClick={() => setSelectedType(type)}
            >
              {typeIcons[type]} {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Workout List */}
      {loading ? (
        <div className={styles.list}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: 80, borderRadius: 20 }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <Dumbbell size={48} style={{ color: 'var(--text-tertiary)' }} />
          <h3>No workouts found</h3>
          <p>Start by logging your first workout!</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Log Workout
          </button>
        </div>
      ) : (
        <div className={styles.list}>
          {filtered.map((workout, i) => (
            <motion.div
              key={workout.id}
              className={styles.workoutCard}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <div
                className={styles.workoutMain}
                onClick={() => setExpandedId(expandedId === workout.id ? null : workout.id)}
              >
                <div className={styles.workoutIcon} style={{ background: `${typeColors[workout.type]}15` }}>
                  {typeIcons[workout.type]}
                </div>
                <div className={styles.workoutInfo}>
                  <span className={styles.workoutName}>{workout.name}</span>
                  <span className={styles.workoutMeta}>
                    {workout.type} · {format(new Date(workout.completed_at), 'MMM d, yyyy')}
                    {workout.mood && ` · ${moodEmojis[workout.mood]}`}
                  </span>
                </div>
                <div className={styles.workoutStats}>
                  {workout.duration_minutes && (
                    <span className={styles.workoutStat}>
                      <Clock size={14} /> {workout.duration_minutes}m
                    </span>
                  )}
                  {workout.calories_burned && (
                    <span className={styles.workoutStat}>
                      <Flame size={14} /> {workout.calories_burned} cal
                    </span>
                  )}
                </div>
                <ChevronDown
                  size={18}
                  style={{
                    color: 'var(--text-tertiary)',
                    transition: 'transform 0.2s',
                    transform: expandedId === workout.id ? 'rotate(180deg)' : 'rotate(0)',
                  }}
                />
              </div>

              <AnimatePresence>
                {expandedId === workout.id && (
                  <motion.div
                    className={styles.workoutExpand}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {workout.exercises?.length > 0 && (
                      <div className={styles.exerciseList}>
                        <h5>Exercises</h5>
                        {workout.exercises.map((ex, j) => (
                          <div key={j} className={styles.exerciseItem}>
                            <span>{ex.name}</span>
                            <span className={styles.exerciseMeta}>
                              {ex.sets && `${ex.sets} sets`}
                              {ex.reps && ` × ${ex.reps} reps`}
                              {ex.weight_kg && ` @ ${ex.weight_kg}kg`}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    {workout.notes && (
                      <p className={styles.workoutNotes}>{workout.notes}</p>
                    )}
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleDelete(workout.id)}
                      style={{ color: 'var(--danger)', marginTop: 8 }}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Workout Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Log Workout" size="lg">
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className="input-group" style={{ flex: 2 }}>
              <label>Workout Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Upper Body Power"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="input-group" style={{ flex: 1 }}>
              <label>Type</label>
              <select
                className="select-field"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                {workoutTypes.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className="input-group">
              <label>Duration (min)</label>
              <input
                type="number"
                className="input-field"
                placeholder="45"
                value={form.duration_minutes}
                onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Calories Burned</label>
              <input
                type="number"
                className="input-field"
                placeholder="350"
                value={form.calories_burned}
                onChange={(e) => setForm({ ...form, calories_burned: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Mood</label>
              <select
                className="select-field"
                value={form.mood}
                onChange={(e) => setForm({ ...form, mood: e.target.value })}
              >
                {moodOptions.map((m) => (
                  <option key={m} value={m}>
                    {moodEmojis[m]} {m.charAt(0).toUpperCase() + m.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Exercises */}
          <div className={styles.exercisesSection}>
            <div className={styles.exercisesSectionHeader}>
              <h5>Exercises</h5>
              <button type="button" className="btn btn-ghost btn-sm" onClick={handleAddExercise}>
                <Plus size={14} /> Add
              </button>
            </div>
            {form.exercises.map((ex, i) => (
              <div key={i} className={styles.exerciseFormRow}>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Exercise name"
                  value={ex.name}
                  onChange={(e) => handleExerciseChange(i, 'name', e.target.value)}
                  style={{ flex: 2 }}
                />
                <input
                  type="number"
                  className="input-field"
                  placeholder="Sets"
                  value={ex.sets}
                  onChange={(e) => handleExerciseChange(i, 'sets', e.target.value)}
                  style={{ flex: 0.7 }}
                />
                <input
                  type="number"
                  className="input-field"
                  placeholder="Reps"
                  value={ex.reps}
                  onChange={(e) => handleExerciseChange(i, 'reps', e.target.value)}
                  style={{ flex: 0.7 }}
                />
                <input
                  type="number"
                  className="input-field"
                  placeholder="Kg"
                  value={ex.weight_kg}
                  onChange={(e) => handleExerciseChange(i, 'weight_kg', e.target.value)}
                  style={{ flex: 0.7 }}
                />
                {form.exercises.length > 1 && (
                  <button
                    type="button"
                    className="btn-icon btn-ghost"
                    onClick={() => handleRemoveExercise(i)}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="input-group">
            <label>Notes</label>
            <textarea
              className="input-field"
              placeholder="How did it go?"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
            Save Workout
          </button>
        </form>
      </Modal>
    </div>
  );
}
