import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";

const PersistenceLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    // if the auth.accessToken does not exist call the verifyrefreshtoken  otherwise set isloading is true
    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
  }, []);

  useEffect(() => {
    console.log(`is loading ${isLoading}`);
    console.log(auth);
  }, [isLoading]);

  return <>{isLoading ? <p>....Loading</p> : <Outlet />}</>;
};

export default PersistenceLogin;
