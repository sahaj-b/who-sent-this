import { useAuth } from "../context/AuthContext";
import { ReactNode, useEffect } from "react";
import Loading from "../pages/Loading";
import { toastifyAndThrowError } from "../utils/errorHandler";

export default function Private({ component }: { component: ReactNode }) {
  const auth = useAuth();
  useEffect(() => {
    if (!auth.user) {
      auth
        .userInfo()
        .catch(() =>
          auth
            .refreshToken()
            .catch(() => auth.registerAnonymous().catch(toastifyAndThrowError)),
        );
    }
  }, []);
  return auth.user ? component : <Loading />;
}
