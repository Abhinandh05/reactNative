# Frontend Implementation Guide

## Overview
This document outlines all the frontend screens and functionality that have been created to work with the backend LMS API.

## Frontend Architecture

### Key Screens Implemented

#### 1. **Authentication Screens** (`/app/auth/`)
- **login.tsx** - User login with role-based routing
  - Handles student, admin, and superadmin logins
  - Routes to appropriate dashboard based on role
  - Uses cookie-based authentication (httpOnly JWT)
  
- **register.tsx** - New user registration
  - Validates phone (10 digits)
  - Validates password (uppercase, lowercase, number, special character)
  - Auto-login after successful registration

#### 2. **Student Dashboard** (`/app/(tabs)/dashboard.tsx`)
- Shows personalized greeting with user name
- "My Courses" quick action button
- Displays all published courses
- Profile data fetched from `/api/v1/user/profile`
- Published courses fetched from `/api/v1/course/published-course`
- Handles 404 gracefully (no courses available yet)

#### 3. **Courses Browse Screen** (`/app/(tabs)/courses.tsx`)
- Browse all published courses
- Search functionality by course title and instructor name
- Filter by: All, Free, Paid
- Shows course card with instructor name
- Responsive loading states
- Handles empty states

#### 4. **Course Detail Screen** (`/app/course-detail.tsx`)
- Display full course information:
  - Course title, description, thumbnail
  - Instructor name, category, level
  - Price (if paid course)
  - Course type badge
- Lists all lectures for the course
- Fetch from:
  - `/api/v1/course/{courseId}` - Course details
  - `/api/v1/lecture/{courseId}/lecture` - Lectures list
- Gracefully handles missing lectures

#### 5. **My Courses Screen** (`/app/my-courses.tsx`)
- Shows enrolled courses with progress
- Fetches from `/api/v1/enrollment/my-courses`
- Quick navigation to explore courses if empty
- Progress tracking for each course

#### 6. **User Profile Screen** (`/app/(tabs)/profile.tsx`)
- Display user information (name, email)
- Avatar with user initial
- Settings and support options
- Logout functionality
- Clears authentication tokens

#### 7. **Admin Dashboard** (`/app/admin/index.tsx`)
- Shows admin statistics
  - Number of courses created
  - Quick action buttons
- Fetches from:
  - `/api/v1/user/profile` - Admin info
  - `/api/v1/course/creator` - Admin's courses count
- Protected: Only accessible to admin/superadmin roles

#### 8. **Manage Courses Screen** (`/app/admin/manage-courses.tsx`)
- List of admin's created courses
- Publish/Unpublish toggle
- Add lectures button
- Course status badge
- Fetches from `/api/v1/course/creator`

#### 9. **Create Course Screen** (`/app/admin/create-course.tsx`)
- Form to create new course
- Fields: Title, Category, Type (free/paid), Price
- Validation for all fields
- Creates via `/api/v1/course/create`
- Redirects to manage-courses on success

#### 10. **Add Lecture Screen** (`/app/admin/add-lecture/[courseId].tsx`)
- Upload video file for a lecture
- Fields: Lecture title, description, video file
- Video upload to `/api/v1/video/create/{courseId}`
- File picker integration (expo-document-picker)

## API Integration

### Base Configuration (`/utils/api.ts`)
```typescript
- Axios instance with automatic baseURL detection
- Android: 10.0.2.2:8080
- iOS: Derived from debuggerHost
- Web: window.location.hostname:8080
- withCredentials: true for cookie-based auth
```

### Error Handling Strategy
Each screen implements:
- Try-catch blocks for all API calls
- Specific error handling for common status codes:
  - 404: No data found (graceful empty state)
  - 401: Authentication required (redirect to login)
  - 500: Server error (show error toast)
- Console logging for debugging
- User-friendly error messages via Toast notifications

### Data Flow

**Login Flow:**
1. User enters credentials
2. POST `/api/v1/user/login`
3. Backend sets httpOnly JWT cookie
4. Response includes user object with role
5. Frontend routes based on role:
   - admin/superadmin → /admin
   - student → /dashboard

