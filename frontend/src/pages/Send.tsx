import { Button } from "../components/Buttons";
import GlowDrop from "../components/GlowDrop";
import { useParams } from "react-router";
import Header from "../components/Header";
import { ApiGetUserName, ApiSendMessage } from "../services/messageService";
import { useEffect, useRef, useState } from "react";
import Loading from "./Loading";
import { toastifyAndThrowError } from "../utils/errorHandler";
import { MessageInputBox } from "../components/InputBoxes";
import Box from "../components/Box";
import Toggle from "../components/Toggle";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react/dist/iconify.js";

function InvalidUser({ id }: { id: string | undefined }) {
  return (
    <>
      <Header />
      <br />
      <div className="mx-5 flex justify-center items-center">
        <span className="py-3 px-4 rounded-2xl bg-accent/20 text-center mt-10 text-accent text-4xl opacity-90 md:text-5xl">
          User with ID: <span className="text-primary">{id}</span> not found
        </span>
      </div>
    </>
  );
}
export default function Send() {
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [allowReply, setAllowReply] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { id } = useParams();
  useEffect(() => {
    id
      ? ApiGetUserName(id)
          .then((name) => {
            setUserName(name!);
            setLoading(false);
          })
          .catch(toastifyAndThrowError)
      : setLoading(false);
  }, []);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const message = inputRef.current?.value;
    if (!message) {
      toast.error("Message cannot be empty");
    } else if (message.length > 600) {
      toast.error("Message is too long");
    } else {
      setButtonLoading(true);
      ApiSendMessage(message, id!, allowReply)
        .then(() => {
          toast.success("Message sent");
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

  if (!userName) {
    return <InvalidUser id={id} />;
  }

  return (
    <>
      <GlowDrop />
      <Header />
      <div className="w-screen px-3 mt-20">
        <form>
          <Box widthClass="w-[95%] max-w-2xl">
            <span className="font-[Sigmar] text-4xl md:text-5xl text-primary/80">
              Send to:{" "}
              <span className="text-accent/90">
                {userName ? userName : "Anonymous"}
              </span>
            </span>
            <div>
              <MessageInputBox ref={inputRef} />
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
