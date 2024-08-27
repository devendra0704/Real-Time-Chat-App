import express from "express";
import { signup,login,updateProfile, logout} from "../controllers/AuthController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import { getUserInfo } from "../controllers/AuthController.js";

const app=express();
const router=express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.get("/user-info",verifyToken, getUserInfo);
router.post("/update-profile",verifyToken,updateProfile);
// router.post("/add-profile-image",verifyToken,addProfileImage)
router.post("/logout",logout);


export default router;