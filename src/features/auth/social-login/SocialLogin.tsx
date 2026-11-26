import { Button } from "../../../components/common";

import googleIcon from "../../../assets/gg.png";
import facebookIcon from "../../../assets/facebook.png";
import styles from "./SocialLogin.module.css";

const SocialLogin = () => {
    return (
        <div className={styles.socialLogin}>

            <div className={styles.divider}>
                <span>Hoặc đăng nhập bằng</span>
            </div>

            <div className={styles.socialButtons}>

                <Button type="button" variant="outline" className={styles.socialBtn}>
                    <img src={googleIcon} alt="Google" />
                    <span>Google</span>
                </Button>

                <Button type="button" variant="outline" className={styles.socialBtn}>
                    <img src={facebookIcon} alt="Facebook" />
                    <span>Facebook</span>
                </Button>

            </div>

        </div>
    );
};

export default SocialLogin;
