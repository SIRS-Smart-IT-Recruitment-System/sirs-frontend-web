import api from "./api";

export interface GithubAccount {
    id: string;
    candidateId: string;
    githubUsername: string;
    profileUrl: string;
    connectedAt: string;
    updatedAt: string;
}

export interface GithubRepository {
    id: string;
    githubRepoId: number;
    repoName: string;
    fullName: string;
    repoUrl: string;
    description: string;
    primaryLanguage: string;
    starsCount: number;
    forksCount: number;
    isFork: boolean;
    isSelected: boolean;
    candidateCommitRatio: number;
    candidateCommitCount: number;
    totalCommitCount: number;
    hasReadme: boolean;
    hasTests: boolean;
    hasCiCd: boolean;
    languagesJson: string;
    repoScore: number;
    pushedAt: string;
    syncedAt: string;
}

export interface GitVerificationReport {
    id: string;
    candidateId: string;
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
    overallScore: number;
    contributionScore: number;
    bestPracticeScore: number;
    consistencyScore: number;
    complexityScore: number;
    summaryJson: string;
    analyzedAt: string;
    evaluatedRepositories: GithubRepository[];
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const gitAnalysisService = {
    // 1. Kết nối tài khoản GitHub
    connectGithub: async (candidateId: string, githubUsername: string, accessToken: string) => {
        const response = await api.post<ApiResponse<GithubAccount>>("/api/v1/git/connect", {
            candidateId,
            githubUsername,
            accessToken,
            profileUrl: `https://github.com/${githubUsername}`,
        });
        return response.data;
    },

    // 2. Đồng bộ Repositories từ GitHub
    syncRepositories: async (candidateId: string) => {
        const response = await api.post<ApiResponse<GithubRepository[]>>(`/api/v1/git/sync/${candidateId}`);
        return response.data;
    },

    // 3. Lấy danh sách Repositories
    getRepositories: async (candidateId: string) => {
        const response = await api.get<ApiResponse<GithubRepository[]>>(`/api/v1/git/repos/${candidateId}`);
        return response.data;
    },

    // 4. Chọn các repo để đánh giá
    selectRepositories: async (candidateId: string, selectedRepoIds: string[]) => {
        const response = await api.put<ApiResponse<GithubRepository[]>>("/api/v1/git/repos/select", {
            candidateId,
            selectedRepoIds,
        });
        return response.data;
    },

    // 5. Kích hoạt phân tích và tính điểm
    analyzeGit: async (candidateId: string) => {
        const response = await api.post<ApiResponse<GitVerificationReport>>(`/api/v1/git/analyze/${candidateId}`);
        return response.data;
    },

    // 6. Lấy báo cáo mới nhất
    getLatestReport: async (candidateId: string) => {
        const response = await api.get<ApiResponse<GitVerificationReport>>(`/api/v1/git/report/${candidateId}`);
        return response.data;
    },
};
