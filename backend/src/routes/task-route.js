import passport from "passport";
import { router } from "../app.js";
import { tasksMiddleware } from "../middleware/task.js";
import { changeTask, createTaskes } from "../controllers/task-controller.js";

router.get(
	"/",
	passport.authenticate("jwt", { session: false }),
	tasksMiddleware,
);

router.post(
	"/",
	passport.authenticate("jwt", { session: false }),
	createTaskes,
);

router.put(
	"/:taskId",
	passport.authenticate("jwt", { session: false }),
	changeTask,
);
export default router;
