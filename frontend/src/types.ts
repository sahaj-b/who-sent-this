export type TUser = {
  _id: string;
  shortId: string;
  name?: string;
  email?: string;
  receivingPaused: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type TMessage = {
  _id: string;
  text: string;
  sentBy?: string;
  receivedBy: string;
  allowReply: boolean;
  repliedToMessageId?: string;
  createdAt: Date;
  updatedAt: Date;
};
