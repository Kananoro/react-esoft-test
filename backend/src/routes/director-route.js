import { router } from "../app.js";
import { checkRole } from "../middleware/role.js";
import { getSubordinatesOfDirector } from "../controllers/subordinate-controller.js";
import { authenticateToken } from "../middleware/auth-token.js";

router.get(
	"/subordinate",
	authenticateToken,
	checkRole,
	getSubordinatesOfDirector,
);

export default router;
