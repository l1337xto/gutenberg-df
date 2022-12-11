import { AzureFunction, Context } from "@azure/functions"
var natural = require('natural');
var tokenizer = new natural.SentenceTokenizer();
var Analyzer = require('natural').SentimentAnalyzer;
var stemmer = require('natural').PorterStemmer;
var analyzer = new Analyzer("English", stemmer, "afinn");
const activityFunction: AzureFunction = async function (context: Context): Promise<string> {
    let arr:string[]=[];
    context.log(context.bindingData?.instanceId,":::SentimentAnalysis: Initializing processing.");
    var tokens = tokenizer.tokenize(context.bindings.name.bookContent);
    tokens.forEach((token:string)=>{
        const tokennn = token.replace(/[^a-zA-Z0-9 .!,?]/g, "");
        arr.push(tokennn, analyzer.getSentiment(tokennn.split(" ")));
    })
    context.log(context.bindingData?.instanceId,":::SentimentAnalysis: Completed processing.");
    return arr.toString();
};

export default activityFunction;
