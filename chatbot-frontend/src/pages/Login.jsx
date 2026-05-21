import "./Login.css";

const Login = () => {

    const handleGoogleLogin = () => {

        window.location.href =
            "https://jeniai-backend.tushar-sonawane.xyz/auth/google";

    };

    return (

        <div className="login-page">

            {/* BACKGROUND GLOW EFFECTS */}
            <div className="bg-glow glow-one"></div>
            <div className="bg-glow glow-two"></div>

            {/* LOGIN CARD */}
            <div className="login-card">

                <div className="top-badge">
                    ✨ AI Powered
                </div>

                <h1 id="welcome">
                    Welcome Back
                </h1>

                <p className="subtitle">
                    Login or create your account to continue using ChatBot AI
                </p>

                <button
                    className="google-btn"
                    onClick={handleGoogleLogin}
                >

                    <img
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                        alt="Google"
                    />

                    <span id="goggle-text">
                        Continue with Google
                    </span>

                </button>

                <p className="terms">
                    By continuing, you agree to our Terms & Privacy Policy
                </p>

            </div>

        </div>

    );

};

export default Login;