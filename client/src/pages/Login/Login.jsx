import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import styles from "./Login.module.css";
import { toast } from "sonner";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login", { email, password });
      // store token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user._id);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/start-test"); // navigate to test page after login
    } catch (error) {
      console.error(error);
      toast.error("Login failed");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Please sign in to continue</p>

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Email</label>
            <input
              className={styles.inputField}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Password</label>
            <input
              className={styles.inputField}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className={styles.loginButton} type="submit">
            Sign In
          </button>

          <div className={styles.signupLink}>
            Don't have an account?{" "}
            <a href="/register" className={styles.link}>
              Create account
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
