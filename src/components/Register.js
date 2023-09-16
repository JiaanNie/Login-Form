import {
  faCheck,
  faInfoCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef } from "react";
import axios from "../api/axios";
const REGISTER_URL = "/register/";
// first we need user and password regex to vaildate the input password and username has meet the requirement

// the regex is saying that it must begin with upper case A to Z or lower case a to z
// any alph character or digits 3 to 23 characters long
// total lenght is 4 to 24
const USER_REGEX = /^[A-Za-z][a-zA-Z0-9-_]{3,23}$/;

// the regex is saying
// password must contain a lower and upper case character, a digit and a number the length is between 8 to 24 characters long
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const Register = () => {
  const userNameRef = useRef();
  // we need this error ref because when the arrow occour, we would need the text of speech read the error message from the screen
  const errorRef = useRef();

  const [userName, setUserName] = useState("");
  const [vaildateUserName, setVaildateUserName] = useState(false);
  const [userNameFocus, setUserNameFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [vaildatePassword, setVaildatePassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(true);

  const [comfirmPassword, setComfirmPassword] = useState("");
  const [vaildateComfirmPassword, setVaildateComfirmPassword] = useState(false);
  const [comfirmPasswordFocus, setComfirmPasswordFocus] = useState(true);

  const [errorMessage, setErrorMessage] = useState();
  const [success, setSuccess] = useState();

  // this use effect is when the component inital loaded we want to have cursor focus on the username input field
  useEffect(() => {
    userNameRef.current.focus();
  }, []);

  // the next use effect is we want to vaildate the input username if is pass the regex test
  useEffect(() => {
    setVaildateUserName(USER_REGEX.test(userName));
  }, [userName]);

  // now lets apply the same logic for the password, however we would like to include the comfirm password in this use effect as well
  // the reason is because if one of them change we would notify the second has to change as well
  useEffect(() => {
    // when both password are matching and
    setVaildatePassword(PASSWORD_REGEX.test(password));
    setVaildateComfirmPassword(password === comfirmPassword);
  }, [password, comfirmPassword]);

  // the purpose of this use effect assume user encounter an error message because their password or user name didnt meet the requirment
  // when user started typing  we assume that
  // user have read the error message and want to make adjustment to it because of it we will clear out the error message
  useEffect(() => {
    setErrorMessage("");
  }, [userName, password, comfirmPassword]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    // guard just in case if someone enable the button using javascript
    if (!USER_REGEX.test(userName) || !PASSWORD_REGEX.test(password)) {
      setErrorMessage("invalid entry");
      return;
    }
    // axios call to the backend
    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({ username: userName, password }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setSuccess(true);
    } catch (error) {
      if (!error?.response) {
        setErrorMessage("Server Time out");
      } else if (error.response?.status === 409) {
        setErrorMessage("User name already taken");
      } else {
        setErrorMessage("Registration Failed");
      }
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1>Success</h1>
          <p>
            <a href="#">Sign in</a>
          </p>
        </section>
      ) : (
        <section>
          <p
            ref={errorRef}
            className={errorMessage ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errorMessage}
          </p>
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            {/* the htmlFor has to match the input id  */}
            <label htmlFor="userName">
              UserName:
              <span className={vaildateUserName ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span
                className={vaildateUserName || !userName ? "hide" : "invalid"}
              >
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type="text"
              ref={userNameRef}
              id="userName"
              required
              autoComplete="off"
              aria-invalid={vaildateUserName ? "true" : "false"}
              aria-describedby="uidnote"
              onFocus={() => setUserNameFocus(true)}
              onBlur={() => setUserNameFocus(false)}
              onChange={(e) => setUserName(e.target.value)}
            />
            <p
              id="uidnote"
              className={
                userNameFocus && userName && !vaildateUserName
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icons={faInfoCircle} />
              Must be 4 to 24 characters long <br />
              Must start with a lower or upper case character <br />
              Hyphens, underscore, digits, lower and upper are allowed
            </p>
            <label htmlFor="password">
              Password:
              <span className={vaildatePassword ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span
                className={vaildatePassword || !password ? "hide" : "invalid"}
              >
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type="password"
              id="password"
              required
              aria-invalid={vaildatePassword ? "true" : "false"}
              aria-describedby="passwordnote"
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p
              id="passwordnote"
              className={
                passwordFocus && password && !vaildatePassword
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icons={faInfoCircle} />
              Must be 8 to 24 characters long <br />
              Password must contain a lower case, upper case, a digit and
              special character !@#$%
            </p>
            <label htmlFor="comfirmPassword">
              Comfirm Password:
              <span
                className={
                  vaildateComfirmPassword && comfirmPassword && vaildatePassword
                    ? "valid"
                    : "hide"
                }
              >
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span
                className={
                  vaildateComfirmPassword || !comfirmPassword
                    ? "hide"
                    : "invalid"
                }
              >
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type="password"
              id="comfirmPassword"
              required
              aria-invalid={vaildateComfirmPassword ? "true" : "false"}
              aria-describedby="comfirmpasswordnote"
              onFocus={() => setComfirmPasswordFocus(true)}
              onBlur={() => setComfirmPasswordFocus(false)}
              onChange={(e) => setComfirmPassword(e.target.value)}
            />
            <p
              id="comfirmpasswordnote"
              className={
                comfirmPasswordFocus &&
                comfirmPassword &&
                !vaildateComfirmPassword
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icons={faInfoCircle} />
              passowrd does not match
            </p>
            <button
              disabled={
                !vaildateUserName ||
                !vaildatePassword ||
                !vaildateComfirmPassword
                  ? true
                  : false
              }
            >
              Submit
            </button>
          </form>
          <p>Already Register</p>
          <a href="#">Sign In</a>
        </section>
      )}
    </>
  );
};
// the reason in the form where we dont need to handle a click event is because, if the form has a single button by default when the button
// being press it will emit a onSubmit event
export default Register;
