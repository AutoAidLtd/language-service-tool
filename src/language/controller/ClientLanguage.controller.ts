import { NextFunction, Request, Response } from "express";
import { clientLangService } from "../service/clientLang.service";
import { success, error } from "../../core/common/ResponseWrapper";
import { ObjectId } from "mongoose";
import {Pagination} from "../../core/common/paging"
export interface IClientLanguageController {
  getAll: (req: Request, res: Response, next: NextFunction) => void;
  createLanguage: (req: Request, res: Response, next: NextFunction) => void;
  updateLanguage: (req: Request, res: Response, next: NextFunction) => void;
  deleteLanguage: (req: Request, res: Response, next: NextFunction) => void;
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
};
