import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './components/css/RegistrationPage.module.css';

export default function RegistrationPage() {
  const [message, setMessage] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [isSignIn, setIsSignIn] = useState(false);
  const navigate = useNavigate();

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?!.*\s).{8,}$/;

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!passwordPattern.test(password)) {
      setMessage("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`http://localhost:7035/api/user/register`, {
        method: "POST",
        mode: "cors",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ FullName: fullName, Email: email, Password: password })
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      // if (!res.ok) {
      //   const data = await res.json();
      //   console.log(`Error: `, data);
      //   setMessage(data.message || "Error signing up, please try again");
      //   return;
      // }

      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      console.error("Error signing up: ", error);
      setMessage("Error signing up, please try again");
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:7035/api/user/login`, {
        method: "POST",
        mode: "cors",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signInEmail, password: signInPassword })
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();

      if (data.token) {
        localStorage.setItem('authToken', data.token);
        console.log('Saved token:', localStorage.getItem('authToken')); // Debug log
        setMessage(data.message);
        setFullName(data.fullName)
      }

      setMessage(data.message);
      navigate("/");
    } catch (error) {
      console.error("Error signing in: ", error);
      setMessage("Error signing in, please try again");
    }
  };

return (
    <section className={styles.regLogin}>
      <div className={`${styles.container} ${isSignIn ? styles.active : ""}`}>

        {/* Register Box */}
        <div className={`${styles.user} ${styles.signinBx}`}>
          <div className={styles.imgBx}>
            <img src="https://res.cloudinary.com/diyp1k5z5/image/upload/v1744874379/login-img_cdeenv.jpg" alt="Register" />
          </div>
          <div className={styles.formBx}>
            <form onSubmit={handleRegister}>
              <h2>Register</h2>
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <ul className={styles.passwordRequirementsContainer}>
                  <li className={styles.passwordRequirements}><span class="low-upper-case"><i class="fa fa-file-text" aria-hidden="true"></i></span>&nbsp;1 lowercase &amp; 1 uppercase</li>
                  <li className={styles.passwordRequirements}><span class="one-number"><i class="fa fa-file-text" aria-hidden="true"></i></span> &nbsp;1 number (0-9)</li>
                  <li className={styles.passwordRequirements}><span class="one-special-char"><i class="fa fa-file-text" aria-hidden="true"></i></span> &nbsp;1 Special Character (@$!%*?&^#()[]{}|\\\\/−+_.:;=,~).</li>
                  <li className={styles.passwordRequirements}><span class="eight-character"><i class="fa fa-file-text" aria-hidden="true"></i></span>&nbsp;At least 8 characters long</li>
              </ul>
              {message && <p className={styles.message}>{message}</p>}
              <input
                type="password"
                placeholder="Create Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <input type="submit" value="Register" />
              <p className={styles.signup}>
                Already have an account?{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); setIsSignIn(true); }}>Sign In.</a>
              </p>
            </form>
          </div>
        </div>

        {/* Sign In Box */}
        <div className={`${styles.user} ${styles.signupBx}`}>
          <div className={styles.formBx}>
            <form onSubmit={handleSignIn}>
              <h2>Sign In</h2>
              <input
                type="email"
                placeholder="Email Address"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                required
              />
              <input type="submit" value="Sign In" />
              <p className={styles.signup}>
                Don't have an account?{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); setIsSignIn(false); }}>Sign Up.</a>
              </p>
            </form>
          </div>
          <div className={styles.imgBx}>
            <img src="https://res.cloudinary.com/diyp1k5z5/image/upload/v1744874376/signup-img_daepqz.png" alt="Sign In" />
          </div>
        </div>

      </div>
    </section>
  );
}