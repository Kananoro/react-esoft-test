import { validation } from "../utils/validate.js";
import { loginSchema } from "./validators/index.js";
import { authLogin } from "../controllers/auth-controller.js";
import { authenticateToken } from "../middleware/auth-token.js";
import { router } from "../app.js";

router.get("/login", authenticateToken, function (req, res, next) {
	res.json({ message: "You are in login" });
});

router.post("/login", validation(loginSchema), authLogin);

router.get("/logout", function (req, res, nex) {
	res.json({ message: "Logout route" });
});

router.get("/protect", authenticateToken, (req, res) => {
	if (!req.user) return res.sendStatus(403);
	res.json({ user: req.user });
	next();
});

export default router;
