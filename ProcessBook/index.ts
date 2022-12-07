import { AzureFunction, Context } from "@azure/functions"
import { CONSTANTS } from "../src/constants/constants";

const activityFunction: AzureFunction = async function (context: Context): Promise<string> {
    var book: string = context.bindingData.bookContent;
    book = book.replace(/  +/g,'')
    return book.replace(/[^a-zA-Z0-9 .!,?]/g, '');
};
export default activityFunction;
