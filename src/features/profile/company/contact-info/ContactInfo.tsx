import {
    Mail,
    Phone,
    User,
    Briefcase,
} from "lucide-react";

import styles from "./ContactInfo.module.css";

interface ContactInfoProps {
    contactPerson?: string;
    position?: string;
    email?: string;
    phone?: string;
}

function ContactInfo({
    contactPerson,
    position,
    email,
    phone,
}: ContactInfoProps) {

    return (
        <section className={styles.card}>

            <div className={styles.cardHeader}>
                <h2>Thông tin liên hệ</h2>
            </div>

            <div className={styles.contactGrid}>

                <div className={styles.contactItem}>
                    <div className={styles.icon}>
                        <User size={18} />
                    </div>

                    <div className={styles.contactInfo}>
                        <span>Người đại diện theo pháp luật</span>
                        <p>{contactPerson || "Chưa cập nhật"}</p>
                    </div>
                </div>

                <div className={styles.contactItem}>
                    <div className={styles.icon}>
                        <Briefcase size={18} />
                    </div>

                    <div className={styles.contactInfo}>
                        <span>Chức vụ</span>
                        <p>{position || "Chưa cập nhật"}</p>
                    </div>
                </div>

                <div className={styles.contactItem}>
                    <div className={styles.icon}>
                        <Mail size={18} />
                    </div>

                    <div className={styles.contactInfo}>
                        <span>Email liên hệ</span>
                        <p>{email || "Chưa cập nhật"}</p>
                    </div>
                </div>

                <div className={styles.contactItem}>
                    <div className={styles.icon}>
                        <Phone size={18} />
                    </div>

                    <div className={styles.contactInfo}>
                        <span>Số điện thoại</span>
                        <p>{phone || "Chưa cập nhật"}</p>
                    </div>
                </div>

            </div>

        </section>
    );
}

export default ContactInfo;