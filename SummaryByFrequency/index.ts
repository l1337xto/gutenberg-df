import { AzureFunction, Context } from "@azure/functions"
import SByFreq from "../src/Interfaces/frequency.interface";
const SummarizerManager = require("node-summarizer").SummarizerManager;

const activityFunction: AzureFunction = async function (context: Context): Promise<string[]> {
    context.log(context.bindingData?.instanceId,":::SummaryByFrequency: Initializing processing.")
    const book:string = context.bindingData.bookContent;
    let Summarizer = new SummarizerManager(book,369); 
    const summary:SByFreq = Summarizer.getSummaryByFrequency();
    return summary.sorted_sentences;
};

export default activityFunction;
