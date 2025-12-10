import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './config/database.js';
import { swaggerSpec, swaggerUi } from "./config/swagger.js";
import courseRoute from "./course/course.route.js";
import courseProgressRoute from "./courseProgress/courseProgress.route.js";
import enrollmentRoute from "./enrollment/enrollment.route.js";
import lectureRoute from "./lecture/lecture.route.js";
import { globalLimiter } from "./middleware/rateLimit.js";
import userRoute from './user/user.route.js';
import userFormRoutes from "./userForm/userForm.route.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isVercel = process.env.VERCEL === '1';

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(globalLimiter);

// Lazy database connection for serverless
let dbConnected = false;
const ensureDbConnection = async () => {
    if (!dbConnected) {
        try {
            await connectDB();
            dbConnected = true;
        } catch (error) {
            console.error('Database connection failed:', error);
            throw error;
        }
    }
};

// Database connection middleware - connects on first request
app.use(async (req, res, next) => {
    try {
        await ensureDbConnection();
        next();
    } catch (error) {
        console.error('Database middleware error:', error);
        res.status(503).json({
            success: false,
            message: 'Database connection unavailable',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/video", lectureRoute);
app.use("/api/v1/form", userFormRoutes);
app.use("/api/v1/course-progress", courseProgressRoute);
app.use("/api/v1/enrollment", enrollmentRoute);

// Root route
app.get("/", (_, res) => {
    res.send("API is working and PostgreSQL Connected ✅");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server only in non-serverless environment
if (!isVercel) {
    ensureDbConnection().then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
            console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
        });
    }).catch((error) => {
        console.error('Failed to start server:', error);
        process.exit(1);
    });
}

// Export for Vercel serverless
export default app;
