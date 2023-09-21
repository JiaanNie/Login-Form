import axios from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
  // the purpose of this hook is setAuth to a empty object
  // the axios call will clear out the jwt in the cookie
  const { setAuth } = useAuth();
  const logout = async () => {
    setAuth({});
    try {
      await axios.get("/logout", { withCredentials: true });
    } catch (error) {
      console.log(error);
    }
  };
  return logout;
};

export default useLogout;
