import type { CompanyProfileResponse } from "../../../../types/authTypes";
import BusinessLicense from "../business-license/BusinessLicense";
import CompanyInfo from "../company-info/CompanyInfo";
import ContactInfo from "../contact-info/ContactInfo";
import ImageGallery from "../image-gallery/ImageGallery";
import styles from "./CompanyRecords.module.css";

function CompanyRecords({ company }: { company: CompanyProfileResponse }) {
    return (
        <details className={styles.records}>
            <summary>Thông tin pháp lý & tài liệu doanh nghiệp</summary>
            <div className={styles.content}>
                <CompanyInfo
                    taxCode={company.businessRegistrationNumber}
                    address={company.headquartersAddress}
                    createdAt={company.createdAt}
                    updatedAt={company.updatedAt}
                />
                <ContactInfo contactPerson={company.legalRepresentative} />
                <BusinessLicense />
                <ImageGallery />
            </div>
        </details>
    );
}

export default CompanyRecords;
