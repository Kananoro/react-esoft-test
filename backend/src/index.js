import dotenv from "dotenv";
import { jwtStrategy } from "./config/passport-jwt.js";
import { app } from "./app.js";
import authRoutes from "./routes/auth-route.js";
import taskRouter from "./routes/task-route.js";
import cors from "cors";
import passport from "passport";

dotenv.config();

const port = process.env.PORT || 3000;
app.use(passport.initialize());

app.use(cors());

passport.use("jwt", jwtStrategy);

app.get("/", function (req, res, next) {
	res.json({ message: "You are in" });
});

app.use("/auth", authRoutes);
app.use("/task", taskRouter);

app.listen(port, function () {
	console.log(`Servert start on http://localhost:${port}`);
});
