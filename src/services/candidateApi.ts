import axios from "axios";

const candidateApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "",
    headers: {
        "Content-Type": "application/json",
    },
});

// Tự động gắn Authorization Bearer token cho tất cả API liên quan tới Candidate Profile
candidateApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default candidateApi;
