import { useAuth } from "../context/AuthContext";
import { ReactNode, useEffect } from "react";
import getCookieValue from "../utils/getCookie";
import Loading from "../pages/Loading";

export default function Private({ component }: { component: ReactNode }) {
  const auth = useAuth();
  useEffect(() => {
    if (!auth.user) {
      if (getCookieValue("refreshToken")) {
        auth
          .userInfo()
          .catch(() =>
            auth.refreshToken().catch(() => auth.registerAnonymous()),
          );
      } else auth.registerAnonymous();
    }
  }, []);
  return auth.user ? component : <Loading />;
}
