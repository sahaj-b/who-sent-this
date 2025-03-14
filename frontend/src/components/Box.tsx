import { ReactNode } from "react";

export default function Box({
  children,
  widthClass = "w-full max-w-md",
}: {
  children: ReactNode;
  widthClass?: string;
}) {
  return (
    <div
      className={
        "ring-primary/70 bg-secondary/15 shadow-primary/15 mx-auto flex flex-col space-y-10 rounded-2xl px-8 py-8 shadow-xl ring-2 " +
        widthClass
      }
    >
      {children}
    </div>
  );
}
