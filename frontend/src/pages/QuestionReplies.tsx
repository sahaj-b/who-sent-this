import { Link, useParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import { ApiGetMessageById, ApiGetReplies } from "../services/messageService";
import MessagesGridBox from "../components/MessagesGridBox";
import { SecondaryButton } from "../components/Buttons";
import BigMessage from "../components/BigMessage";
import { useEffect, useState } from "react";
import { TMessage } from "../types";
import InvalidMessage from "../components/InvalidMessage";
import Loading from "./Loading";
import { toastifyAndThrowError } from "../utils/errorHandler";
import clampText from "../utils/clampText";

export default function QuestionReplies() {
  const { user } = useAuth();
  const { id: questionId } = useParams();
  const [question, setQuestion] = useState<TMessage | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    questionId
      ? ApiGetMessageById(questionId)
          .then((msg) => {
            setQuestion(msg!);
            setLoading(false);
          })
          .catch(toastifyAndThrowError)
      : setLoading(false);
  }, []);
  if (loading) return <Loading />;
  if (!question)
    return (
      <InvalidMessage text="Question is either deleted or doesn't exist" />
    );
  return (
    <>
      <Header />

      <div className="mx-4 flex flex-col items-center space-y-10 py-20">
        {user?.receivingPaused && (
          <div className="text-text/70 mb-10 text-center text-lg">
            You have paused receiving messages.{" "}
            <Link to="/settings" className="text-primary hover:underline">
              Change settings
            </Link>
          </div>
        )}

        <Link to="/questions">
          <SecondaryButton
            content={
              <span className="font-bold">
                Back to <span className="text-purple-300"> Questions</span>
              </span>
            }
          />
        </Link>

        <MessagesGridBox
          heading={
            <div className="flex flex-col justify-center space-x-2">
              <div className="text-text/90 mb-2 overflow-hidden font-[Funnel_Sans] text-xl font-bold overflow-ellipsis">
                <span className="text-primary mr-2 inline text-2xl">Q:</span>
                {clampText(question.text, 1)}
              </div>
              Replies
            </div>
          }
          getMessages={() => ApiGetReplies(questionId!)}
          emptyMessage="No Replies Received yet"
          BigMessage={BigMessage}
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
