import { AzureFunction, Context } from "@azure/functions"
const path = require('path');
const fs = require('fs')
import axios from 'axios';

async function downloadImage(path_:string) {
    const url = 'https://storage.googleapis.com/gutenberg-analysis-uga/key.json'
    const writer = fs.createWriteStream(path_)
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    })
    response.data.pipe(writer)
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
    })
}

const activityFunction: AzureFunction = async function (context: Context): Promise<string> {
    try {
        context.log(context.bindingData?.instanceId,":::SaveCloudKey: Initializing processing.")
        const path_ = path.join(__dirname, './../src/key.json')
        if (fs.existsSync(path)) {
            // File exists in path
          } else {
            await downloadImage(path_);
        }
        context.log(context.bindingData?.instanceId,":::SaveCloudKey: Key downloaded.")
        return `SUCCESS`;
    } catch {
        return `FAILURE`;
    }
};
export default activityFunction;
