import { useAuth } from "../context/AuthContext";
import { ReactNode, useEffect } from "react";
import getCookieValue from "../utils/getCookie";
import Loading from "../pages/Loading";
import { toastifyAndThrowError } from "../utils/errorHandler";

export default function Private({ component }: { component: ReactNode }) {
  const auth = useAuth();
  useEffect(() => {
    if (!auth.user) {
      if (getCookieValue("refreshToken")) {
        auth
          .userInfo()
          .catch(() =>
            auth
              .refreshToken()
              .catch(() =>
                auth.registerAnonymous().catch(toastifyAndThrowError),
              ),
          );
      } else auth.registerAnonymous().catch(toastifyAndThrowError);
    }
  }, []);
  return auth.user?._id ? component : <Loading />;
}
