import { Link } from "react-router";
import { Button, SecondaryButton } from "../components/Buttons";
import { useAuth } from "../context/AuthContext";
export default function Home() {
  const auth = useAuth();
  const user = auth.user;
  return (
    <div className="bg-background h-screen">
      <div className="from-accent/30 to-accent/0 absolute -top-60 -left-60 h-96 w-96 rounded-full bg-radial blur-3xl"></div>
      <div className="from-accent/40 to-accent/0 absolute -top-50 -right-70 h-96 w-96 rounded-full bg-radial opacity-70 blur-3xl"></div>
      <div className="flex justify-between px-3 py-3">
        <div></div>
        {user ? (
          <SecondaryButton
            content="Logout"
            onClick={auth.logout}
            className="z-10"
          />
        ) : (
          <Link to="/login" className="z-10">
            <SecondaryButton content="Login" />
          </Link>
        )}
      </div>
      <div className="mx-3 mt-15 text-center font-[Sigmar] text-5xl tracking-wide md:text-6xl">
        <span className="from-accent via-secondary bg-linear-60 via-70% bg-clip-text pr-1 text-transparent italic font-stretch-extra-expanded">
          Who
        </span>
        <span className="text-primary opacity-80"> Sent This?</span>
      </div>
      <p className="text-text mx-8 mt-5 text-center font-[Funnel_Sans] text-lg opacity-80">
        Send and receive anonymous messages without revealing your identity
      </p>
      <div className="mt-10 flex justify-center">
        <Link to="/dashboard">
          <Button
            content={
              user ? "View received messages" : "Start receiving messages"
            }
          />
        </Link>
      </div>
    </div>
  );
}
