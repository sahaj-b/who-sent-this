import { useNavigate } from "react-router";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";
import { Tooltip } from "../components/Info";
import { TMessage } from "../types";
import { toastifyAndThrowError } from "../utils/errorHandler";
import { Button, SecondaryButton } from "../components/Buttons";
import { toast } from "react-toastify";
import { ApiDeleteMessage } from "../services/messageService";
import { BigMessageType } from "./MessagesGridBox";

const BigMessage: BigMessageType = ({
  clickedMessage,
  setClickedMessage,
  setMessages,
}) => {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();
  async function handleDelete() {
    if (!ApiDeleteMessage) {
      return;
    }
    setDeleteLoading(true);
    try {
      await ApiDeleteMessage(clickedMessage[0]._id);
      toast.success("Message deleted successfully");
      setClickedMessage(null);
      setMessages((prev: any) =>
        prev!.filter((msg: TMessage) => msg._id !== clickedMessage[0]._id),
      );
    } catch (e: any) {
      toastifyAndThrowError(e);
    } finally {
      setDeleteLoading(false);
    }
  }
  return (
    <div className="flex flex-col space-y-5">
      <div className="w-full space-y-2 px-2 py-2 text-xl break-words whitespace-pre-line">
        {clickedMessage?.[1] ? (
          <div className="text-text/80 flex w-full items-end space-x-1 pr-7">
            <Icon icon="mdi:reply" className="mb-3 inline size-6 shrink-0" />{" "}
            <p className="bg-background/20 ring-text/20 max-w-full rounded-lg px-4 py-2 ring-1">
              {clickedMessage?.[1]?.text}
            </p>
          </div>
        ) : (
          ""
        )}
        <div className="text-text/90 font-bold">{clickedMessage?.[0].text}</div>
      </div>
      <div className="m-auto flex w-xs justify-center space-x-4">
        <Button
          disabled={!clickedMessage?.[0].allowReply}
          content={
            <>
              {!clickedMessage?.[0]?.allowReply && (
                <Tooltip
                  content="This message doesn't allow replies"
                  widthClass="w-full"
                />
              )}
              <Icon
                icon="mdi:reply"
                className="relative -top-0.5 inline size-6"
              />{" "}
              Reply
            </>
          }
          className="group relative w-auto"
          onClick={() => {
            {
              clickedMessage?.[0].allowReply &&
                navigate("/reply/" + clickedMessage?.[0]._id);
            }
          }}
        />
        <SecondaryButton
          content={
            <>
              <Icon
                icon={deleteLoading ? "svg-spinners:3-dots-move" : "mdi:delete"}
                className="relative -top-0.5 inline size-6"
              />{" "}
              {deleteLoading ? "" : "Delete"}
            </>
          }
          onClick={handleDelete}
        />
      </div>
    </div>
  );
};

export default BigMessage;
