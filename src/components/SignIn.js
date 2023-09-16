import { useState, useEffect, useRef } from "react";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
const Auth_URL = "/auth";
const SignIn = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.path || "/";

  const userNameRef = useRef();
  const errorRef = useRef();

  const [userName, setUserName] = useState("");
  const [userNameFocus, setUserNameFocus] = useState();

  const [password, setPassword] = useState("");
  const [passwordFocus, setPasswordFocus] = useState();

  const [errorMessage, setErrorMessage] = useState();

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
      navigate("/", { replace: true });
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
      </form>
      <p>Need an account ?</p>
      <a href="#">Sign up</a>
    </section>
  );
};

export default SignIn;
