# FitTrack Backend API Reference

**Date:** April 17, 2026  
**Base URL:** `http://localhost:3000/api` (Development)

## Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
2. [Workouts Endpoints](#workouts-endpoints)
3. [Goals Endpoints](#goals-endpoints)
4. [User Profile Endpoints](#user-profile-endpoints)
5. [Error Handling](#error-handling)
6. [Authentication Flow](#authentication-flow)

---

## Authentication Endpoints

### POST `/api/auth/signup`

**Description:** Create a new user account

**File Location:** `server/routes/auth.js`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123!",
  "fullName": "John Doe"
}
```

**Parameters:**
- `email` (string, required): Valid email address
- `password` (string, required): Password (min 6 characters recommended by Supabase)
- `fullName` (string, required): User's full name

**Response (200 - Success):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "email_confirmed_at": null,
      "email_change_confirm_status": 0,
      "phone": "",
      "last_sign_in_at": null,
      "app_metadata": {
        "provider": "email",
        "providers": ["email"]
      },
      "user_metadata": {
        "full_name": "John Doe"
      },
      "identities": [
        {
          "id": "550e8400-e29b-41d4-a716-446655440000",
          "user_id": "550e8400-e29b-41d4-a716-446655440000",
          "identity_data": {
            "email": "user@example.com"
          },
          "provider": "email",
          "created_at": "2026-04-17T10:30:00Z",
          "last_sign_in_at": null,
          "updated_at": "2026-04-17T10:30:00Z"
        }
      ],
      "created_at": "2026-04-17T10:30:00Z",
      "updated_at": "2026-04-17T10:30:00Z"
    }
  }
}
```

**Response (400 - Error):**
```json
{
  "error": "User already registered",
  "code": "user_already_exists"
}
```

**Response (422 - Validation Error):**
```json
{
  "error": "Invalid email format",
  "error_id": "..."
}
```

**Error Cases:**
1. **User already registered** - Email exists in system
2. **Invalid email** - Not a valid email format
3. **Weak password** - Password doesn't meet requirements
4. **Server error** - 500 status on unexpected failure

**Implementation Notes:**
- Email confirmation is required before login
- User receives confirmation email via Supabase
- `user_metadata.full_name` is stored for later display
- Token NOT returned on signup (user must login after confirming email)

**Frontend Usage:**
```javascript
try {
  const result = await AuthService.signup(email, password, fullName);
  // Show: "Check your email to confirm account"
  // Redirect to login page
} catch (error) {
  // Display error message
}
```

---

### POST `/api/auth/login`

**Description:** Authenticate user and obtain access token

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123!"
}
```

**Response (200 - Success):**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjEyMzQ1In0...",
    "refresh_token": "sbr_1234567890abcdef...",
    "expires_in": 3600,
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "email_confirmed_at": "2026-04-17T10:00:00Z",
      "user_metadata": {
        "full_name": "John Doe"
      }
    }
  }
}
```

**Response (400 - Failed):**
```json
{
  "error": "Invalid login credentials"
}
```

**Response (400 - Unconfirmed Email):**
```json
{
  "error": "Please confirm your email first, then log in."
}
```

**Response (500 - Server Error):**
```json
{
  "error": "Server error"
}
```

**Token Details:**
- `access_token`: JWT used for API authentication
- `refresh_token`: Used to get new access token when expired
- `expires_in`: Token validity in seconds (3600 = 1 hour)

**Frontend Storage:**
```javascript
localStorage.setItem('supabase_token', data.access_token);
localStorage.setItem('user_id', data.user.id);
localStorage.setItem('user_email', data.user.email);
```

**Error Handling:**
```javascript
const isEmailError = errorMsg.toLowerCase().includes('email not confirmed');
if (isEmailError) {
  showMsg('Please confirm your email first');
} else {
  showMsg('Invalid credentials');
}
```

---

### POST `/api/auth/logout`

**Description:** Logout user (client-side operation primarily)

**Request Body:** (Empty)

**Response (200):**
```json
{
  "success": true
}
```

**Frontend Implementation:**
```javascript
static async logout() {
    localStorage.removeItem('supabase_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_id');
    window.location.replace('/login');
}
```

**Notes:**
- Server endpoint is minimal (mainly for audit logging)
- Real logout happens on client by clearing tokens
- No valid token required for this endpoint

---

## Workouts Endpoints

### GET `/api/workouts`

**Description:** Retrieve all workouts for authenticated user

**Authentication:** Required (Bearer token)

**Request:**
```
GET /api/workouts
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiI...
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Bench Press Session",
      "type": "Strength",
      "duration": 45,
      "calories": 280,
      "notes": "4x8 @185lbs, felt strong",
      "created_at": "2026-04-17T10:30:00Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Morning Run",
      "type": "Cardio",
      "duration": 30,
      "calories": 350,
      "notes": "5K, easy pace",
      "created_at": "2026-04-17T06:15:00Z"
    }
  ]
}
```

**Response (401):**
```json
{
  "error": "Unauthorized"
}
```

**Query Options:**
- Results sorted by `created_at DESC` (newest first)
- Only returns workouts for authenticated user_id

**Frontend Usage:**
```javascript
const workouts = await fetchWorkouts();
// Returns: [ {...}, {...} ] or []
```

---

### POST `/api/workouts`

**Description:** Create a new workout entry

**Authentication:** Required

**Request Body:**
```json
{
  "name": "Morning Sprint",
  "type": "Cardio",
  "duration": 30,
  "calories": 350,
  "notes": "High intensity interval training"
}
```

**Parameters:**
- `name` (string, required): Workout name/description
- `type` (string, required): One of: Strength, Cardio, Yoga, Swimming, Cycling
- `duration` (number, required): Duration in minutes, min 1
- `calories` (number, optional): Calories burned, default 0
- `notes` (string, optional): Additional notes

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Morning Sprint",
    "type": "Cardio",
    "duration": 30,
    "calories": 350,
    "notes": "High intensity interval training",
    "created_at": "2026-04-17T08:00:00Z"
  }
}
```

**Response (400 - Validation Error):**
```json
{
  "error": "Failed to create workout"
}
```

**Response (401):**
```json
{
  "error": "Unauthorized"
}
```

**Backend Processing:**
```javascript
// In server/routes/workouts.js
router.post('/', requireAuth, async (req, res) => {
    const userId = req.user.id; // From middleware
    const { name, type, duration, calories, notes } = req.body;
    
    // Calls supabaseRestFetch to INSERT into workouts table
    // Returns first item from response array
});
```

**Frontend Usage:**
```javascript
const result = await createWorkout({
    name: 'Training Session',
    type: 'Strength',
    duration: 60,
    calories: 400,
    notes: 'New PR on squat!'
});

if (result.success) {
    refreshWorkoutsList();
}
```

---

### POST `/api/workouts/sets`

**Description:** Log individual exercise sets within a workout

**Authentication:** Required

**Request Body:**
```json
{
  "workout_id": "550e8400-e29b-41d4-a716-446655440003",
  "exercise": "Barbell Bench Press",
  "weight": 185,
  "reps": 8,
  "rpe": 9
}
```

**Parameters:**
- `workout_id` (string, required): ID of parent workout
- `exercise` (string, required): Exercise name
- `weight` (number, required): Weight in kg
- `reps` (number, required): Reps performed
- `rpe` (number, required): Rate of Perceived Exertion (1-10)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "workout_id": "550e8400-e29b-41d4-a716-446655440003",
    "exercise": "Barbell Bench Press",
    "weight": 185,
    "reps": 8,
    "rpe": 9,
    "created_at": "2026-04-17T08:15:00Z"
  }
}
```

**Response (400):**
```json
{
  "error": "Failed to log set"
}
```

**RPE Scale:**
- 1-3: Easy (could do many more reps)
- 4-6: Medium (moderate effort)
- 7-8: Hard (close to failure)
- 9-10: Very hard/Failure

**Frontend Usage:**
```javascript
const setData = {
  workout_id: currentWorkoutId,
  exercise: 'Bench Press',
  weight: 185,
  reps: 8,
  rpe: 9
};

const result = await logSet(setData);
if (result.success) {
    updateWorkoutDisplay();
}
```

---

## Goals Endpoints

### GET `/api/goals`

**Description:** Retrieve all goals for authenticated user

**Authentication:** Required

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440020",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Bench Press 300 lbs",
      "goal_type": "strength",
      "target_value": 300,
      "current_value": 250,
      "status": "ongoing",
      "deadline": "2026-06-30",
      "created_at": "2026-04-17T00:00:00Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440021",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Run 10K",
      "goal_type": "endurance",
      "target_value": 10,
      "current_value": 5.2,
      "status": "ongoing",
      "deadline": "2026-07-15",
      "created_at": "2026-04-10T00:00:00Z"
    }
  ]
}
```

**Response (401):**
```json
{
  "error": "Unauthorized"
}
```

---

### POST `/api/goals`

**Description:** Create a new fitness goal

**Authentication:** Required

**Request Body:**
```json
{
  "title": "Deadlift 500 lbs",
  "type": "strength",
  "target_value": 500,
  "current_value": 425,
  "deadline": "2026-08-30"
}
```

**Parameters:**
- `title` (string, required): Goal name
- `type` (string, required): One of: strength, endurance, body_composition
- `target_value` (number, required): Target metric value
- `current_value` (number, optional): Starting value, default 0
- `deadline` (string, optional): ISO date string (YYYY-MM-DD)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440022",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Deadlift 500 lbs",
    "goal_type": "strength",
    "target_value": 500,
    "current_value": 425,
    "status": "ongoing",
    "deadline": "2026-08-30",
    "created_at": "2026-04-17T11:00:00Z"
  }
}
```

