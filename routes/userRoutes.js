import express from "express";
import {
	followUnFollowUser,
	getUserProfile,
	loginUser,
	logoutUser,
	signupUser,
	updateUser,
	getSuggestedUsers,
	freezeAccount,
	sendOtp
} from "../controllers/userController.js";

const router = express.Router();

router.post("/send-otp",sendOtp)
router.get("/profile/:query", getUserProfile);
router.get("/suggested", getSuggestedUsers);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", followUnFollowUser); // Toggle state(follow/unfollow)
router.put("/update/:id",  updateUser);
router.put("/freeze",  freezeAccount);

export default router;
