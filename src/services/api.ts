import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Tự động đính kèm Access Token
api.interceptors.request.use((config) => {
    const url = config.url || "";

    // Những API không cần Access Token
    const publicEndpoints = [
        "/api/v1/auth/login",
        "/api/v1/auth/register",
    ];

    const isPublicEndpoint = publicEndpoints.some(
        (endpoint) => url.includes(endpoint)
    );

    // Chỉ gửi token khi API không phải public
    if (!isPublicEndpoint) {
        const token = localStorage.getItem("accessToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } else {
        // Đảm bảo không gửi token cũ vào Login/Register
        delete config.headers.Authorization;
    }

    return config;
});

export default api;
