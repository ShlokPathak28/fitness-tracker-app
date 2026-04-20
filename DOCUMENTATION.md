# FitTrack Application Documentation

**Created:** April 17, 2026  
**Version:** 1.0.0  
**Description:** Complete documentation for the FitTrack fitness tracking PWA application including all frontend pages, backend routes, and supporting systems.

## Table of Contents

### Frontend Pages
1. [Landing Page](#landing-page)
2. [Login Page](#login-page)
3. [Signup Page](#signup-page)
4. [Dashboard](#dashboard)
5. [Workouts](#workouts-page)
6. [Goals](#goals-page)
7. [Progress](#progress-page)
8. [Profile](#profile-page)

### Backend Routes
1. [Authentication Routes](#authentication-routes)
2. [Workouts Routes](#workouts-routes)
3. [Goals Routes](#goals-routes)
4. [User Routes](#user-routes)

### Frontend Services
1. [Auth Service](#auth-service)
2. [Workouts Service](#workouts-service)
3. [Goals Service](#goals-service)

### Backend Infrastructure
1. [App Setup](#app-setup)
2. [Authentication Middleware](#authentication-middleware)
3. [Supabase Integration](#supabase-integration)

---

## Frontend Pages

### Landing Page

**Location:** `public/landing.html`

**Purpose:** 
The landing page serves as the entry point for new and returning users. It showcases the FitTrack platform's key features with an editorial-grade design featuring animated gradients, kinetic elements, and a compelling call-to-action.

**Key Features:**
- Hero section with animated gradient text ("LOG. VISUALIZE. ACHIEVE.")
- Navigation bar with links to login and signup
- Workout logging section demonstrating the app interface
- Data visualization section showing volume trends
- Consistency metrics display
- Responsive design with Tailwind CSS

**Design System:**
- Uses custom Tailwind theme with Material Design 3 colors
- Primary color: `#ff7eea` (magenta)
- Secondary color: `#c47fff` (purple)
- Tertiary color: `#8ff5ff` (cyan)
- Background: `#0e0e0e` (near-black)

**Key Sections:**

1. **Top Navigation**
   - Fixed position with backdrop blur
   - Links to Workouts, Metrics, Goals sections
   - Login and "Get Started" buttons

2. **Hero Section**
   - Large italic headline with gradient text
   - Subtitle describing the platform
   - CTA button to signup

3. **Workout Logging Section**
   - Demonstrates the input interface
   - Shows fields for weight, reps, RPE
   - Includes rest timer visual
   - "Log This Set" button example

4. **Progress Visualization**
   - Mock SVG chart showing volume trends
   - Stats cards for consistency metrics
   - Displays estimated 1RM information

**JavaScript Libraries:**
- Tailwind CSS (with forms and container queries plugins)
- Material Symbols Outlined icons
- Google Fonts (Plus Jakarta Sans)

---

### Login Page

**Location:** `public/login.html`

**Purpose:** 
Authenticates existing users with email and password, storing authentication tokens for subsequent API requests.

**Key Features:**
- Email and password input fields with Material icons
- Password visibility toggle
- Forgot password link
- Cinematic background image with gradient overlay
- Glass-morphism card design
- Google authentication option (UI only)
- Error message display

**Layout:**
- Fixed cinematic background image (gym interior)
- Centered glass-morphism card (max-width: 480px)
- Floating ornament at bottom right showing "System Active"

**Form Fields:**

```html
Email Address
- Type: email
- Icon: alternate_email
- Placeholder: name@company.com

Password
- Type: password
- Icon: lock
- Includes visibility toggle button
- Placeholder: ••••••••
```

**JavaScript Functionality:**
- Loads `auth.js` which handles form submission
- Validates credentials against backend
- Stores tokens in localStorage on success
- Displays error messages for failed attempts
- Redirects to dashboard on successful login

**Error Handling:**
- Checks for "email not confirmed" errors
- Displays user-friendly error messages
- Shows validation errors

---

### Signup Page

**Location:** `public/signup.html`

**Purpose:**
Registers new users by collecting their full name, email, password, and confirmation. Creates accounts in Supabase authentication system.

**Key Features:**
- Four-field registration form (name, email, password, confirm password)
- Password strength indicators (visual feedback)
- Google signup option (UI only)
- Editorial design with gradient accents
- Statistics display (500k+ Athletes, 99.9% Accuracy)
- Links to existing account login

**Form Fields:**

```html
Full Name
- Type: text
- Icon: person
- Placeholder: Alex Sterling

Email Address
- Type: email
- Icon: alternate_email
- Placeholder: alex@fittrack.com

Password
- Type: password
- Icon: lock
- Placeholder: ••••••••
- Includes visibility toggle

Confirm Password
- Type: password
- Icon: verified_user
- Placeholder: ••••••••
```

**JavaScript Functionality:**
- Password matching validation
- API call to `/api/auth/signup`
- Error handling with user feedback
- Redirects to login on success
- Links to login page for existing users

---

### Dashboard

**Location:** `public/dashboard.html`

**Purpose:**
The main hub after login, displaying user's key fitness metrics, workout statistics, active goals, and providing quick access to all app features.

**Key Features:**
- Personalized greeting with username
- BMI display indicator
- Summary bento grid with 4 key metrics:
  - Total Workouts
  - Calories Burned
  - Active Goals
  - Consistency Streak
- Navigation sidebar with main menu
- "Start Workout" button prominence
- Responsive layout with sidebar collapsing on mobile

**Layout:**
- Fixed left sidebar (288px width)
- Main content area with 1600px max-width
- Glass-morphism cards for data display

**Sidebar Navigation:**
```
Dashboard (active)
├── Workouts
├── Progress
├── Goals
└── Profile
```

**Key Metrics Cards:**
Each metric card displays:
- Material icon
- Label (CAPS)
- Large number value
- Trend indicator
- Background icon watermark

**JavaScript Integration:**
- Loads `auth.js` for authentication
- Requires valid token to display
- Fetches user data on page load
- Updates metrics from API

---

### Workouts Page

**Location:** `public/workout.html`

**Purpose:**
Allows users to log their workout sessions, view workout history, and manage exercise routines with a modal-based input system.

**Key Features:**
- Bento grid layout for workout cards
- Modal dialog for logging new workouts
- Workout type selection (Strength, Cardio, Yoga, Swimming, Cycling)
- Duration and calories input
- Optional notes field
- Workout history display with filtering
- Real-time rendering of workout cards

**Modal Form Fields:**

```html
Workout Name
- Type: text
- Placeholder: e.g. Morning Sprint

Type
- Dropdown selection:
  - Strength
  - Cardio
  - Yoga
  - Swimming
  - Cycling

Duration (min)
- Type: number
- Min: 1

Calories
- Type: number
- Min: 0

Notes
- Type: text
- Optional
```

**Workout Card Display:**
Each workout shows:
- Workout name (large title)
- Type indicator
- Duration
- Calories burned
- Date created
- Edit/delete actions

**JavaScript Functionality:**
- Fetches workouts from `/api/workouts`
- Creates new workout via form submission
- Renders workout grid dynamically
- Modal open/close handlers
- Error handling and display

---

### Goals Page

**Location:** `public/goals.html`

**Purpose:**
Goal tracking system allowing users to set fitness objectives, track progress, and manage goal completion status.

**Key Features:**
- Tab system for Ongoing vs Completed goals
- Goal creation modal
- Progress calculation based on current vs target
- Goal action menu (Mark Completed, Failed, Delete)
- Tips section with best practices
- Active goal count display
- Mobile bottom navigation

**Tab System:**
- **Ongoing Goals**: Active goals with progress tracking
- **Completed Goals**: Historical goals marked as completed/failed

**Goal Modal Fields:**

```html
Goal Title
- Type: text
- Required

Goal Type
- Dropdown:
  - Strength
  - Endurance
  - Body Composition

Target Value
- Type: number (step: 0.1)
- Required

Deadline
- Type: date
- Optional
```

**Goal Card Display:**
```
Title: "Bench Press 150 lbs"
Type badge
Progress bar: [████░░░░░] 60%
Current/Target: 90/150
Deadline: May 2026
Status: ONGOING
Actions menu
```

**Goal Actions Available:**
- **Ongoing**: Mark Completed, Mark Failed, Delete
- **Completed**: Delete only
- **Failed**: Delete only

**Tips Section:**
- Set measurable targets
- Update weekly
- Use numeric targets for auto-tracking

---

### Progress Page

**Location:** `public/progress.html`

**Purpose:**
Analytics and biometrics dashboard providing deep-dive into physical evolution, workout history, and performance trends.

**Key Features:**
- Activity overview chart (bar chart visualization)
- Quick stats cards:
  - Total Workouts
  - Total Duration
  - Calories Burned
- Recent activity list
- Time-based filtering
- Responsive grid layout

**Layout:**
- Main chart takes 8 columns (larger left section)
- Quick stats take 4 columns (smaller right sidebar)
- Full-width recent activity section below

**Chart Visualization:**
- SVG-based bar chart
- Y-axis shows duration in minutes
- X-axis represents workouts
- Gradient background with radial glow effect
- Interactive labels showing max/mid values

**Statistics Cards:**
Each card shows:
```
Icon
Label (CAPS)
Large number value
Card background with opacity

Example:
🏋️ TOTAL WORKOUTS
       42
```

**Recent Activity Table:**
Shows workouts with columns:
- Date
- Workout name
- Type
- Duration
- Calories
- Notes

---

### Profile Page

**Location:** `public/profile.html`

**Purpose:**
User profile management displaying personal biometric data, experience level, and account settings.

**Key Features:**
- Profile avatar area (placeholder)
- Personal information display
- Editable fields:
  - Full Name
  - Height
  - Weight
  - Experience Level
- BMI calculation display
- Account management
- Sign out option

**Profile Sections:**

1. **Avatar & Header**
   - Avatar container (32x32px, rounded)
   - Username display
   - Experience badge

2. **Bio Information**
   - Full Name
   - Height (cm)
   - Weight (kg)
   - Experience Level (Beginner, Intermediate, Advanced)

3. **Metrics**
   - BMI (calculated)
   - Current streak
   - Total XP earned

4. **Account Settings**
   - Email display (read-only)
   - Last login
   - Account created date

---

## Backend Routes

### Authentication Routes

**Location:** `server/routes/auth.js`

**Purpose:**
Handles user authentication including signup, login, and logout operations using Supabase authentication.

#### Endpoint: POST `/api/auth/signup`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "fullName": "John Doe"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-string",
      "email": "user@example.com",
      "user_metadata": {
        "full_name": "John Doe"
      }
    },
    "session": {...}
  }
}
```

**Response (Error - 400/422):**
```json
{
  "error": "User already registered",
  "code": "user_already_exists"
}
```

**Error Cases:**
- User already registered
- Invalid email format
- Password too weak
- Server error

---

#### Endpoint: POST `/api/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "access_token": "jwt-token",
    "refresh_token": "refresh-token",
    "expires_in": 3600,
    "user": {
      "id": "uuid-string",
      "email": "user@example.com"
    }
  }
}
```

**Response (Error - 400):**
```json
{
  "error": "Invalid login credentials"
}
```

**Special Handling:**
- Checks for unconfirmed email with custom message
- Returns JWT token for API authentication
- Token stored in localStorage on frontend

---

#### Endpoint: POST `/api/auth/logout`

**Request:** (No body required)

**Response (Success - 200):**
```json
{
  "success": true
}
```

**Frontend Handling:**
- Clears localStorage tokens
- Redirects to login page

---

### Workouts Routes

**Location:** `server/routes/workouts.js`

**Purpose:**
Manages workout creation, retrieval, and exercise set logging. All endpoints require authentication.

#### Endpoint: GET `/api/workouts`

**Authentication:** Required (Bearer token)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "name": "Morning Sprint",
      "type": "Cardio",
      "duration": 30,
      "calories": 350,
      "notes": "Felt great",
      "created_at": "2026-04-17T10:30:00Z"
    }
  ]
}
```

**Error (401):**
```json
{
  "error": "Unauthorized"
}
```

---

#### Endpoint: POST `/api/workouts`

**Authentication:** Required

**Request:**
```json
{
  "name": "Bench Press Session",
  "type": "Strength",
  "duration": 45,
  "calories": 280,
  "notes": "4x8 @425lbs"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "name": "Bench Press Session",
    "type": "Strength",
    "duration": 45,
    "calories": 280,
    "notes": "4x8 @425lbs",
    "created_at": "2026-04-17T10:30:00Z"
  }
}
```

**Validation:**
- name: required
- type: required (Strength, Cardio, Yoga, Swimming, Cycling)
- duration: required, min 1
- calories: optional, min 0
- notes: optional

---

#### Endpoint: POST `/api/workouts/sets`

**Authentication:** Required

**Request:**
```json
{
  "workout_id": "uuid",
  "exercise": "Barbell Bench Press",
  "weight": 185,
  "reps": 8,
  "rpe": 9
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "workout_id": "uuid",
    "exercise": "Barbell Bench Press",
    "weight": 185,
    "reps": 8,
    "rpe": 9,
    "created_at": "2026-04-17T10:30:00Z"
  }
}
```

**Fields:**
- exercise: Exercise name
- weight: Weight in kg
- reps: Number of repetitions
- rpe: Rate of Perceived Exertion (1-10 scale)

---

### Goals Routes

**Location:** `server/routes/goals.js`

**Purpose:**
CRUD operations for fitness goals with progress tracking and status management.

#### Endpoint: GET `/api/goals`

**Authentication:** Required

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "title": "Bench Press 150 lbs",
      "goal_type": "strength",
      "target_value": 150,
      "current_value": 90,
      "status": "ongoing",
      "deadline": "2026-05-17",
      "created_at": "2026-04-17T10:30:00Z"
    }
  ]
}
```

---

#### Endpoint: POST `/api/goals`

**Authentication:** Required

**Request:**
```json
{
  "title": "Run 10K",
  "type": "endurance",
  "target_value": 10,
  "current_value": 0,
  "deadline": "2026-06-30"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "title": "Run 10K",
    "goal_type": "endurance",
    "target_value": 10,
    "current_value": 0,
    "status": "ongoing",
    "deadline": "2026-06-30",
    "created_at": "2026-04-17T10:30:00Z"
  }
}
```

**Goal Types:**
- strength
- endurance
- body_composition

---

#### Endpoint: PATCH `/api/goals/:id`

**Authentication:** Required

**Request:**
```json
{
  "current_value": 125,
  "status": "completed"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {...}
}
```

**Allowed Status Values:**
- ongoing (default)
- completed
- failed

---

### User Routes

**Location:** `server/routes/user.js`

**Purpose:**
Manages user profile information including biometric data.

#### Endpoint: GET `/api/user/profile`

**Authentication:** Required

**Response (200):**
```json
{
  "success": true,
  "profile": {
    "id": "uuid",
    "user_id": "uuid",
    "full_name": "John Doe",
    "height": 180,
    "weight": 85,
    "experience_level": "intermediate",
    "xp": 450,
    "created_at": "2026-04-17T10:30:00Z"
  }
}
```

**Response (No Profile):**
```json
{
  "success": true,
  "profile": null
}
```

---

#### Endpoint: POST `/api/user/profile`

**Authentication:** Required

**Request:**
```json
{
  "full_name": "John Doe",
  "height": 180,
  "weight": 85,
  "experience_level": "intermediate"
}
```

**Response (200):**
```json
{
  "success": true,
  "profile": {
    "id": "uuid",
    "user_id": "uuid",
    "full_name": "John Doe",
    "height": 180,
    "weight": 85,
    "experience_level": "intermediate",
    "xp": 0,
    "created_at": "2026-04-17T10:30:00Z"
  }
}
```

---

#### Endpoint: PATCH `/api/user/profile`

**Authentication:** Required

**Request:**
```json
{
  "weight": 82,
  "xp": 500
}
```

**Response (200):**
```json
{
  "success": true,
  "profile": {
    ...updated profile data
  }
}
```

**Updatable Fields:**
- full_name
- height
- weight
- experience_level
- xp

---

## Frontend Services

### Auth Service

**Location:** `public/js/auth.js`

**Purpose:**
Client-side authentication service managing signup, login, logout, and token persistence.

#### Class: AuthService

**Static Methods:**

##### `signup(email, password, fullName)`

```javascript
try {
  const result = await AuthService.signup('user@example.com', 'pass123', 'John');
  console.log(result); // { success: true, data: {...} }
} catch (error) {
  console.error(error.message); // Error message from server
}
```

**Functionality:**
- Makes POST request to `/api/auth/signup`
- Passes email, password, fullName
- Throws error on failure
- No token handling (user must login after signup)

---

##### `login(email, password)`

```javascript
try {
  const result = await AuthService.login('user@example.com', 'pass123');
  // On success:
  // - Sets localStorage.supabase_token
  // - Sets localStorage.user_id
  // - Sets localStorage.user_email
} catch (error) {
  console.error(error.message);
}
```

**Functionality:**
- Makes POST request to `/api/auth/login`
- Stores JWT token in localStorage
- Stores user ID and email
- Throws error on failure
- Handles email confirmation status

---

##### `logout()`

```javascript
AuthService.logout(); // Clears all tokens and redirects to login
```

**Functionality:**
- Removes all localStorage tokens
- Redirects to `/login` page
- Synchronous operation

---

##### `isLoggedIn()`

```javascript
if (AuthService.isLoggedIn()) {
  // User has valid token
}
```

**Returns:** Boolean based on token presence

---

##### `getToken()`

```javascript
const token = AuthService.getToken();
// Returns JWT from localStorage or null
```

**Used By:** All API requests via `getAuthHeaders()`

---

### Workouts Service

**Location:** `public/js/workouts.js`

**Purpose:**
Frontend API wrapper for workout operations.

#### Functions:

##### `getAuthHeaders()`

```javascript
const headers = getAuthHeaders();
// Returns: {
//   'Content-Type': 'application/json',
//   Authorization: 'Bearer jwt-token' (if logged in)
// }
```

---

##### `fetchWorkouts()`

```javascript
const workouts = await fetchWorkouts();
// Returns array of workout objects or []
```

**API Call:**
```
GET /api/workouts
Headers: Authorization: Bearer token
```

---

##### `createWorkout(workoutData)`

```javascript
const result = await createWorkout({
  name: 'Morning Run',
  type: 'Cardio',
  duration: 30,
  calories: 250,
  notes: 'Felt great'
});

// Result: { success: true, data: {...} }
```

---

##### `logSet(setData)`

```javascript
const result = await logSet({
  workout_id: 'uuid',
  exercise: 'Bench Press',
  weight: 185,
  reps: 8,
  rpe: 9
});
```

---

##### `fetchWorkoutStats()`

```javascript
const stats = await fetchWorkoutStats();
// Returns: { total_workouts: 42, avg_duration: 35, ... }
```

---

##### `renderWorkoutCard(workout)`

```javascript
const html = renderWorkoutCard({
  id: 'uuid',
  name: 'Bench Press',
  type: 'Strength',
  duration: 45,
  calories: 280,
  created_at: '2026-04-17T10:30:00Z'
});
```

**Returns:** HTML string for workout card with:
- Workout name
- Type badge with color coding
- Duration and calories
- Date created
- Delete button

---

### Goals Service

**Location:** `public/js/goals.js`

**Purpose:**
Frontend service for goal CRUD operations and status management.

#### Functions:

##### `fetchGoals()`

```javascript
const goals = await fetchGoals();
// Returns array of goal objects
```

---

##### `createGoal(goalData)`

```javascript
const result = await createGoal({
  title: 'Bench 300 lbs',
  type: 'strength',
  target_value: 300,
  current_value: 250,
  deadline: '2026-06-30'
});
```

**Error Handling:**
- Returns error object if request fails
- Handles network errors gracefully

```javascript
if (!result.success) {
  console.error(result.error);
}
```

---

##### `deleteGoal(goalId)`

```javascript
const result = await deleteGoal('goal-uuid');
// Returns: { success: true }
```

---

##### `updateGoalStatus(goalId, status)`

```javascript
const result = await updateGoalStatus('goal-uuid', 'completed');
// Or 'failed', 'ongoing'
```

---

##### `updateGoalProgress(goalId, currentValue)`

```javascript
const result = await updateGoalProgress('goal-uuid', 125);
```

---

##### `splitGoals(goals)`

```javascript
const { ongoing, completed } = splitGoals(goalsArray);
```

**Returns:** Goals grouped by status

---

##### `isFinishedStatus(status)`

```javascript
if (isFinishedStatus(goal.status)) {
  // Goal is completed or failed
}
```

---

##### `getGoalActions(goal)`

```javascript
const actions = getGoalActions(goal);
// Returns array of available actions based on goal status
```

**For Ongoing Goals:**
```javascript
[
  { key: 'completed', label: 'Completed', tone: 'success' },
  { key: 'failed', label: 'Failed', tone: 'warning' },
  { key: 'delete', label: 'Delete', tone: 'danger' }
]
```

**For Completed/Failed Goals:**
```javascript
[
  { key: 'delete', label: 'Delete', tone: 'danger' }
]
```

---

## Backend Infrastructure

### App Setup

**Location:** `server/app.js` and `server/index.js`

**Purpose:**
Express application configuration and server initialization.

#### File: `server/app.js`

```javascript
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/user', userRoutes);

// Page routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/landing.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});
// ... other page routes
```

**Middleware Stack:**
1. CORS - Cross-origin resource sharing
2. JSON parsing - Parses request bodies
3. Static files - Serves HTML/CSS/JS from public/

**Route Mounting:**
- `/api/auth` → Authentication endpoints
- `/api/workouts` → Workout management
- `/api/goals` → Goal management
- `/api/user` → User profile

**Page Routes:**
Routes serve HTML files for client-side routing:
- `/` → landing.html
- `/login` → login.html
- `/signup` → signup.html
- `/dashboard` → dashboard.html
- `/workout` → workout.html
- `/goals` → goals.html
- `/progress` → progress.html
- `/profile` → profile.html

---

#### File: `server/index.js`

```javascript
const app = require('../index');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`FitTrack server running on http://localhost:${PORT}`);
});
```

**Startup:**
- Imports Express app from parent directory
- Listens on PORT (default 3000)
- Logs server running message

---

### Authentication Middleware

**Location:** `server/middleware/auth.js`

**Purpose:**
Middleware to verify JWT tokens and extract user information for protected routes.

#### Middleware: `requireAuth`

```javascript
function requireAuth(req, res, next) {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    getUserFromToken(accessToken)
        .then((user) => {
            if (!user || !user.id) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            req.accessToken = accessToken;
            req.user = user;
            next();
        })
        .catch(() => res.status(500).json({ error: 'Server error' }));
}
```

**Validation Steps:**
1. Extracts token from Authorization header
2. Returns 401 if no token found
3. Verifies token with Supabase
4. Returns 401 if token invalid
5. Attaches user object to request
6. Calls next() to proceed

**Usage in Routes:**
```javascript
router.post('/', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const token = req.accessToken;
  // Protected endpoint logic
});
```

---

### Supabase Integration

**Location:** `server/lib/supabase.js`

**Purpose:**
Supabase API abstraction layer for authentication and database operations.

#### Configuration

```javascript
const SUPABASE_URL = getRequiredEnv('SUPABASE_URL');
const SUPABASE_ANON_KEY = getRequiredEnv('SUPABASE_ANON_KEY');
```

**Required Environment Variables:**
- `SUPABASE_URL`: Base URL for Supabase project
- `SUPABASE_ANON_KEY`: Anonymous key for client access

**Throws Error** if variables missing

---

#### Function: `getAccessToken(req)`

```javascript
const getAccessToken = (req) => {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) {
        return null;
    }
    return auth.slice(7).trim();
};
```

**Input:** Express request object

**Output:** JWT token string or null

**Format Expected:** `Bearer eyJhbGci...`

---

#### Function: `getUserFromToken(accessToken)`

```javascript
const getUserFromToken = async (accessToken) => {
    if (!accessToken) {
        return null;
    }

    const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        return null;
    }

    return response.json();
};
```

**Input:** JWT access token

**Output:** User object with id, email, etc.

```javascript
{
  id: 'uuid-string',
  email: 'user@example.com',
  email_confirmed_at: '2026-04-17T10:00:00Z',
  user_metadata: {
    full_name: 'John Doe'
  }
}
```

**Returns:** null if token invalid

---

#### Function: `supabaseRestFetch(path, options, accessToken)`

```javascript
const response = await supabaseRestFetch(
  `workouts?user_id=eq.${userId}&order=created_at.desc`,
  { admin: true },
  req.accessToken
);

const data = await response.json();
```

**Parameters:**
- `path`: REST API path (after `/rest/v1/`)
- `options`: Fetch options (method, headers, body)
- `accessToken`: JWT token for authorization

**Automatic Headers Added:**
- `apikey`: SUPABASE_ANON_KEY
- `Authorization`: Bearer token (if provided)

**Base URL:** `${SUPABASE_URL}/rest/v1/${path}`

**Common Usage:**

```javascript
// GET request
const response = await supabaseRestFetch(
  `goals?user_id=eq.${userId}`,
  {},
  token
);

// POST request
const response = await supabaseRestFetch(
  'workouts',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({...data})
  },
  token
);

// PATCH request
const response = await supabaseRestFetch(
  `goals?id=eq.${goalId}`,
  {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({status: 'completed'})
  },
  token
);
```

---

## API Architecture Summary

**Authentication Flow:**

```
Frontend
  ↓
signup() → POST /api/auth/signup → Supabase Auth
  ↓
login() → POST /api/auth/login → Supabase Auth
  ↓
Store token in localStorage
  ↓
All API requests include Bearer token
```

**Protected Route Flow:**

```
Request with Bearer token
  ↓
requireAuth middleware
  ↓
Extract token from Authorization header
  ↓
Verify with Supabase AUTH API
  ↓
Attach user object to request
  ↓
Route handler executes
  ↓
supabaseRestFetch() → Supabase REST API
  ↓
Response sent to client
```

**Data Models:**

```
User (from Supabase Auth)
├── id (UUID)
├── email
└── user_metadata (full_name)

Profile (Custom Table)
├── id
├── user_id (FK to User)
├── full_name
├── height
├── weight
├── experience_level
├── xp
└── created_at

Workout
├── id
├── user_id
├── name
├── type
├── duration
├── calories
├── notes
└── created_at

Workout_Sets
├── id
├── workout_id
├── exercise
├── weight
├── reps
├── rpe
└── created_at

Goal
├── id
├── user_id
├── title
├── goal_type
├── target_value
├── current_value
├── status
├── deadline
└── created_at
```

---

## Environment Configuration

**Required Environment Variables:**

```.env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
PORT=3000
NODE_ENV=production
```

**Port Configuration:**
- Development: 3000 (default)
- Production: Set via PORT env var

---

## File Structure Overview

```
fitness-tracker-app/
├── public/
│   ├── index.html (served by /api paths)
│   ├── landing.html
│   ├── login.html
│   ├── signup.html
│   ├── dashboard.html
│   ├── workout.html
│   ├── goals.html
│   ├── progress.html
│   ├── profile.html
│   ├── css/
│   │   └── (styles - currently empty)
│   └── js/
│       ├── auth.js (AuthService class)
│       ├── workouts.js (Workouts API)
│       ├── goals.js (Goals API)
│       ├── dashboard.js
│       ├── progress.js
│       └── profile.js
├── server/
│   ├── app.js (Express setup)
│   ├── index.js (Server start)
│   ├── lib/
│   │   └── supabase.js (Supabase integration)
│   ├── middleware/
│   │   └── auth.js (requireAuth middleware)
│   └── routes/
│       ├── auth.js (Auth endpoints)
│       ├── workouts.js (Workouts endpoints)
│       ├── goals.js (Goals endpoints)
│       └── user.js (User profile endpoints)
├── index.js (main entry - imports server/app.js)
├── package.json
└── .env (not in repo)
```

---

## Color System

**Primary Palette:**
- Primary: `#ff7eea` (Hot Magenta)
- Secondary: `#c47fff` (Purple)
- Tertiary: `#8ff5ff` (Cyan)

**Surface Colors:**
- Background: `#0e0e0e` (Near Black)
- Surface: `#0e0e0e`
- Surface Container: `#1a1919`
- Surface Container Low: `#131313`
- Surface Container High: `#201f1f`
- Surface Variant: `#262626`

**Utility Colors:**
- Error: `#ff6e84` (Red)
- Outline: `#767575` (Gray)
- On Surface: `#ffffff` (White)
- On Surface Variant: `#adaaaa` (Light Gray)

---

## Design System

**Typography:**
- Font Family: Plus Jakarta Sans
- Weights: 200-800

**Border Radius:**
- Default: 1rem (16px)
- Large: 2rem (32px)
- Extra Large: 3rem (48px)
- Full: 9999px (pill-shaped)

**Glass Morphism:**
- Background: rgba(26, 25, 25, 0.6-0.85)
- Backdrop Filter: blur(24px)
- Border: 1px rgba(72, 72, 71, 0.15)

**Icons:**
- Material Symbols Outlined
- Weight: 400
- Size: 24px (default)

---

## Notes for Development

1. **Authentication**: All endpoints except `/auth` routes require valid JWT token
2. **CORS**: Frontend and backend can be on different origins
3. **Token Expiry**: Implement refresh token logic if needed
4. **Error Handling**: Frontend should check response.ok and handle errors gracefully
5. **Loading States**: Implement spinners for async operations
6. **Mobile Responsive**: All pages use Tailwind responsive utilities
7. **Progressive Enhancement**: App works with JavaScript disabled for static pages

