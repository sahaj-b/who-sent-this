import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import {
  addEmailToExistingUser,
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
  .route("/add-email")
  .post(addEmailToExistingUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/me").get(verifyJWT, getUserInfo);
router.route("/me").patch(verifyJWT, changeUserSettings);

export default router;
