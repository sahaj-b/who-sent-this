import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import {
  registerExistingUserWithEmail,
  registerUserWithEmailAndLogin,
  changeUserSettings,
  registerUserAnonymouslyAndLogin,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getUserInfo,
} from "../controllers/user.controller";

const router = Router();
router.route("/register-anonymous").post(registerUserAnonymouslyAndLogin);
router.route("/register-with-email").post(registerUserWithEmailAndLogin);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

// Secured routes
router
  .route("/register-existing-with-email")
  .post(registerExistingUserWithEmail);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/info").post(verifyJWT, getUserInfo);
router.route("/update-settings").post(verifyJWT, changeUserSettings);

export default router;
