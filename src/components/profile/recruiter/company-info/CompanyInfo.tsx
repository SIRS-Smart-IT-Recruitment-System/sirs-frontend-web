import { Building2, MapPin, Users, Globe, Hash } from "lucide-react";
import { company } from "../recruiterProfileData";
import styles from "./CompanyInfo.module.css";

interface CompanyInfoProps {
    companyName?: string;
    taxCode?: string;
    address?: string;
    size?: string;
    website?: string;
}

function CompanyInfo({
    companyName,
    taxCode,
    address,
    size = company.size,
    website = company.website,
}: CompanyInfoProps) {
    const displayName = companyName || company.name;
    const displayTaxCode = taxCode || company.taxCode;
    const displayAddress = address || company.address;

    return (
        <section className={styles.card}>
            {/* Tiêu đề */}
            <div className={styles.cardHeader}>
                <h2>Thông tin công ty</h2>
            </div>

            {/* Logo và tên công ty */}
            <div className={styles.companyHeader}>
                <div className={styles.logo}>
                    <Building2 size={30} />
                </div>

                <div className={styles.companyName}>
                    <h3>{displayName}</h3>

                    <span className={styles.companyStatus}>
                        Đã xác thực
                    </span>
                </div>
            </div>

            {/* Thông tin chi tiết */}
            <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                    <Hash size={17} />

                    <div>
                        <span>Mã số thuế / GPKD</span>
                        <p>{displayTaxCode}</p>
                    </div>
                </div>

                <div className={styles.infoItem}>
                    <Users size={17} />

                    <div>
                        <span>Quy mô nhân sự</span>
                        <p>{size}</p>
                    </div>
                </div>

                <div className={styles.infoItem}>
                    <MapPin size={17} />

                    <div>
                        <span>Địa chỉ trụ sở</span>
                        <p>{displayAddress}</p>
                    </div>
                </div>

                <div className={styles.infoItem}>
                    <Globe size={17} />

                    <div>
                        <span>Website</span>
                        <p>{website}</p>
                    </div>
                </div>
            </div>

            {/* Lĩnh vực hoạt động */}
            <div className={styles.fields}>
                <span>Lĩnh vực hoạt động</span>

                <div className={styles.tagList}>
                    {company.fields.map((field) => (
                        <span key={field} className={styles.tag}>
                            {field}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default CompanyInfo;
