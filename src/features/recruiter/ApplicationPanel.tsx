import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarPlus, Code2, FileText } from "lucide-react";
import { Avatar, Badge, Button } from "../../components/common";
import { ROUTES } from "../../routers/routePaths";
import { applicationStage, displayDate } from "./model";
import type { Application } from "./model";
import { useRecruitment } from "./useRecruitment";
import { Status, Surface } from "./RecruitmentUI";
import s from "./Recruitment.module.css";

export default function ApplicationPanel({ item, onClose }: { item: Application; onClose: () => void }) {
    const { data, save } = useRecruitment();
    const [confirmReject, setConfirmReject] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const stage = applicationStage(item, data);
    const meeting = data.interviews.find((m) => m.applicationId === item.id && m.status !== "Đã hủy");

    function review(stage: "Đã duyệt CV" | "Đã từ chối") {
        setMessage("");
        try {
            save({
                ...data,
                applications: data.applications.map((a) => (a.id === item.id ? { ...a, stage } : a)),
            });
            setError("");
            setConfirmReject(false);
            setMessage("Đã lưu trạng thái hồ sơ mẫu.");
        } catch {
            setError("Chưa lưu được thay đổi. Kiểm tra dung lượng trình duyệt và thử lại.");
        }
    }

    return (
        <Surface
            drawer
            title="Hồ sơ ứng viên"
            onClose={onClose}
            footer={
                <>
                    {error && (
                        <p role="alert" className={s.error}>
                            {error}
                        </p>
                    )}
                    {message && (
                        <p role="status" className={s.success}>
                            {message}
                        </p>
                    )}
                    {confirmReject ? (
                        <div className={s.warning}>
                            <strong>Từ chối hồ sơ của {item.name}?</strong>
                            <div className={s.actions}>
                                <Button variant="outline" onClick={() => setConfirmReject(false)}>
                                    Quay lại
                                </Button>
                                <Button variant="danger" onClick={() => review("Đã từ chối")}>
                                    Xác nhận từ chối hồ sơ mẫu
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {stage !== "Đã từ chối" && (
                                <Link
                                    className={s.primaryLink}
                                    to={
                                        ROUTES.RECRUITER.INTERVIEWS +
                                        (meeting
                                            ? "?detail=" + encodeURIComponent(meeting.id)
                                            : "?schedule=" + encodeURIComponent(item.id))
                                    }
                                >
                                    <CalendarPlus size={16} />
                                    {meeting ? "Xem lịch phỏng vấn" : "Lên lịch phỏng vấn"}
                                </Link>
                            )}
                            {stage === "Chờ duyệt" && (
                                <Button variant="outline" onClick={() => review("Đã duyệt CV")}>
                                    Duyệt CV mẫu
                                </Button>
                            )}
                            {(stage === "Chờ duyệt" || stage === "Đã duyệt CV") && (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setMessage("");
                                        setError("");
                                        setConfirmReject(true);
                                    }}
                                >
                                    Từ chối
                                </Button>
                            )}
                        </>
                    )}
                </>
            }
        >
            <div className={s.identity}>
                <Avatar name={item.name} size="lg" />
                <div>
                    <h2>{item.name}</h2>
                    <p>{item.job}</p>
                </div>
            </div>
            <Status value={stage} />
            <dl className={s.details}>
                <dt>Email</dt>
                <dd>{item.email}</dd>
                <dt>Địa điểm</dt>
                <dd>{item.city}</dd>
                <dt>Ngày ứng tuyển</dt>
                <dd>{displayDate(item.submitted)}</dd>
            </dl>
            <section className={s.inset}>
                <h3>
                    <Code2 size={18} /> Báo cáo năng lực Git
                </h3>
                {item.gitReport.state === "available" ? (
                    <>
                        <p>
                            <b className={s.score}>{item.gitReport.score}</b> / 100
                        </p>
                        <progress max={100} value={item.gitReport.score} aria-label="Điểm Git mẫu" />
                    </>
                ) : (
                    <p>
                        {item.gitReport.state === "processing"
                            ? "Báo cáo mẫu đang chờ kết quả phân tích."
                            : "Chưa có báo cáo Git."}
                    </p>
                )}
                <small>Điểm minh họa. Chưa kết nối báo cáo Git dành cho nhà tuyển dụng.</small>
            </section>
            <section>
                <h3>Kỹ năng</h3>
                <div className={s.tags}>
                    {item.skills.map((skill) => (
                        <Badge key={skill}>{skill}</Badge>
                    ))}
                </div>
            </section>
            <section className={s.inset}>
                <h3>
                    <FileText size={18} /> Hồ sơ đính kèm
                </h3>
                {item.cvSummary ? (
                    <>
                        <details>
                            <summary>Xem nội dung CV mẫu</summary>
                            <p>{item.cvSummary}</p>
                        </details>
                        <a
                            className={s.textButton}
                            download={"CV-mau-" + item.id + ".txt"}
                            href={
                                "data:text/plain;charset=utf-8," +
                                encodeURIComponent("CV mẫu · " + item.email + "\n\n" + item.cvSummary)
                            }
                        >
                            Tải CV mẫu (.txt)
                        </a>
                    </>
                ) : (
                    <p>Chưa có CV đính kèm.</p>
                )}
            </section>
        </Surface>
    );
}
