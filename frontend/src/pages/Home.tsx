// import { Icon } from "@iconify/react";
export default function Home() {
  return (
    <div className="bg-background h-screen">
      <div className="from-accent/30 to-accent/0 absolute -top-60 -left-60 h-96 w-96 rounded-full bg-radial blur-3xl"></div>
      <div className="from-accent/40 to-accent/0 absolute -top-50 -right-70 h-96 w-96 rounded-full bg-radial opacity-70 blur-3xl"></div>
      <div className="flex justify-between px-3 py-3">
        <div></div>
        <span className="border-x border-primary/50 text-text bg-secondary/20 hover:bg-secondary/50 transition rounded-xl px-3 py-1 text-xl hover:cursor-pointer z-10">
          Login
        </span>
      </div>
      <div className="font-[Sigmar] mt-15 text-center text-5xl tracking-wide md:text-6xl">
        <span className="pr-1 from-accent via-secondary bg-linear-60 via-70% bg-clip-text text-transparent italic font-stretch-extra-expanded">
          Who
        </span>
        <span className="text-primary opacity-80"> Sent This?</span>
      </div>
      <p className="font-[Funnel_Sans] text-text mt-5 text-center text-lg opacity-80">
        Send and receive anonymous messages without revealing your identity
      </p>
    </div>
  );
}
