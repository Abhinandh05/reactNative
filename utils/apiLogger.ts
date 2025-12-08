/**
 * API Error Logging & Debugging Utility
 * 
 * This utility provides comprehensive error logging for API calls
 * Use this for debugging API issues
 */

interface ErrorInfo {
    timestamp: string;
    endpoint: string;
    method: string;
    status?: number;
    message: string;
    data?: any;
    headers?: any;
}

class APILogger {
    private logs: ErrorInfo[] = [];
    private maxLogs = 50;

    logError(endpoint: string, method: string, error: any) {
        const errorInfo: ErrorInfo = {
            timestamp: new Date().toISOString(),
            endpoint,
            method,
            status: error.response?.status,
            message: error.message,
            data: error.response?.data,
            headers: error.config?.headers,
        };

        this.logs.push(errorInfo);

        // Keep only last 50 logs
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        // Log to console with colors
        console.group(`❌ API Error: ${method} ${endpoint}`);
        console.log('Status:', errorInfo.status);
        console.log('Message:', errorInfo.message);
        console.log('Response:', errorInfo.data);
        console.groupEnd();

        return errorInfo;
    }

    logSuccess(endpoint: string, method: string, data: any) {
        console.log(`✅ ${method} ${endpoint}`, data);
    }

    logRequest(endpoint: string, method: string, data?: any) {
        console.log(`📤 ${method} ${endpoint}`, data);
    }

    getAllLogs() {
        return this.logs;
    }

    getLogsForEndpoint(endpoint: string) {
        return this.logs.filter(log => log.endpoint.includes(endpoint));
    }

    clearLogs() {
        this.logs = [];
    }

    exportLogs() {
        return JSON.stringify(this.logs, null, 2);
    }

    printLastError() {
        if (this.logs.length === 0) {
            console.log('No errors logged');
            return;
        }
        const lastError = this.logs[this.logs.length - 1];
        console.log('Last Error:', lastError);
    }
}

export const apiLogger = new APILogger();

// Export helper functions for common error scenarios

export const handleAPIError = (error: any) => {
    if (!error.response) {
        // Network error
        return {
            type: 'NETWORK_ERROR',
            message: 'Network error. Please check your connection.',
            details: error.message,
        };
    }

    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
        case 400:
            return {
                type: 'VALIDATION_ERROR',
                message: data?.message || 'Invalid request data',
                details: data?.errors || data?.message,
            };
        case 401:
            return {
                type: 'AUTH_ERROR',
                message: 'Please login to continue',
                details: 'Your session has expired',
            };
        case 403:
            return {
                type: 'FORBIDDEN_ERROR',
                message: 'You do not have permission to access this',
                details: data?.message,
            };
        case 404:
            return {
                type: 'NOT_FOUND_ERROR',
                message: 'Resource not found',
                details: data?.message,
            };
        case 429:
            return {
                type: 'RATE_LIMIT_ERROR',
                message: 'Too many requests. Please try again later.',
                details: data?.message,
            };
        case 500:
            return {
                type: 'SERVER_ERROR',
                message: 'Server error. Please try again later.',
                details: data?.message,
            };
        default:
            return {
                type: 'UNKNOWN_ERROR',
                message: 'An error occurred',
                details: data?.message || error.message,
            };
    }
};

// Export API documentation helper
export const getAPIDocumentation = () => {
    return {
        baseURL: 'http://localhost:8080',
        endpoints: {
            auth: {
                login: 'POST /api/v1/user/login',
                register: 'POST /api/v1/user/register',
                logout: 'GET /api/v1/user/logout',
                profile: 'GET /api/v1/user/profile',
            },
            courses: {
                getAllPublished: 'GET /api/v1/course/published-course',
                getFreeCourses: 'GET /api/v1/course/free-courses',
                getPaidCourses: 'GET /api/v1/course/paid-courses',
                getById: 'GET /api/v1/course/{courseId}',
                getCreatorCourses: 'GET /api/v1/course/creator',
                create: 'POST /api/v1/course/create',
                edit: 'PUT /api/v1/course/edit/{courseId}',
                togglePublish: 'PATCH /api/v1/course/publish/{courseId}',
            },
            lectures: {
                getByCourse: 'GET /api/v1/lecture/{courseId}/lecture',
                create: 'POST /api/v1/lecture/lecture',
                edit: 'PUT /api/v1/lecture/{courseId}/lecture/{lectureId}',
                delete: 'DELETE /api/v1/lecture/lecture/{lectureId}',
            },
            enrollment: {
                myEnrolled: 'GET /api/v1/enrollment/my-courses',
                checkAccess: 'GET /api/v1/enrollment/check-access/{courseId}',
                getCourseEnrollments: 'GET /api/v1/enrollment/course/{courseId}',
            },
        },
    };
};

// Debug function to test API connectivity
export const testAPIConnectivity = async (apiInstance: any) => {
    const endpoints = [
        '/api/v1/course/published-course',
        '/api/v1/user/profile',
    ];

    console.log('🧪 Testing API Connectivity...');

    for (const endpoint of endpoints) {
        try {
            const response = await apiInstance.get(endpoint);
            console.log(`✅ ${endpoint} - OK`);
        } catch (error: any) {
            console.log(
                `❌ ${endpoint} - ${error.response?.status || 'Network Error'}`
            );
        }
    }
};
