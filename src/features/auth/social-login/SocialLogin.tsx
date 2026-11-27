import { Button } from "../../../components/common";

import googleIcon from "../../../assets/gg.png";
import facebookIcon from "../../../assets/facebook.png";
import styles from "./SocialLogin.module.css";

const SocialLogin = () => {
    return (
        <div className={styles.socialLogin}>

            <div className={styles.divider}>
                <span>Đăng nhập mạng xã hội chưa khả dụng</span>
            </div>

            <div className={styles.socialButtons}>

                <Button
                    type="button"
                    variant="outline"
                    className={styles.socialBtn}
                    disabled
                >
                    <img src={googleIcon} alt="" />
                    <span>Google</span>
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    className={styles.socialBtn}
                    disabled
                >
                    <img src={facebookIcon} alt="" />
                    <span>Facebook</span>
                </Button>

            </div>

        </div>
    );
};

export default SocialLogin;
