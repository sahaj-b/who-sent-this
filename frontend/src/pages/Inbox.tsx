import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import {
  ApiDeleteMessage,
  ApiGetMessageById,
  ApiGetMessages,
} from "../services/messageService";
import GridBox from "../components/GridBox";
import ShareURL from "../components/ShareURL";

export default function Inbox() {
  const { user } = useAuth();
  return (
    <>
      <Header />

      <div className="mx-4 flex flex-col items-center py-20">
        {user?.receivingPaused && (
          <div className="text-text/70 mb-10 text-center text-lg">
            You have paused receiving messages.{" "}
            <Link to="/settings" className="text-primary hover:underline">
              Change settings
            </Link>
          </div>
        )}

        <ShareURL
          url={user!.shortId}
          message="Share this link to receive messages"
        />

        <div className="h-16"></div>

        <GridBox
          heading="Inbox"
          ApiGetTexts={ApiGetMessages}
          ApiDeleteTextById={ApiDeleteMessage}
          ApiGetTextById={ApiGetMessageById}
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
