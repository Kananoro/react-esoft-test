import { hashPassword } from "../src/services/user-service.js";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
	try {
		await prisma.task.deleteMany();
		await prisma.user.deleteMany();

		const password1 = await hashPassword("password1");
		const password2 = await hashPassword("password2");
		const password3 = await hashPassword("password3");

		const director = await prisma.user.create({
			data: {
				firstName: "Ivan",
				lastName: "Svetlakov",
				login: "kananoro",
				password: password1,
				role: "ADMIN",
			},
		});

		const user1 = await prisma.user.create({
			data: {
				firstName: "NeIvan",
				lastName: "NeSvetlakov",
				login: "nekananoro",
				password: password2,
				role: "USER",
				directorId: director.id,
			},
		});

		const user2 = await prisma.user.create({
			data: {
				firstName: "Pepe",
				lastName: "TheFrog",
				login: "pepe",
				password: password3,
				role: "USER",
				directorId: director.id,
			},
		});

		await prisma.task.create({
			data: {
				title: "TODO HIGH Task",
				description: "Example",
				dueDate: new Date("2024-09-09"),
				priority: "HIGH",
				status: "TODO",
				creator: {
					connect: { id: director.id },
				},
				responsible: {
					connect: { id: user1.id },
				},
			},
		});

		await prisma.task.create({
			data: {
				title: "In Progress LOW Task",
				description: "Example",
				dueDate: new Date("2024-04-23"),
				priority: "LOW",
				status: "IN_PROGRESS",
				creator: {
					connect: { id: user2.id },
				},
				responsible: {
					connect: { id: user2.id },
				},
			},
		});

		await prisma.task.create({
			data: {
				title: "DONE LOW Task",
				description: "Example",
				dueDate: new Date("2024-04-24"),
				priority: "LOW",
				status: "DONE",
				creator: {
					connect: { id: director.id },
				},
				responsible: {
					connect: { id: user2.id },
				},
			},
		});

		await prisma.task.create({
			data: {
				title: "DONE HIGH Task",
				description: "Example",
				dueDate: new Date("2024-09-09"),
				priority: "LOW",
				status: "DONE",
				creator: {
					connect: { id: director.id },
				},
				responsible: {
					connect: { id: user2.id },
				},
			},
		});

		await prisma.task.create({
			data: {
				title: "Expired Task",
				description: "Example",
				dueDate: new Date("2024-04-20"),
				priority: "LOW",
				status: "IN_PROGRESS",
				creator: {
					connect: { id: user2.id },
				},
				responsible: {
					connect: { id: user2.id },
				},
			},
		});
	} catch (error) {
		throw error;
	}
};

main().catch((err) => {
	console.warn("Error While generating Seed: \n", err);
});
