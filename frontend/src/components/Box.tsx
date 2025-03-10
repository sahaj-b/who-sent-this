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
        "ring-primary/80 bg-secondary/20 shadow-primary/20 mx-auto flex flex-col space-y-10 rounded-2xl px-8 py-10 shadow-xl ring-2 " +
        widthClass
      }
    >
      {children}
    </div>
  );
}
