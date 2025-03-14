import {
  ChangeEvent,
  HTMLInputTypeAttribute,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { isEmailInvalid } from "../utils/validators";
import Info from "./Info";
import { Icon } from "@iconify/react/dist/iconify.js";

export function InputBox({
  placeholder = "",
  type = "text",
  onChange = () => {},
  ringColorClass = "focus:ring-primary/70",
  className = "",
  value,
}: {
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  ringColorClass?: string;
  className?: string;
  value?: string;
}) {
  return (
    <input
      type={type}
      aria-label={type}
      className={
        "bg-secondary/25 text-text w-full rounded-md px-5 py-2 text-lg transition focus:ring-2 focus:outline-none " +
        ringColorClass +
        " " +
        className
      }
      placeholder={placeholder}
      onChange={onChange}
      value={value}
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
  placeholder = "Enter your Password",
  value,
}: {
  setPassword: (e: SetStateAction<string>) => void;
  placeholder?: string;
  value?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <InputBox
        type={showPassword ? "text" : "password"}
        className="pr-10"
        placeholder={placeholder}
        onChange={(e) => setPassword(e.target.value)}
        value={value}
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
  value,
  placeholder = "Name (Optional)",
}: {
  setName: (e: SetStateAction<string>) => void;
  value?: string;
  placeholder?: string;
}) {
  return (
    <div className="relative w-full">
      <InputBox
        type="text"
        className="pr-10"
        placeholder={placeholder}
        onChange={(e) => setName(e.target.value)}
        value={value}
      />
      <div className="text-primary absolute top-2.5 right-2 size-6">
        <Info content="Users will see this name while sending messages to you" />
      </div>
    </div>
  );
}

export function MessageInputBox({
  ref,
  placeholder = "Enter your message",
}: {
  ref: any;
  placeholder?: string;
}) {
  return (
    <textarea
      aria-label="Message"
      className="bg-secondary/30 text-text focus:ring-primary/80 w-full resize-verticle rounded-md px-5 py-2 text-lg transition outline-none focus:ring-2"
      placeholder={placeholder}
      ref={ref}
    />
  );
}
