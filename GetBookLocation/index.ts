import { AzureFunction, Context } from "@azure/functions"
import agent from "../src/utilities/agent";
import book from "../src/utilities/random-book.generator";
import IListing from "../src/Interfaces/directory-listing";
const parse = require('parse-apache-directory-index');

const activityFunction: AzureFunction = async function (context: Context): Promise<string> {
    let bookPath: string = undefined;
    bookPath = await getNextPath(context);
    return bookPath;
};

async function getNextPath(context: Context): Promise<string> {
    context.log(context.bindingData?.instanceId,":::GetBookLocation:Started API fetch")
    let bookLocation: string = undefined;
    await agent.requestHandler.directoryListings(book())
        .then((responseBody: string) => {
            context.log(context.bindingData?.instanceId,":::GetBookLocation:Started API fetch completed")
            let parsedResponse = parse(responseBody)
            if (parsedResponse && parsedResponse.files.length) {
                let foundFiles: IListing[] = getFileListings(parsedResponse);
                if (foundFiles && foundFiles.length) {
                    bookLocation = getBookFromFileListing(foundFiles);
                }
            }
        })
        .catch((_error) => {
            context.log(context.bindingData?.instanceId,":::GetBookLocation:API fetch failed")
        }
        )
    return bookLocation;
}
function getFileListings(parsedResponse): IListing[] {
    let foundFiles: IListing[] = [];
    parsedResponse.files.forEach((listing: IListing) => {
        if (listing.type === 'file') {
            foundFiles.push(listing)
        }
    })
    return foundFiles;
}
function getBookFromFileListing(foundFiles: IListing[]): string {
    let foundBook: string = undefined;
    foundFiles.some((file: IListing) => {
        let _fileName = file.name;
        if (_fileName && _fileName.split('.').at(-1) === 'txt' && file.size > 0 && file.path) {
            // context.log("File:", file.name, " at Path:", file.path, "\tSize:", file.size);
            foundBook = file.path
            return true;
        }
    })
    return foundBook;
}
export default activityFunction;
