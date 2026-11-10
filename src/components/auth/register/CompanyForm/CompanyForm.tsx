import { useState } from "react";
import styles from "./CompanyForm.module.css";
import Button from "../../../ui/button/Button";
import Input from "../../../ui/input/Input";

interface CompanyFormProps {
    onBack?: () => void;
}

const CompanyForm = (_props: CompanyFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [companyName, setCompanyName] = useState("");
    const [address, setAddress] = useState("");
    const [businessId, setBusinessId] = useState("");
    const [representative, setRepresentative] = useState("");

    const [errors, setErrors] = useState({
        companyName: "",
        address: "",
        businessId: "",
        representative: "",
    });

    const handleCompleteRegister = () => {
        if (isLoading) return;

        // Bắt đầu Loading
        setIsLoading(true);

        setTimeout(() => {
            const newErrors = {
                companyName: "",
                address: "",
                businessId: "",
                representative: "",
            };

            if (!companyName.trim()) {
                newErrors.companyName = "Vui lòng nhập tên doanh nghiệp";
            }

            if (!address.trim()) {
                newErrors.address = "Vui lòng nhập địa chỉ trụ sở";
            }

            if (!businessId.trim()) {
                newErrors.businessId = "Vui lòng nhập mã số doanh nghiệp";
            } else if (!/^\d{10}(\d{3})?$/.test(businessId)) {
                newErrors.businessId = "Mã số doanh nghiệp phải gồm 10 hoặc 13 chữ số";
            }

            if (!representative.trim()) {
                newErrors.representative = "Vui lòng nhập tên người đại diện";
            }

            setIsLoading(false);

            setErrors(newErrors);

            if (
                !newErrors.companyName &&
                !newErrors.address &&
                !newErrors.businessId &&
                !newErrors.representative
            ) {
                console.log("Thông tin doanh nghiệp hợp lệ");
            }
        }, 2000);
    };

    return (
        <div className={styles.companyForm}>
            <div className={styles.heading}>
                <h2>ĐĂNG KÝ DOANH NGHIỆP</h2>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
                <div className={styles.formGroup}>
                    <Input
                        type="text"
                        label="Tên doanh nghiệp"
                        placeholder="Nhập tên doanh nghiệp của bạn"
                        value={companyName}
                        onChange={(e) => {
                            setCompanyName(e.target.value);
                            setErrors((prev) => ({
                                ...prev,
                                companyName: "",
                            }));
                        }}
                        error={errors.companyName}
                    />
                </div>

                <div className={styles.formGroup}>
                    <Input
                        type="text"
                        label="Địa chỉ trụ sở"
                        placeholder="Nhập địa chỉ doanh nghiệp"
                        value={address}
                        onChange={(e) => {
                            setAddress(e.target.value);
                            setErrors((prev) => ({
                                ...prev,
                                address: "",
                            }));
                        }}
                        error={errors.address}
                    />
                </div>

                <div className={styles.formGroup}>
                    <Input
                        type="text"
                        label="Mã số doanh nghiệp"
                        placeholder="Nhập mã số doanh nghiệp"
                        value={businessId}
                        onChange={(e) => {
                            setBusinessId(e.target.value);
                            setErrors((prev) => ({
                                ...prev,
                                businessId: "",
                            }));
                        }}
                        error={errors.businessId}
                    />
                </div>

                <div className={styles.formGroup}>
                    <Input
                        type="text"
                        label="Người đại diện theo pháp luật"
                        placeholder="Nhập tên người đại diện"
                        value={representative}
                        onChange={(e) => {
                            setRepresentative(e.target.value);
                            setErrors((prev) => ({
                                ...prev,
                                representative: "",
                            }));
                        }}
                        error={errors.representative}
                    />
                </div>

                <Button
                    type="button"
                    variant="primary"
                    className={styles.submitButton}
                    onClick={handleCompleteRegister}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className={styles.spinner} />
                            Đang đăng ký...
                        </>
                    ) : (
                        "Hoàn tất đăng ký"
                    )}
                </Button>
            </form>
        </div>
    );
};

export default CompanyForm;