import { ImagePlus, Image as ImageIcon } from "lucide-react";
import styles from "./ImageGallery.module.css";

const galleryImages = [
    { id: 1, title: "Văn phòng làm việc", type: "office" },
    { id: 2, title: "Không gian công ty", type: "meeting" },
    { id: 3, title: "Khu vực làm việc", type: "workspace" },
];

function ImageGallery() {
    return (
        <section className={styles.card}>
            <div className={styles.cardHeader}>
                <h2>Thư viện hình ảnh</h2>

                <button type="button" className={styles.addButton}>
                    <ImagePlus size={16} />
                    Thêm hình ảnh
                </button>
            </div>

            <div className={styles.gallery}>
                {galleryImages.map((image) => (
                    <div className={styles.imageItem} key={image.id}>
                        <div className={`${styles.imagePlaceholder} ${styles[image.type]}`}>
                            <ImageIcon size={30} />
                        </div>

                        <p>{image.title}</p>
                    </div>
                ))}
            </div>

            <p className={styles.note}>
                Hình ảnh giúp ứng viên hiểu rõ hơn về môi trường làm việc.
            </p>
        </section>
    );
}

export default ImageGallery;