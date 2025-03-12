import { Icon } from "@iconify/react/dist/iconify.js";
import { JSX, useEffect, useState } from "react";
import { Tooltip } from "../components/Info";
import Box from "../components/Box";
import { TMessage } from "../types";
import { toastifyAndThrowError } from "../utils/errorHandler";
import BlurBox from "./BlurBox";
import clampText from "../utils/clampText";

export type BigMessageType = ({
  clickedMessage,
  setClickedMessage,
  setMessages,
}: {
  clickedMessage: [TMessage, TMessage | null];
  setClickedMessage: React.Dispatch<
    React.SetStateAction<[TMessage, TMessage | null] | null>
  >;
  setMessages: React.Dispatch<React.SetStateAction<TMessage[] | null>>;
}) => JSX.Element;

function Message({
  message,
  setClickedMessage,
  getMessageById,
}: {
  message: TMessage;
  setClickedMessage: React.Dispatch<
    React.SetStateAction<[TMessage, TMessage | null] | null>
  >;
  getMessageById?: (id: string) => Promise<TMessage | null | void>;
}) {
  const [repliedToMessage, setRepliedToMessage] = useState<TMessage | null>(
    null,
  );
  useEffect(() => {
    if (getMessageById && message.repliedToMessageId) {
      getMessageById(message.repliedToMessageId).then((msg) => {
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
        <div className="text-text/50 -mb-1.5 flex items-center pl-1 text-lg">
          <Icon
            icon="proicons:corner-radius"
            className="relative top-1 mr-0.5 inline size-4 shrink-0"
          />
          <span className="w-full overflow-hidden overflow-ellipsis">
            {clampText(repliedToMessage.text, 1)}
          </span>
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

export default function MessagesGridBox({
  heading,
  getMessages,
  getMessageById,
  BigMessage,
  emptyMessage,
  refreshTrigger,
}: {
  heading: string | React.ReactNode;
  getMessages: () => Promise<TMessage[] | void>;
  getMessageById?: (id: string) => Promise<TMessage | null | void>;
  BigMessage: BigMessageType;
  emptyMessage: string;
  refreshTrigger?: boolean;
}) {
  const [texts, setMessages] = useState<TMessage[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshed, setRefreshed] = useState(false);
  const [clickedMessage, setClickedMessage] = useState<
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
    getMessages()
      .then((msgs) => {
        setMessages(msgs!);
      })
      .catch(toastifyAndThrowError);
  }, [refreshTrigger]);

  function reloadMessages() {
    setLoading(true);
    getMessages()
      .then((msgs) => {
        setMessages(msgs!);
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
        <div className="text-text/70 mb-5 text-center text-xl">
          {emptyMessage}
        </div>
      );
    } else {
      messagesComponent = (
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-3">
          {texts.map((msg) => (
            <Message
              key={msg._id}
              message={msg}
              setClickedMessage={setClickedMessage}
              getMessageById={getMessageById}
            />
          ))}
        </div>
      );
    }
  }

  return (
    <>
      <BlurBox
        show={!!clickedMessage}
        setShowFalse={() => setClickedMessage(null)}
      >
        <BigMessage
          clickedMessage={clickedMessage!}
          setClickedMessage={() => {
            setClickedMessage(null);
          }}
          setMessages={setMessages}
        />
      </BlurBox>
      <Box widthClass="relative w-[90%] max-w-5xl">
        <div className="flex items-end justify-between">
          <div className="text-primary w-[85%] font-[Sigmar] text-5xl opacity-90 md:text-6xl">
            {heading}
          </div>
          <div
            className="group text-primary bg-secondary/50 md:-top-1 hover:bg-secondary/70 relative inline cursor-pointer rounded-full p-1.5 transition"
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
