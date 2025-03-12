import { useNavigate } from "react-router";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";
import { TMessage } from "../types";
import { toastifyAndThrowError } from "../utils/errorHandler";
import { Button, SecondaryButton } from "../components/Buttons";
import { toast } from "react-toastify";
import { ApiDeleteMessage } from "../services/messageService";
import { BigMessageType } from "./MessagesGridBox";
import ShareURL from "./ShareURL";

const BigQuestion: BigMessageType = ({
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
    <div className="flex flex-col space-y-5 items-center">
      <div className="w-full space-y-2 px-2 py-2 text-xl text-text/90 font-bold break-words whitespace-pre-line">
        {clickedMessage?.[0].text}
      </div>
      <ShareURL url={"/reply/" + clickedMessage?.[0]._id} />
      <div className="flex w-xs justify-center space-x-4">
        <Button
          content={
            <>
              <Icon
                icon="mdi:reply"
                className="relative -top-0.5 inline size-6"
              />{" "}
              Replies
            </>
          }
          className="group relative"
          onClick={() => {
            navigate("/replies/" + clickedMessage?.[0]._id);
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

export default BigQuestion;
