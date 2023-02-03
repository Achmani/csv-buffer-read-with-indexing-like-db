import { TransactionsSummaryHeader } from "./headers/transactions_summary_header";

let transactionsSummaryHeader = new TransactionsSummaryHeader();

async function binarySearchTree(start: number, end: number, searchTimestamp: number): Promise<number> {
    if (end - start == 1 || end - start == 0) {
        return new Promise(resolve => {
            resolve(end);
        });
    }

    let middle = Math.ceil((start + end) / 2);

    let timestamp: number = await transactionsSummaryHeader.getTimestamps(middle);

    if (timestamp < searchTimestamp) {
        return await binarySearchTree(start, middle, searchTimestamp)
    } else {
        return await binarySearchTree(middle, end, searchTimestamp)
    }
}

export async function callBinarySearchTree(start: number, end: number, searchTimestamp: number):Promise<number>{
    let row = await binarySearchTree(start, end, searchTimestamp);
    return row;
}

// callBinarySearchTree(0, getIndexing(process.env.FILEPATH_INDEXING_DATASOURCES!).maxLength, 1571966421);