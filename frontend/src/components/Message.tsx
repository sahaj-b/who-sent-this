import { Icon } from "@iconify/react/dist/iconify.js";
import { useState, useEffect } from "react";
import { TMessage } from "../types";
import clampText from "../utils/clampText";

export function Message({
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
