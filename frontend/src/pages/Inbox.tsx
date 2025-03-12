import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import { ApiGetMessageById, ApiGetMessages } from "../services/messageService";
import MessagesGridBox from "../components/MessagesGridBox";
import ShareURL from "../components/ShareURL";
import { SecondaryButton } from "../components/Buttons";
import BigMessage from "../components/BigMessage";

export default function Inbox() {
  const { user } = useAuth();
  return (
    <>
      <Header />

      <div className="mx-4 flex flex-col space-y-10 items-center py-20">
        {user?.receivingPaused && (
          <div className="text-text/70 mb-10 text-center text-lg">
            You have paused receiving messages.{" "}
            <Link to="/settings" className="text-primary hover:underline">
              Change settings
            </Link>
          </div>
        )}
        <div className="w-[90%] max-w-md">
          <ShareURL
            url={user!.shortId}
            message="Share this link to receive messages"
          />
        </div>

        <Link to="/questions">
          <SecondaryButton
            content={
              <>
                <span className="font-bold">Create/View</span> your{" "}
                <span className="text-purple-300 font-bold"> Questions</span>
              </>
            }
          />
        </Link>

        <MessagesGridBox
          heading="Inbox"
          getMessages={ApiGetMessages}
          getMessageById={ApiGetMessageById}
          emptyMessage="No Messages Received yet"
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
