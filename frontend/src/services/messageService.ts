import { TMessage } from "../types";
import { throwFormattedError } from "../utils/errorHandler";

const url = "http://localhost:3000/api";
export const getUserName = async (id: string) => {
  const res = await fetch(`${url}/users/${id}`, {
    credentials: "include",
  });
  if (res.ok) {
    return await res.json().then((body) => body.data?.name);
  } else if (res.status === 404) {
    return null;
  } else {
    return await throwFormattedError(res, `Getting user ${id}`);
  }
};

export const sendMessage = async (
  text: string,
  recipientId: string,
  allowReply: boolean,
  replyToMsgId?: string,
): Promise<TMessage | void> => {
  const res = await fetch(`${url}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
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
    return await throwFormattedError(res, "Send message");
  }
};

export const getMessages = async (): Promise<TMessage[] | void> => {
  const res = await fetch(`${url}/messages`, {
    method: "GET",
    credentials: "include",
  });
  if (res.ok) {
    return await res.json().then((body) => body.data);
  } else {
    return await throwFormattedError(res, "Get messages");
  }
};