**Response (400):**
```json
{
  "error": "Failed to create goal"
}
```

**Validation Notes:**
- Multiple payload attempts for compatibility with different schema
- Handles both `goal_type` and `type` fields
- Provides fallback attempts if column doesn't exist

**Frontend Usage:**
```javascript
const result = await createGoal({
    title: 'Bench 300 lbs',
    type: 'strength',
    target_value: 300,
    current_value: 250,
    deadline: '2026-06-30'
});

if (result.success) {
    displayGoal(result.data);
} else {
    showError(result.error);
}
```

---

### PATCH `/api/goals/:id`

**Description:** Update goal progress or status

**Authentication:** Required

**URL Parameter:**
- `id`: Goal ID (UUID)

**Request Body:**
```json
{
  "current_value": 275,
  "status": "ongoing"
}
```

**Parameters:**
- `current_value` (number, optional): Update current progress
- `status` (string, optional): One of: ongoing, completed, failed

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440022",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Deadlift 500 lbs",
    "goal_type": "strength",
    "target_value": 500,
    "current_value": 275,
    "status": "ongoing",
    "deadline": "2026-08-30",
    "created_at": "2026-04-17T11:00:00Z"
  }
}
```

**Response (400 - Invalid Status):**
```json
{
  "error": "Invalid goal status"
}
```

**Status Values:**
- `ongoing`: Active goal (allows update, complete, or fail)
- `completed`: Goal achieved
- `failed`: Goal abandoned

**Example Updates:**
```javascript
// Mark goal as completed
await updateGoal(goalId, { status: 'completed' });

