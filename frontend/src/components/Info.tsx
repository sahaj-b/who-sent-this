import { Icon } from "@iconify/react/dist/iconify.js";

export default function Info({ content }: { content: string }) {
  return (
    <div className="group">
      <Icon
        icon="mdi:question-mark-circle"
        className="text-primary relative size-6"
      />
      <div className="bg-secondary/40 text-text/85 shadow-background/80 absolute bottom-full mb-1 w-[11em] left-1/2 -translate-x-1/2 translate-y-8 scale-0 rounded-md px-2 py-1 text-sm font-bold shadow-sm backdrop-blur-sm transition duration-75 group-hover:translate-y-0 group-hover:scale-100">
        {content}
        <Icon
          icon="mdi:arrow-down-drop"
          className="text-secondary/50 absolute top-full left-1/2 size-8 -translate-x-1/2 -translate-y-3.5"
        />
      </div>
    </div>
  );
}
