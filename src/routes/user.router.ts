import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import {
  registerExistingUserWithEmail,
  registerUserWithEmail,
  registerUserAnonymously,
  changeUserSettings as updateUserSettings,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getUserInfo,
} from "../controllers/user.controller";

const router = Router();
router.route("/register-anonymous").post(registerUserAnonymously);
router.route("/register-with-email").post(registerUserWithEmail);

router
  .route("/register-existing-with-email")
  .post(registerExistingUserWithEmail);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/info").post(verifyJWT, getUserInfo);
router.route("/update-settings").post(verifyJWT, updateUserSettings);

export default router;
