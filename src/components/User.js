import { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useRefreshToken from "../hooks/useRefreshToken";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../api/axios";
const User = () => {
  const [users, setUsers] = useState();
  const axiosPrivate = useAxiosPrivate();
  const refresh = useRefreshToken();
  const navigate = useNavigate();
  const location = useLocation();
  const effectRan = useRef(false);
  useEffect(() => {
    let isMounted = true;
    // the purpose of this controller is to cancel any pending request when the component unmount
    let controller = new AbortController();
    // define the function
    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get("/users", {
          signal: controller.signal,
        });
        // const response = await axios.get("/users");
        isMounted && setUsers(response.data);
      } catch (error) {
        console.error(error);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };
    if (effectRan.current === true) {
      // call the getUsers function
      getUsers();
    }

    // return a clean up function

    return () => {
      isMounted = false;
      // cancel all pending request after component being unmounted
      controller.abort();
      effectRan.current = true;
    };
  }, []);

  return (
    <article>
      <h2>Users List</h2>
      {users?.length ? (
        <ul>
          {users.map((user, i) => (
            <li key={i}>{user?.username}</li>
          ))}
        </ul>
      ) : (
        <p>No users to display</p>
      )}
      <button
        onClick={() => {
          try {
            refresh();
          } catch (e) {
            console.error(e);
            navigate("/login", { state: { from: location }, replace: true });
          }
        }}
      >
        Refresh
      </button>
      <br />
    </article>
  );
};

export default User;
