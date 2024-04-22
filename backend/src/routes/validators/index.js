import * as yup from "yup";

export const loginSchema = yup.object({
	body: yup.object({
		login: yup.string().required(),
		password: yup.string().required(),
	}),
});

export const taskSchema = yup.object({
	body: yup.object({
		login: yup.string().required(),
		dueDate: yup.string().required(),
	}),
});
