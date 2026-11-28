import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CalendarDays, CalendarPlus, Clock, MapPin, UsersRound, Video, CheckCheck } from "lucide-react";
import { Avatar, Button } from "../../../components/common";
import { useRecruitment } from "../../../features/recruiter/useRecruitment";
import { dayKey, displayDate, searchable, upcomingInterviews } from "../../../features/recruiter/model";
import { Empty, Metric, SearchField, Status } from "../../../features/recruiter/RecruitmentUI";
import InterviewPanel from "../../../features/recruiter/InterviewPanel";
import InterviewForm from "../../../features/recruiter/InterviewForm";
import s from "../../../features/recruiter/Recruitment.module.css";

export default function InterviewsPage() {
    const { data } = useRecruitment();
    const [params, setParams] = useSearchParams();
    const [message, setMessage] = useState("");
    const [query, setQuery] = useState("");
    const [period, setPeriod] = useState("");
    const [format, setFormat] = useState("");
    const [status, setStatus] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const today = dayKey();
    const applicants = new Map(data.applications.map((a) => [a.id, a]));
    const detail = data.interviews.find((m) => m.id === params.get("detail"));
    const editing = data.interviews.find((m) => m.id === params.get("edit") && m.status !== "Đã hủy");
    const schedule = params.get("schedule");
    const create =
        schedule === "new" ||
        (schedule && applicants.has(schedule) && applicants.get(schedule)?.stage !== "Đã từ chối");
    const canCreate = data.applications.some((a) => a.stage !== "Đã từ chối");
    const active = data.interviews.filter((m) => m.status !== "Đã hủy");
    const confirmed = active.filter((m) => m.status === "Đã xác nhận").length;
    const periods: Record<string, [string, string]> = {
        today: [today, today],
        tomorrow: [dayKey(1), dayKey(1)],
        week: [today, dayKey(6)],
        custom: [from, to],
    };
    const range = periods[period];
    const rows = data.interviews
        .filter((m) => {
            const a = applicants.get(m.applicationId);
            return (
                a &&
                searchable([a.name, a.job, m.round, ...m.panel].join(" ")).includes(searchable(query)) &&
                (!format || m.format === format) &&
                (!status || m.status === status) &&
                (!range || ((!range[0] || m.date >= range[0]) && (!range[1] || m.date <= range[1])))
            );
        })
        .sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
    const dates = [...new Set(rows.map((r) => r.date))];
    function reset() {
        setQuery("");
        setFormat("");
        setStatus("");
        setPeriod("");
        setFrom("");
        setTo("");
    }
    function open(next: Record<string, string>) {
        setMessage("");
        setParams(next);
    }
    function close() {
        setParams({}, { replace: true });
    }
    function finish(text: string) {
        close();
        setMessage(text);
    }

    return (
        <>
            <div className={s.heading}>
                <div>
                    <h1>Lịch phỏng vấn</h1>
                    <p>Theo dõi lịch hẹn và phân công người phỏng vấn.</p>
                </div>
                <Button disabled={!canCreate} onClick={() => open({ schedule: "new" })}>
                    <CalendarPlus size={18} />
                    Lên lịch phỏng vấn
                </Button>
            </div>
            {message && (
                <p className={s.success} role="status">
                    {message}
                </p>
            )}
            <section className={s.metrics}>
                <Metric
                    label="Lịch hôm nay"
                    icon={Clock}
                    value={active.filter((m) => m.date === today).length}
                    hint={displayDate(today) + " · GMT+7"}
                />
                <Metric
                    label="Lịch sắp tới"
                    icon={CalendarDays}
                    value={upcomingInterviews(data).filter((m) => m.date <= dayKey(6)).length}
                    hint="Trong 7 ngày tới"
                />
                <Metric
                    label="Tỷ lệ xác nhận"
                    icon={CheckCheck}
                    value={active.length ? Math.round((confirmed * 100) / active.length) + "%" : "—"}
                    hint="Trên các lịch chưa hủy"
                />
                <Metric
                    label="Hội đồng phỏng vấn"
                    icon={UsersRound}
                    value={data.interviewers.length}
                    hint="Người trong danh sách mẫu"
                />
            </section>
            <section className={s.card}>
                <div className={s.toolbar}>
                    <SearchField
                        label="Tìm ứng viên, vị trí, người phỏng vấn"
                        value={query}
                        onChange={setQuery}
                    />
                    <select aria-label="Thời gian" value={period} onChange={(e) => setPeriod(e.target.value)}>
                        <option value="">Mọi thời điểm</option>
                        <option value="today">Hôm nay</option>
                        <option value="tomorrow">Ngày mai</option>
                        <option value="week">7 ngày tới</option>
                        <option value="custom">Tùy chỉnh</option>
                    </select>
                    <select aria-label="Hình thức" value={format} onChange={(e) => setFormat(e.target.value)}>
                        <option value="">Mọi hình thức</option>
                        <option>Trực tuyến</option>
                        <option>Tại văn phòng</option>
                    </select>
                    <select
                        aria-label="Trạng thái"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="">Mọi trạng thái</option>
                        <option>Đã xác nhận</option>
                        <option>Chờ xác nhận</option>
                        <option>Đã hủy</option>
                    </select>
                    <button className={s.textButton} onClick={reset}>
                        Xóa bộ lọc
                    </button>
                    {period === "custom" && (
                        <div className={s.actions}>
                            <label>
                                Từ ngày{" "}
                                <input
                                    aria-label="Từ ngày"
                                    type="date"
                                    value={from}
                                    max={to}
                                    onChange={(e) => setFrom(e.target.value)}
                                />
                            </label>
                            <label>
                                Đến ngày{" "}
                                <input
                                    aria-label="Đến ngày"
                                    type="date"
                                    value={to}
                                    min={from}
                                    onChange={(e) => setTo(e.target.value)}
                                />
                            </label>
                        </div>
                    )}
                </div>
            </section>
            {dates.map((date) => (
                <section key={date} className={s.agenda}>
                    <header>
                        <CalendarDays size={19} />
                        <h2>
                            {date === today ? "Hôm nay · " : date === dayKey(1) ? "Ngày mai · " : ""}
                            {displayDate(date)}
                        </h2>
                        <small>{rows.filter((m) => m.date === date).length} cuộc phỏng vấn</small>
                    </header>
                    {rows
                        .filter((m) => m.date === date)
                        .map((m) => {
                            const a = applicants.get(m.applicationId)!;
                            return (
                                <article className={s.meeting} key={m.id}>
                                    <div className={s.time}>
                                        <b>{m.start}</b>
                                        <small>{m.end}</small>
                                    </div>
                                    <div className={s.meetingBody}>
                                        <div className={s.identity}>
                                            <Avatar name={a.name} />
                                            <div>
                                                <h3>{a.name}</h3>
                                                <small>{a.job}</small>
                                            </div>
                                        </div>
                                        <strong>{m.round}</strong>
                                        <p>
                                            <UsersRound size={15} />
                                            {m.panel.join(", ")}
                                        </p>
                                        <p>
                                            {m.format === "Trực tuyến" ? (
                                                <Video size={15} />
                                            ) : (
                                                <MapPin size={15} />
                                            )}
                                            {m.format}
                                            {m.format === "Tại văn phòng" && m.location && " · " + m.location}
                                        </p>
                                    </div>
                                    <div className={s.meetingActions}>
                                        <Status value={m.status} />
                                        <button
                                            className={s.textButton}
                                            onClick={() => open({ detail: m.id })}
                                        >
                                            Xem chi tiết →
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                </section>
            ))}
            {!rows.length && (
                <Empty
                    title={data.interviews.length ? "Không có lịch phù hợp" : "Chưa có lịch phỏng vấn"}
                    filtered={!!data.interviews.length}
                    onReset={reset}
                />
            )}
            {detail && applicants.has(detail.applicationId) && (
                <InterviewPanel
                    key={detail.id}
                    item={detail}
                    applicant={applicants.get(detail.applicationId)!}
                    onClose={close}
                    onEdit={() => open({ edit: detail.id })}
                    onCancelled={() => finish("Đã hủy lịch mẫu trong phiên này.")}
                />
            )}
            {!detail && (editing || create) && (
                <InterviewForm
                    key={editing?.id ?? schedule}
                    initial={editing}
                    applicationId={schedule === "new" ? undefined : schedule ?? undefined}
                    onClose={close}
                    onSaved={() => finish("Đã lưu lịch mẫu trong phiên này.")}
                />
            )}
        </>
    );
}
