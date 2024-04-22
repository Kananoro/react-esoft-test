import { prisma } from "../config/prisma.js";
import { isResponsibleForSubordinate } from "./subordinate-service.js";

export const getAllTask = async () => {
	const allTask = await prisma.task.findMany({
		include: {
			creator: {
				select: {
					id: true,
					firstName: true,
					lastName: true,
					middleName: true,
					login: true,
					password: false,
				},
			},
			responsible: {
				select: {
					id: true,
					firstName: true,
					lastName: true,
					middleName: true,
					login: true,
					password: false,
				},
			},
		},
	});
	return allTask;
};

export const getTaskById = async (id) => {
	const Task = await prisma.task.findUnique({
		where: {
			id: Number(id),
		},
	});

	if (!Task) {
		throw new Error("Taks does not exist");
	}

	return Task;
};

export const createTask = async ({
	title,
	description,
	dueDate,
	priority,
	status,
	creatorId,
	responsibleId,
}) => {
	const isResponisble = await isResponsibleForSubordinate(
		creatorId,
		responsibleId,
	);

	let creator = creatorId;
	let responsible = responsibleId;

	if (!isResponisble) {
		if (responsibleId == creatorId) {
			responsible = creator;
		} else {
			throw new Error("Selected subordinate is not valid");
		}
	}

	const createTask = await prisma.task.create({
		data: {
			title: title,
			description: description,
			dueDate: dueDate,
			priority: priority,
			status: status,
			creator: {
				connect: {
					id: creator,
				},
			},
			responsible: {
				connect: {
					id: responsible,
				},
			},
		},
	});

	return createTask;
};

export const updateTask = async (id, updatedData) => {
	try {
		const updatedTask = await prisma.task.update({
			where: {
				id: Number(id),
			},
			data: updatedData,
		});

		return updatedTask;
	} catch (error) {
		throw new Error("Could not update task");
	}
};
