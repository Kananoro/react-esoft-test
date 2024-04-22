import { prisma } from "../config/prisma.js";

export const subortinateByDirectorId = async (directorId) => {
	const directorExist = await prisma.user.findUnique({
		where: {
			id: directorId,
		},
	});

	if (!directorExist) {
		throw new Error("Director with this ID not found!");
	}

	const subordinates = await prisma.user.findMany({
		where: {
			directorId,
		},
		select: {
			id: true,
			login: true,
			firstName: true,
			lastName: true,
			middleName: true,
			role: true,
		},
	});

	return subordinates;
};

export const isResponsibleForSubordinate = async (
	directorId,
	subordinateId,
) => {
	const subordinate = await prisma.user.findUnique({
		where: {
			id: subordinateId,
			directorId: directorId,
		},
	});

	if (!subordinate) {
		return false;
	}

	return true;
};
