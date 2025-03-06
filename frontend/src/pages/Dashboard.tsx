import { Link, useNavigate } from "react-router";
import { Button, SecondaryButton } from "../components/Buttons";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const auth = useAuth();
  const user = auth.user;
  const navigate = useNavigate();

  return (
    <div className="bg-background h-screen">
      <div className="px-5 pt-5">
        <Link to="/">
          <SecondaryButton
            content={<Icon icon="mdi:arrow-back" width={25}></Icon>}
            className="py-3 px-4"
          />
        </Link>
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="ring-primary/80 shadow-primary/15 mt-32 flex flex-col space-y-10 rounded-2xl py-10 px-8 shadow-xl ring-2 md:w-md">
          <span className="text-primary font-[Sigmar] text-5xl opacity-90 md:text-6xl">
            Dashboard
          </span>
          <div className="flex flex-col space-y-5">
            <span className="text-primary text-md font-bold">
              Welcome {user?.name}
            </span>
            <span className="text-primary text-md font-bold">
              Email: {user?.email}
            </span>
            <span className="text-primary text-md font-bold">
              ID: {user?.shortId}
            </span>
            <Button
              content="Logout"
              onClick={() => {
                auth.logout().then(() => {
                  navigate("/");
                });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
