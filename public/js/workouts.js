const WORKOUTS_API_URL = '/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('supabase_token');
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
};

async function fetchWorkouts() {
    try {
        const response = await fetch(`${WORKOUTS_API_URL}/workouts`, {
            headers: getAuthHeaders()
        });
        const result = await response.json();
        if (result.success) {
            return result.data;
        }
        return [];
    } catch (error) {
        console.error('Error fetching workouts:', error);
        return [];
    }
}

async function createWorkout(workoutData) {
    try {
        const response = await fetch(`${WORKOUTS_API_URL}/workouts`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(workoutData)
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error creating workout:', error);
        return { success: false, error: 'Failed to create workout' };
    }
}

async function logSet(setData) {
    try {
        const response = await fetch(`${WORKOUTS_API_URL}/workouts/sets`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(setData)
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error logging set:', error);
        return { success: false, error: 'Failed to log set' };
    }
}

async function fetchWorkoutStats() {
    try {
        const response = await fetch(`${WORKOUTS_API_URL}/workouts/stats`, {
            headers: getAuthHeaders()
        });
        const result = await response.json();
        if (result.success) {
            return result.stats;
        }
        return null;
    } catch (error) {
        console.error('Error fetching stats:', error);
        return null;
    }
}

function renderWorkoutCard(workout) {
    const typeClasses = {
        'Strength': 'strength',
        'Cardio': 'cardio',
        'Yoga': 'yoga'
    };
    
    const typeIcons = {
        'Strength': 'fitness_center',
        'Cardio': 'directions_run',
        'Yoga': 'self_improvement'
    };
    
    const typeClass = typeClasses[workout.type] || 'default';
    const iconName = typeIcons[workout.type] || 'fitness_center';
    
    return `
        <div class="workout-card">
            <div class="workout-card-header">
                <div class="workout-icon-wrap ${typeClass}">
                    <span class="material-symbols-outlined">${iconName}</span>
                </div>
                <span class="workout-card-date">
                    ${new Date(workout.created_at).toLocaleDateString()}
                </span>
            </div>
            <h4 class="workout-card-title">${workout.name || 'Workout'}</h4>
            <p class="workout-card-type">${workout.type || 'Training'}</p>
            <div class="workout-card-stats">
                <div class="workout-card-stat">
                    <p class="workout-stat-label">Duration</p>
                    <p class="workout-stat-value">${workout.duration || 0} min</p>
                </div>
                <div class="workout-card-stat">
                    <p class="workout-stat-label">Calories</p>
                    <p class="workout-stat-value" style="color: var(--primary);">${workout.calories || 0}</p>
                </div>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', async () => {
    if (!localStorage.getItem('supabase_token')) {
        window.location.href = '/login';
        return;
    }

    const workoutGrid = document.getElementById('workout-grid');
    const newWorkoutBtn = document.getElementById('new-workout-btn');
    const sidebarBtn = document.getElementById('sidebar-start-workout-btn');
    const workoutModal = document.getElementById('workout-modal');
    const closeModalBtn = document.getElementById('close-workout-modal');
    const workoutForm = document.getElementById('workout-form');
    const workoutFormError = document.getElementById('workout-form-error');
    const workoutSubmitBtn = document.getElementById('workout-submit-btn');

    function openModal() {
        if (workoutModal) workoutModal.classList.remove('hidden');
    }
    function closeModal() {
        if (workoutModal) workoutModal.classList.add('hidden');
        if (workoutFormError) workoutFormError.textContent = '';
    }

    if (newWorkoutBtn) newWorkoutBtn.addEventListener('click', openModal);
    if (sidebarBtn) sidebarBtn.addEventListener('click', openModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    // Close on backdrop click
    if (workoutModal) {
        workoutModal.addEventListener('click', (e) => {
            if (e.target === workoutModal || e.target.classList.contains('absolute') && e.target.classList.contains('inset-0')) {
                closeModal();
            }
        });
    }

    if (workoutForm) {
        workoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (workoutSubmitBtn) workoutSubmitBtn.disabled = true;
            if (workoutFormError) workoutFormError.textContent = '';
            const workoutData = {
                name: document.getElementById('workout-name').value,
                type: document.getElementById('workout-type').value,
                duration: parseInt(document.getElementById('workout-duration').value),
                calories: parseInt(document.getElementById('workout-calories').value) || 0,
                notes: document.getElementById('workout-notes').value
            };
            
            const result = await createWorkout(workoutData);
            if (result.success) {
                closeModal();
                workoutForm.reset();
                loadWorkouts();
            } else {
                if (workoutFormError) workoutFormError.textContent = result.error || 'Failed to save workout. Please try again.';
            }
            if (workoutSubmitBtn) workoutSubmitBtn.disabled = false;
        });
    }

    const setForm = document.getElementById('set-form');
    if (setForm) {
        setForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const setData = {
                workout_id: document.getElementById('current-workout-id')?.value,
                exercise: document.getElementById('exercise-name')?.value,
                weight: parseFloat(document.getElementById('weight')?.value),
                reps: parseInt(document.getElementById('reps')?.value),
                rpe: parseInt(document.getElementById('rpe')?.value)
            };
            await logSet(setData);
            setForm.reset();
        });
    }

    async function loadWorkouts() {
        if (!workoutGrid) return;
        const workouts = await fetchWorkouts();
        
        if (workouts.length > 0) {
            workoutGrid.innerHTML = workouts.map(renderWorkoutCard).join('');
        } else {
            workoutGrid.innerHTML = '<div class="col-span-12 text-center py-20"><span class="material-symbols-outlined text-6xl text-on-surface-variant mb-4 block">fitness_center</span><p class="text-on-surface-variant text-lg">No workouts yet. Hit <strong class="text-primary">Log New Workout</strong> to start!</p></div>';
        }
    }

    loadWorkouts();
});

