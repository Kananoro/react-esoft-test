import express from "express";
import { router } from "../app.js";
import passport from "passport";

router.get(
	"/",
	passport.authenticate("jwt", { session: false }),
	function (req, res, next) {
		res.json({ message: "You are in login" });
	},
);

export default router;
