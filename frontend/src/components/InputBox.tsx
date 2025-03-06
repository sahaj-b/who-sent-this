import { HTMLInputTypeAttribute } from "react";

export default function InputBox({
  placeholder,
  type = "text",
  onChange = () => {},
  ringColorClass = "focus:ring-primary/80",
  className = "",
}: {
  placeholder: string;
  type?: HTMLInputTypeAttribute;
  onChange?: (e: any) => void;
  ringColorClass?: string;
  className?: string;
}) {
  return (
    <input
      type={type}
      title=""
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
