import { Link } from "react-router";
import WhoSentThis from "./WST";
import ProfileButton from "./ProfileButton";

export default function Header({}) {
  return (
    <div className="flex justify-between space-x-2 max-h-20 mx-5 pt-6 z-10">
      <Link to="/">
        <WhoSentThis className="text-nowrap text-4xl md:text-6xl md:absolute md:left-1/2 md:-translate-x-1/2" />
      </Link>
      <ProfileButton />
    </div>
  );
}
