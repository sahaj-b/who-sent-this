import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState, useRef, useEffect } from "react";

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const auth = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);
  return (
    <div className="relative" ref={dropdownRef}>
      <Icon
        icon="mdi:account"
        className="inset-ring-2 inset-ring-accent/20 text-primary bg-secondary/60 size-12 rounded-full p-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      />
      <div
        className={`ring-primary bg-secondary/50 shadow-background absolute right-1/2 z-10 mt-1 translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl shadow-md ring-1 backdrop-blur-sm transition
        ${isOpen ? "translate-x-1/4 translate-y-0 scale-100" : "scale-0"}`}
      >
        {auth.user &&
        (auth.user?.email ||
          window.localStorage.getItem("accountOrReceiver") === "true") ? (
          <>
            <Element
              text="Inbox"
              icon="mdi:inbox-arrow-down"
              onClick={() => {
                navigate("/inbox");
                setIsOpen(false);
              }}
            />
            <Element
              text="Questions"
              icon="mdi:frequently-asked-questions"
              onClick={() => {
                navigate("/Questions");
                setIsOpen(false);
              }}
            />
            <Element
              text="Settings"
              icon="mdi:settings"
              onClick={() => {
                navigate("/settings");
                setIsOpen(false);
              }}
            />
          </>
        ) : null}
        {user?.email ? (
          <Element
            text="Logout"
            icon="mdi:logout"
            onClick={() => {
              auth.logout();
              navigate("/");
              setIsOpen(false);
            }}
          />
        ) : (
          <>
            <Element
              text="Login"
              icon="mdi:login"
              onClick={() => {
                navigate("/login");
                setIsOpen(false);
              }}
            />
            <Element
              text="Register"
              icon="mdi:register"
              onClick={() => {
                navigate("/register");
                setIsOpen(false);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