// Update progress
await updateGoal(goalId, { current_value: 500 });

// Combined
await updateGoal(goalId, { 
    current_value: 500, 
    status: 'completed' 
});
```

---

## User Profile Endpoints

### GET `/api/user/profile`

**Description:** Retrieve authenticated user's profile information

**Authentication:** Required

**Response (200 - Profile Exists):**
```json
{
  "success": true,
  "profile": {
    "id": "550e8400-e29b-41d4-a716-446655440030",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "full_name": "John Doe",
    "height": 180,
    "weight": 85,
    "experience_level": "intermediate",
    "xp": 450,
    "created_at": "2026-04-17T10:30:00Z"
  }
}
```

**Response (200 - No Profile Yet):**
```json
{
  "success": true,
  "profile": null
}
```

**Profile Fields:**
- `full_name`: User's full name
- `height`: Height in cm
- `weight`: Weight in kg
- `experience_level`: beginner, intermediate, or advanced
- `xp`: Experience points (gamification)

---

### POST `/api/user/profile`

**Description:** Create user profile

**Authentication:** Required

**Request Body:**
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
    "id": "550e8400-e29b-41d4-a716-446655440030",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "full_name": "John Doe",
    "height": 180,
    "weight": 85,
    "experience_level": "intermediate",
    "xp": 0,
    "created_at": "2026-04-17T10:30:00Z"
  }
}
```

