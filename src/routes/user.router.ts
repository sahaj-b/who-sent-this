import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import {
  registerExistingUserWithEmail,
  registerUserWithEmail,
  registerUserAnonymously,
  changeUserSettings,
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "../controllers/user.controller";

const router = Router();
router.route("/register-anonymous").post(registerUserAnonymously);
router.route("/register-with-email").post(registerUserWithEmail);

router
  .route("/register-existing-with-email")
  .post(registerExistingUserWithEmail);
router.route("/change-settings").post(changeUserSettings);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);

export default router;
