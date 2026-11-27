import api from "./api";
import type {
    AuthResponse,
    RegisterRequest,
    LoginRequest,
} from "../types/authTypes";
import { clearCandidateProfileCache } from "./candidateProfileService";

// Đăng ký tài khoản
export const register = async (data: RegisterRequest) => {
    const response = await api.post<AuthResponse>(
        "/api/v1/auth/register",
        data
    );

    return response.data;
};

// Đăng nhập
export const login = async (data: LoginRequest) => {
    const response = await api.post<AuthResponse>(
        "/api/v1/auth/login",
        data
    );

    return response.data;
};

export function saveSession(account: AuthResponse, email: string) {
    if (!account.accessToken || !account.role) {
        throw new Error("Phản hồi xác thực thiếu thông tin phiên.");
    }

    clearCandidateProfileCache();
    localStorage.setItem("accessToken", account.accessToken);
    localStorage.setItem("role", account.role);
    localStorage.setItem("accountEmail", account.email?.trim() || email);
}

// Xóa sạch toàn bộ dữ liệu phiên (localStorage, sessionStorage)
export const clearSession = (): void => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("accountEmail");
    clearCandidateProfileCache();
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

