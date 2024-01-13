import { NextFunction, Request, Response } from "express";
import langType from "../utils/type.json";
import { success } from "../../core/common/ResponseWrapper";
// const langType
export interface LanguageController {
  getLanguageTypes: (req: Request, res: Response, next: NextFunction) => void;
}

export const LanguageController: LanguageController = {
  getLanguageTypes: async (req, res, next) => {
    if (langType) {
      res.json(
        success<typeof langType>({
          code: 200,
          data: langType,
          message: "",
        })
      );
    }
  },
};
