import { useParams } from "react-router";
import Header from "../components/Header";
import { ApiGetUserName, ApiSendMessage } from "../services/messageService";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import { toastifyAndThrowError } from "../utils/errorHandler";
import SendBox, { handleSendType } from "../components/SendBox";

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
  const { id } = useParams();
  useEffect(() => {
    id
      ? ApiGetUserName(id)
          .then((name) => {
            setUserName(name ?? "");
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
    const message = inputRef.current?.value;
    if (!message) {
      setResponseMsg({ message: "Message cannot be empty", success: false });
    } else if (message.length > 600) {
      setResponseMsg({ message: "Message is too long", success: false });
    } else {
      setButtonLoading(true);
      ApiSendMessage(message, id!, allowReply)
        .then(() => {
          setResponseMsg({
            message: "Message sent",
            success: true,
          });
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

  if (typeof userName !== "string") {
    return <InvalidUser id={id} />;
  }

  return (
    <>
      <Header />
      <SendBox
        heading={
          <span className="font-[Sigmar] text-4xl md:text-5xl text-primary/80">
            Send to:{" "}
            <span className="text-accent/90">
              {userName ? userName : "Anonymous"}
            </span>
          </span>
        }
        handleSend={handleSend}
      />
    </>
  );
}