**Response (400):**
```json
{
  "error": "Failed to create profile"
}
```

---

### PATCH `/api/user/profile`

**Description:** Update user profile information

**Authentication:** Required

**Request Body:**
```json
{
  "weight": 82,
  "xp": 500
}
```

**Updatable Fields:**
- `full_name` (string)
- `height` (number)
- `weight` (number)
- `experience_level` (string)
- `xp` (number)

**Response (200):**
```json
{
  "success": true,
  "profile": {
    "id": "550e8400-e29b-41d4-a716-446655440030",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "full_name": "John Doe",
    "height": 180,
    "weight": 82,
    "experience_level": "intermediate",
    "xp": 500,
    "created_at": "2026-04-17T10:30:00Z"
  }
}
```

**Response (400):**
```json
{
  "error": "Failed to update profile"
}
```

---

## Error Handling

### Standard Error Response Format

All errors follow this pattern:

```json
{
  "error": "Error message",
  "code": "error_code" // Optional
}
```

### Common HTTP Status Codes

| Status | Meaning | Example |
|--------|---------|---------|
| 200 | Success | Request completed successfully |
| 400 | Bad Request | Invalid parameters or failed validation |
| 401 | Unauthorized | No token or invalid token |
| 422 | Unprocessable Entity | Validation error from Supabase |
| 500 | Server Error | Unexpected error |

### Error Scenarios

**Missing Token:**
```
Status: 401
{
  "error": "Unauthorized"
}
```

**Invalid Token:**
```
Status: 401
{
  "error": "Unauthorized"
}
```

**Server Error:**
```
Status: 500
{
  "error": "Server error"
}
```

### Frontend Error Handling Pattern

```javascript
async function apiCall(url, options) {
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || `Error: ${response.status}`);
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        return { error: error.message, success: false };
    }
}

// Usage:
const result = await apiCall('/api/goals', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(goalData)
});

if (result.error) {
    showErrorMessage(result.error);
} else {
    refreshGoalsList();
}
```

---

## Authentication Flow Diagram

```
User enters credentials
        ↓
POST /api/auth/login
        ↓
Server validates with Supabase
        ↓
Supabase returns access_token
        ↓
Server responds with {success: true, data: {...}}
        ↓
Frontend stores token in localStorage
        ↓
All future requests include:
  Authorization: Bearer {token}
        ↓
Server middleware requireAuth:
  ├─ Extract token from header
  ├─ Verify with Supabase
  ├─ Attach user to request
  └─ Continue to route
        ↓
API operation executes
        ↓
Response sent to client
```

---

## Rate Limiting & Best Practices

**Current Implementation:** No rate limiting in place

**Recommended Limits:**
- Auth endpoints: 5 requests/minute per IP
- General endpoints: 60 requests/minute per user
- Workspace endpoints: 100 requests/minute

**Best Practices:**

1. **Token Management:**
   - Store token in secure location (localStorage safe for SPA)
   - Add token refresh logic when expired
   - Clear on logout

2. **Request Optimization:**
   - Cache responses where appropriate
   - Debounce rapid requests
   - Use pagination for large result sets

3. **Error Recovery:**
   - Retry failed requests with exponential backoff
   - Show user-friendly error messages
   - Log errors for debugging

---

## Testing Endpoints

### Using cURL

```bash
# Signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","fullName":"Test User"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Create Workout (with token)
curl -X POST http://localhost:3000/api/workouts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"name":"Test Workout","type":"Cardio","duration":30,"calories":250}'
```

### Using Fetch in Console

```javascript
// Login
const loginRes = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: 'test@example.com',
        password: 'Test123!'
    })
});
const loginData = await loginRes.json();
const token = loginData.data.access_token;

// Create goal
const goalRes = await fetch('/api/goals', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
        title: 'Test Goal',
        type: 'strength',
        target_value: 300,
        current_value: 250
    })
});
const goalData = await goalRes.json();
console.log(goalData);
```

