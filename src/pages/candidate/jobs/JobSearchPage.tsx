import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
    ArrowRight,
    BriefcaseBusiness,
    MapPin,
    Search,
    SlidersHorizontal,
    Sparkles,
} from "lucide-react";

import Button from "../../../components/common/button/Button";
import Input from "../../../components/common/input/Input";
import Select from "../../../components/common/select/Select";
import JobCard from "../../../features/jobs/JobCard";
import PreviewNotice from "../../../features/jobs/PreviewNotice";
import { JOB_PREVIEW_ITEMS } from "../../../features/jobs/jobPreviewData";

import styles from "../../../features/jobs/JobsPreview.module.css";

interface SearchFilters {
    keyword: string;
    location: string;
    level: string;
    workType: string;
    minSalary: number;
}

const emptyFilters: SearchFilters = {
    keyword: "",
    location: "",
    level: "",
    workType: "",
    minSalary: 0,
};

const locationOptions = [
    ...new Set(JOB_PREVIEW_ITEMS.map((job) => job.location)),
].map((value) => ({
    label: value,
    value,
}));

const levelOptions = [
    ...new Set(JOB_PREVIEW_ITEMS.map((job) => job.level)),
].map((value) => ({
    label: value,
    value,
}));

const workTypeOptions = [
    ...new Set(JOB_PREVIEW_ITEMS.map((job) => job.workType)),
].map((value) => ({
    label: value,
    value,
}));

const salaryOptions = [
    { label: "Từ 20 triệu", value: "20" },
    { label: "Từ 30 triệu", value: "30" },
    { label: "Từ 40 triệu", value: "40" },
];

function JobSearchPage() {
    const [filters, setFilters] = useState<SearchFilters>(emptyFilters);
    const [activeFilters, setActiveFilters] = useState<SearchFilters>(emptyFilters);

    const filteredJobs = useMemo(() => {
        return JOB_PREVIEW_ITEMS.filter((job) => {
            const phrase = activeFilters.keyword
                .trim()
                .toLocaleLowerCase("vi");
            const searchableText = `${job.title} ${job.company} ${job.category}`
                .toLocaleLowerCase("vi");

            const matchesPhrase = !phrase || searchableText.includes(phrase);
            const matchesLocation =
                !activeFilters.location ||
                job.location === activeFilters.location;
            const matchesLevel =
                !activeFilters.level || job.level === activeFilters.level;
            const matchesWorkType =
                !activeFilters.workType ||
                job.workType === activeFilters.workType;
            const matchesSalary =
                !activeFilters.minSalary ||
                job.salaryMax >= activeFilters.minSalary;

            return (
                matchesPhrase &&
                matchesLocation &&
                matchesLevel &&
                matchesWorkType &&
                matchesSalary
            );
        });
    }, [activeFilters]);

    const updateFilter = (name: keyof SearchFilters, value: string | number) => {
        setFilters((currentFilters) => ({
            ...currentFilters,
            [name]: value,
        }));
    };

    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setActiveFilters(filters);
    };

    const clearFilters = () => {
        setFilters(emptyFilters);
        setActiveFilters(emptyFilters);
    };

    return (
        <>
            <div className={styles.page}>
                <PreviewNotice />

                <section className={styles.searchHero}>
                    <div className={styles.heroGlow} aria-hidden="true" />
                    <div className={styles.heroContent}>
                        <span className={styles.eyebrow}>
                            <Sparkles size={15} />
                            CƠ HỘI DÀNH CHO BẠN
                        </span>
                        <h1>
                            Tìm công việc tiếp theo
                            <br />
                            <span>
                                đúng với năng lực của bạn.
                            </span>
                        </h1>
                        <p>
                            Khám phá cơ hội IT, xem yêu cầu và chọn nơi bạn muốn
                            phát triển.
                        </p>
                        <div className={styles.heroStats}>
                            <span>
                                <BriefcaseBusiness size={16} />
                                {JOB_PREVIEW_ITEMS.length} tin đang hiển thị
                            </span>
                            <span>
                                <MapPin size={16} />
                                Nhiều địa điểm
                            </span>
                        </div>
                    </div>

                    <div
                        className={styles.heroIllustration}
                        aria-hidden="true"
                    >
                        <div className={styles.heroOrb}>
                            <Search size={48} strokeWidth={1.5} />
                        </div>
                        <span className={styles.orbitDot} />
                        <span className={styles.orbitDotSmall} />
                    </div>
                </section>

                <form
                    className={styles.searchPanel}
                    aria-label="Tìm kiếm và lọc việc làm"
                    onSubmit={handleSearch}
                >
                    <div className={styles.searchPanelHeading}>
                        <div>
                            <span className={styles.sectionKicker}>
                                BỘ LỌC
                            </span>
                            <h2>
                                Tìm cơ hội phù hợp
                            </h2>
                        </div>
                        <SlidersHorizontal size={20} />
                    </div>

                    <div className={styles.filterGrid}>
                        <Input
                            label="Từ khóa"
                            value={filters.keyword}
                            onChange={(event) => {
                                updateFilter("keyword", event.target.value);
                            }}
                            placeholder="Tên vị trí, công ty, kỹ năng"
                            leftIcon={<Search size={17} />}
                        />
                        <Select
                            label="Địa điểm"
                            value={filters.location}
                            onChange={(event) => {
                                updateFilter("location", event.target.value);
                            }}
                            placeholder="Tất cả địa điểm"
                            options={locationOptions}
                        />
                        <Select
                            label="Cấp bậc"
                            value={filters.level}
                            onChange={(event) => {
                                updateFilter("level", event.target.value);
                            }}
                            placeholder="Tất cả cấp bậc"
                            options={levelOptions}
                        />
                        <Select
                            label="Loại hình"
                            value={filters.workType}
                            onChange={(event) => {
                                updateFilter("workType", event.target.value);
                            }}
                            placeholder="Tất cả loại hình"
                            options={workTypeOptions}
                        />
                        <Select
                            label="Lương tối thiểu"
                            value={
                                filters.minSalary
                                    ? String(filters.minSalary)
                                    : ""
                            }
                            onChange={(event) => {
                                updateFilter(
                                    "minSalary",
                                    Number(event.target.value)
                                );
                            }}
                            placeholder="Không giới hạn"
                            options={salaryOptions}
                        />
                    </div>

                    <div className={styles.searchPanelFooter}>
                        <span>
                            {filteredJobs.length} kết quả trong bản xem trước
                        </span>
                        <div>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={clearFilters}
                            >
                                Xóa bộ lọc
                            </Button>
                            <Button type="submit">
                                Tìm việc
                                <ArrowRight size={16} />
                            </Button>
                        </div>
                    </div>
                </form>

                <div className={styles.resultsHeading}>
                    <div>
                        <span className={styles.sectionKicker}>
                            DÀNH CHO BẠN
                        </span>
                        <h2>
                            Việc làm nổi bật
                        </h2>
                    </div>
                    <button
                        className={styles.sortButton}
                        type="button"
                        disabled
                    >
                        Mới nhất
                        <span>
                            ⌄
                        </span>
                    </button>
                </div>

                {filteredJobs.length > 0 ? (
                    <div className={styles.jobGrid}>
                        {filteredJobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>
                            <Search size={25} />
                        </div>
                        <h3>
                            Chưa có kết quả phù hợp
                        </h3>
                        <p>
                            Thử bỏ bớt bộ lọc hoặc thay đổi từ khóa tìm kiếm.
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={clearFilters}
                        >
                            Xóa bộ lọc
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}

export default JobSearchPage;
