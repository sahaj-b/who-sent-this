import { useRef, useState } from "react";
import Box from "./Box";
import { MessageInputBox } from "./InputBoxes";
import Toggle from "./Toggle";
import { Button, SecondaryButton } from "./Buttons";
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
          <div className="flex flex-col items-center sm:flex-row justify-center gap-3 text-nowrap">
            <Button
              content={
                <>
                  {responseMsg.success ? "Send Another" : "Send"} &nbsp;
                  <Icon icon="mdi:send" className="relative -top-0.5 inline" />
                </>
              }
              type="submit"
              loading={buttonLoading}
              onClick={(e) => {
                responseMsg.success
                  ? setResponseMsg({} as TResponseMsg)
                  : handleSend(
                      e,
                      inputRef,
                      allowReply,
                      setButtonLoading,
                      setResponseMsg,
                    );
              }}
            />
            {responseMsg.success ? (
              <SecondaryButton
                content={
                  <>
                    Go to Inbox
                    <Icon
                      icon="mdi:inbox"
                      className="relative -top-0.5 inline"
                    />
                  </>
                }
                onClick={() => navigate("/Inbox")}
              />
            ) : null}
          </div>
        </Box>
      </form>
    </div>
  );
}
