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
  deleteUser,
  userExists,
} from "../controllers/user.controller";

const router = Router();
router.route("/register-anonymous").post(registerUserAnonymouslyAndLogin);
router.route("/register-with-email").post(registerUserWithEmailAndLogin);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

// Secured routes
router.use(verifyJWT);
router.route("/add-email").post(addEmailToExistingUser);
router.route("/logout").post(logoutUser);
router.route("/me").get(getUserInfo);
router.route("/me").patch(changeUserSettings);
router.route("/me").delete(deleteUser);
router.route("/exists").get(userExists);

export default router;
