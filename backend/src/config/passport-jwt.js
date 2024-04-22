import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { config } from "./jwt.js";
import { prisma } from "./prisma.js";

export const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: config.jwt.secret,
};

export const jwtStrategy = new JwtStrategy(
	jwtOptions,
	async (jwtPayload, done) => {
		try {
			const user = await prisma.user.findUnique({
				where: {
					id: jwtPayload.id,
				},
			});

			if (!user) {
				return done(null, false);
			}

			done(null, { id: user.id, role: jwtPayload.role });
		} catch (error) {
			done(error, false);
		}
	},
);
