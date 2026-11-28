import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "../../components/common";
import { dayKey } from "./model";
import type { Interview } from "./model";
import { useRecruitment } from "./useRecruitment";
import { Surface } from "./RecruitmentUI";
import s from "./Recruitment.module.css";

interface Props {
    initial?: Interview;
    applicationId?: string;
    onClose: () => void;
    onSaved: () => void;
}

export default function InterviewForm({ initial, applicationId, onClose, onSaved }: Props) {
    const { data, save } = useRecruitment();
    const [draft, setDraft] = useState<Omit<Interview, "id" | "status">>(
        initial ?? {
            applicationId: applicationId ?? "",
            round: "",
            date: dayKey(),
            start: "",
            end: "",
            format: "Trực tuyến",
            location: "",
            panel: [],
            notes: "",
        }
    );
    const [error, setError] = useState("");
    function field<K extends keyof typeof draft>(key: K, value: typeof draft[K]) {
        setDraft((old) => ({ ...old, [key]: value }));
        setError("");
    }
    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (draft.end <= draft.start) {
            setError("Giờ kết thúc phải sau giờ bắt đầu.");
            return;
        }
        if (!draft.round.trim() || !draft.panel.length) {
            setError("Nhập vòng phỏng vấn và chọn ít nhất một người phỏng vấn.");
            return;
        }
        if (new Date(draft.date + "T" + draft.start + ":00+07:00").getTime() <= Date.now()) {
            setError("Chọn thời điểm bắt đầu trong tương lai (GMT+7).");
            return;
        }
        const item: Interview = {
            ...draft,
            round: draft.round.trim(),
            location: draft.location.trim(),
            notes: draft.notes.trim(),
            id: initial?.id ?? crypto.randomUUID(),
            status: "Chờ xác nhận",
        };
        try {
            const interviews = initial
                ? data.interviews.map((m) => (m.id === initial.id ? item : m))
                : [...data.interviews, item];
            save({ ...data, interviews });
            onSaved();
        } catch {
            setError("Chưa lưu được lịch mẫu. Kiểm tra dung lượng trình duyệt và thử lại.");
        }
    }

    return (
        <Surface
            title={initial ? "Đổi lịch phỏng vấn" : "Lên lịch phỏng vấn"}
            onClose={onClose}
            footer={
                <>
                    {error && (
                        <p className={s.error} role="alert">
                            {error}
                        </p>
                    )}
                    <Button variant="outline" onClick={onClose}>
                        Hủy bỏ
                    </Button>
                    <Button form="interview-form" type="submit">
                        Lưu lịch mẫu
                    </Button>
                </>
            }
        >
            <form id="interview-form" className={s.form} onSubmit={submit}>
                <fieldset>
                    <legend>Thông tin ứng viên</legend>
                    <label>
                        Hồ sơ ứng tuyển
                        <select
                            required
                            disabled={!!initial}
                            value={draft.applicationId}
                            onChange={(e) => field("applicationId", e.target.value)}
                        >
                            <option value="">Chọn hồ sơ</option>
                            {data.applications
                                .filter((a) => a.stage !== "Đã từ chối" || a.id === initial?.applicationId)
                                .map((a) => (
                                    <option value={a.id} key={a.id}>
                                        {a.name} · {a.job}
                                    </option>
                                ))}
                        </select>
                    </label>
                    <label>
                        Vòng phỏng vấn
                        <input
                            required
                            maxLength={120}
                            value={draft.round}
                            placeholder="Ví dụ: Phỏng vấn kỹ thuật"
                            onChange={(e) => field("round", e.target.value)}
                        />
                    </label>
                </fieldset>
                <fieldset>
                    <legend>Thời gian và hình thức</legend>
                    <div className={s.timeFields}>
                        <label>
                            Ngày (GMT+7)
                            <input
                                type="date"
                                required
                                min={dayKey()}
                                value={draft.date}
                                onChange={(e) => field("date", e.target.value)}
                            />
                        </label>
                        <label>
                            Giờ bắt đầu
                            <input
                                type="time"
                                required
                                value={draft.start}
                                onChange={(e) => field("start", e.target.value)}
                            />
                        </label>
                        <label>
                            Giờ kết thúc
                            <input
                                type="time"
                                required
                                value={draft.end}
                                onChange={(e) => field("end", e.target.value)}
                            />
                        </label>
                    </div>
                    <label>
                        Hình thức
                        <select
                            value={draft.format}
                            onChange={(e) => {
                                setError("");
                                setDraft({
                                    ...draft,
                                    format: e.target.value as Interview["format"],
                                    location: "",
                                });
                            }}
                        >
                            <option>Trực tuyến</option>
                            <option>Tại văn phòng</option>
                        </select>
                    </label>
                    <label>
                        {draft.format === "Trực tuyến" ? "Liên kết họp (nếu có)" : "Địa điểm"}
                        <input
                            type={draft.format === "Trực tuyến" ? "url" : "text"}
                            pattern={draft.format === "Trực tuyến" ? "https://.+" : undefined}
                            required={draft.format === "Tại văn phòng"}
                            value={draft.location}
                            onChange={(e) => field("location", e.target.value)}
                        />
                    </label>
                </fieldset>
                <fieldset>
                    <legend>Người phỏng vấn</legend>
                    <div className={s.checks}>
                        {data.interviewers.map((person) => (
                            <label key={person}>
                                <input
                                    type="checkbox"
                                    checked={draft.panel.includes(person)}
                                    onChange={(e) =>
                                        field(
                                            "panel",
                                            e.target.checked
                                                ? [...draft.panel, person]
                                                : draft.panel.filter((p) => p !== person)
                                        )
                                    }
                                />
                                {person}
                            </label>
                        ))}
                    </div>
                </fieldset>
                <label>
                    Ghi chú
                    <textarea rows={3} value={draft.notes} onChange={(e) => field("notes", e.target.value)} />
                </label>
                <p className={s.notice}>
                    Lịch mẫu lưu trong tab này. Google Calendar, Google Meet và gửi thư mời chưa kết nối.
                </p>
            </form>
        </Surface>
    );
}
