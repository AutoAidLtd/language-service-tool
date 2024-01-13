import express from "express";
import { ClientLanguageController } from "../controller";
const ClientLanguageRoute = express.Router();
const basePath = "/client_language";
ClientLanguageRoute.get(basePath, ClientLanguageController.getAll);
ClientLanguageRoute.post(basePath, ClientLanguageController.createLanguage);
ClientLanguageRoute.put(basePath, ClientLanguageController.updateLanguage);
ClientLanguageRoute.delete(basePath, ClientLanguageController.deleteLanguage);
export default ClientLanguageRoute;
