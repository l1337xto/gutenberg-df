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
    let summary:any=null;
    if(processedBook!==undefined){
        const SummaryByFrequency = context.df.callActivity(CONSTANTS.SummaryByFrequency, context.bindingData)
        const SummaryByRank = context.df.callActivity(CONSTANTS.SummaryByRank, context.bindingData);
        summary = yield context.df.Task.all([SummaryByFrequency, SummaryByRank])
    }
    return summary;
});

export default orchestrator;
