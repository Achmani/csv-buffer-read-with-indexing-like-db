import * as dotenv from 'dotenv'
import { getIndexing } from "./filesystem";
import { callBinarySearchTree } from "./binary_search_tree";
import { TransactionsSummaryHeader, summary } from './headers/transactions_summary_header';

dotenv.config();

async function getData(token: string, timestamp: string): Promise<summary> {
    let row = getIndexing(process.env.FILEPATH_INDEXING_DATASOURCES!).maxLength;
    let transactionsSummaryHeader = new TransactionsSummaryHeader();
    console.log(timestamp);
    if (timestamp != "") {
        row = await callBinarySearchTree(0, getIndexing(process.env.FILEPATH_INDEXING_DATASOURCES!).maxLength, parseInt(timestamp))
    }
    console.log("row");
    console.log(row);
    let result = await transactionsSummaryHeader.getData(row);
    console.log(result);
    return result;
}

getData(process.argv[2], process.argv[3]);

