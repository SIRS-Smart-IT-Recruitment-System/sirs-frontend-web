import api from "./api";
import type {
    CompanyProfileRequest,
    CompanyProfileResponse,
} from "../types/authTypes";

// Tạo hồ sơ Công ty / Doanh nghiệp
export const createCompanyProfile = async (
    data: CompanyProfileRequest
): Promise<CompanyProfileResponse> => {
    const response = await api.post(
        "/api/v1/company/profile/create",
        data
    );
    return response.data;
};

// Lấy hồ sơ Công ty của tài khoản hiện tại
export const getCompanyProfile = async (): Promise<CompanyProfileResponse> => {
    const response = await api.get("/api/v1/company/profile");
    return response.data;
};

// Cập nhật hồ sơ Công ty
export const updateCompanyProfile = async (
    data: CompanyProfileRequest
): Promise<CompanyProfileResponse> => {
    const response = await api.put("/api/v1/company/profile", data);
    return response.data;
};
