import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { Building2, ContactRound, Users } from "lucide-react";

import Button from "../../../../components/common/button/Button";
import Spinner from "../../../../components/common/spinner/Spinner";
import {
    getCompanyRecruiters,
    getRecruiterProfile,
} from "../../../../services/recruiterProfileService";
import type {
    CompanyProfileResponse,
    RecruiterProfileResponse,
} from "../../../../types/authTypes";
import panel from "../CompanyPanel.module.css";

interface CompanyTeamProps {
    company: CompanyProfileResponse | null;
    email: string | null;
}

function CompanyTeam({ company, email }: CompanyTeamProps) {
    const companyId = company?.companyId;
    const [members, setMembers] = useState<RecruiterProfileResponse[]>([]);
    const [self, setSelf] = useState<RecruiterProfileResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [identityUnavailable, setIdentityUnavailable] = useState(false);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        let active = true;

        async function loadTeam() {
            setLoading(true);
            setError("");
            try {
                let recruiter: RecruiterProfileResponse | null = null;
                try {
                    recruiter = await getRecruiterProfile();
                } catch (err) {
                    const missing = isAxiosError(err) && err.response?.status === 404;
                    if (!missing && !companyId) throw err;
                    if (active) {
                        setIdentityUnavailable(!missing);
                    }
                }
                if (!active) return;
                const teamId = companyId || recruiter?.companyId;
                const roster = teamId ? await getCompanyRecruiters(teamId) : [];
                if (active) {
                    setSelf(recruiter);
                    setMembers(roster);
                    if (recruiter) setIdentityUnavailable(false);
                }
            } catch {
                if (active) setError("Không thể tải đội ngũ tuyển dụng.");
            } finally {
                if (active) setLoading(false);
            }
        }

        void loadTeam();
        return () => {
            active = false;
        };
    }, [companyId, attempt]);

    return (
        <section id="company-team" tabIndex={-1}>
            <div className={panel.heading}>
                <h2><Users size={20} /> Doanh nghiệp & đội ngũ</h2>
            </div>
            {company && (
                <div className={panel.row}>
                    <Building2 size={22} aria-hidden="true" />
                    <div>
                        <strong>{company.companyName}</strong>
                        <small>{company.headquartersAddress}</small>
                        <small>Đại diện pháp luật · {company.legalRepresentative}</small>
                    </div>
                </div>
            )}
            <h3 className={panel.subheading}>
                Đội ngũ tuyển dụng
                {!loading && !error && ` · ${members.length} thành viên`}
            </h3>
            {loading ? (
                <Spinner size="sm" label="Đang tải đội ngũ…" />
            ) : error ? (
                <div role="alert">
                    <p className={panel.description}>{error}</p>
                    <Button variant="outline" onClick={() => setAttempt(attempt + 1)}>
                        Thử lại
                    </Button>
                </div>
            ) : members.length > 0 ? (
                <ul className={panel.list}>
                    {members.map((member) => {
                        const current = member.recruiterId === self?.recruiterId;
                        const shortId = member.recruiterId.slice(0, 8);

                        return (
                            <li className={panel.row} key={member.recruiterId}>
                                <ContactRound size={21} aria-hidden="true" />
                                <div>
                                    <strong>
                                        {current ? email || "Tài khoản của bạn" : `Nhà tuyển dụng · ${shortId}`}
                                    </strong>
                                    <small>
                                        {current ? "Bạn" : "Thành viên"}
                                        {member.createdAt && (
                                            <> · Tham gia {new Date(member.createdAt).toLocaleDateString("vi-VN")}</>
                                        )}
                                    </small>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className={panel.description}>Chưa có thành viên trong đội ngũ.</p>
            )}
            {!loading && !error && identityUnavailable && (
                <p className={panel.description}>
                    Chưa xác định được tài khoản của bạn trong danh sách.
                    {" "}
                    <button type="button" onClick={() => setAttempt(attempt + 1)}>
                        Thử lại
                    </button>
                </p>
            )}
        </section>
    );
}

export default CompanyTeam;
