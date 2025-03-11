import { Link } from "react-router";
import WhoSentThis from "./WST";
import ProfileButton from "./ProfileButton";
import GlowDrop from "./GlowDrop";

export default function Header({}) {
  return (
    <>
      <GlowDrop />
      <div className="md:bg-transparent bg-secondary/30 rounded-b-2xl flex justify-between space-x-2 max-h-20 px-5 py-3 z-10">
        <Link to="/">
          <WhoSentThis className="text-nowrap text-4xl md:text-6xl md:top-5 md:absolute md:left-1/2 md:-translate-x-1/2" />
        </Link>
        <ProfileButton />
      </div>
    </>
  );
}
