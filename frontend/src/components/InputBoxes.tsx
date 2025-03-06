import {
  ChangeEvent,
  HTMLInputTypeAttribute,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { isEmailInvalid } from "../utils/validators";
import { Icon } from "@iconify/react/dist/iconify.js";
import Info from "./Info";

export function InputBox({
  placeholder = "",
  type = "text",
  onChange = () => {},
  ringColorClass = "focus:ring-primary/80",
  className = "",
}: {
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  ringColorClass?: string;
  className?: string;
}) {
  return (
    <input
      type={type}
      aria-label={type}
      className={
        "bg-secondary/30 text-text w-full rounded-md px-5 py-2 text-lg transition focus:ring-2 focus:outline-none " +
        ringColorClass +
        " " +
        className
      }
      placeholder={placeholder}
      onChange={onChange}
    />
  );
}

export function EmailInputBox({
  email,
  setEmail,
}: {
  email: string;
  setEmail: (e: SetStateAction<string>) => void;
}) {
  const [ringColorClass, setRingColorClass] = useState("focus:ring-primary/80");

  useEffect(() => {
    if (!email) {
      setRingColorClass("focus:ring-primary/80");
    } else if (isEmailInvalid(email)) {
      setRingColorClass("focus:ring-accent");
    } else {
      setRingColorClass("focus:ring-green-300/60");
    }
  }, [email]);

  return (
    <InputBox
      placeholder="Enter your email"
      type="text"
      onChange={(e) => setEmail(e.target.value)}
      ringColorClass={ringColorClass}
    />
  );
}

export function PasswordInputBox({
  setPassword,
}: {
  setPassword: (e: SetStateAction<string>) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <InputBox
        type={showPassword ? "text" : "password"}
        className="pr-10"
        placeholder="Enter your Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Icon
        icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
        className="text-primary absolute top-2.5 right-2 size-6 hover:cursor-pointer"
        onClick={() => setShowPassword(!showPassword)}
      />
    </div>
  );
}

export function NameInputBox({
  setName,
}: {
  setName: (e: SetStateAction<string>) => void;
}) {
  return (
    <div className="relative">
      <InputBox
        type="text"
        className="pr-10"
        placeholder="Name (Optional)"
        onChange={(e) => setName(e.target.value)}
      />
      <div className="text-primary absolute top-2.5 right-2 size-6">
        <Info content="Users will see this name while sending messages to you" />
      </div>
    </div>
  );
}
