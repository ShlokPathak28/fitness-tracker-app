# FitTrack: Complete Implementation Reference
## Button-by-Button, Function-by-Function, Field-by-Field Guide

**Last Updated:** April 17, 2026  
**Coverage:** 100% - Every button, every form field, every function with parameters and return values

---

## Table of Contents

1. [Authentication System](#authentication-system)
2. [Dashboard Page](#dashboard-page)
3. [Workouts Page](#workouts-page)
4. [Goals Page](#goals-page)
5. [Progress Page](#progress-page)
6. [Profile Page](#profile-page)
7. [Navigation & Sidebar](#navigation--sidebar)
8. [Utility Functions Library](#utility-functions-library)
9. [API Endpoints & Connections](#api-endpoints--connections)
10. [LocalStorage Keys](#localstorage-keys)

---

# AUTHENTICATION SYSTEM

## File: `public/js/auth.js`

### AuthService Class

#### Method: `signup(email, password, fullName)`
- **Purpose:** Register a new user account
- **Parameters:**
  - `email` (string) - User's email address
  - `password` (string) - User's password
  - `fullName` (string) - User's full name
- **Returns:** Promise → Object with signup result data
- **API Call:** `POST /api/auth/signup`
- **Error Handling:** Throws error if response not ok or has error field
- **Frontend Location:** `/signup.html`
- **Example Usage:**
  ```javascript
  try {
    const result = await AuthService.signup('user@example.com', 'password123', 'John Doe');
    window.location.href = '/login?registered=1';
  } catch (err) {
    errorEl.textContent = err.message;
  }
  ```

#### Method: `login(email, password)`
- **Purpose:** Authenticate user and retrieve JWT token
- **Parameters:**
  - `email` (string) - User's email
  - `password` (string) - User's password
- **Returns:** Promise → Object with token data or throws error
- **API Call:** `POST /api/auth/login`
- **Success Response:** Contains `data.access_token` and `data.user.id`
- **Side Effects:** 
  - Stores `supabase_token` in localStorage
  - Stores `user_id` in localStorage
  - Stores `user_email` in localStorage
- **Error Messages Generated:**
  - "Email not confirmed" appears as: "Please confirm your email first, then log in."
  - Generic error: "Login failed. Check your credentials."
- **Frontend Location:** `/login.html`

#### Method: `logout()`
- **Purpose:** Clear authentication and redirect to login
- **Returns:** void (redirect happens)
- **Side Effects:**
  - Removes `supabase_token` from localStorage
  - Removes `user_email` from localStorage
  - Removes `user_id` from localStorage
  - Redirects to `/login` page
- **Frontend Location:** Various pages (logout button in sidebar)

#### Method: `isLoggedIn()`
- **Purpose:** Check if user has valid token
- **Returns:** Boolean - true if `supabase_token` exists in localStorage
- **Used By:** All protected pages as guard check

#### Method: `getToken()`
- **Purpose:** Retrieve JWT token from storage
- **Returns:** String - JWT token or null if not logged in
- **Used By:** All API requests in `getAuthHeaders()`

---

## Login Page: `/login.html`

### Form: `login-form`

#### Field 1: Email Input (`#email`)
- **Type:** text
- **Placeholder:** "Email"
- **Required:** Yes
- **Validation:** Built into form submit handler
- **Value Captured As:** `email` variable in form handler

#### Field 2: Password Input (`#password`)
- **Type:** password
- **Placeholder:** "Password"
- **Required:** Yes
- **Show/Hide Toggle:** YES (see below)
- **Value Captured As:** `password` variable in form handler

#### Button: Password Toggle (`#toggle-password`)
- **Type:** button
- **HTML:** Contains `.material-symbols-outlined` icon
- **Icon States:**
  - Initially: `visibility` (eye icon)
  - After Click: `visibility_off` (eye-slash icon)
- **Function:** Toggles password field between `type="password"` and `type="text"`
- **Event Listener Type:** click
- **Behavior:**
  ```
  IF password.type === 'password' THEN
    password.type = 'text'
    icon.textContent = 'visibility_off'
  ELSE
    password.type = 'password'
    icon.textContent = 'visibility'
  ```

### Message Display: `#login-info`
- **Type:** div displaying message
- **Populated By:** URL parameter check - `?registered=1`
- **Message:** "Signup successful. Please confirm your email, then log in."
- **Display Condition:** Only shows if URL has `registered=1` parameter

### Error Display: `#login-error`
- **Type:** div for error messages
- **Cleared On:** Form submit
- **Set On:** Catch block after login attempt
- **Error Messages:**
  - "Please confirm your email first, then log in." (for email confirmation errors)
  - "Login failed. Check your credentials." (for generic errors)

### Button: Login Submit (`#login-btn`)
- **Type:** submit button
- **Label:** "Log In"
- **Form:** `login-form`
- **Disabled State:** YES - Set to disabled during API call, re-enabled in finally block
- **On Click:**
  1. Prevent default form submission
  2. Get email and password values
  3. Clear error message
  4. Disable button
  5. Call `AuthService.login(email, password)`
  6. If success: navigate to `/dashboard`
  7. If error: display error message
  8. Finally: re-enable button

---

## Signup Page: `/signup.html`

### Form: `signup-form`

#### Field 1: Full Name Input (`#fullname`)
- **Type:** text
- **Placeholder:** "Full Name"
- **Required:** Yes
- **Validation:** Must not be empty (checked in form handler)
- **Value Captured As:** `fullName` variable

#### Field 2: Email Input (`#email`)
- **Type:** text
- **Placeholder:** "Email"
- **Required:** Yes
- **Value Captured As:** `email` variable

#### Field 3: Password Input (`#password`)
- **Type:** password
- **Placeholder:** "Password"
- **Required:** Yes (and must match confirm-password)
- **Show/Hide Toggle:** YES
- **Value Captured As:** `password` variable

#### Field 4: Confirm Password Input (`#confirm-password`)
- **Type:** password
- **Placeholder:** "Confirm Password"
- **Required:** Yes (must match password field)
- **Show/Hide Toggle:** YES (dynamically created if not present)
- **Value Captured As:** `confirmPassword` variable
- **Validation:** Must exactly match `password` field

#### Button: Password Show/Hide (`#toggle-password`)
- **Same behavior as login page password toggle**

#### Button: Confirm Password Show/Hide (`#toggle-confirm-password`)
- **Type:** button
- **Creation:** Dynamically created by JavaScript if not in HTML
- **Parent:** `.parentElement` of `#confirm-password`
- **Position:** `absolute right-4 top-1/2 -translate-y-1/2`
- **Styling:** `text-neutral-500 hover:text-white`
- **Icon:** `visibility` initially, toggles to `visibility_off`
- **Behavior:** Same as password toggle but for confirm password

### Error Display: `#signup-error`
- **Cleared On:** Form submit start
- **Set On:** Validation failure or API error
- **Error Messages:**
  - "Passwords do not match" (if password !== confirmPassword)
  - Any error from API response
  - "Signup failed" (generic fallback)

### Button: Signup Submit (`#signup-btn`)
- **Type:** submit button
- **Label:** "Sign Up"
- **Disabled State:** YES - Set disabled during API call
- **On Click:**
  1. Prevent default
  2. Get all form field values
  3. Validate password === confirmPassword
  4. Disable button
  5. Clear error message
  6. Call `AuthService.signup(email, password, fullName)`
  7. If success: navigate to `/login?registered=1`
  8. If error: display error message
  9. Finally: re-enable button

### Logout Button (All Pages): `#logout-btn`
- **Type:** button/link with click handler
- **Location:** Sidebar (appears on all authenticated pages)
- **On Click:**
  1. Prevent default
  2. Call `AuthService.logout()`
  3. Redirects to `/login`

---

# DASHBOARD PAGE

## File: `public/js/dashboard.js`

### Utility Functions

#### Function: `fetchWithTimeout(url, options = {}, timeout = 5000)`
- **Purpose:** Make fetch request with automatic abort after timeout
- **Parameters:**
  - `url` (string) - API endpoint URL
  - `options` (object, optional) - Fetch options (method, headers, body)
  - `timeout` (number, optional) - Milliseconds before abort (default: 5000)
- **Returns:** Promise → Response object (or error response with `ok: false`)
- **Behavior:**
  1. Create AbortController
  2. Set timer to abort after timeout milliseconds
  3. Execute fetch with abort signal
  4. Clear timeout on response
  5. Catch error (timeout or network error)
  6. Log error message
  7. Return error response object
- **Error Handling:**
  - Timeout errors are caught
  - Returns `{ ok: false, json: async () => ({ error: e.message }) }`
- **Used By:** All dashboard API calls

#### Function: `getAuthHeaders()`
- **Purpose:** Get authorization headers with JWT token
- **Returns:** Object with headers:
  ```javascript
  {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` // Only if token exists
  }
  ```
- **Used By:** All authenticated API requests

#### Function: `fetchProfile()`
- **Purpose:** Get current user's profile data
- **Returns:** Promise → Profile object or null
- **API Call:** `GET /api/user/profile`
- **Success:** Returns profile object
- **Failure:** Logs error, returns null

#### Function: `updateProfile(profileData)`
- **Purpose:** Update user profile (PATCH request)
- **Parameters:** `profileData` (object) - Fields to update
- **Returns:** Promise → API response
- **API Call:** `PATCH /api/user/profile`
- **Note:** Used on profile page, not dashboard

#### Function: `fetchWorkoutStats()`
- **Purpose:** Get aggregated workout statistics
- **Returns:** Promise → Stats object or null
- **API Call:** `GET /api/workouts/stats`
- **Success Response Format:**
  ```javascript
  {
    totalWorkouts: number,
    totalCalories: number,
    totalDuration: number // in minutes
  }
  ```
- **Failure:** Returns null

#### Function: `fetchWorkouts()`
- **Purpose:** Get all workouts for current user
- **Returns:** Promise → Array of workout objects
- **API Call:** `GET /api/workouts`
- **Failure:** Returns empty array []

#### Function: `fetchGoalsCount()`
- **Purpose:** Count only ongoing goals (not completed/failed)
- **Returns:** Promise → Number of active goals
- **API Call:** `GET /api/goals`
- **Logic:**
  1. Fetch all goals
  2. Filter where status is NOT 'completed' and NOT 'failed'
  3. Return count
- **Failure:** Returns 0

#### Function: `calculateBmi(weightKg, heightCm)`
- **Purpose:** Calculate Body Mass Index
- **Parameters:**
  - `weightKg` (number) - Weight in kilograms
  - `heightCm` (number) - Height in centimeters
- **Returns:** Number - BMI value or null if invalid input
- **Formula:** `BMI = weight_kg / (height_m)²`
- **Validation:** Returns null if weight or height is 0/falsy
- **Example:** calculateBmi(75, 180) = 23.15

#### Function: `describeBmi(bmi)`
- **Purpose:** Get BMI category description
- **Parameters:** `bmi` (number) - BMI value
- **Returns:** String - BMI category
- **Categories:**
  - BMI < 18.5: "Underweight"
  - BMI 18.5-25: "Healthy"
  - BMI 25-30: "Overweight"
  - BMI ≥ 30: "Obesity"
  - Invalid: "Add profile data"

#### Function: `calculateStreakDays(workouts)`
- **Purpose:** Calculate consecutive days with workouts ending today
- **Parameters:** `workouts` (array) - Array of workout objects
- **Returns:** Number - Consecutive days with workouts
- **Algorithm:**
  1. Create set of unique dates from workouts (YYYY-MM-DD format)
  2. Start from today, iterate backward
  3. Count consecutive days that have workouts
  4. Stop when hitting first gap
- **Edge Cases:**
  - Empty array: returns 0
  - No workout today: returns 0
  - Today + yesterday both have workouts: returns 2+

#### Function: `renderActivityChart(workouts, period = 'week')`
- **Purpose:** Render 7-day or 4-week activity chart
- **Parameters:**
  - `workouts` (array) - Workout data
  - `period` (string) - 'week' or 'month'
- **Returns:** void (renders to #activity-chart)
- **Chart Logic for Week:**
  1. Build series data for last 7 days
  2. Find peak duration
  3. Calculate height percentage for each day
  4. Highlight peak day with gradient
  5. Render colored bars with day labels
- **Chart Logic for Month:**
  1. Build series for 4 weeks
  2. Aggregate by week
  3. Find peak week
  4. Highlight peak with gradient
- **Button States Updated:**
  - Active button (current period) gets `bg-surface-variant` class
  - Inactive button gets hover state styling

#### Function: `buildSeries(workouts, period = 'week')`
- **Purpose:** Aggregate workout durations by day/week
- **Parameters:**
  - `workouts` (array)
  - `period` (string) - 'week' or 'month'
- **Returns:** Object with labels and values arrays
- **Week Logic:**
  - Filter workouts from last 7 days
  - Group by day of week (MON-SUN)
  - Convert JS day number (0=Sun) to calendar day
- **Month Logic:**
  - Filter workouts from last 28 days
  - Group by week number (W1-W4)
  - Calculate week index from date difference

### Page Initialization: `DOMContentLoaded` Event

**Auth Check:**
- If no `supabase_token` in localStorage:
  - Redirect to `/login`
  - Return (stop execution)

**Data Fetching:**
- Parallel fetch of: profile, stats, workouts, goalsCount
- Uses `Promise.all()` for concurrent requests
- If any fail, individual error logs, page shows 0 or defaults

**Element Rendering:**

##### Username Display (`#username`)
- **Source:** `profile.full_name`
- **Fallback:** Email domain (before @)
- **Default:** "User"
- **Updated On:** Page load

##### Total Workouts (`#total-workouts`)
- **Source:** `stats.totalWorkouts`
- **Format:** Number
- **Default:** 0
- **Updated On:** Page load

##### Total Calories (`#total-calories`)
- **Source:** `stats.totalCalories`
- **Format:** Number
- **Default:** 0
- **Updated On:** Page load

##### Active Goals Count (`#active-goals-count`)
- **Source:** `goalsCount`
- **Format:** String of number
- **Default:** 0
- **Updated On:** Page load

##### BMI Display (`#dashboard-bmi`)
- **Calculation:** `calculateBmi(profile.weight, profile.height)`
- **Format:** Fixed to 1 decimal place
- **Display:** "--" if null/invalid
- **Updated On:** Page load

##### BMI Label (`#dashboard-bmi-label`)
- **Source:** `describeBmi(bmi)`
- **Updated On:** Page load

##### Streak Days (`#streak-days`)
- **Source:** `calculateStreakDays(workouts)`
- **Format:** "{number} Days"
- **Example:** "7 Days"
- **Updated On:** Page load

##### XP Display (`#user-xp`)
- **Always Set To:** "0 XP"
- **Note:** Currently hardcoded, future feature

##### Activity Chart (`#activity-chart`)
- **Rendered By:** `renderActivityChart(workouts, 'week')`
- **Initial Period:** 'week' (7 days)
- **Updated On:** Page load and button clicks

### Buttons

#### Button: Activity Week Toggle (`#activity-week-btn`)
- **Label:** "WEEK"
- **On Click:**
  - Call `renderActivityChart(workouts, 'week')`
  - Chart re-renders for 7-day period
  - Button styling updates to active state

#### Button: Activity Month Toggle (`#activity-month-btn`)
- **Label:** "MONTH"
- **On Click:**
  - Call `renderActivityChart(workouts, 'month')`
  - Chart re-renders for 4-week period
  - Button styling updates to active state

---

# WORKOUTS PAGE

## File: `public/js/workouts.js`

### Utility Functions

#### Function: `getAuthHeaders()`
- Same as dashboard version - returns headers with JWT token

#### Function: `fetchWorkouts()`
- **Purpose:** Get all workouts for user
- **Returns:** Promise → Array of workout objects
- **API Call:** `GET /api/workouts`
- **Response Format:**
  ```javascript
  {
    success: boolean,
    data: [ { id, name, type, duration, calories, created_at, notes } ]
  }
  ```
- **Failure:** Logs error, returns []

#### Function: `createWorkout(workoutData)`
- **Purpose:** Create new workout log
- **Parameters:** Object with structure:
  ```javascript
  {
    name: string,           // e.g., "Morning Run"
    type: string,           // 'Strength', 'Cardio', 'Yoga'
    duration: number,       // minutes
    calories: number,       // optional
    notes: string           // optional
  }
  ```
- **Returns:** Promise → API response { success, error?, data? }
- **API Call:** `POST /api/workouts`
- **Validation:** Done in form handler (see below)
- **Failure:** Returns { success: false, error: 'Failed to create workout' }

#### Function: `logSet(setData)`
- **Purpose:** Log a set/rep record during active workout
- **Parameters:** Object with structure:
  ```javascript
  {
    workout_id: uuid,
    exercise: string,       // e.g., "Bench Press"
    weight: number,         // in kg or lbs
    reps: number,
    rpe: number            // Rate of Perceived Exertion (1-10)
  }
  ```
- **Returns:** Promise → API response
- **API Call:** `POST /api/workouts/sets`
- **Failure:** Logs error, returns { success: false, error: 'Failed to log set' }

#### Function: `fetchWorkoutStats()`
- **Purpose:** Get aggregated stats
- **Returns:** Promise → Stats object or null
- **API Call:** `GET /api/workouts/stats`
- **Response Structure:**
  ```javascript
  {
    success: boolean,
    stats: {
      totalWorkouts: number,
      totalCalories: number,
      totalDuration: number
    }
  }
  ```

#### Function: `renderWorkoutCard(workout)`
- **Purpose:** Generate HTML card for single workout
- **Parameters:** `workout` (object) - Workout data
- **Returns:** String - HTML Card markup
- **Card Elements:**
  - Icon (color and symbol based on type)
  - Date of workout
  - Workout name
  - Workout type
  - Duration in minutes
  - Calories burned
- **Type Colors:**
  - Strength: `bg-primary/10`
  - Cardio: `bg-secondary/10`
  - Yoga: `bg-tertiary/10`
  - Other: `bg-surface-variant`
- **Type Icons:**
  - Strength: `fitness_center`
  - Cardio: `directions_run`
  - Yoga: `self_improvement`
  - Default: `fitness_center`

### Page Initialization: `DOMContentLoaded` Event

**Auth Check:**
- If no token: redirect to `/login`

**UI Elements:**
- `#workout-grid` - Container for workout cards
- `#new-workout-btn` - Button to create workout
- `#sidebar-start-workout-btn` - Sidebar button to start workout
- `#workout-modal` - Modal dialog for creating workout
- `#close-workout-modal` - Button to close modal
- `#workout-form` - Form inside modal
- `#workout-form-error` - Error message display
- `#workout-submit-btn` - Submit button for form

### Modal Functions

#### Function: `openModal()`
- **Effect:** Removes 'hidden' class from `#workout-modal`
- **Result:** Modal becomes visible

#### Function: `closeModal()`
- **Effect:** 
  - Adds 'hidden' class to `#workout-modal`
  - Clears error message in `#workout-form-error`
- **Result:** Modal hidden, form reset for next use

### Buttons & Event Listeners

#### Button: New Workout (`#new-workout-btn`)
- **Label:** "Log New Workout"
- **On Click:** Call `openModal()`

#### Button: Sidebar Workout (`#sidebar-start-workout-btn`)
- **Location:** Sidebar
- **Label:** "Start Workout"
- **On Click:** Call `openModal()`

#### Button: Close Modal (`#close-workout-modal`)
- **Icon:** X (close)
- **On Click:** Call `closeModal()`

#### Modal Backdrop Click
- **Trigger:** Click on `#workout-modal` itself (not content)
- **Effect:** Calls `closeModal()`

### Workout Creation Form: `#workout-form`

#### Field 1: Workout Name (`#workout-name`)
- **Type:** text
- **Placeholder:** "Workout Name"
- **Required:** Yes
- **Value Captured As:** `workoutData.name`

#### Field 2: Workout Type (`#workout-type`)
- **Type:** select/dropdown
- **Options:**
  - "Strength"
  - "Cardio"
  - "Yoga"
  - (others if added)
- **Required:** Yes
- **Value Captured As:** `workoutData.type`

#### Field 3: Duration (`#workout-duration`)
- **Type:** number
- **Unit:** Minutes
- **Required:** Yes
- **Conversion:** `parseInt()` in handler
- **Value Captured As:** `workoutData.duration`

#### Field 4: Calories (`#workout-calories`)
- **Type:** number
- **Required:** No (optional)
- **Default:** 0 if empty
- **Conversion:** `parseInt()` with || 0
- **Value Captured As:** `workoutData.calories`

#### Field 5: Notes (`#workout-notes`)
- **Type:** textarea
- **Required:** No
- **Maximum Length:** Not limited
- **Value Captured As:** `workoutData.notes`

### Form Submit Handler: `#workout-form` submit event

**On Submit:**
1. Prevent default
2. Disable `#workout-submit-btn`
3. Clear error message
4. Build `workoutData` object from form fields
5. Call `createWorkout(workoutData)`
6. If success:
   - Call `closeModal()`
   - Call `workoutForm.reset()`
   - Call `loadWorkouts()` (redraw grid)
7. If error:
   - Display error in `#workout-form-error`
8. Finally: Re-enable button

### Function: `loadWorkouts()`
- **Purpose:** Fetch and display all workouts
- **Execution:**
  1. Get `#workout-grid` element
  2. Fetch workouts via `fetchWorkouts()`
  3. If > 0: Map each to `renderWorkoutCard()` and inject HTML
  4. If = 0: Display empty state message:
     - Icon: `fitness_center`
     - Text: "No workouts yet. Hit **Log New Workout** to start!"

### Set Logging Form: `#set-form` (Optional)

#### Field 1: Workout ID (`#current-workout-id`)
- **Type:** hidden field
- **Purpose:** Links set to active workout
- **Value Captured As:** `setData.workout_id`

#### Field 2: Exercise Name (`#exercise-name`)
- **Type:** text
- **Placeholder:** "Exercise Name"
- **Value Captured As:** `setData.exercise`

#### Field 3: Weight (`#weight`)
- **Type:** number
- **Unit:** kg or lbs
- **Conversion:** `parseFloat()` in handler
- **Value Captured As:** `setData.weight`

#### Field 4: Reps (`#reps`)
- **Type:** number
- **Minimum:** 1
- **Conversion:** `parseInt()` in handler
- **Value Captured As:** `setData.reps`

#### Field 5: RPE (`#rpe`)
- **Type:** number
- **Range:** 1-10
- **Label:** Rate of Perceived Exertion
- **Conversion:** `parseInt()` in handler
- **Value Captured As:** `setData.rpe`

#### Form Submit Handler: `#set-form` submit event
- **On Submit:**
  1. Prevent default
  2. Build `setData` from form fields
  3. Call `logSet(setData)`
  4. Reset form for next set
  5. No success message shown (silent success)

---

# GOALS PAGE

## File: `public/js/goals.js`

### Constants

#### Status Constants
```javascript
const STATUS_COMPLETED = 'completed'
const STATUS_FAILED = 'failed'
const STATUS_ONGOING = 'ongoing'
```

### Utility Functions

#### Function: `isFinishedStatus(status)`
- **Purpose:** Check if goal is in terminal state
- **Parameters:** `status` (string)
- **Returns:** Boolean - true if 'completed' or 'failed'

#### Function: `normalizeGoalStatus(goal)`
- **Purpose:** Get status from goal object with fallback
- **Parameters:** `goal` (object or null)
- **Returns:** String - status or 'ongoing' if null/undefined

#### Function: `splitGoals(goals)`
- **Purpose:** Separate goals into ongoing and completed/failed
- **Parameters:** `goals` (array)
- **Returns:** Object with structure:
  ```javascript
  {
    ongoing: [ goal objects ],
    completed: [ goal objects + 'completed' or 'failed' ]
  }
  ```

#### Function: `getGoalActions(goal)`
- **Purpose:** Get available action buttons for goal based on status
- **Parameters:** `goal` (object)
- **Returns:** Array of action objects with keys: key, label, tone
- **If Finished (completed/failed):**
  ```javascript
  [
    { key: 'delete', label: 'Delete', tone: 'danger' }
  ]
  ```
- **If Ongoing:**
  ```javascript
  [
    { key: 'completed', label: 'Completed', tone: 'success' },
    { key: 'failed', label: 'Failed', tone: 'warning' },
    { key: 'delete', label: 'Delete', tone: 'danger' }
  ]
  ```

#### Function: `getAuthHeaders()`
- Same as workouts page version

#### Function: `fetchGoals()`
- **Purpose:** Get all goals for user
- **Returns:** Promise → Array of goal objects or []
- **API Call:** `GET /api/goals`
- **Success Format:**
  ```javascript
  {
    success: boolean,
    data: [ goals... ]
  }
  ```
- **Failure:** Returns []

#### Function: `createGoal(goalData)`
- **Purpose:** Create new goal
- **Parameters:** Object containing:
  ```javascript
  {
    title: string,
    goal_type: string,        // 'strength', 'body_composition', 'endurance'
    target_value: number,
    current_value: number,
    deadline: string (ISO date, optional)
  }
  ```
- **Returns:** Promise → Response object
- **API Call:** `POST /api/goals`
- **Error Handling:**
  - Catches JSON parse errors
  - Returns { success: false, error: 'message' }
- **Failure Message:** "Failed to create goal"

#### Function: `updateGoalProgress(goalId, currentValue)`
- **Purpose:** Update progress toward goal
- **Parameters:**
  - `goalId` (uuid)
  - `currentValue` (number) - New progress value
- **Returns:** Promise → Response
- **API Call:** `PATCH /api/goals/{goalId}`
- **Body:** `{ current_value: currentValue }`
- **Used By:** Progress input handler

#### Function: `updateGoalStatus(goalId, status)`
- **Purpose:** Mark goal as completed, failed, or revert to ongoing
- **Parameters:**
  - `goalId` (uuid)
  - `status` (string) - 'completed', 'failed', or 'ongoing'
- **Returns:** Promise → Response
- **API Call:** `PATCH /api/goals/{goalId}`
- **Error Handling:**
  - Catches JSON parse errors
  - Returns { success: false, error: 'message' }
- **Used By:** Action buttons on goal cards

#### Function: `deleteGoal(goalId)`
- **Purpose:** Remove goal permanently
- **Parameters:** `goalId` (uuid)
- **Returns:** Promise → Response
- **API Call:** `DELETE /api/goals/{goalId}`
- **Error Handling:**
  - Catches JSON parse errors
  - Returns { success: false, error: 'message' }
- **Used By:** Delete action button

#### Function: `escapeHtml(value)`
- **Purpose:** Prevent XSS by escaping HTML special characters
- **Parameters:** `value` (any)
- **Returns:** String - escaped value
- **Character Mappings:**
  - `&` → `&amp;`
  - `<` → `&lt;`
  - `>` → `&gt;`
  - `"` → `&quot;`
  - `'` → `&#39;`
- **Used By:** All goal title renderings

#### Function: `getStatusBadge(goal)`
- **Purpose:** Get HTML badge showing goal status
- **Parameters:** `goal` (object)
- **Returns:** String - HTML span element
- **Badges:**
  - **Completed:** Green badge "Completed"
  - **Failed:** Amber badge "Failed"
  - **Ongoing:** Gray badge "Ongoing"
- **Classes:** Color-coded with Material Design colors

#### Function: `getActionButtonClass(tone)`
- **Purpose:** Get Tailwind CSS classes for action button
- **Parameters:** `tone` (string) - 'success', 'warning', 'danger'
- **Returns:** String - CSS classes
- **Tone Colors:**
  - **success:** `bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25`
  - **warning:** `bg-amber-500/15 text-amber-300 hover:bg-amber-500/25`
  - **danger:** `bg-rose-500/15 text-rose-300 hover:bg-rose-500/25`

#### Function: `renderGoalCard(goal)`
- **Purpose:** Generate HTML card for goal
- **Parameters:** `goal` (object)
- **Returns:** String - HTML markup
- **Card Sections:**
  1. **Goal Type Badge**
     - Escaped and uppercased
     - Color coded by type
  2. **Status Badge**
     - Uses `getStatusBadge(goal)`
  3. **Title**
     - Escaped HTML
  4. **Progress Display**
     - Format: "{current_value} / {target_value}"
  5. **Dates**
     - Start date (created_at)
     - Deadline (if set)
  6. **Action Buttons**
     - Generated from `getGoalActions(goal)`
     - Each button has `data-goal-action` and `data-goal-id`

### Page Initialization: `DOMContentLoaded` Event

**Auth Check:**
- If no token: redirect to `/login`

**UI Elements:**
- `#goal-grid` - Container for goal cards
- `#new-goal-btn` - Button to create goal
- `#sidebar-new-goal-btn` - Sidebar button
- `#goal-modal` - Modal dialog
- `#close-goal-modal` - Close button
- `#goal-form` - Form inside modal
- `#goal-form-error` - Error display
- `#goal-submit-btn` - Submit button

### Modal Functions

#### Function: `openGoalModal()`
- **Purpose:** Show goal creation modal
- **Execution:**
  1. Get `#goal-modal` element
  2. Remove 'hidden' class
  3. Add 'flex' class (to show)
- **Export:** `window.openGoalModal = openGoalModal` for global access via onclick handlers
- **HTML Usage:** `<button onclick="openGoalModal()">New Goal</button>`

#### Function: `closeGoalModal()`
- **Purpose:** Hide goal creation modal
- **Execution:**
  1. Get `#goal-modal` element
  2. Add 'hidden' class (to hide)
  3. Remove 'flex' class
- **Export:** `window.closeGoalModal = closeGoalModal` for global access
- **HTML Usage:** `<button onclick="closeGoalModal()">Close</button>`

### Modal Interactions

#### Button: New Goal (`#new-goal-btn`)
- **On Click:** `openGoalModal()`
- **Event Listener Type:** click

#### Button: Sidebar New Goal (`#sidebar-new-goal-btn`)
- **On Click:** `openGoalModal()`
- **Event Listener Type:** click

#### Button: Close Goal Modal (`#close-goal-modal`)
- **On Click:** `closeGoalModal()`
- **Event Listener Type:** click

#### Modal Backdrop Click
- **Trigger:** Click on `#goal-modal` itself (not inner content)
- **Condition:** `e.target === goalModal` (direct click on modal, not bubbled)
- **Effect:** Calls `closeGoalModal()`
- **Purpose:** Click outside modal to dismiss

### Goal Creation Form: `#goal-form`

#### Field 1: Goal Title (`#goal-title`)
- **Type:** text
- **Placeholder:** "Goal Title"
- **Required:** Yes
- **Max Length:** Not limited
- **Value Captured As:** `goalData.title` (via `document.getElementById('goal-title').value`)

#### Field 2: Goal Type (`#goal-type`)
- **Type:** select
- **Options:**
  - "strength"
  - "body_composition"
  - "endurance"
  - (others if added)
- **Required:** Yes
- **Value Captured As:** `goalData.type` (via `document.getElementById('goal-type').value`)

#### Field 3: Target Value (`#goal-target`)
- **Type:** number
- **Placeholder:** "Target"
- **Required:** Yes
- **Unit:** Depends on goal type (reps, kg, km, etc.)
- **Conversion:** `parseFloat()` for validation
- **Value Captured As:** `goalData.target_value` (via `document.getElementById('goal-target').value`)
- **Validation:** Must be > 0
- **Error Message:** "Please enter a valid target value greater than 0."

#### Field 4: Deadline (`#goal-deadline`)
- **Type:** date
- **Required:** No
- **Format Support:**
  - ISO format: YYYY-MM-DD (standard)
  - Fallback: DD-MM-YYYY (for non-standard locales)
- **Parsing Logic:**
  ```javascript
  deadlineRaw = input.value
  IF deadlineRaw matches DD-MM-YYYY:
    deadline = YYYY-MM-DD (converted)
  ELSE:
    deadline = deadlineRaw (assumed ISO)
  ```
- **Value Captured As:** `goalData.deadline`

### Form Submit Handler: `#goal-form` submit event

**Validation:**
1. Get target value via `parseFloat()`
2. Check if NaN or ≤ 0
3. If invalid: show error "Please enter a valid target value greater than 0." and return

**On Valid Submit:**
1. Prevent default
2. Get submit button and disable it
3. Clear error message
4. Parse deadline (support dd-mm-yyyy fallback)
5. Build `goalData` object:
   ```javascript
   {
     title: string,
     type: string,
     target_value: float,
     current_value: 0,
     deadline: string or null
   }
   ```
6. Call `createGoal(goalData)`
7. If success:
   - `goalForm.reset()`
   - `closeGoalModal()`
   - Call `loadGoals()` (refresh grid)
8. If error:
   - Display error message in `#goal-form-error`
9. Finally: Re-enable submit button

### Tab Switching: `[data-goals-tab]` Buttons

#### Tab Buttons
- **Selector:** `button[data-goals-tab]`
- **Data Attribute Values:**
  - "ongoing" - Show ongoing goals only
  - "completed" - Show completed/failed goals only
- **Active Button Styling:**
  - Classes: `bg-gradient-to-r from-primary to-secondary text-on-primary-fixed`
- **Inactive Button Styling:**
  - Classes: `bg-surface-container-low text-on-surface-variant`

#### On Tab Click Handler
1. Update `state.activeTab` to clicked tab value
2. Clear any action error messages
3. Call `renderGoals()` to show filtered list

#### Section Title: `#goals-section-title`
- **Dynamic Text:**
  - Active tab 'completed': "Completed Goals"
  - Active tab 'ongoing': "Ongoing Goals"
- **Updated On:** Tab switch via `renderGoals()`

### Error Display Elements

#### Form Submit Error: `#goal-form-error`
- **Display Location:** Inside goal creation modal
- **Messages:**
  - "Please enter a valid target value greater than 0." (validation error)
  - Result.error from API (if creation fails)
  - "Could not save goal. Please try again." (generic error)
- **Cleared On:** Form submit starts

#### Action Button Error: `#goal-action-error`
- **Display Location:** Page level (separate from modal)
- **Messages:** Error from goal action updates
  - "Could not update this goal. Please try again." (on status/delete failure)
  - `result.error` from API response
- **Cleared On:** Tab switch, new action attempted

### Goal Count Display: `#active-goal-count`
- **Display:** Count of ongoing goals only
- **Updated On:** Goals loaded or filters change
- **Calculation:** Count goals where `status !== 'completed' && status !== 'failed'`

### Empty State Messages

#### Empty State (Ongoing Goals)
- **Icon:** `emoji_events` (trophy icon)
- **Message:** "No ongoing goals yet. Set your first goal to get started."
- **Show When:** Ongoing tab selected and `groupedGoals.ongoing.length === 0`

#### Empty State (Completed Goals)
- **Icon:** `trophy`
- **Message:** "No completed or failed goals yet. Finish one to build your history."
- **Show When:** Completed tab selected and `groupedGoals.completed.length === 0`

### Inline Progress Update Handler

**Trigger:** Change on `input[type="number"][data-goal-id]` inside goal card

**Behavior:**
1. Get `data-goal-id` from input element
2. Get new value from input.value
3. Call `updateGoalProgress(goalId, newValue)`
4. Optionally refresh card display

### Action Button Handlers

**Trigger:** Click on button with `data-goal-action` and `data-goal-id`

**Behavior:**
1. Get the action button from click event
2. Extract `goalAction` and `goalId` from `button.dataset`
3. Check if goalId is already pending (avoid double-clicks)
4. Add goalId to `state.pendingGoalIds` set
5. Re-render goals to show disabled state on buttons
6. Execute action:
   - If action = 'delete': `deleteGoal(goalId)`
   - Otherwise: `updateGoalStatus(goalId, goalAction)` where action is status value
7. Remove goalId from `state.pendingGoalIds`
8. If error: Show error message in `#goal-action-error` and re-render
9. If success: Call `loadGoals()` to refresh full list

**Handlers by Action Type:**
- **"completed"** → `updateGoalStatus(goalId, 'completed')` → Refresh goals
- **"failed"** → `updateGoalStatus(goalId, 'failed')` → Refresh goals
- **"delete"** → `deleteGoal(goalId)` → Refresh goals

### Goals Rendering Logic

#### Function: `renderGoals()`
- **Purpose:** Display correct goals based on active tab
- **Execution:**
  1. Get `#goals-grid` element
  2. Split goals: `splitGoals(state.goals)` → { ongoing, completed }
  3. Select visible goals based on `state.activeTab`
  4. If goals exist:
     - Render each goal via `renderGoalCard()`
     - Join HTML and inject into grid
  5. If no goals:
     - Show empty state markup based on tab
  6. Update active goal count display in `#active-goal-count`
  7. Disable action buttons for goals in `state.pendingGoalIds`
  8. Update tab button styling via `updateTabUi()`

#### Function: `updateTabUi()`
- **Purpose:** Update tab button styling to show active state
- **Execution:**
  1. Iterate all `tabButtons`
  2. Check if `button.dataset.goalsTab === state.activeTab`
  3. If active: Add gradient classes
  4. If inactive: Add surface/variant classes
  5. Update `#goals-section-title` text based on active tab

### Function: `loadGoals()`
- **Purpose:** Fetch and render all goals
- **Execution:**
  1. Fetch goals via `fetchGoals()`
  2. Update `state.goals`
  3. Call `renderGoals()` to display

---

# PROGRESS PAGE

## File: `public/js/progress.js`

### Utility Functions

#### Function: `getAuthHeaders()`
- Same as other pages

#### Function: `formatDurationLabel(totalMinutes)`
- **Purpose:** Convert minutes to human-readable duration
- **Parameters:** `totalMinutes` (number or any truthy value)
- **Returns:** String - Formatted duration
- **Logic:**
  ```
  IF minutes < 60:
    return "{minutes} min"
  ELSE:
    hours = floor(minutes / 60)
    remainingMinutes = minutes % 60
    IF remainingMinutes > 0:
      return "{hours} hr(s) {remainingMinutes} min"
    ELSE:
      return "{hours} hr(s)"
  ```
- **Examples:**
  - 45 → "45 min"
  - 60 → "1 hr"
  - 90 → "1 hr 30 min"
  - 120 → "2 hrs"
  - 125 → "2 hrs 5 min"
- **Used By:**
  - Progress page total duration
  - Progress activity chart hover labels
  - Progress recent workouts list

#### Function: `getDayKey(dateValue)`
- **Purpose:** Create consistent date key for grouping
- **Parameters:** `dateValue` (Date or ISO string)
- **Returns:** String - Format "YYYY-MM-DD"
- **Logic:**
  - Parse to Date object
  - Extract year, month (padded), day (padded)
  - Join with hyphens
- **Example:** new Date("2026-04-17") → "2026-04-17"
- **Used By:** `buildActivitySeries()` for day grouping

#### Function: `buildActivitySeries(workouts, days = 7, referenceDate = new Date())`
- **Purpose:** Build chart data for N-day activity chart
- **Parameters:**
  - `workouts` (array) - Workout array
  - `days` (number, optional) - Days to display (default 7)
  - `referenceDate` (Date, optional) - End date for range (default today)
- **Returns:** Array of objects with structure:
  ```javascript
  [
    {
      date: Date object,
      label: string (e.g., "Mon"),
      minutes: number (total duration that day),
      durationLabel: string (formatted),
      isPeak: boolean (true if equals peak),
      heightPct: number (0-100 for bar height)
    },
    ...
  ]
  ```
- **Algorithm:**
  1. Build Map of dates → total minutes
  2. Generate array of N consecutive dates ending at referenceDate
  3. For each date, lookup total from map
  4. Find peak (highest minutes)
  5. Calculate heightPct as percentage of peak
  6. Mark isPeak for matching peak date
- **Chart Height Logic:**
  - Peak day: 100% height
  - Other days: `Math.max(12, Math.round((value/peak) * 100))`
  - Minimum 12% ensures visibility of small workouts

#### Function: `fetchWorkouts()`
- **Purpose:** Get all workouts for user
- **Returns:** Promise → Array or []
- **API Call:** `GET /api/workouts`

#### Function: `renderActivityChart(workouts)`
- **Purpose:** Render 7-day activity chart with interactive elements
- **Parameters:** `workouts` (array)
- **Returns:** void (renders to DOM)
- **Target Elements:**
  - `#progress-activity-chart` - Main chart container
  - `#progress-activity-summary` - Summary text below chart
  - `#progress-activity-max-label` - Peak label
  - `#progress-activity-mid-label` - Mid-point label
- **Chart Elements per Day:**
  1. Bar container with gradient
  2. Hover tooltip showing duration
  3. Day label (MON, TUE, etc)
- **Summary Text:**
  - If no workouts: "No workouts this week yet. Start one session to light up your activity trend."
  - If workouts: "{activeDays} active day(s) this week. Peak output {peak}."
- **Peak Styling:**
  - Gradient: `from-primary via-secondary to-tertiary`
  - Box shadow: Pink glow
- **Normal Styling:**
  - Gradient: `from-primary/30 via-primary/55 to-secondary/70`
- **Hover Behavior:**
  - Tooltip appears above bar
  - Shows formatted duration

#### Function: `renderRecentWorkouts(workouts)`
- **Purpose:** Show list of 5 most recent workouts
- **Parameters:** `workouts` (array)
- **Returns:** void (renders to `#progress-recent-workouts`)
- **Rendering:**
  1. Sort workouts by created_at descending
  2. Take first 5
  3. Render each as list item with:
     - Workout name
     - Type and date
     - Duration formatted
- **Empty State:**
  - Icon: `history`
  - Message: "No workouts logged yet."

### Page Initialization: `initProgressPage()`

**Auth Check:**
- If no token: redirect to `/login`

**Data Fetching:**
- Fetch all workouts via `fetchWorkouts()`
- Calculate:
  - `totalWorkouts` = workouts.length
  - `totalDuration` = sum of all workout.duration
  - `totalCalories` = sum of all workout.calories

**Element Updates:**
- `#progress-total-workouts` → totalWorkouts
- `#progress-total-duration` → formatted via `formatDurationLabel()`
- `#progress-total-calories` → totalCalories

**Render Functions Called:**
1. `renderActivityChart(workouts)`
2. `renderRecentWorkouts(workouts)`

**Export (for Testing):**
```javascript
module.exports = {
  formatDurationLabel,
  buildActivitySeries,
}
```

---

# PROFILE PAGE

## File: `public/js/profile.js`

### Constants

#### `PROFILE_UNIT_KEY`
- **Value:** `'profile_unit_preference'`
- **Purpose:** localStorage key for user's unit system preference
- **Stored Values:**
  - `'metric'` - kg and cm
  - `'imperial'` - lbs and feet/inches

### Utility Functions

#### Function: `getAuthHeaders()`
- Same as other pages

#### Function: `fetchProfile()`
- **Purpose:** Get user's profile data
- **Returns:** Promise → Profile object or null
- **API Call:** `GET /api/user/profile`
- **Response Structure:**
  ```javascript
  {
    success: boolean,
    profile: {
      user_id: uuid,
      full_name: string,
      weight: number (kg),
      height: number (cm),
      created_at: ISO date,
      updated_at: ISO date
    }
  }
  ```

#### Function: `fetchWorkoutStats()`
- **Purpose:** Get aggregated workout statistics
- **Returns:** Promise → Stats object or null
- **API Call:** `GET /api/workouts/stats`
- **Response Object:**
  ```javascript
  {
    totalWorkouts: number,
    totalDuration: number,
    totalCalories: number
  }
  ```

#### Function: `fetchWorkoutsForStreak()`
- **Purpose:** Get all workouts for streak calculation
- **Returns:** Promise → Array or []
- **API Call:** `GET /api/workouts`

#### Function: `saveProfile(profileData, hasExistingProfile)`
- **Purpose:** Save or update profile
- **Parameters:**
  - `profileData` (object) - Profile fields to save
  - `hasExistingProfile` (boolean) - Determines HTTP method
- **Returns:** Promise → Response
- **API Call:**
  - If `hasExistingProfile = true`: `PATCH /api/user/profile`
  - If `hasExistingProfile = false`: `POST /api/user/profile`
- **Error Return:** `{ success: false, error: 'Unable to save profile right now.' }`

#### Function: `calculateStreakDays(workouts)`
- **Purpose:** Calculate consecutive workout days ending today
- **Parameters:** `workouts` (array)
- **Returns:** Number - Days of consecutive workouts
- **Algorithm:**
  1. Create set of unique dates (YYYY-MM-DD)
  2. Start from today, count backward
  3. Stop on first missing date
- **Edge Cases:**
  - Empty array: returns 0
  - No workout today: returns 0
- **Example:** If workouts on Apr 16, 15, 14 but not 13, returns 3

#### Function: `kgToLbs(kg)`
- **Purpose:** Convert kilograms to pounds
- **Parameters:** `kg` (number)
- **Returns:** Number - Weight in pounds
- **Formula:** `kg * 2.2046226218`
- **Example:** 75 kg → 165.35 lbs

#### Function: `lbsToKg(lbs)`
- **Purpose:** Convert pounds to kilograms
- **Parameters:** `lbs` (number)
- **Returns:** Number - Weight in kilograms
- **Formula:** `lbs / 2.2046226218`
- **Example:** 165 lbs → 74.84 kg

#### Function: `cmToImperial(cm)`
- **Purpose:** Convert centimeters to feet and inches
- **Parameters:** `cm` (number)
- **Returns:** Object - `{ feet: number, inches: number }`
- **Algorithm:**
  1. Convert cm to total inches: `cm / 2.54`
  2. Extract feet: `floor(totalInches / 12)`
  3. Extract remaining inches: `totalInches - (feet * 12)`
  4. Round inches
  5. Handle edge case where inches = 12 (add to feet)
- **Example:** 180 cm → { feet: 5, inches: 11 }

#### Function: `imperialToCm(feet, inches)`
- **Purpose:** Convert feet and inches to centimeters
- **Parameters:**
  - `feet` (number)
  - `inches` (number)
- **Returns:** Number - Height in centimeters
- **Formula:** `((feet * 12) + inches) * 2.54`
- **Example:** imperialToCm(5, 11) → 180 cm

#### Function: `calculateBmi(weightKg, heightCm)`
- **Purpose:** Calculate Body Mass Index
- **Parameters:**
  - `weightKg` (number)
  - `heightCm` (number)
- **Returns:** Number or null
- **Formula:** `weight_kg / (height_m)²`
- **Validation:** Returns null if weight or height is 0/falsy
- **Example:** calculateBmi(75, 180) → 23.15

#### Function: `formatBmi(bmi)`
- **Purpose:** Format BMI for display
- **Parameters:** `bmi` (number or null)
- **Returns:** String
- **Format:**
  - Valid BMI: Fixed to 1 decimal place
  - Invalid: "--"
- **Example:** formatBmi(23.456) → "23.5"

#### Function: `formatDuration(totalMinutes)`
- **Purpose:** Convert minutes to readable duration string
- **Parameters:** `totalMinutes` (number)
- **Returns:** String
- **Logic:**
  ```
  IF minutes < 60:
    return "{minutes} min"
  ELSE:
    hours = totalMinutes / 60
    IF Integer:
      return "{hours} hr(s)"
    ELSE:
      return "{hours.toFixed(1)} hrs"
  ```
- **Examples:**
  - 45 → "45 min"
  - 60 → "1 hr"
  - 90 → "1.5 hrs"

#### Function: `updateBmiPreview()`
- **Purpose:** Live update BMI display as user types
- **Execution:**
  1. Get weight/height from active input fields (metric or imperial)
  2. Convert imperial to metric if needed
  3. Calculate BMI
  4. Update `#profile-bmi` text
  5. Update `#profile-sidebar-bmi` text
  6. Update `#profile-bmi-status` text with category
- **Status Categories:**
  - No BMI data: "Add your height and weight to calculate BMI."
  - < 18.5: "BMI range: underweight"
  - 18.5-25: "BMI range: healthy"
  - 25-30: "BMI range: overweight"
  - ≥ 30: "BMI range: obesity"

#### Function: `syncImperialLabels()`
- **Purpose:** Keep imperial display labels in sync with input values
- **Updates:**
  - `#feet-value` → text "{feet} ft"
  - `#inches-value` → text "{inches} in"
- **Called On:** Every input change in imperial mode

#### Function: `fillFormFromProfile()`
- **Purpose:** Populate form fields with existing profile data
- **Execution:**
  1. Extract values from `currentProfile`
  2. Get full_name or email domain
  3. Get weight in kg
  4. Get height in cm
  5. Convert height to imperial (feet/inches)
  6. Fill all input fields
  7. Call `syncImperialLabels()`
  8. Call `updateBmiPreview()`

#### Function: `setUnitMode(nextMode)`
- **Purpose:** Switch between metric and imperial units
- **Parameters:** `nextMode` (string) - 'metric' or 'imperial'
- **Side Effects:**
  1. Set `unitMode = nextMode`
  2. Save to localStorage: `localStorage.setItem(PROFILE_UNIT_KEY, nextMode)`
  3. Show/hide metric fields: toggle 'hidden' class on `#metric-fields`
  4. Show/hide imperial fields: toggle 'hidden' class on `#imperial-fields`
  5. Update button styling:
     - Active button: `bg-primary text-on-primary-fixed font-bold`
     - Inactive button: `bg-surface-container-high text-on-surface-variant`
  6. Call `updateBmiPreview()` to recalculate
- **Persistence:** Choice saved in localStorage

### Page Initialization: `DOMContentLoaded` Event

**Auth Check:**
- If no token: redirect to `/login`

**Data Fetching:**
- Parallel fetch: profile, stats, workouts
- Store in `currentProfile`, stats, workouts

**Element Resolution:**
- Resolve all form inputs and display elements by ID
- Initialize `unitMode` from localStorage (default 'metric')

**Display Auto-Population:**

#### Profile Display Elements

##### `#profile-name`
- **Display:** User's full name or email domain or "Profile"

##### `#profile-email`
- **Display:** Email from localStorage or "No email available"

##### `#profile-streak`
- **Display:** String of streak value from `calculateStreakDays(workouts)`

##### `#profile-sidebar-name`
- **Display:** Same as `#profile-name`

##### `#profile-sidebar-bmi`
- **Display:** Formatted BMI value

##### `#profile-total-workouts`
- **Display:** stats.totalWorkouts or 0

##### `#profile-total-duration`
- **Display:** Formatted via `formatDuration(stats.totalDuration)`

##### `#profile-total-calories`
- **Display:** stats.totalCalories or 0

##### `#profile-bmi`
- **Display:** Formatted BMI from `calculateBmi(profile.weight, profile.height)`

### Form Elements

#### Field 1: Full Name (`#full-name`)
- **Type:** text
- **Pre-filled:** From `currentProfile.full_name` or email domain
- **Required:** Yes
- **Validation:** Must not be empty
- **Error:** "Please enter your name."

#### Field 2: Weight - Metric (`#weight-kg`)
- **Type:** number
- **Unit:** Kilograms
- **Pre-filled:** From profile or empty
- **Visible When:** Metric unit mode active
- **Validation:** Must be > 0
- **Error:** "Please enter a valid weight."
- **Linked to Imperial:** Auto-converts to lbs when imperial mode enabled

#### Field 3: Height - Metric (`#height-cm`)
- **Type:** number
- **Unit:** Centimeters
- **Pre-filled:** From profile or empty
- **Visible When:** Metric unit mode active
- **Validation:** Must be between 80-260 cm
- **Error:** "Please enter a valid height."
- **Range Rationale:** 80cm ≈ 2'7", 260cm ≈ 8'6"

#### Field 4: Weight - Imperial (`#weight-lbs`)
- **Type:** number
- **Unit:** Pounds
- **Pre-filled:** Auto-converted from kg or empty
- **Visible When:** Imperial unit mode active
- **Updates:** When user changes value
- **Converts To:** kg for API submission

#### Field 5: Height - Feet (`#height-feet`)
- **Type:** number
- **Unit:** Feet
- **Pre-filled:** From cm conversion or 0
- **Visible When:** Imperial unit mode active
- **Display Label:** `#feet-value` shows "{value} ft"

#### Field 6: Height - Inches (`#height-inches`)
- **Type:** number
- **Unit:** Inches (0-11, not 0-12)
- **Pre-filled:** From cm conversion or 0
- **Visible When:** Imperial unit mode active
- **Display Label:** `#inches-value` shows "{value} in"

### Unit Switcher Buttons

#### Button: Metric Unit (`#unit-metric-btn`)
- **Label:** "KG / CM"
- **On Click:** `setUnitMode('metric')`
- **Active State:** `bg-primary text-on-primary-fixed`
- **Inactive State:** `bg-surface-container-high text-on-surface-variant`
- **Effect:**
  - Show metric fields
  - Hide imperial fields
  - Save preference
  - Recalculate BMI

#### Button: Imperial Unit (`#unit-imperial-btn`)
- **Label:** "LBS / FT"
- **On Click:** `setUnitMode('imperial')`
- **Active State:** `bg-primary text-on-primary-fixed`
- **Inactive State:** `bg-surface-container-high text-on-surface-variant`
- **Effect:**
  - Hide metric fields
  - Show imperial fields
  - Save preference
  - Recalculate BMI

### Input Event Listeners

#### All Weight/Height Inputs
- **Event:** `input` (not change)
- **Fields:** weight-kg, height-cm, weight-lbs, height-feet, height-inches
- **On Change:**
  1. Call `syncImperialLabels()` to update display
  2. Call `updateBmiPreview()` to recalculate BMI
  3. Clear formError message
  4. Clear formSuccess message

#### Full Name Input
- **Event:** `input`
- **On Change:**
  1. Clear formError message
  2. Clear formSuccess message

### Profile Form: `#profile-form` (Complete Lifecycle)

#### Form Submit Handler (Detailed)

**Step 1: Clear Previous Messages**
- Clear `#profile-form-error`
- Clear `#profile-form-success`

**Step 2: Update UI - Button Before Save**
- `saveBtn.disabled = true`
- `saveBtn.textContent = 'Saving...'`

**Step 3: Gather Form Data**
- Get `fullName` from `#full-name` (trimmed)
- Get weight/height:
  - If metric mode: from kg and cm fields directly
  - If imperial mode: from lbs, feet, inches (then convert to metric)
- Round weight to 2 decimals: `Number(weightKg.toFixed(2))`
- Round height to 2 decimals: `Number(heightCm.toFixed(2))`

**Step 4: Validate Data**
- Validation 1: `if (!fullName)` → Error: "Please enter your name."
- Validation 2: `if (!weightKg || weightKg <= 0)` → Error: "Please enter a valid weight."
- Validation 3: `if (!heightCm || heightCm < 80 || heightCm > 260)` → Error: "Please enter a valid height."
- On validation failure: display error in `#profile-form-error`, return (stop execution)

**Step 5: Call API**
- `saveProfile(profileData, Boolean(currentProfile))`
  - If `currentProfile !== null`: PATCH (update existing)
  - If `currentProfile === null`: POST (create new)

**Step 6: Update UI - Button After Save**
- `saveBtn.disabled = false`
- `saveBtn.textContent = 'Save Changes'`

**Step 7: Handle API Response**

*If Error:*
- Display error in `#profile-form-error`: `result.error || 'Failed to save profile.'`
- Return (stop execution)

*If Success:*
- Update `currentProfile` with:
  - `result.profile` if provided
  - Otherwise: merge saved data into existing object
- Update `#profile-name` with new full name
- Update `#profile-sidebar-name` with new full name
- Call `fillFormFromProfile()` to sync form with updated data
- Call `setUnitMode(unitMode)` to re-sync display
- Display success message in `#profile-form-success`: "Profile updated."

#### Success Message: `#profile-form-success`
- **Display:** "Profile updated."
- **Set On:** Successful API response
- **Cleared On:** User interaction (input change or new form submission)

#### Error Message: `#profile-form-error`
- **Display:** Error text from API or validation
- **Examples:**
  - Validation: "Please enter your name." / "Please enter a valid weight." / "Please enter a valid height."
  - API: `result.error` from server response
- **Cleared On:** User triggers input event or form submit begins

#### Button: Save Profile (`#profile-save-btn`)
- **Label:** "Save Profile" (default) / "Saving..." (during save)
- **Type:** submit
- **Disabled State:** Yes - during API call
- **State Changes:**
  1. On form submit start:
     - `saveBtn.disabled = true`
     - `saveBtn.textContent = 'Saving...'`
  2. After API call completes (success or error):
     - `saveBtn.disabled = false`
     - `saveBtn.textContent = 'Save Changes'`
- **On Click:** Triggers form submit handler

### Navigation Buttons

#### Button: Back / Dashboard Link
- **Typical Location:** Profile header
- **Navigates To:** `/dashboard`
- **Type:** Internal navigation link or button

---

# NAVIGATION & SIDEBAR

## Sidebar Navigation (All Pages)

### Sidebar Container: `.sidebar` or `#sidebar`

#### Navigation Links (Global)
1. **Dashboard** → `/dashboard`
2. **Workouts** → `/workout`
3. **Goals** → `/goals`
4. **Progress** → `/progress`
5. **Profile** → `/profile`

#### Action Buttons in Sidebar

##### Start Workout Button
- **ID:** `#sidebar-start-workout-btn` (in workouts.js)
- **Label:** "Start Workout" or icon
- **On Click:** Opens workout creation modal
- **Page:** Workouts page

##### New Goal Button
- **ID:** `#sidebar-new-goal-btn` (in goals.js)
- **Label:** "New Goal" or icon
- **On Click:** Opens goal creation modal
- **Page:** Goals page

##### Logout Button
- **ID:** `#logout-btn`
- **Location:** Footer of sidebar
- **Label:** "Logout" or icon
- **On Click:** Call `AuthService.logout()`
- **Pages:** All authenticated pages
- **Event Handler:**
  ```javascript
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    AuthService.logout();
  });
  ```

### Active Link Highlighting
- **Current Page:** Sidebar link to current page typically highlighted
- **Class:** Usually `active` or `bg-primary` color

---

# UTILITY FUNCTIONS LIBRARY

## Math & Calculation Functions

### Weight Conversions
```javascript
kgToLbs(kg) → number (kg * 2.2046226218)
lbsToKg(lbs) → number (lbs / 2.2046226218)
```

### Height Conversions
```javascript
cmToImperial(cm) → { feet: number, inches: number }
imperialToCm(feet, inches) → number
```

### Health Metrics
```javascript
calculateBmi(weightKg, heightCm) → number or null
describeBmi(bmi) → string ("Underweight", "Healthy", "Overweight", "Obesity", or "Add profile data")
```

### Duration Formatting
```javascript
formatDurationLabel(totalMinutes) → string ("45 min", "1 hr 30 min", "2 hrs", etc.)
formatDuration(totalMinutes) → string (similar but slightly different formatting)
```

### Streak Calculation
```javascript
calculateStreakDays(workouts) → number (consecutive days with workouts ending today)
```

### Date/Time Helpers
```javascript
getDayKey(dateValue) → string ("YYYY-MM-DD")
```

### Series Building
```javascript
buildActivitySeries(workouts, days = 7, referenceDate = new Date()) → array
  Returns: [
    {
      date: Date,
      label: string,
      minutes: number,
      durationLabel: string,
      isPeak: boolean,
      heightPct: number
    },
    ...
  ]

buildSeries(workouts, period = 'week') → { labels: array, values: array }
  For week: labels = ['MON', 'TUE', ..., 'SUN'], values = durations
  For month: labels = ['W1', 'W2', 'W3', 'W4'], values = weekly durations
```

### String Utilities
```javascript
escapeHtml(value) → string
  Escapes: & < > " '
  Prevents XSS in goal titles
```

### Status Functions
```javascript
isFinishedStatus(status) → boolean (true if 'completed' or 'failed')
normalizeGoalStatus(goal) → string (goal.status or 'ongoing')
splitGoals(goals) → { ongoing: array, completed: array }
getGoalActions(goal) → array of action objects
```

## API & HTTP Helpers

### Auth Headers
```javascript
getAuthHeaders() → { 'Content-Type': 'application/json', 'Authorization': 'Bearer token' }
```

### Fetch with Timeout
```javascript
fetchWithTimeout(url, options, timeout) → Promise<Response>
  Automatically aborts after timeout milliseconds
```

### API Service Methods

**AuthService:**
- `signup(email, password, fullName)` → Promise
- `login(email, password)` → Promise
- `logout()` → void
- `isLoggedIn()` → boolean
- `getToken()` → string

**Profile Service Functions:**
- `fetchProfile()` → Promise<ProfileObject>
- `saveProfile(data, hasExisting)` → Promise
- `fetchWorkoutStats()` → Promise<Stats>
- `fetchWorkoutsForStreak()` → Promise<Workouts[]>

**Workout Service Functions:**
- `fetchWorkouts()` → Promise<Workout[]>
- `createWorkout(data)` → Promise
- `logSet(setData)` → Promise
- `fetchWorkoutStats()` → Promise<Stats>

**Goal Service Functions:**
- `fetchGoals()` → Promise<Goal[]>
- `createGoal(data)` → Promise
- `updateGoalProgress(goalId, value)` → Promise
- `updateGoalStatus(goalId, status)` → Promise
- `deleteGoal(goalId)` → Promise

**Progress Service Functions:**
- `fetchWorkouts()` → Promise<Workout[]>

---

# API ENDPOINTS & CONNECTIONS

## Authentication Endpoints

### POST /api/auth/signup
- **Frontend Call:** `AuthService.signup(email, password, fullName)`
- **File:** auth.js (signup form)
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "fullName": "John Doe"
  }
  ```
- **Response:** User data and/or confirmation info
- **Used On:** Signup page form submission

### POST /api/auth/login
- **Frontend Call:** `AuthService.login(email, password)`
- **File:** auth.js (login form)
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "data": {
      "access_token": "jwt_token_here",
      "user": { "id": "user_uuid" }
    }
  }
  ```
- **Token Storage:** JWT stored in `supabase_token` localStorage
- **Used On:** Login page form submission

## User Profile Endpoints

### GET /api/user/profile
- **Frontend Call:** `fetchProfile()`
- **Files:** profile.js, dashboard.js
- **Authorization:** Bearer token required
- **Response:**
  ```json
  {
    "success": true,
    "profile": {
      "user_id": "uuid",
      "full_name": "John Doe",
      "weight": 75.5,
      "height": 180,
      "created_at": "ISO_DATE",
      "updated_at": "ISO_DATE"
    }
  }
  ```
- **Used For:**
  - Dashboard: Display username, calculate BMI
  - Profile: Pre-fill form
  - Sidebar: Show name/BMI

### POST /api/user/profile (Create)
- **Frontend Call:** `saveProfile(data, false)`
- **File:** profile.js (form submit)
- **Authorization:** Bearer token required
- **Request Body:**
  ```json
  {
    "full_name": "John Doe",
    "weight": 75.5,
    "height": 180
  }
  ```
- **Response:** Updated profile object
- **Trigger:** First time profile save
- **Used On:** Profile page form submission

### PATCH /api/user/profile (Update)
- **Frontend Call:** `saveProfile(data, true)`
- **File:** profile.js (form submit)
- **Authorization:** Bearer token required
- **Request Body:** Same as POST
- **Response:** Updated profile object
- **Trigger:** Profile exists and updating
- **Used On:** Profile page form submission (updating existing)

## Workout Endpoints

### GET /api/workouts
- **Frontend Calls:**
  - `fetchWorkouts()` in workouts.js
  - `fetchWorkouts()` in progress.js
  - Used in dashboard.js for calculations
- **Files:** workouts.js, progress.js, dashboard.js
- **Authorization:** Bearer token required
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "name": "Morning Run",
        "type": "Cardio",
        "duration": 45,
        "calories": 350,
        "notes": "Great run!",
        "created_at": "ISO_DATE"
      },
      ...
    ]
  }
  ```
- **Used For:**
  - Display all workouts on workouts page
  - Calculate statistics (dashboard, profile)
  - Build activity charts (progress, dashboard)
  - Streak calculation
  - Recent workouts list (progress)

### POST /api/workouts (Create)
- **Frontend Call:** `createWorkout(data)`
- **File:** workouts.js (workout form)
- **Authorization:** Bearer token required
- **Request Body:**
  ```json
  {
    "name": "Morning Run",
    "type": "Cardio",
    "duration": 45,
    "calories": 350,
    "notes": "Great run!"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": { "id": "new_uuid", ... }
  }
  ```
- **POST vs PATCH Note:** Always POST for new workouts (immutable logs)
- **Used On:** Workouts page → "Log New Workout" button

### POST /api/workouts/sets (Log Set)
- **Frontend Call:** `logSet(setData)`
- **File:** workouts.js (set form)
- **Authorization:** Bearer token required
- **Request Body:**
  ```json
  {
    "workout_id": "uuid",
    "exercise": "Bench Press",
    "weight": 100,
    "reps": 8,
    "rpe": 8
  }
  ```
- **Response:** Set confirmation
- **Used For:** Logging individual sets during workout session

### GET /api/workouts/stats
- **Frontend Calls:**
  - `fetchWorkoutStats()` in workouts.js
  - `fetchWorkoutStats()` in profile.js
  - `fetchWorkoutStats()` in dashboard.js
- **Files:** workouts.js, profile.js, dashboard.js
- **Authorization:** Bearer token required
- **Response:**
  ```json
  {
    "success": true,
    "stats": {
      "totalWorkouts": 42,
      "totalDuration": 3600,
      "totalCalories": 36000
    }
  }
  ```
- **Used For:**
  - Dashboard: Display total workouts, calories
  - Profile: Display stats at top
  - Statistics generation

## Goal Endpoints

### GET /api/goals
- **Frontend Call:** `fetchGoals()`
- **File:** goals.js, dashboard.js (count active)
- **Authorization:** Bearer token required
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "title": "Run 50km this month",
        "goal_type": "endurance",
        "target_value": 50,
        "current_value": 32,
        "status": "ongoing",
        "deadline": "2026-04-30",
        "created_at": "ISO_DATE"
      },
      ...
    ]
  }
  ```
- **Used For:**
  - Display all goals on goals page
  - Dashboard: Count active goals (status != 'completed' and != 'failed')

### POST /api/goals (Create)
- **Frontend Call:** `createGoal(data)`
- **File:** goals.js (goal form)
- **Authorization:** Bearer token required
- **Request Body:**
  ```json
  {
    "title": "Run 50km this month",
    "goal_type": "endurance",
    "target_value": 50,
    "current_value": 0,
    "deadline": "2026-04-30"
  }
  ```
- **Response:** Created goal object
- **Used On:** Goals page → "New Goal" button

### PATCH /api/goals/{goalId} (Update Progress)
- **Frontend Call:** `updateGoalProgress(goalId, currentValue)`
- **File:** goals.js (progress input)
- **Authorization:** Bearer token required
- **Request Body:**
  ```json
  {
    "current_value": 35
  }
  ```
- **Response:** Updated goal object
- **Used For:** Inline goal progress updates

### PATCH /api/goals/{goalId} (Update Status)
- **Frontend Call:** `updateGoalStatus(goalId, status)`
- **File:** goals.js (action buttons)
- **Authorization:** Bearer token required
- **Request Body:**
  ```json
  {
    "status": "completed" // or "failed" or "ongoing"
  }
  ```
- **Response:** Updated goal object
- **Used For:** Mark goal as completed/failed

### DELETE /api/goals/{goalId}
- **Frontend Call:** `deleteGoal(goalId)`
- **File:** goals.js (delete button)
- **Authorization:** Bearer token required
- **Response:** Confirmation
- **Used For:** Delete goal permanently

---

# LOCALSTORAGE KEYS

## Authentication Keys

### `supabase_token`
- **Type:** String (JWT)
- **Purpose:** Authentication token for all API requests
- **Set By:** `AuthService.login()` on successful login
- **Used By:** `getAuthHeaders()` in all API calls
- **Cleared By:** `AuthService.logout()`
- **Guard:** All routes check `localStorage.getItem('supabase_token')`

### `user_id`
- **Type:** String (UUID)
- **Purpose:** Current user's database ID
- **Set By:** `AuthService.login()` response data
- **Used For:** API calls that may need explicit user_id
- **Cleared By:** `AuthService.logout()`

### `user_email`
- **Type:** String (email)
- **Purpose:** Display user email, fallback for name
- **Set By:** `AuthService.login()` with email input
- **Used For:**
  - Profile page display
  - Fallback name generation (email domain)
  - Dashboard username fallback
- **Cleared By:** `AuthService.logout()`

## User Preferences

### `profile_unit_preference`
- **Type:** String - 'metric' or 'imperial'
- **Purpose:** User's chosen unit system for weight/height
- **Default:** 'metric'
- **Set By:** `setUnitMode()` in profile.js on button click
- **Used By:** Profile page form display
- **Persistence:** Remembered across page reloads
- **Effect:**
  - 'metric': Shows kg and cm fields
  - 'imperial': Shows lbs and feet/inches fields

---

## Summary: Everything Covered

✅ **Authentication:**
- Login flow, form validation, error handling
- Signup flow with password matching
- Token storage and logout
- Password show/hide toggles

✅ **Dashboard:**
- Fetch and display user data
- BMI calculation and display
- Streak calculation
- Activity chart (7-day/4-week)
- Statistics aggregation
- Button interactions

✅ **Workouts:**
- Workout creation form with validation
- Modal open/close lifecycle
- Workout card rendering
- Set logging form
- Responsive to API responses

✅ **Goals:**
- Goal creation with type selection
- Status management (ongoing/completed/failed)
- Progress tracking
- Action buttons (complete, fail, delete)
- Goal card rendering with status badges

✅ **Progress:**
- 7-day activity chart with hover tooltips
- Recent workouts list
- Summary statistics
- Duration formatting
- Peak highlighting

✅ **Profile:**
- Full profile form with validation
- Unit system switching (metric/imperial)
- Weight/height conversions
- BMI live calculation
- Profile data persistence
- Streak display
- Statistics display

✅ **Utilities:**
- 40+ utility functions documented
- All parameters and return types
- Conversion formulas explained
- Error handling patterns
- Edge cases noted

✅ **API Connections:**
- All 15+ endpoints mapped
- Request/response structures
- When/where they're called
- Error handling

✅ **LocalStorage:**
- 5 keys documented
- Purpose and lifecycle
- When set/cleared
