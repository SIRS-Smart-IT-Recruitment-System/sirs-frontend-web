
import api from "./api";
import type {
    RegisterRequest,
    LoginRequest,
} from "../types/authTypes";

// Đăng ký tài khoản
export const register = async (data: RegisterRequest) => {
    const response = await api.post(
        "/api/v1/auth/register",
        data
    );

    return response.data;
};

// Đăng nhập
export const login = async (data: LoginRequest) => {
    const response = await api.post(
        "/api/v1/auth/login",
        data
    );

    return response.data;
};

// Xóa sạch toàn bộ dữ liệu phiên (localStorage, sessionStorage)
export const clearSession = (): void => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    sessionStorage.clear();
};

// Hàm gọi API Đăng xuất
export const logout = async (): Promise<void> => {
    try {
        await api.post("/api/v1/auth/logout");
    } catch (error) {
        console.warn("API logout error or not supported:", error);
    } finally {
        clearSession();
    }
};

