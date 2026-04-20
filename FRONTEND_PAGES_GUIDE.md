# FitTrack Frontend Pages - Detail Guide

**Date:** April 17, 2026

## Quick Navigation

- [Landing Page](#landing-page-publiclandinghtml)
- [Authentication Pages](#authentication-pages)
- [Dashboard & Main App](#dashboard--main-app)
- [Feature Pages](#feature-pages)

---

## Landing Page (`public/landing.html`)

### Location in Project
```
c:\Users\Shlok\Documents\GitHub\new\fitness-tracker-app\public\landing.html
```

### What It Does
- Serves as the public-facing homepage
- Showcases FitTrack features to potential users
- Directs users to login or signup
- Responsive design optimized for all devices

### How It Works

**Entry Point:**
```
http://localhost:3000/
```

**Served by:** `server/app.js` route:
```javascript
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/landing.html'));
});
```

### Key Components

#### 1. Top Navigation Bar
```html
<nav class="fixed top-0 w-full z-50 bg-stone-950/80 backdrop-blur-xl">
```
- Fixed positioned (stays visible while scrolling)
- Semi-transparent with blur effect
- Links:
  - Workouts (anchor link)
  - Metrics (anchor link)
  - Goals (anchor link)
  - Login button (routes to `/login`)
  - Get Started button (routes to `/signup`)

**Styling Applied:**
- `fixed top-0` = Sticky navigation
- `z-50` = High z-index to stay on top
- `backdrop-blur-xl` = Blur background behind nav
- `bg-stone-950/80` = Semi-transparent dark background

#### 2. Hero Section
```html
<section class="min-h-screen flex flex-col items-center justify-center">
```

**Content:**
- Label: "The FitTrack Editorial"
- Main headline: "LOG. VISUALIZE. ACHIEVE."
- Subheadline: "Experience obsidian-grade performance tracking..."

**Styling:**
- Full screen height (`min-h-screen`)
- Large gradient text using CSS:
```css
background: linear-gradient(135deg, #ff7eea 0%, #c47fff 50%, #8ff5ff 100%);
-webkit-background-clip: text;
background-clip: text;
color: transparent;
```

**Call-to-Action Button:**
```html
<a href="/signup" class="bg-primary text-on-primary-fixed px-10 py-5">
    Start Your Session <span class="material-symbols-outlined">arrow_forward</span>
</a>
```

#### 3. Workout Logging Demonstration Section
```html
<section class="py-32 px-12 bg-surface" id="workouts">
```

**Layout:** Two-column grid
- Left: Text content (sticky on scroll)
- Right: Interactive form example

**Form Example Shows:**
```
Exercise: Barbell Bench Press
Weight: _____ KG
Reps: _____ 
RPE (Rate of Perceived Exertion): _____
Rest Timer: 01:42 (with progress bar)
[+ Log This Set] button
```

**Styling Features:**
- `sticky top-32` on left column keeps text visible

#### 4. Data Visualization Section
```html
<section class="py-32 bg-surface-container-lowest relative" id="metrics">
```

**Layout:** Bento grid with 3 cards
- Large 2-column chart (left)
- 2 vertical cards (right)
- Small stats cards (bottom)

**Charts:**
- Mock SVG chart showing volume trends
- Gradient under line
- SVG path for smooth curve

**Cards Display:**
```
┌─────────────────────────────┐
│ Total Volume Trend          │
│ +14.2% vs last month        │
│ [SVG Chart Area]            │
└─────────────────────────────┘

┌──────────────┐  ┌──────────────┐
│ Estimated 1RM│  │ Consistency  │
│ 125 KG       │  │ 24 Days      │
└──────────────┘  └──────────────┘
```

#### 5. Mobile Responsiveness

For screens under 768px:
```css
@media (max-width: 768px) {
    .hero-title { font-size: 4rem !important; }
    .nav-desktop { display: none !important; }
}
```

### Color Scheme Used
```javascript
Primary: #ff7eea (Bright magenta)
Secondary: #c47fff (Purple)
Tertiary: #8ff5ff (Cyan)
Background: #0e0e0e (Near black)
Text: #ffffff (White)
Variant text: #adaaaa (Light gray)
```

---

## Authentication Pages

### Login Page (`public/login.html`)

**Location:**
```
c:\Users\Shlok\Documents\GitHub\new\fitness-tracker-app\public/login.html
```

**Routes to:**
```
http://localhost:3000/login
```

**Controller:**
```javascript
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});
```

### Layout Structure

```
┌─────────────────────────────────────┐
│  Background Image (Dark Gym)        │
│  ┌───────────────────────────────┐  │
│  │ FitTrack                      │  │
│  │ Obsidian Performance Engine   │  │
│  │                               │  │
│  │ Welcome back                  │  │
│  │ Enter your credentials...     │  │
│  │                               │  │
│  │ [Email Input Field]           │  │
│  │ [Password Input Field]        │  │
│  │ [Sign In Button]              │  │
│  │ Forgot Password?              │  │
│  │                               │  │
│  │ ─── Or continue with ───      │  │
│  │ [Google Button]               │  │
│  │                               │  │
│  │ Don't have an account?        │  │
│  │ Join Now                      │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Form Fields

**Email Address**
```html
<input 
  type="email" 
  id="email" 
  placeholder="name@company.com" 
  class="w-full h-14 pl-14 pr-6 bg-surface-container-highest"
  required
/>
```
- Icon: `alternate_email`
- Type: `email` (HTML5 validation)
- Required field

**Password**
```html
<input 
  type="password" 
  id="password" 
  placeholder="••••••••" 
  class="w-full h-14 pl-14 pr-6"
  required
/>
```
- Icon: `lock`
- Visibility toggle button (right side)
- Required field

### JavaScript Handler

Located in `public/js/auth.js`:

```javascript
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            const result = await AuthService.login(email, password);
            window.location.href = '/dashboard'; // Redirect on success
        } catch (err) {
            document.getElementById('login-error').textContent = err.message;
        }
    });
}
```

### Error Messages

**Common Errors:**
```javascript
"Invalid login credentials" // Wrong password
"user_email_not_confirmed" // Email not verified
"Please confirm your email first, then log in."
```

### Data Flow

```
User enters email/password
        ↓
