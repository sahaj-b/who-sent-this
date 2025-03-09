import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";

export default function Inbox() {
  const auth = useAuth();
  const user = auth.user;
  return (
    <>
      <Header />
      {user?.receivingPaused && (
        <div className="text-center text-text/70 mt-10 text-lg">
          You are not receiving messages.{" "}
          <Link to="/settings" className="text-primary hover:underline">
            Change settings
          </Link>
        </div>
      )}
      {user?.email || (
        <div className="mx-3 text-center text-text/70 mt-10 text-lg">
          <Link to="/register" className="text-primary hover:underline">
            Register
          </Link>{" "}
          to access messages from any device or browser
        </div>
      )}
    </>
  );
}
