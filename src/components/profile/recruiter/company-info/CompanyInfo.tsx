import {Building2, MapPin, Users, Globe, Hash} from "lucide-react";
import { company } from "../recruiterProfileData";
import styles from "./CompanyInfo.module.css";

function CompanyInfo() {
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
                    <h3>{company.name}</h3>

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
                        <span>Mã số thuế</span>
                        <p>{company.taxCode}</p>
                    </div>
                </div>

                <div className={styles.infoItem}>
                    <Users size={17} />

                    <div>
                        <span>Quy mô nhân sự</span>
                        <p>{company.size}</p>
                    </div>
                </div>

                <div className={styles.infoItem}>
                    <MapPin size={17} />

                    <div>
                        <span>Địa chỉ</span>
                        <p>{company.address}</p>
                    </div>
                </div>

                <div className={styles.infoItem}>
                    <Globe size={17} />

                    <div>
                        <span>Website</span>
                        <p>{company.website}</p>
                    </div>
                </div>
            </div>

            {/* Lĩnh vực hoạt động */}
            <div className={styles.fieldSection}>
                <span>Lĩnh vực hoạt động</span>

                <div className={styles.fieldList}>
                    {company.fields.map((field) => (
                        <span
                            key={field}
                            className={styles.fieldTag}
                        >
                            {field}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default CompanyInfo;
