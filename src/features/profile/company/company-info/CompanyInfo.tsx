import { CalendarDays, Hash, MapPin, RefreshCw } from "lucide-react";

import styles from "./CompanyInfo.module.css";

interface CompanyInfoProps {
    taxCode?: string;
    address?: string;
    createdAt?: string;
    updatedAt?: string;
    size?: string;
    website?: string;
    fields?: string[];
}

function formatDate(value?: string) {
    if (!value) return;
    const date = new Date(value);

    if (Number.isFinite(date.getTime())) {
        return date.toLocaleDateString("vi-VN");
    }
}

function CompanyInfo({
    taxCode,
    address,
    createdAt,
    updatedAt,
    size,
    website,
    fields = [],
}: CompanyInfoProps) {
    const facts = [
        { label: "Mã số doanh nghiệp", value: taxCode, icon: Hash },
        { label: "Trụ sở chính", value: address, icon: MapPin },
        { label: "Ngày tạo hồ sơ", value: formatDate(createdAt), icon: CalendarDays },
        { label: "Cập nhật lần cuối", value: formatDate(updatedAt), icon: RefreshCw },
    ];

    return (
        <section>
            <dl className={styles.facts} aria-label="Thông tin công ty">
                {facts.map(({ label, value, icon: Icon }) => (
                    <div className={styles.fact} key={label}>
                        <dt>
                            <Icon size={17} aria-hidden="true" />
                            {label}
                        </dt>
                        <dd>{value || "Chưa cập nhật"}</dd>
                    </div>
                ))}
            </dl>
            <details className={styles.otherFacts}>
                <summary>Thông tin doanh nghiệp khác</summary>
                <dl className={styles.extraList}>
                    <div>
                        <dt>Quy mô nhân sự</dt>
                        <dd>{size || "Chưa cập nhật"}</dd>
                    </div>
                    <div>
                        <dt>Website</dt>
                        <dd>{website || "Chưa cập nhật"}</dd>
                    </div>
                    <div>
                        <dt>Lĩnh vực hoạt động</dt>
                        <dd>{fields.join(", ") || "Chưa cập nhật"}</dd>
                    </div>
                </dl>
            </details>
        </section>
    );
}

export default CompanyInfo;
