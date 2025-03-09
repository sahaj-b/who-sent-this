import { Link } from "react-router";
import { Button } from "../components/Buttons";
import { useAuth } from "../context/AuthContext";
import GlowDrop from "../components/GlowDrop";
import WhoSentThis from "../components/WST";
import ProfileButton from "../components/ProfileButton";
export default function Home() {
  const { user } = useAuth();
  return (
    <>
      <GlowDrop />
      <div className="flex justify-end px-3 pb-3 pt-4">
        <ProfileButton />
      </div>
      <WhoSentThis className="mt-7 text-[2.5rem] sm:text-5xl md:text-6xl" />
      <p className="md:text-xl text-text mx-8 mt-5 text-center text-lg opacity-80">
        Send and receive anonymous messages without revealing your identity
      </p>
      <div className="mt-10 flex justify-center">
        <Link to="/inbox">
          <Button
            content={
              user?.receivingPaused
                ? "Start receiving messages"
                : "View received messages"
            }
          />
        </Link>
      </div>
    </>
  );
}
