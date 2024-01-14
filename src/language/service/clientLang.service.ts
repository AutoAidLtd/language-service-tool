import { ObjectId } from "mongoose";
import { ClientLanguage, ClientLanguageModel } from "../models";
import { Pagination } from "../../core/common/paging";
export const clientLangService = {
  create: async (record: ClientLanguage) => {
    const result = await ClientLanguageModel.create(record);
    return result;
  },
  getAll: async ({
    currentPage = 0,
    pageSize = 10,
    keyword = ""
  }: Pagination) => {
    console.log(currentPage);
    console.log(pageSize);
    
    const result = await ClientLanguageModel.find({
      // $text :{
      //   $search: keyword
      // }

    },
    {

    },{
      skip : currentPage * pageSize,
      limit: pageSize,
    });
    return result;
  },

  upsert: async (record: ClientLanguage) => {
    const result = await ClientLanguageModel.updateOne({}, record, {
      upsert: true,
    });
    return result;
  },
  delete: async (id: ObjectId) => {
    console.log(id);
    
    const result = await ClientLanguageModel.deleteOne({ _id: id });
    return result;
  },
  exportCsv : async(languages:string[])=>{
    const result = await ClientLanguageModel.find(); 
  },
  countAll :async()=>{
    return await ClientLanguageModel.count();
  }
};
