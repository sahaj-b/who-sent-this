import { useAuth } from "../context/AuthContext";
import { ReactNode, useEffect } from "react";
import Loading from "../pages/Loading";
import { toastifyAndThrowError } from "../utils/errorHandler";
import { useNavigate } from "react-router";

export default function Private({
  component,
  allowAnonymous,
}: {
  component: ReactNode;
  allowAnonymous?: boolean;
}) {
  const auth = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!auth.user) {
      if (allowAnonymous) {
        auth
          .refreshToken()
          .catch(() => auth.registerAnonymous().catch(toastifyAndThrowError));
      } else {
        auth.refreshToken().catch(() => navigate("/"));
      }
    }
  }, []);
  return auth.user ? component : <Loading />;
}
