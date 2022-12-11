import * as df from "durable-functions"
import { CONSTANTS } from "../src/constants/constants";
const orchestrator = df.orchestrator(function* (context) {
    let bookPath:string = yield context.df.callActivity(CONSTANTS.GetBookLocation);
    if(bookPath===undefined) return `Could not find book in the directory or directory was empty!`
    context.bindingData.bookPath=bookPath;
    let book:string = yield context.df.callActivity(CONSTANTS.GetBookContent, context.bindingData);
    if(book === undefined) {
       return `Unable to read book.`;
    } else if(book === CONSTANTS.NEXT_BOOK){
        return `Book found in incompatible language.`;
    } else {
        context.bindingData.bookContent=book;
    }
    let processedBook = yield context.df.callActivity(CONSTANTS.ProcessBook, context.bindingData);
    context.bindingData.bookContent=processedBook;
    let uploadToCloud:any=null;
    if(processedBook!==undefined){
        let _a = context.df.callActivity(CONSTANTS.SummaryByFrequency, context.bindingData);
        let _b = context.df.callActivity(CONSTANTS.SentimentAnalysis, context.bindingData);
        context.bindingData.bookSummary = yield context.df.Task.all([_a, _b]);
        uploadToCloud = yield context.df.callActivity(CONSTANTS.SaveToDrive, context.bindingData);
    }
    return uploadToCloud;
});

export default orchestrator;
