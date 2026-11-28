import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowRight, CalendarDays, Inbox, ListChecks, UserRoundPlus } from "lucide-react";
import { Avatar, Pagination } from "../../../components/common";
import { useRecruitment } from "../../../features/recruiter/useRecruitment";
import {
    applicationStage,
    dayKey,
    displayDate,
    sampleStages,
    searchable,
} from "../../../features/recruiter/model";
import { Empty, Metric, SearchField, Status } from "../../../features/recruiter/RecruitmentUI";
import ApplicationPanel from "../../../features/recruiter/ApplicationPanel";
import s from "../../../features/recruiter/Recruitment.module.css";

export default function CandidatesPage() {
    const { data } = useRecruitment();
    const [params, setParams] = useSearchParams();
    const [query, setQuery] = useState("");
    const [job, setJob] = useState("");
    const [stage, setStage] = useState("");
    const [ascending, setAscending] = useState(false);
    const [page, setPage] = useState(1);
    const applications = data.applications;
    const selected = applications.find((a) => a.id === params.get("detail"));
    const filtered = applications
        .filter(
            (a) =>
                (!job || a.job === job) &&
                (!stage || applicationStage(a, data) === stage) &&
                searchable([a.name, a.email, a.job].join(" ")).includes(searchable(query))
        )
        .sort((a, b) =>
            ascending ? a.submitted.localeCompare(b.submitted) : b.submitted.localeCompare(a.submitted)
        );
    const pages = Math.ceil(filtered.length / 5);
    const current = Math.min(page, Math.max(1, pages));
    const first = (current - 1) * 5;
    function reset() {
        setQuery("");
        setJob("");
        setStage("");
        setPage(1);
    }
    const count = (label: string) => applications.filter((a) => applicationStage(a, data) === label).length;

    return (
        <>
            <div className={s.heading}>
                <div>
                    <h1>Quản lý ứng viên</h1>
                    <p>Sàng lọc hồ sơ, xem đánh giá Git và lên lịch phỏng vấn.</p>
                </div>
            </div>
            <section className={s.metrics}>
                <Metric
                    label="Tổng hồ sơ"
                    value={applications.length}
                    hint="Tất cả vị trí tuyển dụng"
                    icon={Inbox}
                />
                <Metric
                    label="Chờ duyệt"
                    value={count("Chờ duyệt")}
                    hint="Hồ sơ cần xem xét"
                    icon={ListChecks}
                />
                <Metric
                    label="Đã lên lịch"
                    value={count("Phỏng vấn")}
                    hint="Hồ sơ có lịch phỏng vấn"
                    icon={CalendarDays}
                />
                <Metric
                    label="Hồ sơ mới"
                    value={applications.filter((a) => a.submitted >= dayKey(-6)).length}
                    hint="Trong 7 ngày qua"
                    icon={UserRoundPlus}
                />
            </section>
            <section className={s.card}>
                <div className={s.toolbar}>
                    <SearchField
                        label="Tìm theo tên, email hoặc vị trí"
                        value={query}
                        onChange={(v) => {
                            setQuery(v);
                            setPage(1);
                        }}
                    />
                    <select
                        aria-label="Vị trí tuyển dụng"
                        value={job}
                        onChange={(e) => {
                            setJob(e.target.value);
                            setPage(1);
                        }}
                    >
                        <option value="">Tất cả vị trí tuyển dụng</option>
                        {[...new Set(applications.map((a) => a.job))].sort().map((j) => (
                            <option key={j}>{j}</option>
                        ))}
                    </select>
                    <button className={s.textButton} onClick={reset}>
                        Xóa bộ lọc
                    </button>
                </div>
                <div className={s.tabs}>
                    {["", ...sampleStages].map((value) => (
                        <button
                            key={value}
                            aria-pressed={stage === value}
                            onClick={() => {
                                setStage(value);
                                setPage(1);
                            }}
                        >
                            {value || "Tất cả"} <small>{value ? count(value) : applications.length}</small>
                        </button>
                    ))}
                </div>
            </section>
            <section className={s.card}>
                <header className={s.cardHead}>
                    <div>
                        <h2>Danh sách ứng viên</h2>
                        <small>{filtered.length} hồ sơ</small>
                    </div>
                    <select
                        aria-label="Sắp xếp ngày nộp"
                        value={ascending ? "asc" : "desc"}
                        onChange={(e) => {
                            setAscending(e.target.value === "asc");
                            setPage(1);
                        }}
                    >
                        <option value="desc">Mới nhất</option>
                        <option value="asc">Cũ nhất</option>
                    </select>
                </header>
                {filtered.length ? (
                    <>
                        <div className={s.tableScroll}>
                            <table>
                                <thead>
                                    <tr>
                                        {[
                                            "Ứng viên",
                                            "Vị trí ứng tuyển",
                                            "Trạng thái",
                                            "Ngày nộp",
                                            "Thao tác",
                                        ].map((h) => (
                                            <th key={h}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.slice(first, first + 5).map((a) => (
                                        <tr key={a.id}>
                                            <td>
                                                <div className={s.identity}>
                                                    <Avatar name={a.name} />
                                                    <div>
                                                        <strong>{a.name}</strong>
                                                        <small>{a.email}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{a.job}</td>
                                            <td>
                                                <Status value={applicationStage(a, data)} />
                                            </td>
                                            <td>{displayDate(a.submitted)}</td>
                                            <td>
                                                <button
                                                    className={s.textButton}
                                                    onClick={() => setParams({ detail: a.id })}
                                                >
                                                    Xem hồ sơ <ArrowRight size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <footer className={s.cardFoot}>
                            <small>
                                Hiển thị {first + 1}–{Math.min(first + 5, filtered.length)} trên{" "}
                                {filtered.length} hồ sơ
                            </small>
                            <Pagination currentPage={current} totalPages={pages} onPageChange={setPage} />
                        </footer>
                    </>
                ) : (
                    <Empty
                        title={
                            applications.length ? "Không tìm thấy ứng viên phù hợp" : "Chưa có hồ sơ ứng viên"
                        }
                        filtered={!!applications.length}
                        onReset={reset}
                    />
                )}
            </section>
            {selected && (
                <ApplicationPanel
                    key={selected.id}
                    item={selected}
                    onClose={() => setParams({}, { replace: true })}
                />
            )}
        </>
    );
}
