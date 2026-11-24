
import {
    Building2,
    MapPin,
    Users,
    Globe,
    Hash,
} from "lucide-react";

import styles from "./CompanyInfo.module.css";

interface CompanyInfoProps {
    companyName?: string;
    taxCode?: string;
    address?: string;
    size?: string;
    website?: string;
    fields?: string[];
}

function CompanyInfo({
    companyName,
    taxCode,
    address,
    size,
    website,
    fields = [],
}: CompanyInfoProps) {
    return (
        <section className={styles.card}>
            <div className={styles.cardHeader}>
                <h2>Thông tin công ty</h2>
            </div>

            <div className={styles.companyHeader}>
                <div className={styles.logo}>
                    <Building2 size={30} />
                </div>

                <div className={styles.companyName}>
                    <h3>{companyName || "Chưa cập nhật"}</h3>

                    <span className={styles.companyStatus}>
                        Đã xác thực
                    </span>
                </div>
            </div>

            <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                    <Hash size={17} />
                    <div>
                        <span>Mã số thuế / GPKD</span>
                        <p>{taxCode || "Chưa cập nhật"}</p>
                    </div>
                </div>

                <div className={styles.infoItem}>
                    <Users size={17} />
                    <div>
                        <span>Quy mô nhân sự</span>
                        <p>{size || "Chưa cập nhật"}</p>
                    </div>
                </div>

                <div className={styles.infoItem}>
                    <MapPin size={17} />
                    <div>
                        <span>Địa chỉ trụ sở</span>
                        <p>{address || "Chưa cập nhật"}</p>
                    </div>
                </div>

                <div className={styles.infoItem}>
                    <Globe size={17} />
                    <div>
                        <span>Website</span>
                        <p>{website || "Chưa cập nhật"}</p>
                    </div>
                </div>
            </div>

            <div className={styles.fieldSection}>
                <span>Lĩnh vực hoạt động</span>

                <div className={styles.fieldList}>
                    {fields.length > 0 ? (
                        fields.map((field) => (
                            <span
                                key={field}
                                className={styles.fieldTag}
                            >
                                {field}
                            </span>
                        ))
                    ) : (
                        <span>Chưa cập nhật</span>
                    )}
                </div>
            </div>
        </section>
    );
}

export default CompanyInfo;
