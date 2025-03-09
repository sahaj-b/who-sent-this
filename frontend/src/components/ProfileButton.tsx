import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Icon } from "@iconify/react/dist/iconify.js";

function Element({
  text,
  icon,
  onClick,
}: {
  text: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-text hover:bg-secondary/50 border-primary/50 z-10 cursor-pointer border-b px-3 py-1 w-full text-left text-xl"
    >
      <div className="text-nowrap">
        <Icon icon={icon} className="relative -top-0.5 -left-0.5 inline" />{" "}
        {text}
      </div>
    </button>
  );
}

export default function ProfileButton() {
  const auth = useAuth();
  const navigate = useNavigate();
  return (
    <div className="group relative">
      <Icon
        icon="mdi:account"
        className="text-primary shadow-accent/20 bg-secondary/60 size-12 rounded-full p-2 -mt-1 shadow-md"
      />
      <div
        className="ring-primary bg-secondary/50 shadow-background absolute right-1/2 z-10 mt-1 translate-x-1/2 -translate-y-1/2 scale-0 flex-col overflow-hidden rounded-xl shadow-md ring-1 backdrop-blur-sm transition
        group-hover:translate-x-1/4 group-hover:translate-y-0 group-hover:scale-100 hover:translate-x-1/4 hover:translate-y-0 hover:scale-100"
      >
        <Element
          text="Inbox"
          icon="mdi:inbox-arrow-down"
          onClick={() => navigate("/inbox")}
        />
        <Element
          text="Settings"
          icon="mdi:settings"
          onClick={() => navigate("/settings")}
        />
        {auth.user?.email || (
          <>
            <Element
              text="Login"
              icon="mdi:login-variant"
              onClick={() => navigate("/login")}
            />
            <Element
              text="Register"
              icon="mdi:register"
              onClick={() => navigate("/register")}
            />
          </>
        )}
      </div>
    </div>
  );
}