**Course Browse Flow:**
1. Dashboard/Courses tab loads published courses
2. GET `/api/v1/course/published-course`
3. Displays CourseCard components
4. User taps course → navigate to course-detail
5. Course detail fetches full data + lectures

**Admin Course Management Flow:**
1. Admin creates course → POST `/api/v1/course/create`
2. Redirects to manage-courses screen
3. Lists admin's courses → GET `/api/v1/course/creator`
4. Admin can toggle publish → PATCH `/api/v1/course/publish/{id}`
5. Admin adds lectures → uploads video to `/api/v1/video/create/{id}`

## Component Reusability

### CourseCard Component
- Used in dashboard, courses, my-courses screens
- Props:
  - id: course ID
  - title: course title
  - author: instructor name
  - image: thumbnail URI
  - progress: completion percentage (optional)

### Input Component
- Reusable text input with glassmorphism effect
- Used in search bars and form fields

### Button Component
- Primary and secondary variants
- Used for all primary actions

### useColorScheme Hook
- Dark/Light mode support
- Theme switching
- Applied to all screens

## Loading & Error States

Every screen properly handles:
- **Loading State**: ActivityIndicator while fetching
- **Error State**: Error message with retry/back buttons
- **Empty State**: User-friendly message with CTAs
- **Success State**: Toast notifications for actions

## Navigation Structure

```
/
├── /auth
│   ├── /login
│   └── /register
├── /(tabs)
│   ├── /dashboard
│   ├── /courses
│   └── /profile
├── /admin
│   ├── / (dashboard)
│   ├── /create-course
│   ├── /manage-courses
│   └── /add-lecture/[courseId]
├── /course-detail (with courseId param)
├── /my-courses
└── /error-screen
```

## Key Features Implemented

✅ **Role-Based Access Control**
- Different dashboards for student vs admin
- Protected routes redirect unauthorized users

✅ **Real-Time Data Loading**
- All screens fetch data from backend
- Proper error handling for network issues

✅ **Search & Filter**
- Course search by title and instructor
- Filter by course type (free/paid)

✅ **Authentication**
- Login/Register with validation
- Cookie-based JWT auth
- Logout with token cleanup

✅ **Course Management (Admin)**
- Create courses with validation
- Publish/unpublish courses
- Add video lectures
- View course statistics

✅ **User Management**
- Profile information display
- User preferences
- Logout functionality

✅ **Responsive Design**
- Dark/light theme support
- Adaptive layouts
- Touch-friendly UI

## Debugging Tips

### Check Console Logs
All API calls log detailed information:
```javascript
console.error('Error fetching courses:', {
  message: error.message,
  response: error.response?.data,
  status: error.response?.status,
});
```

### Verify API Endpoints
Each screen documents which endpoints it calls:
- Check backend swagger at http://localhost:8080/api-docs
- Compare response structure with frontend expectations

### Toast Notifications
All errors show in red toast notifications in bottom-left:
- Click to dismiss
- Shows error message and details

### Network Tab
Use Expo DevTools or browser DevTools to inspect:
- Request headers (cookies included)
- Response status and data
- Request/response timing

## Common Issues & Solutions

**"Failed to load data" on dashboard**
- Check if courses are published in admin panel
- Verify `/api/v1/course/published-course` returns data
- Check backend console for errors

**"No courses found" but admin created courses**
- Ensure courses are marked as "published"
- Check admin's role is correct (admin or superadmin)
- Verify course_creator_id matches user ID

**Login redirects to login again**
- Check cookies are being set (Network tab)
- Verify JWT_SECRET in .env matches backend
- Ensure withCredentials is enabled in axios

**Course detail shows "No lectures"**
- Check lectures exist in database
- Verify lecture endpoint returns data
- Check course_id in URL parameter

## Performance Optimizations

- FlatList for rendering large course lists
- useFocusEffect for re-fetching data on screen focus
- Lazy loading of lecture videos
- Proper cleanup of listeners

## Future Enhancements

- [ ] Video playback component
- [ ] Course ratings and reviews
- [ ] Progress tracking
- [ ] Offline mode
- [ ] Payment integration for paid courses
- [ ] Certificate generation
- [ ] Discussion forums
- [ ] Note-taking functionality
