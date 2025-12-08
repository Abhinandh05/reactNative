import axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Determine backend URL in a variety of dev environments:
// - Android emulator: use 10.0.2.2
// - iOS / Expo Go on simulator or device: derive IP from debuggerHost
// - Web: use window.location.hostname
// - Allow `BACKEND_URL` env override via `process.env.BACKEND_URL` when available
function getBackendUrl() {
    const envOverride = typeof process !== 'undefined' && (process as any).env && (process as any).env.BACKEND_URL;
    if (envOverride) return envOverride;

    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:8080';
    }

    // Web (in browser)
    if (Platform.OS === 'web') {
        try {
            const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
            return `http://${host}:8080`;
        } catch {
            return 'http://localhost:8080';
        }
    }

    // For native iOS / Android devices (Expo Go), try to derive the LAN IP from the manifest.debuggerHost
    const debuggerHost = Constants.manifest?.debuggerHost as string | undefined;
    if (debuggerHost) {
        const host = debuggerHost.split(':')[0];
        return `http://${host}:3000`;
    }

    return 'http://localhost:3000';
}

const BASE_URL = getBackendUrl();

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // send and receive cookies (backend sets httpOnly cookie)
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors widely if needed
api.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
