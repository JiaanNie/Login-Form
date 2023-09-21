import { useState, useEffect, useRef } from "react";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
const Auth_URL = "/auth";
const SignIn = () => {
  const { setAuth, persist, setPersist } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const userNameRef = useRef();
  const errorRef = useRef();

  const [userName, setUserName] = useState("");
  const [userNameFocus, setUserNameFocus] = useState();

  const [password, setPassword] = useState("");
  const [passwordFocus, setPasswordFocus] = useState();

  const [errorMessage, setErrorMessage] = useState();
  const togglePersist = () => {
    setPersist((prev) => !prev);
  };
  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  useEffect(() => {
    userNameRef.current.focus();
  }, []);
  useEffect(() => {
    setErrorMessage("");
  }, [userName, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        Auth_URL,
        { username: userName, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setUserName("");
      setPassword("");
      const roles = response.data.roles;
      const accessToken = response?.data?.accessToken;
      setAuth({ userName, password, roles, accessToken });
      navigate(from, { replace: true });
    } catch (error) {
      if (!error?.response) {
        setErrorMessage("server not responding");
      } else if (error.response?.status === 400) {
        setErrorMessage("invalid input");
      } else if (error.response?.status === 401) {
        setErrorMessage("unauthorized");
      } else {
        setErrorMessage("fail error");
      }
      errorRef.current.focus();
    }

    // here is where we going to make an axios call and get the accesstoken
    // and deal the the response from the backend
  };

  return (
    <section>
      <p
        ref={errorRef}
        className={errorMessage ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {errorMessage}
      </p>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username: </label>
        <input
          id="username"
          type="text"
          autoComplete="off"
          ref={userNameRef}
          required
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <label htmlFor="password">Password: </label>
        <input
          id="password"
          type="password"
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <button>Sign in</button>
        <div className="persistCheck">
          <input
            type="checkbox"
            id="persist"
            onChange={togglePersist}
            checked={persist}
          />
          <label htmlFor="persist">trust this device</label>
        </div>
      </form>
      <p>Need an account ?</p>
      <a href="#">Sign up</a>
    </section>
  );
};

export default SignIn;
