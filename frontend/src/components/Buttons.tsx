import { JSX } from "react";

export function Button({
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
      className={
        "from-primary/80 via-primary to-primary/60 bg-primary text-background hover:bg-accent/80 ring-secondary ring-offset-background shadow-accent/20 cursor-pointer rounded-xl bg-linear-60 px-5 py-2 font-[Funnel_Sans] text-xl font-semibold shadow-xl ring-2 ring-offset-0 transition duration-300 hover:shadow-2xl hover:ring-offset-2 " +
        className
      }
      onClick={onClick}
    >
      {content}
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
        "inset-ring-primary text-text bg-secondary/60 hover:bg-secondary/80 rounded-xl px-3 py-1 text-xl inset-ring-1 transition duration-300 hover:cursor-pointer hover:inset-ring-2 " +
        className
      }
    >
      {content}
    </button>
  );
}
