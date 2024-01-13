import {Router} from "express"
import { CommonLanguageRoute } from "../language/route";

const IndexRouter = Router();

IndexRouter.use("/demo",(req,res,next)=>{
    res.send("Oke")
})
IndexRouter.use("/",CommonLanguageRoute)


export {IndexRouter}