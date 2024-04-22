import { Router } from "express";
import { getAllTaskes } from "../controllers/task-controller.js";

const router = Router();

export const tasksMiddleware = (req, res, next) => {
	return getAllTaskes(req, res, next);
};

export default router;
