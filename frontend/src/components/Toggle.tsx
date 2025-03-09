export default function Toggle({
  bool,
  setBool,
  label,
  className = "",
}: {
  bool: boolean;
  setBool: (bool: React.SetStateAction<boolean>) => void;
  label: string;
  className?: string;
}) {
  return (
    <label className={"inline-flex items-center cursor-pointer " + className}>
      <input
        type="checkbox"
        value=""
        className="sr-only peer"
        onChange={() => setBool((bool) => !bool)}
        checked={bool}
      />
      <div className="relative w-11 h-6 bg-transparent peer-focus:outline-none ring-2 ring-primary rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-primary peer-checked:after:bg-secondary after:rounded-full after:h-5 after:w-5 transition after:transition peer-checked:bg-primary"></div>
      <span className="ml-3 text-md text-text/90">{label}</span>
    </label>
  );
}
