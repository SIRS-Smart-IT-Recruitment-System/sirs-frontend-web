import styles from "./SocialLogin.module.css";

import googleIcon from "../../../assets/gg.png";
import facebookIcon from "../../../assets/facebook.png";

const SocialLogin = () => {
    return (
        <div className={styles.socialLogin}>

            <div className={styles.divider}>
                <span>Hoặc đăng nhập bằng</span>
            </div>

            <div className={styles.socialButtons}>

                <button type="button">
                    <img src={googleIcon} alt="Google" />
                    Google
                </button>

                <button type="button">
                    <img src={facebookIcon} alt="Facebook" />
                    Facebook
                </button>

            </div>

        </div>
    );
};

export default SocialLogin;
