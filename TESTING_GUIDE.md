# Complete Testing & Troubleshooting Guide

## 🧪 End-to-End Testing Flow

### Prerequisites
- Backend running on http://localhost:8080
- Database migrations completed
- Frontend running with `npm run dev`

## Test Case 1: User Registration & Login

### Steps:
1. **Open App** → You should see login screen
2. **Click Register** → Registration form appears
3. **Fill Form:**
   - Name: "Test User"
   - Email: "testuser@example.com"
   - Phone: "9876543210" (exactly 10 digits)
   - Password: "Test@12345" (must have uppercase, lowercase, number, special char)
4. **Click Register** → Success toast appears
5. **Auto-redirect to Dashboard** → Should show "Hello, Test User"

### Expected Results:
- ✅ Form validates before submission
- ✅ Success message shows
- ✅ User auto-logs in
- ✅ Redirected to dashboard with user name

### Troubleshooting:
- **"Phone number must be 10 digits"** → Ensure phone has exactly 10 digits
- **"Password must have uppercase..."** → Check password requirements
- **"User already exists"** → Use different email
- **Failed to create user** → Check backend console for errors

---

## Test Case 2: Admin Login & Create Course

### Steps:
1. **Go to Login Screen**
2. **Enter Admin Credentials:**
   - Email: `academics@stackuplearning.com`
   - Password: `123456758`
3. **Click Login** → Should redirect to `/admin` dashboard
4. **Verify Admin Dashboard Shows:**
   - "Admin Panel" title
   - Statistics section
   - "Quick Actions" buttons
5. **Click "Create Course"** → Create course form appears
6. **Fill Course Form:**
   - Title: "React Native Basics"
   - Category: "Programming"
   - Type: "Free"
   - Price: "0" (auto-filled)
7. **Click Create** → Success message, redirect to manage courses
8. **Verify Course Appears** → Course listed with "Draft" badge

### Expected Results:
- ✅ Admin redirected to /admin dashboard
- ✅ Statistics display course count
- ✅ Create course form submits successfully
- ✅ Course appears in manage courses list
- ✅ Course has "Draft" status (not published)

### Troubleshooting:
- **"Access denied. Only administrators can access"** → User not admin, use correct email
- **"Failed to create course"** → Check backend console
- **Course doesn't appear** → Refresh or go back and return to page
- **"Failed to load courses"** → Backend API error, check `/api/v1/course/creator` endpoint

---

## Test Case 3: Admin Publishes Course

### Steps:
1. **Stay on Manage Courses Screen** (or navigate back)
2. **Find the "React Native Basics" course**
3. **Click "Publish" Button** → Badge should change from "Draft" to "Published"
4. **Success Toast** → "Course published" message appears

### Expected Results:
- ✅ Button text changes to "Unpublish"
- ✅ Badge changes to "Published" (green)
- ✅ Toast shows success message
- ✅ API call succeeds: PATCH `/api/v1/course/publish/{id}`

### Troubleshooting:
- **"Failed to update course"** → Check backend middleware
- **No change in UI** → Refresh page
- **Button doesn't respond** → Check network tab for 429 rate limit errors

---

## Test Case 4: Student Browses Courses

### Steps:
1. **Logout from Admin** → Click logout on any screen
2. **Login as Student** → Use test user created in Test Case 1
3. **Dashboard Should Show:**
   - "Hello, [Name]" greeting
   - "My Courses" quick action button
   - "Explore Courses" section with "React Native Basics" course
4. **Go to Courses Tab** → Should show all published courses
5. **Search for Course:**
   - Type "React" in search
   - Should filter to matching courses
6. **Try Filter by Type:**
   - Click "Free" → Should show only free courses
   - Click "All" → Should show all courses

### Expected Results:
- ✅ Dashboard shows published courses
- ✅ CourseCard displays course info
- ✅ Search filters courses in real-time
- ✅ Type filter works
- ✅ No rate limit errors (should be bypassed in dev)

### Troubleshooting:
- **"No courses available"** → Ensure admin published a course
- **Search doesn't work** → Check course_title field in data
- **Rate limit error (429)** → Backend Arcjet middleware needs bypass
  - Check: `NODE_ENV=development` in backend/.env
  - Verify arcjet-dynamic.js has bypass check