Form submission prevented (e.preventDefault)
        ↓
AuthService.login() called
        ↓
POST /api/auth/login
        ↓
Server validates with Supabase
        ↓
Token returned → localStorage.setItem('supabase_token', token)
        ↓
Redirect to /dashboard
        ↓
Dashboard loads with authenticated state
```

---

### Signup Page (`public/signup.html`)

**Location:**
```
public/signup.html
```

**Route:** `/signup`

### Form Structure

```
┌─────────────────────────────────┐
│ YOUR ASCENT BEGINS              │
│ 500k+ Athletes | 99.9% Accuracy │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Create Account              │ │
│ │                             │ │
│ │ [Full Name Input]           │ │
│ │ [Email Input]               │ │
│ │ [Password Input]            │ │
│ │ [Confirm Password Input]    │ │
│ │                             │ │
│ │ [Create Account Button]     │ │
│ │                             │ │
│ │ ─── Or ───                  │ │
│ │ [Google Sign Up]            │ │
│ │                             │ │
│ │ Already registered?         │ │
│ │ Sign In                     │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

### Form Fields

**Full Name**
```html
<input 
  type="text" 
  id="fullname" 
  placeholder="Alex Sterling" 
  required
/>
```
Icon: `person`

**Email Address**
```html
<input 
  type="email" 
  id="email" 
  placeholder="alex@fittrack.com" 
  required
/>
```
Icon: `alternate_email`

