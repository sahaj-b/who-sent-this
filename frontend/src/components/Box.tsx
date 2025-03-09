import { ReactNode } from "react";

export default function Box({ children }: { children: ReactNode }) {
  return (
    <div className="ring-primary/80 bg-secondary/20 shadow-primary/20 mx-auto mt-32 flex w-full max-w-md flex-col space-y-10 rounded-2xl px-8 py-10 shadow-xl ring-2">
      {children}
    </div>
  );
}
