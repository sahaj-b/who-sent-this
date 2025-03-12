import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import { ApiGetQuestions, ApiPostQuestion } from "../services/messageService";
import MessagesGridBox from "../components/MessagesGridBox";
import { Button, SecondaryButton } from "../components/Buttons";
import BigQuestion from "../components/BigQuestion";
import { useRef, useState } from "react";
import BlurBox from "../components/BlurBox";
import { MessageInputBox } from "../components/InputBoxes";
import { TMessage, TResponseMsg } from "../types";
import ShareURL from "../components/ShareURL";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function Questions() {
  const [clickedCreateQuestion, setClickedCreateQuestion] = useState(false);
  const [createdQuestion, setCreatedQuestion] = useState<TMessage>(
    {} as TMessage,
  );
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [createButtonLoading, setCreateButtonLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState<TResponseMsg>(
    {} as TResponseMsg,
  );
  const QuestionRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreatedQuestion({} as TMessage);
    if (!QuestionRef.current) {
      return;
    }
    if (!QuestionRef.current.value) {
      setResponseMsg({ message: "Question cannot be empty", success: false });
      return;
    }
    setCreateButtonLoading(true);
    try {
      const question = await ApiPostQuestion(QuestionRef.current.value);
      setCreatedQuestion(question!);
      setResponseMsg({ message: "Question created", success: true });
      setRefreshTrigger(!refreshTrigger);
    } catch (e: any) {
      setResponseMsg({ message: e.message, success: false });
    } finally {
      setCreateButtonLoading(false);
    }
  }
  return (
    <>
      <Header />
      <BlurBox
        show={clickedCreateQuestion}
        setShowFalse={() => {
          setClickedCreateQuestion(false);
          setResponseMsg({} as TResponseMsg);
          setCreatedQuestion({} as TMessage);
        }}
      >
        {createdQuestion._id ? (
          <ShareURL
            message="Share this link to receive replies"
            url={window.location.origin + "/reply/" + createdQuestion._id}
          />
        ) : (
          <div className="w-[80vw] max-w-xl p-1 pr-3">
            <form className="flex flex-col space-y-5 items-center">
              <MessageInputBox
                placeholder="Enter your Question"
                ref={QuestionRef}
              />
              {responseMsg.message ? (
                <div
                  className={
                    "font-bold -mt-2 pl-1 " +
                    (responseMsg.success ? "text-green-300/80" : "text-accent")
                  }
                >
                  {responseMsg.message}
                </div>
              ) : (
                ""
              )}
              <Button
                content="Create"
                type="submit"
                onClick={handleCreate}
                loading={createButtonLoading}
              />
            </form>
          </div>
        )}
      </BlurBox>

      <div className="mx-4 flex flex-col items-center space-y-10 py-20">
        {user?.receivingPaused && (
          <div className="text-text/70 mb-10 text-center text-lg">
            You have paused receiving messages.{" "}
            <Link to="/settings" className="text-primary hover:underline">
              Change settings
            </Link>
          </div>
        )}
        <div className="flex justify-center items-center gap-3 w-[90%] flex-wrap">
          <Button
            content="Create a Question"
            className="max-w-3xs"
            onClick={() => setClickedCreateQuestion(true)}
          />

          <SecondaryButton
            content={
              <>
                {"Go to Inbox"} &nbsp;
                <Icon icon={"mdi:inbox"} className="relative -top-0.5 inline" />
              </>
            }
            className="max-w-3xs"
            onClick={() => navigate("/inbox")}
          />
        </div>
        <MessagesGridBox
          heading="Questions"
          getMessages={ApiGetQuestions}
          emptyMessage="No Questions Created yet"
          BigMessage={BigQuestion}
          refreshTrigger={refreshTrigger}
        />

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