- **Courses don't load** → Check `/api/v1/course/published-course` endpoint

---

## Test Case 5: View Course Details

### Steps:
1. **On Courses Screen**
2. **Click on "React Native Basics" CourseCard**
3. **Course Detail Screen Should Show:**
   - Course thumbnail/image
   - Course title
   - Instructor/creator name
   - Category badge
   - Level badge
   - Course type badge
   - Description (if available)
   - "Lectures (0)" section (no lectures yet)
4. **Go Back** → Click arrow button to return

### Expected Results:
- ✅ Course details load
- ✅ Lectures list shows (empty if none)
- ✅ All metadata displays correctly
- ✅ Back button works
- ✅ No errors in console

### Troubleshooting:
- **"Course not found"** → Wrong course ID in URL
- **Lectures section shows error** → Check `/api/v1/lecture/{courseId}/lecture`
- **Image doesn't load** → Check course_thumbnail URL is valid
- **Data is missing** → Backend may not be returning all fields

---

## Test Case 6: Admin Adds Lecture

### Steps:
1. **Login as Admin again**
2. **Go to Manage Courses**
3. **Click "Lectures" button on course**
4. **Add Lecture Screen Appears**
5. **Fill Form:**
   - Title: "Introduction to React Native"
   - Description: "Learn the basics of React Native"
   - Select a video file (or any file for testing)
6. **Click "Upload"** → Loading indicator appears
7. **Success Message** → "Lecture uploaded successfully"
8. **Redirect to Manage Courses**

### Expected Results:
- ✅ Lecture form submits successfully
- ✅ Video file is picked and attached
- ✅ Success message shows
- ✅ Redirects back to manage courses
- ✅ API call to `/api/v1/video/create/{courseId}` succeeds

### Troubleshooting:
- **"Failed to upload"** → Check file size limits
- **"No file selected"** → Must choose a file
- **Validation errors** → Fill all required fields
- **414 or 413 error** → File too large, check backend limits

---

## Test Case 7: View Course with Lectures

### Steps:
1. **Student Login**
2. **Go to Courses**
3. **Click on "React Native Basics"** → Course detail screen
4. **Verify Lectures Section Shows:**
   - Lecture count updated: "Lectures (1)"
   - Lecture card with:
     - Number (1)
     - Title: "Introduction to React Native"
     - Description
     - Duration (if available)
     - Play button
5. **Try to Click Play** → Should attempt to play video

### Expected Results:
- ✅ Lectures fetch successfully
- ✅ Lecture count accurate
- ✅ All lecture metadata displays
- ✅ Play button is clickable
- ✅ No console errors

### Troubleshooting:
- **Lectures don't appear** → 
  - Check `/api/v1/lecture/{courseId}/lecture` returns data
  - Verify courseId in URL parameter
- **Lecture count shows 0** → Refresh page to reload
- **Missing fields** → Check backend returns all lecture fields

---

## Test Case 8: My Courses (Enrollment)

### Steps:
1. **Student Dashboard**
2. **Click "My Courses" Quick Action**
3. **My Courses Screen Shows:**
   - "You haven't enrolled in any courses yet" (if no enrollments)
   - OR list of enrolled courses with progress
4. **If Empty:** Button to "Explore Courses"

### Expected Results:
- ✅ Screen navigates without errors
- ✅ Proper empty state message
- ✅ CTA button works if empty
- ✅ Loading state shows initially

### Troubleshooting:
- **Navigation error** → Check route is registered in _layout.tsx
- **Blank screen** → Check `/api/v1/enrollment/my-courses` endpoint
- **404 error** → Student not enrolled in any courses (expected)

---

## Test Case 9: User Profile

### Steps:
1. **Any User (Student or Admin)**
2. **Click Profile Tab**
3. **Profile Screen Shows:**
   - Avatar with user initial
   - User name
   - User email
   - Settings section
   - Support section
   - Logout button
4. **Verify Data is Real:**
   - Name matches registered name
   - Email matches registered email
5. **Click Logout** → Redirect to login screen

