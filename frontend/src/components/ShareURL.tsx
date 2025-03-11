import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";
import { Tooltip } from "../components/Info";

function URL({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    copied && (timer = setTimeout(() => setCopied(false), 2000));
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <div className="shadow-accent/15 bg-secondary/30 ring-accent/50 text-text mx-auto mt-0.5 flex w-full max-w-sm justify-between rounded-xl text-lg shadow-xl ring-1">
      <div className="bg-accent/50 flex items-center rounded-l-xl p-2">
        <Icon icon="mdi:link-variant" className="size-6" />
      </div>
      <div className="text-text/90 overflow-x-auto p-2 pl-3 font-bold">
        {url}
      </div>
      <div className="flex">
        <button
          className={
            "group bg-accent/70 relative flex cursor-pointer items-center p-2 transition active:scale-95 " +
            (copied && "text-background bg-green-300/90")
          }
          onClick={() => {
            setCopied(true);
            window.navigator.clipboard.writeText(url);
          }}
        >
          <Icon
            icon={copied ? "tabler:copy-check" : "tabler:copy"}
            className="size-6"
          />
          <Tooltip content={copied ? "Copied!" : "Copy"} />
        </button>
        <button
          className="group border-secondary bg-accent/70 relative flex cursor-pointer items-center rounded-r-xl border-l-2 p-2 transition active:scale-95"
          onClick={() => window.navigator.share({ url })}
        >
          <Icon icon="mdi:share" className="size-6" />
          <Tooltip content="Share" />
        </button>
      </div>
    </div>
  );
}

export default function ShareURL({
  url,
  message,
}: {
  url: string;
  message: string;
}) {
  return (
    <>
      <div className="from-accent/50 via-primary to-accent/40 bg-primary text-background rounded-t-xl bg-linear-30 px-3 py-2 text-xl font-bold">
        {message}
      </div>
      <URL url={url} />
    </>
  );
}
