/**
 * Content for the UI preview only. This file is not an API fallback and must
 * be replaced with the documented Jobs service contract when it is available.
 */
export interface JobPreview {
    id: string;
    title: string;
    company: string;
    initials: string;
    location: string;
    salary: string;
    salaryMin: number;
    salaryMax: number;
    level: string;
    workType: string;
    category: string;
    postedAt: string;
    deadline: string;
    applicants: number;
    description: string;
    requirements: string[];
    benefits: string[];
    status: "Đang mở" | "Đã đóng" | "Bản nháp";
}

export const JOB_PREVIEW_ITEMS: JobPreview[] = [
    {
        id: "preview-frontend",
        title: "Frontend Engineer (React)",
        company: "Nova Digital",
        initials: "ND",
        location: "TP. Hồ Chí Minh",
        salary: "25–40 triệu",
        salaryMin: 25,
        salaryMax: 40,
        level: "Middle",
        workType: "Toàn thời gian",
        category: "Frontend",
        postedAt: "Đăng 2 ngày trước",
        deadline: "30/12/2026",
        applicants: 18,
        description:
            "Cùng đội ngũ sản phẩm xây dựng trải nghiệm web dễ dùng, nhanh và ổn định cho khách hàng doanh nghiệp.",
        requirements: [
            "Có kinh nghiệm với React và TypeScript",
            "Hiểu REST API và quy trình làm việc với Git",
            "Chủ động trao đổi trong môi trường Agile",
        ],
        benefits: [
            "Lương tháng 13 và thưởng theo hiệu quả",
            "Bảo hiểm sức khỏe mở rộng",
            "Linh hoạt thời gian làm việc",
        ],
        status: "Đang mở",
    },
    {
        id: "preview-backend",
        title: "Backend Developer — Java",
        company: "Bluewave Technology",
        initials: "BT",
        location: "Hà Nội",
        salary: "30–45 triệu",
        salaryMin: 30,
        salaryMax: 45,
        level: "Senior",
        workType: "Toàn thời gian",
        category: "Backend",
        postedAt: "Đăng 4 ngày trước",
        deadline: "05/01/2027",
        applicants: 12,
        description:
            "Thiết kế và phát triển các dịch vụ backend có khả năng mở rộng, phối hợp cùng sản phẩm và vận hành.",
        requirements: [
            "Thành thạo Java và Spring Boot",
            "Có kinh nghiệm thiết kế API và cơ sở dữ liệu",
            "Quan tâm đến chất lượng và khả năng vận hành hệ thống",
        ],
        benefits: [
            "Ngân sách học tập hằng năm",
            "Laptop theo lựa chọn",
            "Khám sức khỏe định kỳ",
        ],
        status: "Đang mở",
    },
    {
        id: "preview-product",
        title: "Product Designer",
        company: "Mây Studio",
        initials: "MS",
        location: "Đà Nẵng",
        salary: "20–32 triệu",
        salaryMin: 20,
        salaryMax: 32,
        level: "Middle",
        workType: "Hybrid",
        category: "Design",
        postedAt: "Đăng 1 tuần trước",
        deadline: "12/01/2027",
        applicants: 9,
        description:
            "Nghiên cứu nhu cầu người dùng và biến các vấn đề phức tạp thành trải nghiệm sản phẩm rõ ràng.",
        requirements: [
            "Có portfolio thể hiện quy trình thiết kế",
            "Sử dụng tốt Figma",
            "Có khả năng trình bày quyết định thiết kế",
        ],
        benefits: [
            "Môi trường tôn trọng sự tập trung",
            "Lịch hybrid linh hoạt",
            "Ngân sách thiết bị làm việc",
        ],
        status: "Đang mở",
    },
    {
        id: "preview-qa",
        title: "QA Engineer",
        company: "Orchid Labs",
        initials: "OL",
        location: "TP. Hồ Chí Minh",
        salary: "18–28 triệu",
        salaryMin: 18,
        salaryMax: 28,
        level: "Junior",
        workType: "Toàn thời gian",
        category: "QA / QC",
        postedAt: "Đăng 9 ngày trước",
        deadline: "20/12/2026",
        applicants: 24,
        description:
            "Đảm bảo chất lượng sản phẩm qua kiểm thử có hệ thống và phối hợp sớm với nhóm phát triển.",
        requirements: [
            "Nắm được quy trình kiểm thử phần mềm",
            "Biết viết test case rõ ràng",
            "Cẩn thận và giao tiếp tốt",
        ],
        benefits: [
            "Được hướng dẫn bởi QA Lead",
            "Bảo hiểm đầy đủ",
            "Lộ trình phát triển nghề nghiệp",
        ],
        status: "Đang mở",
    },
];

export const COMPANY_JOB_PREVIEW_ITEMS: JobPreview[] = [
    JOB_PREVIEW_ITEMS[0],
    JOB_PREVIEW_ITEMS[1],
    {
        ...JOB_PREVIEW_ITEMS[2],
        id: "preview-draft",
        title: "UI/UX Designer",
        company: "Nova Digital",
        status: "Bản nháp",
        applicants: 0,
    },
    {
        ...JOB_PREVIEW_ITEMS[3],
        id: "preview-closed",
        title: "Manual Tester",
        company: "Nova Digital",
        status: "Đã đóng",
        applicants: 31,
    },
];
