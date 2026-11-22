    import styles from "./RoleSelect.module.css";

    interface RoleSelectProps {
        onBack?: () => void;
        onSelectCandidate: () => void;
        onSelectCompany: () => void;
    }

    const RoleSelect = ({ onSelectCandidate, onSelectCompany }: RoleSelectProps) => {
        return (
            <div className={styles.roleSelect}>

                <h2 className={styles.title}>Chọn Vị Trí Của Bạn</h2>

                <div className={styles.roleCards}>

                    <button
                        type="button"
                        className={styles.roleCard}
                        onClick={onSelectCompany}
                    >
                        <div className={styles.roleIcon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15l.75 18H3.75L4.5 3z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V9h6v12M9 9h6" />
                            </svg>
                        </div>
                        <span className={styles.roleName}>Nhà tuyển dụng</span>
                        <span className={styles.roleDesc}>Tìm kiếm và tuyển dụng ứng viên</span>
                    </button>

                    <button
                        type="button"
                        className={styles.roleCard}
                        onClick={onSelectCandidate}
                    >
                        <div className={`${styles.roleIcon} ${styles.roleIconGreen}`}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                        </div>
                        <span className={styles.roleName}>Ứng viên</span>
                        <span className={styles.roleDesc}>Tìm công việc mơ ước của bạn</span>
                    </button>

                </div>

            </div>
        );
    };

    export default RoleSelect;

