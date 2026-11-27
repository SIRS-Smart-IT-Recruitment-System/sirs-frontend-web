import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
    Building2,
    CalendarDays,
    CircleDollarSign,
    Eye,
    MapPin,
} from "lucide-react";

import Button from "../../components/common/button/Button";
import Input from "../../components/common/input/Input";
import Modal from "../../components/common/modal/Modal";
import Select from "../../components/common/select/Select";
import Textarea from "../../components/common/textarea/Textarea";
import type { JobPreview } from "./jobPreviewData";

import styles from "./JobsPreview.module.css";

export type JobDraft = Pick<
    JobPreview,
    | "title"
    | "location"
    | "salary"
    | "level"
    | "workType"
    | "category"
    | "deadline"
    | "description"
    | "requirements"
    | "benefits"
>;

interface JobFormModalProps {
    isOpen: boolean;
    job?: JobPreview | null;
    onClose: () => void;
    onSave: (draft: JobDraft) => void;
}

const emptyDraft: JobDraft = {
    title: "",
    location: "",
    salary: "",
    level: "",
    workType: "",
    category: "",
    deadline: "",
    description: "",
    requirements: [],
    benefits: [],
};

const levelOptions = [
    { label: "Junior", value: "Junior" },
    { label: "Middle", value: "Middle" },
    { label: "Senior", value: "Senior" },
    { label: "Lead", value: "Lead" },
];

const workTypeOptions = [
    { label: "Toàn thời gian", value: "Toàn thời gian" },
    { label: "Bán thời gian", value: "Bán thời gian" },
    { label: "Hybrid", value: "Hybrid" },
    { label: "Từ xa", value: "Từ xa" },
];

function getJobDraft(job?: JobPreview | null): JobDraft {
    if (!job) {
        return emptyDraft;
    }

    return {
        title: job.title,
        location: job.location,
        salary: job.salary,
        level: job.level,
        workType: job.workType,
        category: job.category,
        deadline: job.deadline,
        description: job.description,
        requirements: job.requirements,
        benefits: job.benefits,
    };
}

function JobFormModal({
    isOpen,
    job,
    onClose,
    onSave,
}: JobFormModalProps) {
    const [draft, setDraft] = useState<JobDraft>(() => getJobDraft(job));
    const [requirementsText, setRequirementsText] = useState(
        () => job?.requirements.join("\n") ?? ""
    );
    const [benefitsText, setBenefitsText] = useState(
        () => job?.benefits.join("\n") ?? ""
    );

    const updateDraft = (
        event: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = event.target;

        setDraft((currentDraft) => ({
            ...currentDraft,
            [name]: value,
        }));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        onSave({
            ...draft,
            requirements: requirementsText
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean),
            benefits: benefitsText
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean),
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={job ? "Chỉnh sửa tin tuyển dụng" : "Tạo tin tuyển dụng"}
            footer={(
                <div className={styles.formFooter}>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        form="preview-job-form"
                    >
                        {job ? "Lưu bản xem trước" : "Tạo bản xem trước"}
                    </Button>
                </div>
            )}
        >
            <form
                id="preview-job-form"
                className={styles.jobForm}
                onSubmit={handleSubmit}
            >
                <div className={styles.formPreviewNote}>
                    <Eye size={15} />
                    Biểu mẫu minh họa. Thao tác chỉ cập nhật trạng thái trong
                    màn hình này.
                </div>

                <Input
                    label="Tiêu đề tin tuyển dụng"
                    name="title"
                    value={draft.title}
                    onChange={updateDraft}
                    placeholder="Ví dụ: Frontend Engineer"
                    leftIcon={<Building2 size={17} />}
                />

                <div className={styles.formGrid}>
                    <Input
                        label="Vị trí / chuyên môn"
                        name="category"
                        value={draft.category}
                        onChange={updateDraft}
                        placeholder="Ví dụ: Frontend"
                    />
                    <Input
                        label="Mức lương"
                        name="salary"
                        value={draft.salary}
                        onChange={updateDraft}
                        placeholder="Ví dụ: 25–40 triệu"
                        leftIcon={<CircleDollarSign size={17} />}
                    />
                    <Input
                        label="Địa điểm"
                        name="location"
                        value={draft.location}
                        onChange={updateDraft}
                        placeholder="Tỉnh / thành phố"
                        leftIcon={<MapPin size={17} />}
                    />
                    <Select
                        label="Cấp bậc"
                        name="level"
                        value={draft.level}
                        onChange={updateDraft}
                        options={levelOptions}
                    />
                    <Select
                        label="Loại hình làm việc"
                        name="workType"
                        value={draft.workType}
                        onChange={updateDraft}
                        options={workTypeOptions}
                    />
                </div>

                <Input
                    label="Hạn nộp hồ sơ"
                    name="deadline"
                    value={draft.deadline}
                    onChange={updateDraft}
                    placeholder="Ví dụ: 30/12/2026"
                    leftIcon={<CalendarDays size={17} />}
                />

                <Textarea
                    label="Mô tả công việc"
                    name="description"
                    value={draft.description}
                    onChange={updateDraft}
                    placeholder="Mô tả vai trò và công việc chính"
                />

                <div className={styles.formGrid}>
                    <Textarea
                        label="Yêu cầu"
                        value={requirementsText}
                        onChange={(event) => {
                            setRequirementsText(event.target.value);
                        }}
                        placeholder="Mỗi yêu cầu trên một dòng"
                    />
                    <Textarea
                        label="Quyền lợi"
                        value={benefitsText}
                        onChange={(event) => {
                            setBenefitsText(event.target.value);
                        }}
                        placeholder="Mỗi quyền lợi trên một dòng"
                    />
                </div>
            </form>
        </Modal>
    );
}

export default JobFormModal;
