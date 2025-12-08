# LMS Application - Setup & Run Guide

## Overview
This is a full-stack Learning Management System (LMS) with React Native frontend and Express.js backend. The app supports student and admin roles with course management, lectures, and video uploads.

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL (running on localhost:5432)
- Expo CLI (`npm install -g expo-cli`)

## Installation

### 1. Install Dependencies

```powershell
# Install root (frontend) dependencies
npm install

# Install backend dependencies
npm install --prefix backend
```

### 2. Setup Database
Ensure PostgreSQL is running and create the database:

```powershell
# Run migrations to create tables
npm run migrate --prefix backend
```

### 3. Seed Admin User (Optional)
Seed an admin account for testing:

```powershell
npm run seed:admin --prefix backend
```

**Default Admin Credentials:**
- Email: `academics@stackuplearning.com`
- Password: `123456758`

## Running the Application

### Option 1: Run Both Backend & Frontend Together (Recommended for Development)

```powershell
npm run start:all
```

This starts:
- **Backend Server**: `http://localhost:8080`
- **Expo Metro Bundler**: Waiting on `http://localhost:8081`
- **Swagger API Docs**: `http://localhost:8080/api-docs`

### Option 2: Run Backend & Frontend Separately

**Terminal 1 - Backend:**
```powershell
npm run dev --prefix backend
```

**Terminal 2 - Frontend:**
```powershell
npm start
```

## Accessing the App

### Web (Browser)
After running `npm start`, press `w` in the terminal to open the app in your browser.

### Expo Go (Android/iOS)
1. Install Expo Go on your phone
2. Scan the QR code displayed in the terminal
3. App opens on your phone over LAN

### Android Emulator
Press `a` in the terminal to launch Android emulator

### iOS Simulator
Press `i` in the terminal to launch iOS simulator (macOS only)

## Testing Login Workflows

### Student Login
Use any registered account:
- Dashboard shows available courses
- Can enroll in free courses
- View course content

### Admin Login
Use admin credentials:
- Email: `academics@stackuplearning.com`
- Password: `123456758`
- Redirects to Admin Panel
- Can create courses, manage lectures, upload videos

## Key Features Implemented

### ✅ Student Features
- User registration with phone validation
- Secure login with password rules
- Dashboard with published courses
- View course details
- Profile management
- Logout

### ✅ Admin Features
- Admin detection and role-based routing
- Admin Dashboard with course stats
- Create courses (free or paid)
- Manage courses (publish/unpublish)
- Add lectures to courses
- Upload video files
- Quick actions panel

### ✅ API Integration
- Secure axios client with cookie-based auth
- Proper error handling with retry
- Admin/student role routing
- Response parsing for all endpoints
- Arcjet protection bypass in development

## Environment Configuration

### Backend (.env)
Located in `backend/.env`:
```env
PORT=8080
JWT_SECRET=^3(A"iuIh2&:erW
NODE_ENV=development
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=abhi
DB_HOST=localhost
DB_PORT=5432
```

### Frontend (Auto-configured)
The app automatically detects:
- Android emulator: `http://10.0.2.2:8080`
- iOS simulator/device: Derives from debuggerHost
- Web: Uses `window.location.hostname`

Override with env var:
```powershell
$env:BACKEND_URL='http://your-ip:8080'
npm start
```

## Password Requirements
For registration and password reset:
- **Minimum 8 characters**
- **At least 1 uppercase letter (A-Z)**
- **At least 1 lowercase letter (a-z)**
- **At least 1 number (0-9)**
- **At least 1 special character (@$!%*?&)**

Example: `Abcde@123`

## Phone Number Format
- **Exactly 10 digits**
- No spaces or special characters
- Example: `1234567890`

## Troubleshooting

### "Failed to load data" on Dashboard
- **Cause**: Backend not running or CORS issues
- **Fix**: Ensure backend is running on `http://localhost:8080`
- **Check**: Visit `http://localhost:8080` in browser

### "Bot Detected" Login Error
- **Cause**: Arcjet protection is active in production mode
- **Fix**: App auto-bypasses in development mode
- **Note**: Only happens in production (`NODE_ENV=production`)

### Video Upload Fails
- **Cause**: Missing multipart form-data support
- **Fix**: Backend already configured, ensure file size < 500MB
- **Check**: AWS S3 credentials in `.env`

### Database Connection Refused
- **Cause**: PostgreSQL not running
- **Fix**: Start PostgreSQL service
- **Verify**: `psql -U postgres -d postgres` in terminal

### Port 8080 Already in Use
- **Fix**: Kill existing process or change PORT in `.env`
- **Check**: `Get-Process node | Stop-Process -Force`

## API Endpoints Summary

### Authentication
- `POST /api/v1/user/register` - Register new user
- `POST /api/v1/user/login` - Login (sets httpOnly cookie)
- `GET /api/v1/user/logout` - Logout
- `GET /api/v1/user/profile` - Get user profile (requires auth)

### Courses
- `GET /api/v1/course/published-course` - Get all published courses (public)
- `GET /api/v1/course/creator` - Get admin's courses (requires auth + admin)
- `POST /api/v1/course/create` - Create course (requires auth + admin)
- `PATCH /api/v1/course/publish/:courseId` - Publish/unpublish (requires auth + admin)

### Lectures & Videos
- `POST /api/v1/video/create/:courseId` - Upload lecture video (requires auth + admin)

## File Structure

```
app/
├── auth/
│   ├── login.tsx          (Student/Admin login)
│   └── register.tsx       (Registration with phone)
├── (tabs)/
│   ├── dashboard.tsx      (Student dashboard)
│   ├── courses.tsx        (Course list)
│   └── profile.tsx        (User profile)
├── admin/
│   ├── index.tsx          (Admin dashboard)
│   ├── create-course.tsx  (Create new course)
│   ├── manage-courses.tsx (List & manage courses)
│   └── add-lecture/
│       └── [courseId].tsx (Add lectures with video)
└── _layout.tsx            (Main routing)

utils/
└── api.ts                 (Axios client with auth)

backend/
├── server.js              (Express app)
├── user/                  (User routes & controller)
├── course/                (Course routes & controller)
├── lecture/               (Lecture routes & controller)
└── middleware/            (Auth, rate limit, Arcjet)
```

## Development Tips

### Hot Reload
Changes to TypeScript/React files auto-reload in Expo Go and web.

### Debug Mode
Press `j` in Expo terminal to open debugger.

### Clear Cache
```powershell
npm start -- --clear
```

### Reset Watchman (Mac)
```bash
watchman watch-del-all
```

## Performance Notes

- **Video Upload**: Uses AWS S3 via multer-s3 plugin
- **Database**: PostgreSQL with Sequelize ORM
- **Rate Limiting**: Arcjet protection (development mode disabled)
- **Authentication**: JWT tokens in httpOnly cookies

## Support

For issues:
1. Check backend logs: Look for error messages in terminal
2. Enable verbose logging: Add `debug: true` to axios config
3. Check browser console (web): F12 > Console tab
4. Clear app cache and restart

## Next Steps

- Deploy to Heroku or AWS
- Configure production database
- Set up CI/CD pipeline
- Add more course content types
- Implement payment gateway for paid courses
