export const checkRole = (req, res, next) => {
	const user = req.user;
	if (user && user.role === "ADMIN") {
		return next();
	} else {
		return res.status(403).json({ message: "Access denied" });
	}
};
