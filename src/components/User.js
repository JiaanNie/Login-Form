import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useRefreshToken from "../hooks/useRefreshToken";
const User = () => {
  const [users, setUsers] = useState();
  const axiosPrivate = useAxiosPrivate();
  const refresh = useRefreshToken();
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
        isMounted && setUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    // call the getUsers function
    getUsers();
    // return a clean up function
    return () => {
      isMounted = false;
      // cancel all pending request after component being unmounted
      controller.abort();
    };
  }, []);

  return (
    <article>
      <h5>List of Users</h5>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user.username}</li>
        ))}
      </ul>
      {console.log(users)}

      <button onClick={() => refresh()}>Refresh</button>
      <br />
    </article>
  );
};

export default User;
