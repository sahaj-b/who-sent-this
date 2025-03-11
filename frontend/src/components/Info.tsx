import { Icon } from "@iconify/react/dist/iconify.js";

export function Tooltip({
  content,
  widthClass,
  show,
}: {
  content: string;
  widthClass?: string;
  show?: boolean;
}) {
  return (
    <div
      className={
        "bg-secondary/40 text-text/85 shadow-background/80 absolute bottom-full left-1/2 mb-1 -translate-x-1/2 rounded-md px-2 py-1 text-sm font-bold shadow-sm backdrop-blur-sm transition duration-75 group-hover:translate-y-0 group-hover:scale-100 " +
        widthClass +
        (show ? " translate-y-0 scale-100" : " translate-y-8 scale-0")
      }
    >
      {content}
      <Icon
        icon="mdi:arrow-down-drop"
        className="text-secondary/50 absolute top-full left-1/2 size-8 -translate-x-1/2 -translate-y-3.5"
      />
    </div>
  );
}

export default function Info({ content }: { content: string }) {
  return (
    <div className="group relative">
      <Icon icon="mdi:question-mark-circle" className="text-primary size-6" />
      <Tooltip content={content} widthClass="w-[11em]" />
    </div>
  );
}
