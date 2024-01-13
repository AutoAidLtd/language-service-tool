import express, { NextFunction, Response, Request, json } from "express";
import { clientLangService } from "../language/service/clientLang.service";
import { CommonLanguageRoute } from "../language/route";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";
import { IndexRouter } from "../route";
const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ ok: true });
});
app.use("/api",IndexRouter);

export default app;
