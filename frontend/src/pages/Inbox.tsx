import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import { Icon, loadIcons } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";
import { Tooltip } from "../components/Info";
import Box from "../components/Box";
import { TMessage } from "../types";
import { toastifyAndThrowError } from "../utils/errorHandler";
import { ApiDeleteMessage, ApiGetMessages } from "../services/messageService";
import { Button, SecondaryButton } from "../components/Buttons";
import { toast } from "react-toastify";

loadIcons(["tabler:copy-check"]);
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

function Message({
  message,
  setClickedMessage,
}: {
  message: TMessage;
  setClickedMessage: React.Dispatch<React.SetStateAction<TMessage | null>>;
}) {
  const lines = message.text.split("\n");
  return (
    <div
      className="hover:bg-secondary/40 bg-secondary/30 text-text/90 ring-secondary/70 shadow-accent/10 cursor-pointer overflow-hidden rounded-lg px-4 py-3 text-lg overflow-ellipsis ring-1 transition hover:shadow-lg"
      onClick={() => setClickedMessage(message)}
    >
      {lines.length < 3 ? message.text : lines.slice(0, 2).join("\n") + "..."}
    </div>
  );
}

function ClickedMessageComponent({
  clickedMessage,
  setClickedMessage,
  setMessages,
}: {
  clickedMessage: TMessage;
  setClickedMessage: React.Dispatch<React.SetStateAction<TMessage | null>>;
  setMessages: React.Dispatch<React.SetStateAction<TMessage[] | null>>;
}) {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();
  async function handleDelete() {
    setDeleteLoading(true);
    try {
      await ApiDeleteMessage(clickedMessage._id);
      toast.success("Message deleted successfully");
      setClickedMessage(null);
      setMessages((prev: any) =>
        prev!.filter((msg: TMessage) => msg._id !== clickedMessage._id),
      );
    } catch (e: any) {
      toastifyAndThrowError(e);
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <>
      <div
        className={
          "fixed inset-0 z-40 h-screen w-screen opacity-60 backdrop-blur-sm " +
          (clickedMessage || "hidden")
        }
        onClick={() => {
          setClickedMessage(null);
        }}
      ></div>
      <div
        className={
          "bg-secondary/20 shadow-background/50 ring-primary justify-center items-center fixed top-1/2 z-50 flex space-y-5 p-5 max-w-[85%] md:max-w-3xl -translate-y-1/2 flex-col rounded-2xl shadow-xl ring-2 backdrop-blur-xl transition duration-100 " +
          (clickedMessage ? "scale-100" : "scale-0")
        }
      >
        <p className="break-words text-text/90 text-xl w-full font-bold p-2 ">
          {clickedMessage?.text}
        </p>
        <div className="flex space-x-4 justify-center w-xs">
          <Button
            content={
              <>
                <Icon
                  icon="mdi:reply"
                  className="size-6 -top-0.5 relative inline"
                />{" "}
                Reply
              </>
            }
            className="w-auto"
            onClick={() => {
              navigate("/reply/" + clickedMessage?._id);
            }}
          />
          <SecondaryButton
            content={
              <>
                <Icon
                  icon={
                    deleteLoading ? "svg-spinners:3-dots-move" : "mdi:delete"
                  }
                  className="size-6 -top-0.5 relative inline"
                />{" "}
                {deleteLoading ? "" : "Delete"}
              </>
            }
            onClick={handleDelete}
          />
        </div>
      </div>
    </>
  );
}

function InboxBox() {
  const [messages, setMessages] = useState<TMessage[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshed, setRefreshed] = useState(false);
  const [clickedMessage, setClickedMessage] = useState<TMessage | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (messages && !loading) {
      setRefreshed(true);
      timer = setTimeout(() => setRefreshed(false), 1200);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    ApiGetMessages()
      .then((msgs) => {
        setMessages(msgs!);
      })
      .catch(toastifyAndThrowError);
  }, []);

  function reloadMessages() {
    setLoading(true);
    ApiGetMessages()
      .then((msgs) => {
        setMessages(msgs!);
        setLoading(false);
      })
      .catch((e) => {
        toastifyAndThrowError(e);
        setLoading(false);
      });
  }

  let messagesComponent = (
    <Icon
      icon="svg-spinners:pulse-rings-2"
      className="text-primary mx-auto mb-6 size-20"
    />
  );
  if (messages) {
    if (messages.length === 0) {
      messagesComponent = (
        <div className="text-text/70 text-center text-xl">
          No Messages Received yet
        </div>
      );
    } else {
      messagesComponent = (
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-3">
          {messages.map((msg) => (
            <Message
              key={msg._id}
              message={msg}
              setClickedMessage={setClickedMessage}
            />
          ))}
        </div>
      );
    }
  }

  return (
    <>
      <ClickedMessageComponent
        setMessages={setMessages}
        setClickedMessage={setClickedMessage}
        clickedMessage={clickedMessage!}
      />
      <Box widthClass="w-[90%] max-w-5xl">
        <div className="flex items-center justify-between">
          <div className="text-primary font-[Sigmar] text-5xl opacity-90 md:text-6xl">
            Inbox
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

export default function Inbox() {
  const { user } = useAuth();

  useEffect(() => {
    loadIcons([
      "tabler:copy-check",
      "svg-spinners:3-dots-move",
      "svg-spinners:90-ring-with-bg",
    ]);
  }, []);
  return (
    <>
      <Header />

      <div className="mx-4 flex flex-col items-center py-20">
        {user?.receivingPaused && (
          <div className="text-text/70 text-center text-lg">
            You have paused receiving messages.{" "}
            <Link to="/settings" className="text-primary hover:underline">
              Change settings
            </Link>
          </div>
        )}

        <div className="from-accent/50 via-primary to-accent/40 bg-primary text-background rounded-t-xl bg-linear-30 px-3 py-2 text-xl font-bold">
          Share this Link to receive messages
        </div>
        <URL url={user!.shortId} />

        <div className="h-16"></div>

        <InboxBox />

        {!user?.email ? (
          <div className="text-text/70 mx-3 mt-10 text-center text-lg">
            <Link to="/register" className="text-primary hover:underline">
              Register
            </Link>{" "}
            to access messages from any device or browser
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