**Password**
```html
<input 
  type="password" 
  id="password" 
  placeholder="••••••••" 
  required
/>
```
Icon: `lock`
With visibility toggle

**Confirm Password**
```html
<input 
  type="password" 
  id="confirm-password" 
  placeholder="••••••••" 
  required
/>
```
Icon: `verified_user`

### Validation Logic

In `public/js/auth.js`:

```javascript
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Validate passwords match
        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }
        
        try {
            const result = await AuthService.signup(
                email,
                password,
                fullName
            );
            window.location.href = '/login?registered=1';
        } catch (err) {
            showError(err.message);
        }
    });
}
```

### API Call

```javascript
POST /api/auth/signup
{
  "email": "user@example.com",
  "password": "securePassword",
  "fullName": "John Doe"
}
```

---

## Dashboard & Main App

### Dashboard (`public/dashboard.html`)

**Location:**
```
public/dashboard.html
```

**Route:** `/dashboard`

**Access:** Requires authentication (redirects to login if no token)

### Layout

```
┌──────────────────────────────────────────────────────┐
│ FITTRACK    │ Dashboard │ Welcome back, Alex.        │
│ ├ Dashboard │           │ Your energy is up 12%      │
│ ├ Workouts  │           │                     BMI 24 │
│ ├ Progress  │           ├─────────────────────────────┤
│ ├ Goals     │           │ Total Workouts: 42         │
│ ├ Profile   │           │ Calories: 8,450            │
│ │            │ MAIN      │ Active Goals: 3            │
│ │[Start WO]  │ CONTENT   │ Consistency: 24 days      │
│ │            │ AREA      │                            │
│ │[Sign Out]  │           ├─────────────────────────────┤
│ └──────────────────────────────────────────────────────┘
```

### Sidebar Navigation

Fixed left sidebar (288px width):
```html
<aside class="h-screen w-72 fixed left-0 top-0 z-50">
    FitTrack logo
    Navigation items (with active state highlights)
    Start Workout button
    Sign Out link
</aside>
```

**Active State:**
```css
.active {
  background: linear-gradient(to right, rgba(255, 126, 234, 0.1), transparent);
  border-right: 2px solid #ff7eea;
  color: #ff7eea;
}
```

### Main Content Area

```javascript
<main class="ml-72 p-12"> // ml-72 = margin-left 288px to account for sidebar
```

### Header Section

```html
<header class="flex justify-between items-end mb-16">
  <div>
    <h2>Welcome back, <span class="gradient-text">Alex</span>.</h2>
    <p>Your kinetic energy is up 12% from last week.</p>
  </div>
  <div class="bmi-card">
    <p>BMI</p>
    <span>24</span>
  </div>
</header>
```

**Dynamic Content:**
- Username loaded from API/localStorage
- BMI fetched from user profile
- Energy stats from workout data

### Metrics Cards Grid

```html
<section class="grid grid-cols-1 md:grid-cols-4 gap-6">
  <!-- 4 cards in responsive grid -->
  <!-- Collapses to single column on mobile -->
</section>
```

**Cards:**

1. **Total Workouts**
   - Icon: `fitness_center` (Primary color)
   - Value: Number from API
   - Trend: "+4 this week"

2. **Calories Burned**
   - Icon: `local_fire_department` (Secondary color)
   - Value: Total calories
   - Badge: "High Intensity"

3. **Active Goals**
   - Icon: `emoji_events` (Tertiary color)
   - Value: Number of ongoing goals
   - Link: To goals page

4. **Consistency Streak**
   - Icon: `calendar_today`
   - Value: Days
   - Visual: Streak indicator

### JavaScript Integration

File: `public/js/dashboard.js`

```javascript
// Fetch user profile
const profile = await fetch('/api/user/profile', {
    headers: { Authorization: `Bearer ${token}` }
});

// Fetch workout stats
const stats = await fetch('/api/workouts', {
    headers: { Authorization: `Bearer ${token}` }
});

// Update DOM with fetched data
document.getElementById('username').textContent = profile.full_name;
document.getElementById('total-workouts').textContent = stats.length;
```

