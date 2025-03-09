import { Icon } from "@iconify/react/dist/iconify.js";
import { JSX } from "react";

export function Button({
  content,
  className = "",
  type = "button",
  loading = false,
  onClick = () => {},
}: {
  content: string | JSX.Element;
  className?: string;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
  onClick?: (e?: any) => void;
}) {
  return (
    <button
      type={type}
      className={
        "from-primary/80 via-primary to-primary/60 bg-primary text-background hover:bg-accent/80 ring-accent/80 ring-offset-background shadow-primary/20 w-full cursor-pointer rounded-xl bg-linear-60 px-5 py-2 text-xl font-semibold shadow-xl ring-2 ring-offset-0 transition duration-300 hover:shadow-2xl hover:ring-offset-2 " +
        className +
        " " +
        (loading ? "pointer-events-none opacity-70" : "")
      }
      onClick={onClick}
    >
      {loading ? (
        <Icon icon="svg-spinners:3-dots-move" className="m-auto size-7" />
      ) : (
        content
      )}
    </button>
  );
}

export function SecondaryButton({
  content,
  className = "",
  type = "button",
  onClick = () => {},
}: {
  content: string | JSX.Element;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={
        "inset-ring-primary text-text bg-secondary/60 rounded-xl px-3 py-1 text-xl inset-ring-1 transition duration-300 hover:cursor-pointer hover:inset-ring-2 " +
        className
      }
    >
      {content}
    </button>
  );
}
