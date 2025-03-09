import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import Header from "../components/Header";
import { toastifyAndThrowError } from "../utils/errorHandler";

export default function Inbox() {
  const auth = useAuth();
  const user = auth.user;
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (user?.receivingPaused) {
      setLoading(true);
      auth
        .changeSettings({ receivingPaused: false })
        .then(() => {
          setLoading(false);
        })
        .catch(toastifyAndThrowError);
    }
  }, []);
  if (loading) return <Loading />;
  return (
    <>
      <Header />
      {user?.email || (
        <div className="mx-3 text-center text-text/70 mt-10 text-lg">
          <Link to="/register" className="text-primary hover:underline">
            Register{" "}
          </Link>
          to access messages from any device or browser
        </div>
      )}
    </>
  );
}
