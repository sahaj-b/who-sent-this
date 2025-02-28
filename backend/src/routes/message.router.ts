import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import { sendMessage, getMessages } from "../controllers/message.controller";

const router = Router();
router.use(verifyJWT);
router.route("/").post(sendMessage);
router.route("/").get(getMessages);

export default router;