### Expected Results:
- ✅ User data loads from `/api/v1/user/profile`
- ✅ Avatar initial is correct
- ✅ Name and email match
- ✅ Logout clears cookies
- ✅ Redirect to login works

### Troubleshooting:
- **Name shows "User"** → API not returning user data
- **Email is wrong** → Check backend profile endpoint
- **Logout doesn't work** → Check cookie cleanup code
- **Can still access protected routes** → Token still in cookies

---

## Performance Tests

### Test: Courses List Performance

1. **Create 50+ test courses** via API
2. **Go to Courses Tab**
3. **Scroll through list** → Should be smooth
4. **Search for course** → Should respond quickly
5. **Filter by type** → Should update without lag

Expected: No jank, smooth 60fps scrolling

### Test: Course Detail Load Time

1. **Click on course** → Should load in < 2 seconds
2. **With 100+ lectures** → Should still be responsive
3. **Network tab** → Verify parallel requests

---

## API Error Scenarios

### Test: Network Error

1. **Turn off backend**
2. **Try to navigate to any screen** → Should show error toast
3. **"Network error" message appears**
4. **Retry button available** → Click to retry

### Test: 404 Error (No Data)

1. **Visit course-detail with invalid ID**
2. **Should show "Course not found"**
3. **Back button available**

### Test: 401 Unauthorized

1. **Clear cookies manually**
2. **Try to access protected route** → Redirect to login
3. **Login screen appears**

### Test: 429 Rate Limit

If Arcjet bypass not working:
1. **Make repeated requests**
2. **Should see "Rate limit exceeded" error**
3. **Expected in production only**

---

## Console Debugging

### View All API Logs

Open browser DevTools Console and check for:
```
✅ POST /api/v1/user/login { success: true, user: {...} }
❌ GET /api/v1/course/published-course status: 404
📤 POST /api/v1/course/create { title: "..." }
```

### Check Cookies

In DevTools → Application → Cookies:
- Should see `token` cookie after login
- Should be removed after logout
- Should be httpOnly (not visible in JS)

### Network Tab Analysis

1. **Open Network tab**
2. **Perform action (login, create course)**
3. **Check:**
   - Request headers include cookies
   - Response status is correct
   - Response body has expected data
   - No CORS errors

---

## Debugging Checklist

When something doesn't work:

- [ ] Check backend is running: `curl http://localhost:8080/api-docs`
- [ ] Check console for errors: `npm run dev` output
- [ ] Check DevTools console: Red errors or warnings
- [ ] Check Network tab: Failed requests, wrong status codes
- [ ] Check cookies: Token present after login
- [ ] Check API response: Match expected structure
- [ ] Check database: Data actually exists
- [ ] Check environment: NODE_ENV=development
- [ ] Check logs: Backend console for errors

---

## Common Issues & Quick Fixes

| Issue | Solution |
|-------|----------|
| "Network error" | Ensure backend running on port 8080 |
| "Rate limit (429)" | Check NODE_ENV=development in backend/.env |
| "User not found" | Verify email in database or create new user |
| "Course not published" | Admin must toggle publish status |
| "Lectures don't appear" | Ensure lectures uploaded and course published |
| "Can't login" | Check password case sensitivity |
| "Wrong redirect after login" | Verify user.role in database |
| "Image doesn't load" | Check course_thumbnail URL format |
| "Search doesn't work" | Clear search and try again |
| "Blank dashboard" | Check `/api/v1/course/published-course` response |

---

## Success Criteria

Your implementation is complete when:

- ✅ Can register new student account
- ✅ Can login as student
- ✅ Can login as admin
- ✅ Admin can create course
- ✅ Admin can publish course
- ✅ Student sees published courses
- ✅ Student can view course details
- ✅ Admin can add lectures to course
- ✅ Student sees lectures in course detail
- ✅ No console errors or warnings
- ✅ No network failures (except intentional)
- ✅ Dark/Light theme works
- ✅ Search and filter work
- ✅ All buttons are clickable
- ✅ Error messages are user-friendly
- ✅ Loading states show properly
- ✅ Can logout successfully

Once all of these pass, the frontend is fully functional! 🎉
