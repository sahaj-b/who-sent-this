import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";
import { Tooltip } from "../components/Info";
import Box from "../components/Box";
import { TMessage } from "../types";
import { toastifyAndThrowError } from "../utils/errorHandler";
import BigMessage from "./BigMessage";

function clampText(text: string, limit: number) {
  const lines = text.split("\n");
  return lines.length <= limit
    ? text
    : lines.slice(0, limit).join("\n") + "...";
}

function Message({
  message,
  setClickedMessage,
  ApiGetTextById,
}: {
  message: TMessage;
  setClickedMessage: React.Dispatch<
    React.SetStateAction<[TMessage, TMessage | null] | null>
  >;
  ApiGetTextById?: (id: string) => Promise<TMessage | null | void>;
}) {
  const [repliedToMessage, setRepliedToMessage] = useState<TMessage | null>(
    null,
  );
  useEffect(() => {
    if (ApiGetTextById && message.repliedToMessageId) {
      ApiGetTextById(message.repliedToMessageId).then((msg) => {
        setRepliedToMessage(msg!);
      });
    }
  }, []);
  return (
    <div
      className="hover:bg-secondary/40 bg-secondary/30 ring-secondary/70 shadow-accent/10 cursor-pointer rounded-lg px-4 py-3 text-lg ring-1 transition hover:shadow-lg"
      onClick={() => setClickedMessage([message, repliedToMessage])}
    >
      {repliedToMessage ? (
        <div className="text-text/50 -mb-1.5 pl-1 text-lg">
          <Icon
            icon="proicons:corner-radius"
            className="mr-0.5 inline size-4"
          />
          {clampText(repliedToMessage.text, 1)}
        </div>
      ) : (
        ""
      )}
      <div className="text-text/90 overflow-hidden overflow-ellipsis">
        {clampText(message.text, 2)}
      </div>
    </div>
  );
}

export default function GridBox({
  heading,
  ApiGetTexts,
  ApiDeleteTextById,
  ApiGetTextById,
}: {
  heading: string;
  ApiGetTexts: () => Promise<TMessage[] | void>;
  ApiDeleteTextById?: (id: string) => Promise<void>;
  ApiGetTextById?: (id: string) => Promise<TMessage | null | void>;
}) {
  const [texts, setTexts] = useState<TMessage[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshed, setRefreshed] = useState(false);
  const [clickedText, setClickedText] = useState<
    [TMessage, TMessage | null] | null
  >(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (texts && !loading) {
      setRefreshed(true);
      timer = setTimeout(() => setRefreshed(false), 1200);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    ApiGetTexts()
      .then((msgs) => {
        setTexts(msgs!);
      })
      .catch(toastifyAndThrowError);
  }, []);

  function reloadMessages() {
    setLoading(true);
    ApiGetTexts()
      .then((msgs) => {
        setTexts(msgs!);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toastifyAndThrowError(e);
      });
  }

  let messagesComponent = (
    <Icon
      icon="svg-spinners:pulse-rings-2"
      className="text-primary mx-auto mb-6 size-20"
    />
  );
  if (texts) {
    if (texts.length === 0) {
      messagesComponent = (
        <div className="text-text/70 mb-10 text-center text-xl">
          No Messages Received yet
        </div>
      );
    } else {
      messagesComponent = (
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-3">
          {texts.map((msg) => (
            <Message
              key={msg._id}
              message={msg}
              setClickedMessage={setClickedText}
              ApiGetTextById={ApiGetTextById}
            />
          ))}
        </div>
      );
    }
  }

  return (
    <>
      <BigMessage
        setTexts={setTexts}
        setClickedText={setClickedText}
        clickedMessage={clickedText!}
        ApiDeleteTextById={ApiDeleteTextById}
      />
      <Box widthClass="w-[90%] max-w-5xl">
        <div className="-mt-2 flex items-center justify-between">
          <div className="text-primary font-[Sigmar] text-5xl opacity-90 md:text-6xl">
            {heading}
          </div>
          <div
            className="group text-primary bg-secondary/50 hover:bg-secondary/70 relative -top-0.5 inline cursor-pointer rounded-full p-1.5 transition"
            onClick={reloadMessages}
          >
            <Tooltip
              content={refreshed ? "Refreshed!" : "Refresh"}
              show={refreshed}
            />
            <Icon
              icon={loading ? "svg-spinners:90-ring-with-bg" : "tabler:reload"}
              className="size-8"
            />
          </div>
        </div>
        {messagesComponent}
      </Box>
    </>
  );
}
