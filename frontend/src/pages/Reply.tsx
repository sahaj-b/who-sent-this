import { Button } from "../components/Buttons";
import GlowDrop from "../components/GlowDrop";
import { useParams } from "react-router";
import Header from "../components/Header";
import {
  ApiGetMessageById,
  ApiReplyToMessage,
} from "../services/messageService";
import { useEffect, useRef, useState } from "react";
import Loading from "./Loading";
import { toastifyAndThrowError } from "../utils/errorHandler";
import { MessageInputBox } from "../components/InputBoxes";
import Box from "../components/Box";
import Toggle from "../components/Toggle";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react/dist/iconify.js";
import { TMessage } from "../types";

function InvalidMessage() {
  return (
    <>
      <Header />
      <br />
      <div className="mx-5 flex justify-center items-center">
        <span className="py-3 px-5 rounded-2xl bg-accent/20 text-center mt-10 text-accent text-4xl opacity-90 md:text-5xl">
          Message/Question Not Found
        </span>
      </div>
    </>
  );
}
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
  const [allowReply, setAllowReply] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
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

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const replyText = inputRef.current?.value;
    if (!replyText) {
      toast.error("Message cannot be empty");
    } else if (replyText.length > 600) {
      toast.error("Message is too long");
    } else {
      setButtonLoading(true);
      ApiReplyToMessage(replyText, allowReply, message!._id)
        .then(() => {
          toast.success("Reply sent");
          setButtonLoading(false);
          inputRef.current!.value = "";
        })
        .catch((err) => {
          setButtonLoading(false);
          toastifyAndThrowError(err);
        });
    }
  }

  if (loading) {
    return <Loading />;
  }

  if (!message) {
    return <InvalidMessage />;
  }

  if (!message.allowReply) {
    return <ReplyNotAllowed text={message.text} />;
  }

  return (
    <>
      <GlowDrop />
      <Header />
      <div className="px-3 mt-20">
        <form>
          <Box widthClass="w-[95%] max-w-2xl">
            <span className="font-[Sigmar] text-4xl md:text-5xl text-primary/80">
              Reply to:
            </span>
            <p className="text-text text-xl break-words">{message.text}</p>
            <div>
              <MessageInputBox placeholder="Enter your reply" ref={inputRef} />
              <Toggle
                bool={allowReply}
                setBool={setAllowReply}
                label="Allow reply for this message"
                className="mt-3 ml-1"
              />
            </div>
            <Button
              content={
                <>
                  Send &nbsp;
                  <Icon icon="mdi:send" className="inline relative -top-0.5" />
                </>
              }
              className="-mt-3"
              type="submit"
              onClick={handleSend}
              loading={buttonLoading}
            />
          </Box>
        </form>
      </div>
    </>
  );
}
