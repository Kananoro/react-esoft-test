import express from "express";
import cors from "cors";

const app = express();

export const router = express.Router();

app.use(express.json());
app.use(cors());

export { app };
