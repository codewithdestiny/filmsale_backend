import { Router } from "express";
import UserController from "./auth.controller.js";

const authRoutes = Router();

authRoutes.post("/api/v1/auth", UserController.registerUser);

authRoutes.post("/api/v1/auth/login", UserController.login);


authRoutes.post("/api/v1/auth/password/reset/init", UserController.resetPasswordInit);
authRoutes.get("/api/v1/auth/password/reset/new-form", UserController.resetPasswordForm);

export default authRoutes;