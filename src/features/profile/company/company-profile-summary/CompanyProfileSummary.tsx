import { useState } from "react";
import {
    Building2,
    MapPin,
    Pencil,
    Plus,
    Share2,
    Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Button from "../../../../components/common/button/Button";
import Spinner from "../../../../components/common/spinner/Spinner";
import { ROUTES } from "../../../../routers/routePaths";
import type { CompanyProfileResponse } from "../../../../types/authTypes";
import styles from "./CompanyProfileSummary.module.css";

interface CompanyProfileSummaryProps {
    company: CompanyProfileResponse | null;
    email: string | null;
    loading: boolean;
    onEdit: () => void;
}

function CompanyProfileSummary({
    company,
    email,
    loading,
    onEdit,
}: CompanyProfileSummaryProps) {
    const navigate = useNavigate();
    const [shareMessage, setShareMessage] = useState("");

    async function copyContact() {
        if (!company) return;
        const contact = [
            company.companyName,
            company.headquartersAddress,
            email,
        ].filter(Boolean).join("\n");

        try {
            await navigator.clipboard.writeText(contact);
            setShareMessage("Đã sao chép thông tin liên hệ.");
        } catch {
            setShareMessage("Trình duyệt chưa cho phép sao chép.");
        }
    }

    return (
        <header className={styles.hero}>
            <div className={styles.cover} aria-hidden="true" />
            <div className={styles.identity}>
                <div className={styles.avatar} aria-hidden="true">
                    <Building2 size={36} />
                </div>
                <div className={styles.description}>
                    <p>Hồ sơ nhà tuyển dụng</p>
                    {loading ? (
                        <Spinner size="sm" label="Đang tải hồ sơ…" />
                    ) : (
                        <h1>{company?.companyName || email || "Nhà tuyển dụng"}</h1>
                    )}
                    {company?.headquartersAddress && (
                        <span><MapPin size={16} /> {company.headquartersAddress}</span>
                    )}
                    {company && email && <span>{email}</span>}
                </div>
                <div className={styles.actions}>
                    <Button onClick={() => navigate(ROUTES.RECRUITER.JOB_CREATE)}>
                        <Plus size={16} /> Tạo tin mới
                    </Button>
                    {company && (
                        <Button variant="outline" onClick={onEdit}>
                            <Pencil size={16} /> Chỉnh sửa hồ sơ
                        </Button>
                    )}
                    <a href="#company-team">
                        <Users size={16} /> Đội ngũ
                    </a>
                    {company && (
                        <Button
                            variant="outline"
                            onClick={copyContact}
                            title="Sao chép thông tin liên hệ"
                            aria-label="Sao chép thông tin liên hệ"
                        >
                            <Share2 size={16} />
                        </Button>
                    )}
                </div>
                {shareMessage && <p className={styles.notice} role="status">{shareMessage}</p>}
            </div>
        </header>
    );
}

export default CompanyProfileSummary;