---

## Feature Pages

### Workouts Page

**Location:** `public/workout.html`
**Route:** `/workout`

#### Modal-Based Interface

**Layout:**
- Large "Log New Workout" button in header
- Clicking button opens modal
- Modal has form for entering workout details
- On submit: API call + modal close + refresh grid

**Modal Form:**
```html
<form id="workout-form">
  <input placeholder="Workout Name" required />
  <select> <!-- Type: Strength, Cardio, Yoga... -->
  <input type="number" placeholder="Duration (min)" required />
  <input type="number" placeholder="Calories" />
  <input placeholder="Notes" />
  <button type="submit">Save Session</button>
</form>
```

**JavaScript:**
```javascript
// Modal controls
document.getElementById('new-workout-btn').addEventListener('click', () => {
    document.getElementById('workout-modal').style.display = 'flex';
});

// Form submission
document.getElementById('workout-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const exerciseData = {
        name: document.getElementById('workout-name').value,
        type: document.getElementById('workout-type').value,
        duration: document.getElementById('workout-duration').value,
        calories: document.getElementById('workout-calories').value,
        notes: document.getElementById('workout-notes').value
    };
    
    const result = await createWorkout(exerciseData);
    // Refresh grid...
});
```

#### Workout Grid Display

```javascript
function renderWorkoutCard(workout) {
    const typeColors = {
        'Strength': 'bg-primary/10',
        'Cardio': 'bg-secondary/10',
        'Yoga': 'bg-tertiary/10'
    };
    
    return `
        <div class="bg-surface-container rounded-xl p-6">
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="font-bold">${workout.name}</h3>
                    <span class="text-sm ${typeColors[workout.type]}">
                        ${workout.type}
                    </span>
                </div>
                <button onclick="deleteWorkout('${workout.id}')">✕</button>
            </div>
            <div class="mt-4 flex justify-between text-xs text-on-surface-variant">
                <span>Duration: ${workout.duration} min</span>
                <span>Calories: ${workout.calories}</span>
            </div>
        </div>
    `;
}
```

---

### Goals Page

**Location:** `public/goals.html`
**Route:** `/goals`

#### Tab System

```html
<div class="inline-flex">
  <button data-goals-tab="ongoing">Ongoing Goals</button>
  <button data-goals-tab="completed">Completed Goals</button>
</div>
```

Tab switching:
```javascript
document.querySelectorAll('[data-goals-tab]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        currentTab = e.target.dataset.goalsTab;
        renderGoals(currentTab);
    });
});
```

#### Goal Card Display

```html
<div class="bg-surface-container rounded-xl p-6">
  <div class="flex justify-between items-start mb-4">
    <div>
      <h3 class="font-bold">Bench Press 150 lbs</h3>
      <span class="text-xs text-secondary">Strength • Deadline: May 2026</span>
    </div>
    <button class="menu">⋮</button>
  </div>
  
  <div class="mb-6">
    <div class="flex justify-between mb-2">
      <span class="text-xs">Progress</span>
      <span class="text-xs font-bold">60%</span>
    </div>
    <div class="h-2 bg-surface-container-highest rounded-full overflow-hidden">
      <div class="h-full bg-gradient-to-r from-primary to-secondary w-[60%]"></div>
    </div>
    <div class="text-xs text-on-surface-variant mt-2">90/150 lbs</div>
  </div>
  
  <button onclick="completeGoal('${goal.id}')">Mark Complete</button>
</div>
```

#### Goal Creation Modal

Similar to workouts page:
```javascript
// Click "+ New Goal" opens modal
// Form validates inputs
// POST to /api/goals
// Refresh goals list
```

---

### Progress Page

**Location:** `public/progress.html`
**Route:** `/progress`

#### Chart Display

