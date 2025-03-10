import { Button } from "../components/Buttons";
import GlowDrop from "../components/GlowDrop";
import { useParams } from "react-router";
import Header from "../components/Header";
import { ApiGetUserName, ApiSendMessage } from "../services/messageService";
import { useEffect, useRef, useState } from "react";
import InvalidUser from "./InvalidUser";
import Loading from "./Loading";
import { toastifyAndThrowError } from "../utils/errorHandler";
import { MessageInputBox } from "../components/InputBoxes";
import Box from "../components/Box";
import Toggle from "../components/Toggle";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function Home() {
  const [userName, setUserName] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allowReply, setAllowReply] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { id } = useParams();
  useEffect(() => {
    id
      ? ApiGetUserName(id)
          .then((name) => {
            setUserName(name);
            setLoading(false);
          })
          .catch(toastifyAndThrowError)
      : setLoading(false);
  }, []);

  async function handleSendClick(e: React.FormEvent) {
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
          toastifyAndThrowError(err);
          setButtonLoading(false);
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
      <div className="px-3 mt-20">
        <form>
          <Box>
            <span className="font-[Sigmar] text-4xl md:text-5xl text-primary/80 rounded-2xl ">
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
              onClick={handleSendClick}
              loading={buttonLoading}
            />
          </Box>
        </form>
      </div>
    </>
  );
}
