import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import { sendMessage, getMessages } from "../controllers/message.controller";

const router = Router();
router.use(verifyJWT);
router.route("/send").post(sendMessage);
router.route("/get").get(getMessages);

export default router;
