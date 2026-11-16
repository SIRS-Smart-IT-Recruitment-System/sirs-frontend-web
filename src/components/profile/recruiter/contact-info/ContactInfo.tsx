import {
    Mail,
    Phone,
    User,
    Briefcase,
} from "lucide-react";

import { company } from "../recruiterProfileData";
import styles from "./ContactInfo.module.css";

interface ContactInfoProps {
    contactPerson?: string;
    position?: string;
    email?: string;
    phone?: string;
}

function ContactInfo({
    contactPerson,
    position = company.position,
    email = company.email,
    phone = company.phone,
}: ContactInfoProps) {
    const displayContactPerson = contactPerson || company.contactPerson;

    return (
        <section className={styles.card}>
            {/* Tiêu đề */}
            <div className={styles.cardHeader}>
                <h2>Thông tin liên hệ</h2>
            </div>

            {/* Thông tin liên hệ chia thành 2 cột */}
            <div className={styles.contactGrid}>
                {/* Người đại diện */}
                <div className={styles.contactItem}>
                    <div className={styles.icon}>
                        <User size={18} />
                    </div>

                    <div className={styles.contactInfo}>
                        <span>Người đại diện theo pháp luật</span>
                        <p>{displayContactPerson}</p>
                    </div>
                </div>

                {/* Chức vụ */}
                <div className={styles.contactItem}>
                    <div className={styles.icon}>
                        <Briefcase size={18} />
                    </div>

                    <div className={styles.contactInfo}>
                        <span>Chức vụ</span>
                        <p>{position}</p>
                    </div>
                </div>

                {/* Email */}
                <div className={styles.contactItem}>
                    <div className={styles.icon}>
                        <Mail size={18} />
                    </div>

                    <div className={styles.contactInfo}>
                        <span>Email liên hệ</span>
                        <p>{email}</p>
                    </div>
                </div>

                {/* Số điện thoại */}
                <div className={styles.contactItem}>
                    <div className={styles.icon}>
                        <Phone size={18} />
                    </div>

                    <div className={styles.contactInfo}>
                        <span>Số điện thoại</span>
                        <p>{phone}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ContactInfo;
