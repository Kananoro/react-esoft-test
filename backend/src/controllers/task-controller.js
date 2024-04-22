import { catchAsync } from "../utils/catch-async.js";
import {
	getAllTask,
	createTask,
	updateTask,
	getTaskById,
} from "../services/task-service.js";

export const getAllTaskes = catchAsync(async (req, res) => {
	const allTasks = await getAllTask();
	res.send(allTasks);
});

export const createTaskes = catchAsync(async (req, res) => {
	if (req.user) {
		const taskData = {
			title: req.body.title,
			description: req.body.description,
			dueDate: req.body.dueDate,
			priority: req.body.priority,
			status: req.body.status,
			creatorId: req.user.id,
			responsibleId: req.body.responsibleId,
		};
		const result = await createTask(taskData);
		res.send(result);
	} else {
		res.status(401).send("Unauthorized");
	}
});

export const changeTask = catchAsync(async (req, res) => {
	if (req.user) {
		const taskId = req.params.taskId;
		const { title, dueDate, responsibleId, description, status, priority } =
			req.body;
		const task = await getTaskById(taskId);
		if (req.user.role === "ADMIN" || req.user.id === task.creatorId) {
			task.title = title || task.title;
			task.description = description || task.description;
			task.dueDate = dueDate || task.dueDate;
			task.priority = priority || task.priority;
			task.status = status || task.status;
			task.responsibleId = responsibleId || task.responsibleId;
		} else {
			task.status = status || task.status;
		}

		const updatedTask = await updateTask(taskId, task);
		res.json(updatedTask);
	} else {
		res.status(401).send("Unathorized");
	}
});
