import { useRef, useState } from "react";
import Box from "./Box";
import { MessageInputBox } from "./InputBoxes";
import Toggle from "./Toggle";
import { Button } from "./Buttons";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useNavigate } from "react-router";
import { TResponseMsg } from "../types";

export type handleSendType = (
  e: React.FormEvent,
  inputRef: React.RefObject<HTMLInputElement | null>,
  allowReply: boolean,
  setButtonLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setResponseMsg: React.Dispatch<React.SetStateAction<TResponseMsg>>,
) => void;

export default function SendBox({
  heading,
  handleSend,
}: {
  heading: React.ReactNode;
  handleSend: handleSendType;
}) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [allowReply, setAllowReply] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState<TResponseMsg>(
    {} as TResponseMsg,
  );
  return (
    <div className="mt-20 w-screen px-3">
      <form>
        <Box widthClass="w-[95%] max-w-2xl">
          {heading}
          {!responseMsg.success ? (
            <div>
              <MessageInputBox ref={inputRef} />
              <Toggle
                bool={allowReply}
                setBool={setAllowReply}
                label="Allow reply for this message"
                className="mt-3 ml-1"
              />
            </div>
          ) : (
            ""
          )}
          {responseMsg.message && (
            <div
              className={
                "text-accent -mt-4 font-bold " +
                (responseMsg.success && "text-green-300/80")
              }
            >
              {responseMsg.message}
            </div>
          )}
          <Button
            content={
              <>
                {responseMsg.success ? "Go to Inbox" : "Send"} &nbsp;
                <Icon
                  icon={responseMsg.success ? "mdi:inbox" : "mdi:send"}
                  className="relative -top-0.5 inline"
                />
              </>
            }
            className="-mt-3"
            type="submit"
            loading={buttonLoading}
            onClick={(e) => {
              if (responseMsg.success) navigate("/inbox");
              else
                handleSend(
                  e,
                  inputRef,
                  allowReply,
                  setButtonLoading,
                  setResponseMsg,
                );
            }}
          />
        </Box>
      </form>
    </div>
  );
}
