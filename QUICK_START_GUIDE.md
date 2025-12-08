# ⚡ Quick Start Guide

## 30-Second Setup

### 1. Start Backend
```bash
cd backend
npm run dev
```

### 2. Start Frontend (in new terminal)
```bash
npm run dev
```

### 3. Open App
- Android: Opens automatically or visit Expo QR code
- iOS: Opens automatically
- Web: http://localhost:8081

### 4. Test with Admin Account
```
Email: academics@stackuplearning.com
Password: 123456758
```

---

## What Works Immediately

✅ **Login/Register** - Create account and login
✅ **Admin Panel** - Create and manage courses  
✅ **Student Dashboard** - View published courses
✅ **Course Details** - View course info and lectures
✅ **Search & Filter** - Find courses by name
✅ **Dark/Light Theme** - Toggle theme in profile
✅ **Error Messages** - Clear feedback on issues

---

## 5-Minute Test Flow

1. **Login as Admin**
   - Email: academics@stackuplearning.com
   - Password: 123456758

2. **Create Course**
   - Click "Create Course"
   - Title: "My First Course"
   - Category: "Programming"
   - Type: "Free"
   - Click Create

3. **Publish Course**
   - Click "Manage Courses"
   - Find "My First Course"
   - Click "Publish" button
   - Status changes to green "Published"

4. **View as Student**
   - Click Logout
   - Click "Register"
   - Create new account
   - Check dashboard
   - See "My First Course" in published courses
   - Click course to see details

5. **Add Lecture**
   - Logout
   - Login as admin again
   - Go to course → click "Lectures"
   - Upload any file as test
   - Login as student again
   - Go to course detail
   - See lecture listed

---

## File Locations

```
📱 Frontend Code
├── /app/auth/          → Login/Register
├── /app/(tabs)/        → Student screens
├── /app/admin/         → Admin screens
├── /components/        → Reusable UI
├── /utils/             → API client & logging
└── /constants/         → Theme colors

📚 Documentation
├── FRONTEND_GUIDE.md                    → Architecture
├── FRONTEND_COMPLETE_GUIDE.md           → Full features
├── TESTING_GUIDE.md                     → Step-by-step tests
├── FRONTEND_IMPLEMENTATION_SUMMARY.md   → Overview
└── QUICK_START_GUIDE.md                 → This file!
```

---

## Common Issues & Quick Fixes

### Issue: "Network error"
**Fix:** Ensure backend is running on port 8080
```bash
# In backend folder:
npm run dev
```

### Issue: "No courses available" on dashboard
**Fix:** Admin must publish a course first
```
Login as admin → Create Course → Publish → Student will see it
```

### Issue: Rate limit errors (429)
**Fix:** Check backend/.env has NODE_ENV=development
```
NODE_ENV=development
```

### Issue: Login redirects back to login
**Fix:** Clear app data and try again
```bash
npm run dev  # This clears cache
```

### Issue: Course doesn't appear after creating
**Fix:** Refresh the page or go back and return
- Navigate away and back to trigger refresh

---

## Command Reference

```bash
# Start frontend dev server
npm run dev

# Start frontend on iOS
npm run ios

# Start frontend on Android
npm run android

# Start backend
cd backend && npm run dev

# View backend API docs
http://localhost:8080/api-docs
```

---

## API Endpoints Quick Reference

**Courses:**
- `GET /api/v1/course/published-course` - All published courses
- `POST /api/v1/course/create` - Create course (admin)
- `PATCH /api/v1/course/publish/{id}` - Publish/unpublish

**Lectures:**
- `GET /api/v1/lecture/{courseId}/lecture` - Get lectures
- `POST /api/v1/lecture/lecture` - Create lecture

**User:**
- `POST /api/v1/user/login` - Login
- `POST /api/v1/user/register` - Register
- `GET /api/v1/user/profile` - Get profile

**Full list in:** `/backend/config/swagger.js`

---

## Debugging

### View Console Logs
```
npm run dev shows all API calls and errors
Look for ✅ (success) or ❌ (error)
```

### Check Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Perform action in app
4. See request/response details
5. Check status code and response body

### Check Cookies
1. DevTools → Application → Cookies
2. Look for `token` cookie
3. Should exist after login
4. Should be removed after logout

---

## User Accounts

### Default Admin (Pre-created)
```
Email: academics@stackuplearning.com
Password: 123456758
```

### Create Student
```
Register via app:
- Name: Your name
- Email: Any email
- Phone: 10 digits (required!)
- Password: Must have uppercase, lowercase, number, special char
  Example: Test@12345
```

---

## Feature Checklist

Use this to verify everything works:

### Authentication ✅
- [ ] Can register new account
- [ ] Can login with credentials
- [ ] Can logout
- [ ] Login redirects to correct dashboard

### Admin Features ✅
- [ ] Can access admin dashboard
- [ ] Can create new course
- [ ] Can publish/unpublish course
- [ ] Can add lectures to course
- [ ] Can view course statistics

### Student Features ✅
- [ ] Can view dashboard
- [ ] Can see published courses
- [ ] Can search courses
- [ ] Can filter by price
- [ ] Can view course details
- [ ] Can see lectures in course

### UI/UX ✅
- [ ] Dark mode works
- [ ] Light mode works
- [ ] Loading spinners appear
- [ ] Error messages show
- [ ] Toast notifications work
- [ ] All buttons are clickable
- [ ] All inputs accept text

---

## Video Tutorial (What to Do)

1. **Open Two Terminals**
   - Terminal 1: Run backend
   - Terminal 2: Run frontend

2. **Wait for App to Load**
   - Frontend: "Expo server is running..."
   - Backend: "Server is running at http://localhost:8080"

3. **Login as Admin**
   - See admin dashboard with stats

4. **Create a Test Course**
   - Title: "React Native Mastery"
   - Category: "Programming"
   - Click Create

5. **Publish the Course**
   - Click Manage Courses
   - Click Publish button
   - Status changes to "Published"

6. **Logout & Register as Student**
   - Create new account with any email
   - Phone: 9876543210 (must be 10 digits)
   - Password: Student@123

7. **View Course as Student**
   - Dashboard shows "React Native Mastery"
   - Click course to see details
   - (No lectures yet, but course shows)

8. **Add a Lecture (as Admin)**
   - Logout → Login as admin
   - Go to course → Click "Lectures"
   - Upload any file as test video
   - Click Create Lecture

9. **View Lecture as Student**
   - Logout → Login as student
   - Go to course detail
   - See lecture listed under "Lectures (1)"

**That's it! Everything is working!** 🎉

---

## What's Next?

- ✅ **All frontend done** - Every screen implemented
- ✅ **All API integrated** - Data comes from backend
- ✅ **All tests ready** - See TESTING_GUIDE.md
- 📖 **Read FRONTEND_GUIDE.md** - Understand architecture
- 🔧 **Customize theme** - Edit /constants/Colors.ts
- 🚀 **Deploy** - Run on real device or web

---

## Support Resources

1. **Confused about a screen?** → Check FRONTEND_GUIDE.md
2. **Want to test everything?** → Follow TESTING_GUIDE.md  
3. **Need to debug an issue?** → Check console logs + Network tab
4. **Need API reference?** → Visit http://localhost:8080/api-docs
5. **Want to modify code?** → See FRONTEND_COMPLETE_GUIDE.md

---

## That's All!

You have a fully working LMS app. Just:
1. Start backend
2. Start frontend
3. Use it!

For detailed information, read the other documentation files. 📚

**Happy coding!** 🚀
