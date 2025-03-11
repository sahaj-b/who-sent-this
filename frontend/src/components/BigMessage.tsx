import { useNavigate } from "react-router";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";
import { Tooltip } from "../components/Info";
import { TMessage } from "../types";
import { toastifyAndThrowError } from "../utils/errorHandler";
import { Button, SecondaryButton } from "../components/Buttons";
import { toast } from "react-toastify";
export default function BigMessage({
  clickedMessage,
  setClickedText,
  setTexts,
  ApiDeleteTextById,
}: {
  clickedMessage: [TMessage, TMessage | null];
  setClickedText: React.Dispatch<
    React.SetStateAction<[TMessage, TMessage | null] | null>
  >;
  setTexts: React.Dispatch<React.SetStateAction<TMessage[] | null>>;
  ApiDeleteTextById?: (id: string) => Promise<void>;
}) {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();
  async function handleDelete() {
    if (!ApiDeleteTextById) {
      return;
    }
    setDeleteLoading(true);
    try {
      await ApiDeleteTextById(clickedMessage[0]._id);
      toast.success("Message deleted successfully");
      setClickedText(null);
      setTexts((prev: any) =>
        prev!.filter((msg: TMessage) => msg._id !== clickedMessage[0]._id),
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
          setClickedText(null);
        }}
      ></div>
      <div
        className={
          "bg-secondary/20 shadow-background/50 ring-primary fixed top-1/2 z-50 flex max-w-[85%] -translate-y-1/2 flex-col items-center justify-center space-y-5 rounded-2xl p-5 shadow-xl ring-2 backdrop-blur-xl transition duration-100 md:max-w-3xl " +
          (clickedMessage ? "scale-100" : "scale-0")
        }
      >
        <div className="w-full space-y-2 px-2 py-2 text-xl break-words whitespace-pre-line">
          {clickedMessage?.[1] ? (
            <div className="text-text/80 flex w-full items-end space-x-1 pr-7">
              <Icon icon="mdi:reply" className="shrink-0 mb-3 inline size-6" />{" "}
              <p className="max-w-full rounded-lg bg-background/20 ring-1 ring-text/20 px-4 py-2">
                {clickedMessage?.[1]?.text}
              </p>
            </div>
          ) : (
            ""
          )}
          <div className="text-text/90 font-bold">
            {clickedMessage?.[0].text}
          </div>
        </div>
        <div className="flex w-xs justify-center space-x-4">
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
                  icon={
                    deleteLoading ? "svg-spinners:3-dots-move" : "mdi:delete"
                  }
                  className="relative -top-0.5 inline size-6"
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
