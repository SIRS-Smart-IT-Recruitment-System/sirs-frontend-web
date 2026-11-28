import { useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    BriefcaseBusiness,
    CalendarDays,
    CalendarPlus,
    ChartNoAxesColumn,
    Files,
    UsersRound,
} from "lucide-react";
import { Avatar, Button } from "../../../components/common";
import { ROUTES } from "../../../routers/routePaths";
import { useRecruitment } from "../../../features/recruiter/useRecruitment";
import { dayKey, displayDate, upcomingInterviews } from "../../../features/recruiter/model";
import { Empty, Metric } from "../../../features/recruiter/RecruitmentUI";
import s from "../../../features/recruiter/Recruitment.module.css";

export default function DashboardPage() {
    const { data } = useRecruitment();
    const [days, setDays] = useState(30);
    const cohort = data.applications.filter(
        (a) => a.submitted >= dayKey(1 - days) && a.submitted <= dayKey()
    );
    const meetings = upcomingInterviews(data).filter((m) => m.date <= dayKey(6));
    const review = data.applications
        .filter(
            (a) =>
                a.stage === "Chờ duyệt" &&
                !data.interviews.some((m) => m.applicationId === a.id && m.status !== "Đã hủy")
        )
        .sort((a, b) => b.submitted.localeCompare(a.submitted));
    const interviewed = new Set(
        data.interviews.filter((m) => m.status !== "Đã hủy").map((m) => m.applicationId)
    );
    const stages = [
        { label: "Nhận hồ sơ", count: cohort.length },
        {
            label: "Đã xem xét",
            count: cohort.filter((a) => a.stage !== "Chờ duyệt" || interviewed.has(a.id)).length,
        },
        { label: "Có lịch phỏng vấn", count: cohort.filter((a) => interviewed.has(a.id)).length },
    ];
    const routes = ROUTES.RECRUITER;
    return (
        <>
            <div className={s.heading}>
                <div>
                    <h1>Tổng quan tuyển dụng</h1>
                    <p>Theo dõi hồ sơ, lịch hẹn và tiến trình tuyển dụng.</p>
                </div>
                <div className={s.actions}>
                    <select
                        value={days}
                        aria-label="Kỳ thống kê hồ sơ"
                        onChange={(e) => setDays(Number(e.target.value))}
                    >
                        {[7, 30, 90].map((d) => (
                            <option value={d} key={d}>
                                {d} ngày qua
                            </option>
                        ))}
                    </select>
                    <Button disabled title="Trang đăng tin chưa được triển khai">
                        <BriefcaseBusiness size={16} />
                        Đăng tin tuyển dụng mới
                    </Button>
                </div>
            </div>
            <section className={s.metrics}>
                <Metric
                    label="Hồ sơ ứng viên mới"
                    icon={Files}
                    value={cohort.length}
                    hint={days + " ngày qua"}
                    link={
                        <Link to={routes.CANDIDATES}>
                            Xem danh sách ứng viên <ArrowRight size={14} />
                        </Link>
                    }
                />
                <Metric
                    label="Lịch phỏng vấn sắp tới"
                    icon={CalendarDays}
                    value={meetings.length}
                    hint="Hôm nay và 6 ngày tiếp theo"
                    link={
                        <Link to={routes.INTERVIEWS}>
                            Mở lịch phỏng vấn <ArrowRight size={14} />
                        </Link>
                    }
                />
                <Metric
                    label="Tin tuyển dụng đang mở"
                    icon={BriefcaseBusiness}
                    value={data.openJobs.length}
                    hint="Vị trí đang nhận hồ sơ trong bộ mẫu"
                />
            </section>
            {!data.applications.length && !data.interviews.length && !data.openJobs.length ? (
                <section className={s.card}>
                    <Empty title="Chưa có dữ liệu tuyển dụng" />
                    <div className={s.cardFoot}>
                        <Link className={s.textButton} to={routes.PROFILE}>
                            Xem hồ sơ doanh nghiệp →
                        </Link>
                    </div>
                </section>
            ) : (
                <>
                    <div className={s.columns}>
                        <section className={s.card}>
                            <header className={s.cardHead}>
                                <div>
                                    <h2>Ứng viên cần xem xét</h2>
                                    <small>Hồ sơ đang chờ duyệt</small>
                                </div>
                                <Link to={routes.CANDIDATES}>Xem tất cả →</Link>
                            </header>
                            {review.slice(0, 4).map((a) => (
                                <Link
                                    key={a.id}
                                    className={s.listRow}
                                    to={routes.CANDIDATES + "?detail=" + encodeURIComponent(a.id)}
                                >
                                    <Avatar name={a.name} />
                                    <div>
                                        <strong>{a.name}</strong>
                                        <small>
                                            {a.job} · {displayDate(a.submitted)}
                                        </small>
                                    </div>
                                    <ArrowRight size={16} />
                                </Link>
                            ))}
                            {!review.length && <Empty title="Không có hồ sơ chờ duyệt" />}
                        </section>
                        <section className={s.card}>
                            <header className={s.cardHead}>
                                <div>
                                    <h2>Lịch phỏng vấn sắp tới</h2>
                                    <small>Trong 7 ngày tới · GMT+7</small>
                                </div>
                                <Link to={routes.INTERVIEWS}>Xem lịch →</Link>
                            </header>
                            {meetings.slice(0, 4).map((m) => {
                                const a = data.applications.find((a) => a.id === m.applicationId);
                                return (
                                    <Link
                                        key={m.id}
                                        className={s.listRow}
                                        to={routes.INTERVIEWS + "?detail=" + encodeURIComponent(m.id)}
                                    >
                                        <div className={s.time}>
                                            <b>{m.start}</b>
                                            <small>{displayDate(m.date).slice(0, 5)}</small>
                                        </div>
                                        <div>
                                            <strong>
                                                {a?.name} · {m.round}
                                            </strong>
                                            <small>
                                                {a?.job} · {m.panel.join(", ")}
                                            </small>
                                        </div>
                                        <ArrowRight size={16} />
                                    </Link>
                                );
                            })}
                            {!meetings.length && <Empty title="Chưa có lịch sắp tới" />}
                        </section>
                    </div>
                    <section className={s.card}>
                        <header className={s.cardHead}>
                            <div>
                                <h2>
                                    <ChartNoAxesColumn size={19} /> Tiến trình tuyển dụng
                                </h2>
                                <small>
                                    Tỷ lệ trên tổng số hồ sơ nộp trong {days} ngày qua · Số liệu mẫu
                                </small>
                            </div>
                        </header>
                        <div className={s.pipeline}>
                            {stages.map((stage) => (
                                <div key={stage.label}>
                                    <small>{stage.label}</small>
                                    <strong>{stage.count}</strong>
                                    <progress
                                        aria-label={stage.label}
                                        max={cohort.length || 1}
                                        value={stage.count}
                                    />
                                    <small>
                                        {cohort.length
                                            ? Math.round((100 * stage.count) / cohort.length) + "% hồ sơ"
                                            : "Chưa có hồ sơ trong kỳ"}
                                    </small>
                                </div>
                            ))}
                        </div>
                    </section>
                </>
            )}
            <section className={s.quick}>
                <h2>Thao tác nhanh</h2>
                <div className={s.actions}>
                    <Link className={s.secondaryLink} to={routes.CANDIDATES}>
                        <UsersRound size={16} />
                        Quản lý ứng viên
                    </Link>
                    {data.applications.some((a) => a.stage !== "Đã từ chối") && (
                        <Link className={s.primaryLink} to={routes.INTERVIEWS + "?schedule=new"}>
                            <CalendarPlus size={16} />
                            Lên lịch phỏng vấn
                        </Link>
                    )}
                </div>
            </section>
        </>
    );
}