```html
<section class="col-span-8">
  <h3>Activity Overview</h3>
  <div id="progress-activity-chart" class="flex items-stretch gap-3">
    <!-- Dynamic bar chart -->
  </div>
</section>
```

**Chart Generation:**
```javascript
async function renderActivityChart() {
    const workouts = await fetchWorkouts();
    const chartHtml = workouts.map(w => 
        `<div class="flex-1 bg-gradient-to-t from-primary to-primary/50 rounded-t-lg" 
         style="height: ${(w.duration / maxDuration) * 100}%"></div>`
    ).join('');
    document.getElementById('progress-activity-chart').innerHTML = chartHtml;
}
```

#### Statistics Cards

```javascript
// Fetches from workouts API
const stats = {
    totalWorkouts: workouts.length,
    totalDuration: workouts.reduce((sum, w) => sum + w.duration, 0),
    totalCalories: workouts.reduce((sum, w) => sum + w.calories, 0)
};

// Display in cards:
document.getElementById('progress-total-workouts').textContent = stats.totalWorkouts;
document.getElementById('progress-total-duration').textContent = stats.totalDuration + ' min';
document.getElementById('progress-total-calories').textContent = stats.totalCalories;
```

---

### Profile Page

**Location:** `public/profile.html`
**Route:** `/profile`

#### Layout

```html
<div>
  <!-- Avatar Section -->
  <div class="avatar">...</div>
  
  <!-- Profile Info -->
  <div class="profile-grid">
    <div>
      <h3>Full Name</h3>
      <input type="text" id="profile-name" />
    </div>
    <div>
      <h3>Height (cm)</h3>
      <input type="number" id="profile-height" />
    </div>
    <div>
      <h3>Weight (kg)</h3>
      <input type="number" id="profile-weight" />
    </div>
    <div>
      <h3>Experience</h3>
      <select id="profile-experience">
        <option>Beginner</option>
        <option>Intermediate</option>
        <option>Advanced</option>
      </select>
    </div>
  </div>
  
  <!-- Save Button -->
  <button onclick="saveProfile()">Update Profile</button>
</div>
```

**Save Functionality:**
```javascript
async function saveProfile() {
    const updates = {
        full_name: document.getElementById('profile-name').value,
        height: document.getElementById('profile-height').value,
        weight: document.getElementById('profile-weight').value,
        experience_level: document.getElementById('profile-experience').value
    };
    
    const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
    });
    
    const result = await response.json();
    showMessage('Profile updated successfully');
}
```

---

## Responsive Design Patterns

### Desktop View (>1024px)
- Sidebar visible
- Main content takes full width minus sidebar
- 4-column grids

### Tablet View (768px - 1024px)
- Sidebar collapses or becomes off-canvas
- 2-3 column grids
- Modal dialogs scale down

### Mobile View (<768px)
```css
@media (max-width: 768px) {
    aside {
        position: static;
        width: 100%;
        height: auto;
    }
    
    main {
        margin-left: 0;
        padding: 1.25rem;
    }
    
    .grid-cols-4 {
        grid-template-columns: 1fr;
    }
    
    h1, h2 { font-size: smaller; }
}
```

---

## Common Patterns Used

### 1. Modal Pattern
```javascript
// Show
document.getElementById('modal').style.display = 'flex';

// Close
document.getElementById('close-btn').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'none';
});

// Backdrop close
document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') {
        document.getElementById('modal').style.display = 'none';
    }
});
```

### 2. Form Submission
```javascript
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    button.disabled = true;
    
    try {
        const result = await api.call();
        refreshData();
        showSuccess();
    } catch (error) {
        showError(error.message);
    } finally {
        button.disabled = false;
    }
});
```

### 3. Loading States
```html
<div id="loading" class="text-center py-20">
    <span class="material-symbols-outlined animate-spin">refresh</span>
    <p>Loading your data...</p>
</div>
```

