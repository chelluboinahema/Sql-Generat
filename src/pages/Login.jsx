import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";

import { useDispatch } from "react-redux";

import { login } from "../redux/authSlice";

import { loginUser } from "../api/authApi";

import { useNotification } from "../context/NotificationContext";

export default function Login() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validate = () => {
    const newErrors = {};

    if (!data.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(data.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!data.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(data.password)) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setData({ ...data, email });
    
    if (email.trim()) {
      if (!validateEmail(email)) {
        setErrors({ ...errors, email: "Please enter a valid email address" });
      } else {
        const newErrors = { ...errors };
        delete newErrors.email;
        setErrors(newErrors);
      }
    } else {
      setErrors({ ...errors, email: "Email is required" });
    }
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setData({ ...data, password });
    
    if (password) {
      if (!validatePassword(password)) {
        setErrors({ ...errors, password: "Password must be at least 6 characters" });
      } else {
        const newErrors = { ...errors };
        delete newErrors.password;
        setErrors(newErrors);
      }
    } else {
      setErrors({ ...errors, password: "Password is required" });
    }
  };

  const { showNotification } = useNotification();

  const submit = async (e) => {
    e.preventDefault();

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      setLoading(true);
      const response = await loginUser(data);

      console.log(response);

      dispatch(login(response));

      showNotification("Login successful", "success");
      navigate("/dashboard");
    } catch {
      showNotification("Invalid credentials", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-[430px] bg-card rounded-3xl p-10 shadow-2xl ring-1 ring-primary/10">
        <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">SQL AI</h1>

        <form onSubmit={submit}>
          <input
            placeholder="Email"
            className="w-full p-4 rounded-xl mb-2 bg-slate-900 text-white"
            onChange={handleEmailChange}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mb-4">{errors.email}</p>
          )}

          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 rounded-xl mb-2 bg-slate-900 text-white"
            onChange={handlePasswordChange}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mb-6">{errors.password}</p>
          )}

          <button
            className={`w-full rounded-xl p-4 ${
              Object.keys(errors).length > 0 || !data.email || !data.password
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-primary to-accent text-white shadow"
            }`}
            disabled={Object.keys(errors).length > 0 || !data.email || !data.password}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <div className="mt-5">
          <Link to="/register">Create account</Link>
        </div>
      </div>
    </div>
  );
}
