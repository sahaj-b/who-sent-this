import { useParams } from "react-router";
import Header from "../components/Header";
import {
  ApiGetMessageById,
  ApiReplyToMessage,
} from "../services/messageService";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import { toastifyAndThrowError } from "../utils/errorHandler";
import Box from "../components/Box";
import { TMessage } from "../types";
import SendBox, { handleSendType } from "../components/SendBox";
import InvalidMessage from "../components/InvalidMessage";

function ReplyNotAllowed({ text }: { text: string }) {
  return (
    <>
      <Header />
      <br />
      <Box widthClass="w-[95%] max-w-2xl mt-20">
        <span className="text-2xl text-text/90">{text}</span>
        <span className="py-3 text-center px-5 rounded-2xl bg-accent/20 text-accent text-2xl opacity-90 md:text-3xl">
          This message doesn't allow replies
        </span>
      </Box>
    </>
  );
}

export default function Reply() {
  const [message, setMessage] = useState<TMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const { id: msgId } = useParams();
  useEffect(() => {
    msgId
      ? ApiGetMessageById(msgId)
          .then((msg) => {
            setMessage(msg!);
            setLoading(false);
          })
          .catch(toastifyAndThrowError)
      : setLoading(false);
  }, []);

  const handleSend: handleSendType = async (
    e,
    inputRef,
    allowReply,
    setButtonLoading,
    setResponseMsg,
  ) => {
    e.preventDefault();
    const replyText = inputRef.current?.value;
    if (!replyText) {
      setResponseMsg({ message: "Message cannot be empty", success: false });
    } else if (replyText.length > 600) {
      setResponseMsg({ message: "Message is too long", success: false });
    } else {
      setButtonLoading(true);
      ApiReplyToMessage(replyText, allowReply, message!._id)
        .then(() => {
          setResponseMsg({ message: "Message sent", success: true });
          setButtonLoading(false);
          inputRef.current!.value = "";
        })
        .catch((err) => {
          setButtonLoading(false);
          setResponseMsg(err.message);
        });
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!message) {
    return <InvalidMessage text="Message is either deleted or doesn't exist" />;
  }

  if (!message.allowReply) {
    return <ReplyNotAllowed text={message.text} />;
  }

  return (
    <>
      <Header />
      <SendBox
        heading={
          <>
            <span className="font-[Sigmar] text-4xl md:text-5xl text-primary/80">
              Reply to:
            </span>
            <p className="text-text text-xl break-words">{message.text}</p>
          </>
        }
        handleSend={handleSend}
      />
    </>
  );
}
