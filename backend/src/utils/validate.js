export const validation = (schema) => async (req, res, next) => {
	try {
		await schema.validate(
			{
				body: req.body,
				query: req.query,
				params: req.params,
			},
			{
				aboutEarly: false,
			},
		);
		next();
	} catch (error) {
		return res.status(500).json({ type: error.name, message: error.errors });
	}
};
