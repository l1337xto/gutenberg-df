import * as df from "durable-functions"
import { CONSTANTS } from "../src/constants/constants";

const orchestrator = df.orchestrator(function* (context) {
    let exit:number=CONSTANTS.EXIT;
    let bookContent:string=undefined;
    let bookPath:string = yield context.df.callActivity(CONSTANTS.GetBookLocation);
    context.bindingData.bookPath=bookPath;
    while(exit && bookPath!==undefined){
        context.log(context.bindingData?.instanceId,`:::Found gutenberg book url at: ${bookPath}`)
        exit--;
        const book:string = yield context.df.callActivity(CONSTANTS.GetBookContent, context.bindingData);
        if(book === undefined) bookPath=book;
        else if(book === CONSTANTS.NEXT_BOOK){
            context.log(context.bindingData?.instanceId,":::Book found in incompatible language. Retrying next book->",exit)
            exit--;
            bookPath = yield context.df.callActivity(CONSTANTS.GetBookLocation);
            context.bindingData.bookPath = bookPath;
        } else {
            context.log(context.bindingData?.instanceId,":::Book found. Initializing processing.")
            bookContent=book;
            context.bindingData.bookContent=bookContent;
            break;
        }
    }
    if(bookContent!==undefined){
        bookContent = yield context.df.callActivity(CONSTANTS.ProcessBook, context.bindingData);
    }
    return bookContent;
});

export default orchestrator;
