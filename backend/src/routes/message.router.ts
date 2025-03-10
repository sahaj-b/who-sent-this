import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import {
  sendMessage,
  getMessages,
  deleteMessage,
} from "../controllers/message.controller";

const router = Router();
router.use(verifyJWT);
router.route("/").post(sendMessage);
router.route("/").get(getMessages);
router.route("/").delete(deleteMessage);

export default router;
