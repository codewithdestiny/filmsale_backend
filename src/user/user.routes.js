import { Router } from "express";
import UserController from "../user/user.controller.js";
import verifyJwt from '../auth/verifyJwt.js';

const userRoutes = Router();

userRoutes.get("/api/v1/accounts",verifyJwt, UserController.fetchUsers);

userRoutes.get("/api/v1/accounts/me", verifyJwt, UserController.getMe);

userRoutes.get("/api/v1/accounts/:id",verifyJwt, UserController.getUserById);

userRoutes.put("/api/v1/accounts/purchasedFilm",verifyJwt, UserController.fetchUserAndPopulateFilm);

export default userRoutes;