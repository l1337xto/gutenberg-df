import { AzureFunction, Context } from "@azure/functions"
import { CONSTANTS } from "../src/constants/constants";
import agent from "../src/utilities/agent";

const activityFunction: AzureFunction = async function (context: Context): Promise<string> {
    const bookContent: string = await getBookContent(context.bindingData.bookPath, context)
    return bookContent;
};

async function getBookContent(path: string, context: Context): Promise<string> {
    context.log(context.bindingData?.instanceId, ":::GetBookContent:Started API fetch")
    let bookContent: string = undefined;
    await agent.requestHandler.bookContent(path)
        .then((body: string) => {
            context.log(context.bindingData?.instanceId, ":::GetBookContent:API fetch completed")
            const langIsEng: boolean = getLanguage(body, context)
            if (langIsEng === false) bookContent = CONSTANTS.NEXT_BOOK;
            else if(langIsEng===true) bookContent = body;
        })
        .catch((_error) => {
            context.log(context.bindingData?.instanceId, ":::GetBookContent:API fetch failed")
        }
        )
    return bookContent;
}
function getLanguage(book: string, context: Context): boolean {
    let langMatch:boolean = false;
    if (book) {
        const startIndexLang: number = book.indexOf(CONSTANTS.LANGUAGE)
        if (startIndexLang == -1) return false;
        const language: string = book.substring(
            startIndexLang + CONSTANTS.LANGUAGE_OFFSET,
            startIndexLang + CONSTANTS.LANGUAGE_OFFSET + CONSTANTS.ENGLISH_OFFSET
        );
        context.log(context.bindingData.instanceId, `:::Language for text:${language}`);
        if (language === CONSTANTS.ENGLISH) langMatch = true
        else langMatch = false;
    }
    return langMatch;
}
export default activityFunction;
