import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import messageCooldown from "../middlewares/cooldown.middleware";
import {
  sendMessage,
  getMessages,
  deleteMessage,
  getMessageById,
  replyToMessage,
  postQuestion,
  getQuestions,
} from "../controllers/message.controller";

const router = Router();
router.use(verifyJWT);
router.route("/").post(messageCooldown, sendMessage);
router.route("/").get(getMessages);
router.route("/reply").post(messageCooldown, replyToMessage);
router.route("/questions").post(messageCooldown, postQuestion);
router.route("/questions").get(getQuestions);
router.route("/").delete(deleteMessage);
router.route("/:id").get(getMessageById);

export default router;
