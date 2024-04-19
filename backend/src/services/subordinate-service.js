import { prisma } from "../config/prisma.js";

const subortinateByDirectorId = async (directorId) => {
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

const isResponsibleForSubordinate = async (directorId, subordinateId) => {
	const subordinate = await prisma.user.findUnique({
		where: {
			id: subordinateId,
			directorId: directorId,
		},
	});

	if (!subotdinate) {
		return false;
	}

	return true;
};
