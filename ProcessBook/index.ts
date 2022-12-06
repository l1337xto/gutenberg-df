import { AzureFunction, Context } from "@azure/functions"
import { CONSTANTS } from "../src/constants/constants";

const activityFunction: AzureFunction = async function (context: Context): Promise<string> {
    let book = context.bindingData.bookContent;
    book = processBook(book);
    return book;
};
function processBook(book):string{
    if(book){
        let _a:number = book.indexOf(CONSTANTS.START_OF_BOOK)
        let _b:number = book.indexOf(CONSTANTS.END_OF_BOOK);
        if(_a!==-1 && _b!==-1){
            const bookStart:number = book.indexOf("***", _a+1)+1
            if(bookStart>0){
                book = book.substring(bookStart,_b);
                // book = book.replaceAll('\n',' ');
                // book = book.replaceAll('/  +/g', '')
                return book;
            }
        }
    }
    return '';
}
export default activityFunction;
