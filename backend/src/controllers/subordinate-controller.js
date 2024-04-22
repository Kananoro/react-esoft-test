import { subortinateByDirectorId } from "../services/subordinate-service.js";
import catchAsync from "../utils/catch-async.js";

export const getSubordinatesOfDirector = catchAsync(async (req, res) => {
	if (req.user) {
		const subordinates = await subortinateByDirectorId(req.user.id);
		res.json(subordinates);
	} else {
		res.status(401).send("Unathorized");
	}
});
