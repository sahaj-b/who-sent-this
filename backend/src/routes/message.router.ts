import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import { sendMessage, getMessages } from "../controllers/message.controller";

const router = Router();
router.route("/send").post(verifyJWT, sendMessage);
router.route("/get").get(verifyJWT, getMessages);

export default router;
