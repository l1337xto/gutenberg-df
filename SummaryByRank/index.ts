
import { AzureFunction, Context } from "@azure/functions"
import SByRank from "../src/Interfaces/rank.interface";
const SummarizerManager = require("node-summarizer").SummarizerManager;

const activityFunction: AzureFunction = async function (context: Context): Promise<string> {
    context.log(context.bindingData?.instanceId,":::SummaryByRank: Initializing processing.")
    const book:string = context.bindingData.bookContent;
    let Summarizer = new SummarizerManager(book,369); 
    let rankClassifier:SByRank;
    await Summarizer.getSummaryByRank().then((body:SByRank)=>rankClassifier=body);
    return rankClassifier.summary;
};

export default activityFunction;
