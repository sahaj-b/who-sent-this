import { Icon } from "@iconify/react/dist/iconify.js";
import { JSX } from "react";

export function Button({
  content,
  className = "",
  type = "button",
  loading = false,
  disabled = false,
  onClick = () => {},
}: {
  content: string | JSX.Element;
  className?: string;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
  disabled?: boolean;
  onClick?: (e?: any) => void;
}) {
  return (
    <button
      type={type}
      className={
        (disabled
          ? "text-text/90 cursor-not-allowed bg-gray-500/30 ring-offset-2"
          : "from-primary/80 via-primary to-primary/60 bg-accent/80 text-background md:hover:bg-accent/80 cursor-pointer bg-linear-60 transition duration-300 md:ring-offset-0 md:hover:ring-offset-2") +
        " ring-accent/80 ring-offset-background shadow-primary/20 z-10 w-full rounded-xl px-5 py-2 text-xl font-semibold shadow-2xl ring-2 ring-offset-2" +
        " " +
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
  loading = false,
}: {
  content: string | JSX.Element;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  loading?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={
        "inset-ring-primary text-text bg-secondary/60 z-10 w-full rounded-xl px-5 py-3 text-xl inset-ring-1 transition duration-300 hover:cursor-pointer hover:inset-ring-2 " +
        className
      }
    >
      {loading ? (
        <Icon icon="svg-spinners:3-dots-move" className="m-auto size-7" />
      ) : (
        content
      )}
    </button>
  );
}
