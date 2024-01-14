import { NextFunction, Request, Response } from "express";
import { clientLangService } from "../service/clientLang.service";
import { success, error } from "../../core/common/ResponseWrapper";
import { ObjectId } from "mongoose";
import {Pagination} from "../../core/common/paging"
import {createObjectCsvWriter, } from "csv-writer"
import * as fs from "fs"
export interface IClientLanguageController {
  getAll: (req: Request, res: Response, next: NextFunction) => void;
  createLanguage: (req: Request, res: Response, next: NextFunction) => void;
  updateLanguage: (req: Request, res: Response, next: NextFunction) => void;
  deleteLanguage: (req: Request, res: Response, next: NextFunction) => void;
  exportLanguage: (req: Request, res: Response, next: NextFunction) => void;
  // writeCsvToFile:  (filename:any, data:any) => void;

}
export const ClientLanguageController: IClientLanguageController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    /** TODO: paging & filters */
    try {
      const pagination :Pagination = {
        currentPage: Number.parseInt(req.query?.page as string??"0"),
        pageSize: Number.parseInt(req.query?.pageSize as string??"10"),
        keyword: req.query?.keyword as string??""
      } 
      const listLang = await clientLangService.getAll(pagination);
      res.json(success({code:200, data: listLang, message: "Success"}));
    } catch (err: any) {
      res.json(
        error({
          code: 500,
          message: err.message,
        })
      );
    }
  },
  createLanguage: async (req: Request, res: Response, next: NextFunction) => {
    /** TODO: validate body */
    try {
      const payload = req.body;
      console.log(payload);
      
      const result = await clientLangService.create(payload);
      if (result) {
        res.json(success({code:200,data:result, message: "Create new language successfully"}));
      } else {
        res.json(
          error({
            code: 400,
            message: "Cannot insert right now",
          })
        );
      }
    } catch (err: any) {
      res.json(
        error({
          code: 500,
          message: err.message,
        })
      );
    }
  },
  updateLanguage: async (req: Request, res: Response, next: NextFunction) => {
    /** TODO: validate body */
    try {
      const payload = req.body;
      const result = await clientLangService.upsert(payload);
      if (result) {
        res.json(success);
      } else {
        res.json(
          error({
            code: 400,
            message: "Cannot update right now",
          })
        );
      }
    } catch (err: any) {
      res.json(
        error({
          code: 500,
          message: err.message,
        })
      );
    }
  },
  deleteLanguage: async (req: Request, res: Response, next: NextFunction) => {
    /** TODO: validate body */
    try {
      const { id } = req.query;
      if (!id) {
        res.json(error({ code: 400, message: "missing id" }));
        return;
      }
      const result = await clientLangService.delete( id as any);
      if (result) {
        res.json(success({code: 200, data: result,message: "Delete successfully"}));
      } else {
        res.json(
          error({
            code: 400,
            message: "Cannot delete right now",
          })
        );
      }
    } catch (err: any) {
      res.json(
        error({
          code: 500,
          message: err.message,
        })
      );
    }
  },
  exportLanguage: async (req:Request, res: Response, next: NextFunction)=>{
    console.log("???");
    
    const writeCsvToFile = async (filename:any, langs : string[] ,data:any[], ) => {
      const csvWriter = createObjectCsvWriter({
        path: filename,
        header: [{id: "key", title:"key"},{id: "menu", title:"menu"},...langs.map((l => ({id: l, title: l})))],
      });
      
      await csvWriter.writeRecords(data.map(persistedLang => ({
        key: persistedLang.key,
        menu: persistedLang?.menu ??"",
        ...langs.reduce((acc,cur)=>({...acc,[cur]: persistedLang?.value?.[cur]??""}),{}) ?? {}
      })));
    }
    const streamCsvToClient = (res:Response, filename:string) => {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    
      const stream = fs.createReadStream(filename);
      stream.pipe(res);
    
      stream.on('end', () => {
        fs.unlinkSync(filename); // Remove the file after streaming
      });
    };
    const langs = req?.query?.langs?.toString()?.split(",") ?? ["en", "vi", "ko", "zh", "jp","de","fr"]
    const fileName = req?.query?.fileName ?? "translation.csv";
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}.csv`);
    const allBatchesData = [];
    const totalCount = await clientLangService.countAll();
    const batchSize = 50; // Set your batch size
    const totalBatches = Math.ceil(totalCount / batchSize);
    for (let i = 0; i < totalBatches; i++) {
      const batchData = await clientLangService.getAll({currentPage: i, pageSize:batchSize })
      allBatchesData.push(...batchData);
    }
    await writeCsvToFile(fileName,langs ,allBatchesData);
    streamCsvToClient(res, fileName as string);
  }
};
