import { TMessage } from "../types";
import { responseErrorHandler } from "../utils/errorHandler";

const url = "http://localhost:3000/api/messages";
export const sendMessage = async (
  text: string,
  recipientId: string,
  allowReply: boolean,
  replyToMsgId?: string,
) => {
  const res = await fetch(`${url}/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      recipientId,
      allowReply,
      replyToMsgId,
    }),
  });

  if (res.ok) {
    return await res.json().then((body) => body.data);
  } else {
    return await responseErrorHandler(res, "Send message");
  }
};

export const getMessages = async (): Promise<TMessage[] | void> => {
  const res = await fetch(`${url}/messages`, {
    method: "GET",
  });
  if (res.ok) {
    return await res.json().then((body) => body.data);
  } else {
    return await responseErrorHandler(res, "Get messages");
  }
};
