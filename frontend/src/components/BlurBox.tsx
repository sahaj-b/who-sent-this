export default function BlurBox({
  children,
  show,
  setShowFalse,
}: {
  children: React.ReactNode;
  show: boolean;
  setShowFalse: () => void;
}) {
  return (
    <>
      <div
        className={
          "fixed inset-0 z-40 h-screen w-screen opacity-60 backdrop-blur-sm " +
          (show || "hidden")
        }
        onClick={setShowFalse}
      ></div>

      <div
        className={
          "top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-secondary/20 shadow-background/50 ring-primary fixed z-50 max-w-[85%] rounded-2xl p-5 shadow-xl ring-2 backdrop-blur-xl transition duration-100 md:max-w-3xl " +
          (show ? "scale-100 opacity-100" : "scale-0 opacity-0")
        }
      >
        {children}
      </div>
    </>
  );
}
