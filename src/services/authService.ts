import api from "./api";
import type {
    RegisterRequest,
    LoginRequest,
} from "../types/authTypes";

export const register = async (data: RegisterRequest) => {
    const response = await api.post(
        "/api/v1/auth/register",
        data
    );

    return response.data;
};

export const login = async (data: LoginRequest) => {
    const response = await api.post(
        "/api/v1/auth/login",
        data
    );

    return response.data;
};