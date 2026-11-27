import api from "./api";

export interface GithubAccount {
    id: string;
    candidateId: string;
    githubUsername: string;
    profileUrl: string;
    avatarUrl?: string;
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

export interface GithubConnectSuccessResponse {
    account: GithubAccount;
    repositories: GithubRepository[];
}

export interface GitAnalysisStatus {
    account: GithubAccount | null;
    repositories: GithubRepository[];
    report: GitVerificationReport | null;
}

export const gitAnalysisService = {
    getStatus: async (candidateId: string) => {
        const response = await api.get<GitAnalysisStatus>(`/api/v1/git/status/${candidateId}`);
        return response.data;
    },

    getOAuthAuthorizeUrl: async () => {
        const response = await api.get<{ authorizeUrl: string }>("/api/v1/git/oauth/authorize-url");
        return response.data;
    },

    handleOAuthCallback: async (candidateId: string, code: string, state: string) => {
        const response = await api.post<GithubConnectSuccessResponse>(
            "/api/v1/git/oauth/callback",
            { candidateId, code, state }
        );
        return response.data;
    },

    syncRepositories: async (candidateId: string) => {
        const response = await api.post<GithubRepository[]>(`/api/v1/git/sync/${candidateId}`);
        return response.data;
    },

    analyzeGit: async (candidateId: string, selectedRepoIds: string[]) => {
        const response = await api.post<GitVerificationReport>(`/api/v1/git/analyze/${candidateId}`, {
            selectedRepoIds,
        });
        return response.data;
    },
};
