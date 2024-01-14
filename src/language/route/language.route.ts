import express from "express";
import { LanguageController } from "../controller";
const ClientLanguageRoute = express.Router();
const basePath = "";
 ClientLanguageRoute;
 ClientLanguageRoute.get(basePath + "/types", LanguageController.getLanguageTypes);
 ClientLanguageRoute.get("/",(req,res,next)=>{
    res.send("Nice demo")
 })
 
export default ClientLanguageRoute;
