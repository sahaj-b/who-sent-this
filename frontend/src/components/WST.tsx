export default function WhoSentThis({ className }: { className?: string }) {
  return (
    <div className={"text-center font-[Sigmar] tracking-wide " + className}>
      <span className="from-accent via-secondary bg-linear-60 via-75% bg-clip-text pr-1 text-transparent italic font-stretch-extra-expanded">
        Who
      </span>
      <span className="text-primary opacity-80"> Sent This?</span>
    </div>
  );
}
