import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, Button } from "../../components/common";
import { ROUTES } from "../../routers/routePaths";
import { displayDate } from "./model";
import type { Application, Interview } from "./model";
import { useRecruitment } from "./useRecruitment";
import { Status, Surface } from "./RecruitmentUI";
import s from "./Recruitment.module.css";

export default function InterviewPanel({
    item,
    applicant,
    onClose,
    onEdit,
    onCancelled,
}: {
    item: Interview;
    applicant: Application;
    onClose: () => void;
    onEdit: () => void;
    onCancelled: () => void;
}) {
    const { data, save } = useRecruitment();
    const [confirm, setConfirm] = useState(false);
    const [error, setError] = useState("");
    function cancel() {
        try {
            save({
                ...data,
                interviews: data.interviews.map((m) => (m.id === item.id ? { ...m, status: "Đã hủy" } : m)),
            });
            onCancelled();
        } catch {
            setError("Chưa hủy được lịch mẫu. Kiểm tra dung lượng trình duyệt và thử lại.");
        }
    }
    return (
        <Surface
            drawer
            title="Chi tiết cuộc phỏng vấn"
            onClose={onClose}
            footer={
                <>
                    {error && (
                        <p role="alert" className={s.error}>
                            {error}
                        </p>
                    )}
                    {confirm ? (
                        <div className={s.warning}>
                            <strong>
                                Hủy lịch mẫu của {applicant.name} ngày {displayDate(item.date)}?
                            </strong>
                            <div className={s.actions}>
                                <Button variant="outline" onClick={() => setConfirm(false)}>
                                    Giữ lịch
                                </Button>
                                <Button variant="danger" onClick={cancel}>
                                    Xác nhận hủy lịch mẫu
                                </Button>
                            </div>
                        </div>
                    ) : (
                        item.status !== "Đã hủy" && (
                            <>
                                <Button variant="outline" onClick={() => setConfirm(true)}>
                                    Hủy lịch hẹn
                                </Button>
                                <Button onClick={onEdit}>Đổi lịch hẹn</Button>
                            </>
                        )
                    )}
                </>
            }
        >
            <div className={s.identity}>
                <Avatar name={applicant.name} size="lg" />
                <div>
                    <h2>{applicant.name}</h2>
                    <p>{applicant.job}</p>
                </div>
            </div>
            <p>{applicant.email}</p>
            <Link
                className={s.textButton}
                to={ROUTES.RECRUITER.CANDIDATES + "?detail=" + encodeURIComponent(applicant.id)}
            >
                Xem hồ sơ ứng tuyển →
            </Link>
            <section className={s.inset}>
                <h3>{item.round}</h3>
                <Status value={item.status} />
                <dl className={s.details}>
                    <dt>Ngày</dt>
                    <dd>{displayDate(item.date)}</dd>
                    <dt>Giờ (GMT+7)</dt>
                    <dd>
                        {item.start} – {item.end}
                    </dd>
                    <dt>Hình thức</dt>
                    <dd>{item.format}</dd>
                    <dt>{item.format === "Trực tuyến" ? "Liên kết họp" : "Địa điểm"}</dt>
                    <dd>
                        {item.format === "Trực tuyến" &&
                        item.status !== "Đã hủy" &&
                        item.location.startsWith("https://") ? (
                            <a className={s.textButton} href={item.location} target="_blank" rel="noreferrer">
                                Mở liên kết họp ↗
                            </a>
                        ) : (
                            item.location || "Chưa có liên kết"
                        )}
                    </dd>
                </dl>
            </section>
            <section>
                <h3>Hội đồng phỏng vấn</h3>
                {item.panel.map((p) => (
                    <p key={p}>{p}</p>
                ))}
            </section>
            <section>
                <h3>Ghi chú</h3>
                <p className={s.notes}>{item.notes || "Chưa có ghi chú."}</p>
            </section>
        </Surface>
    );
}
