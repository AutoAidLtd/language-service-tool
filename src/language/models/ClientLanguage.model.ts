import mongoose, { Types } from "mongoose";
import { ClientLanguageModel } from ".";

export type ClientLanguage = {
  key: string;
  value: {
    [locale: string]: string;
  };
  menu: string;
};
const clientLangSchema = new mongoose.Schema<ClientLanguage>(
  {
    key: {
      type: String,
      required: true,
    },
    menu: {
      type: String,
    },
    value: {},
  },
  {}
);
clientLangSchema.index({key: "text", menu: "text"})
const ClientLangModel = mongoose.model("ClientLanguage", clientLangSchema);
// ClientLangModel.createIndexes()
export default ClientLangModel;
