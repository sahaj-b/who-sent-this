import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import {
  addEmailToExistingUser,
  registerWithEmailAndLogin,
  changeUserSettings,
  registerAnonymouslyAndLogin,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getUserInfo,
  deleteUser,
  getUserNameById,
} from "../controllers/user.controller";

const router = Router();
router.route("/register-anonymous").post(registerAnonymouslyAndLogin);
router.route("/register-with-email").post(registerWithEmailAndLogin);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

// Secured routes
router.use(verifyJWT);
router.route("/add-email").post(addEmailToExistingUser);
router.route("/logout").post(logoutUser);
router.route("/me").get(getUserInfo);
router.route("/me").patch(changeUserSettings);
router.route("/me").delete(deleteUser);
router.route("/:shortId").get(getUserNameById);

export default router;
