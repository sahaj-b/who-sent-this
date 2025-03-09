export default function GlowDrop() {
  return (
    <div className="pointer-events-none absolute h-screen w-screen overflow-x-hidden">
      <div className="from-accent/30 to-accent/0 absolute -top-1/2 left-0 h-[23em] w-[30em] -translate-x-1/2 translate-y-1/2 rounded-full bg-radial blur-3xl md:h-1/2 md:w-2/3" />
      <div className="from-accent/40 to-accent/0 absolute -top-1/2 left-1/2 hidden h-[20em] w-1/2 -translate-x-1/2 translate-y-1/2 rounded-full bg-radial blur-3xl md:block" />
      <div className="from-accent/40 to-accent/0 absolute -top-1/2 right-0 h-[25em] w-[30em] translate-x-1/2 translate-y-1/2 rounded-full bg-radial opacity-70 blur-3xl md:h-1/2 md:w-2/3" />
    </div>
  );
}
