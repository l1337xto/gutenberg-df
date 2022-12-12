import { AzureFunction, Context } from "@azure/functions"
const path = require("path");
const {Storage} = require('@google-cloud/storage');
const stream = require('stream');
const gc = new Storage({
    keyFilename:  path.join(__dirname, "./../../key.json"),
    projectId: 'infinite-byte-310712' 
})
const bucket = gc.bucket('gutenberg-analysis-uga');

const activityFunction: AzureFunction = async function (context: Context): Promise<string> {
    context.log(context.bindingData?.instanceId,":::SaveToDrive: Initializing Saving to Cloud.")
    const bookPath:string = context.bindingData.bookPath;
    const fileName:string = bookPath.split("/").pop();
    const data = context.bindings.name.bookSummary.toString();
    const file = bucket.file(fileName+String(new Date().getTime()));
    const passthroughStream = new stream.PassThrough();
    passthroughStream.write(data);
    passthroughStream.end();
    await streamFileUpload(passthroughStream,file).catch((_err) => {});
    context.log(context.bindingData?.instanceId,":::SaveToDrive: Finished Saving to Cloud.")
    return `File ${fileName} uploaded to cloud.`;
};
async function streamFileUpload(passthroughStream, file) {
    passthroughStream.pipe(file.createWriteStream()).on('finish', () => {});
}
export default activityFunction;
