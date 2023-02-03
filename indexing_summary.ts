import { v4 } from 'uuid';
import * as dotenv from 'dotenv'
import * as fs from 'graceful-fs';
import { parse } from 'csv-parse';
import { errorCallback, getIndexing, move, successCallback } from './filesystem';
import { TransactionsSummaryHeader, indexesSummary, summary, transactionType } from './headers/transactions_summary_header';

dotenv.config()

interface transactionsRow {
    timestamps: number,
    transactionType: transactionType,
    token: string,
    nominal: number
}

export async function indexingSummary(filepath: string, filepathSummaryDatasources: string, filepathIndexingDatasources: string) {

    let indexing = getIndexing(filepathIndexingDatasources);

    const transactionsSummaryHeader = new TransactionsSummaryHeader();

    let startSummary = indexing.maxLength == 0 ? indexing.maxLength : (indexing.maxLength + 1) * transactionsSummaryHeader.getDataLength();

    const summaryDatasources = fs.createWriteStream(filepathSummaryDatasources, { mode: 0o600, start: startSummary, flags: 'a' });

    const indexingDatasources = fs.createWriteStream(filepathIndexingDatasources, { mode: 0o600 });

    let summary: summary = await getSummary(indexing, transactionsSummaryHeader);

    fs.createReadStream(filepath)
        .on('error', () => {
            throw Error("CSV is not found");
        })
        .pipe(parse({ fromLine: 2 }))
        .on('data', (row) => {
            processRow(row, summary, summaryDatasources, transactionsSummaryHeader);
            indexing.maxLength++;
        })
        .on('end', () => {
            indexingDatasources.write(JSON.stringify(indexing));
            move(filepath, './archive/' + v4() + '.csv', errorCallback, successCallback);
            console.log("Indexing Success");
        })
}


async function getSummary(indexing: indexesSummary, transactionsSummaryHeader: TransactionsSummaryHeader): Promise<summary> {
    if (indexing.maxLength > 0) {
        return await transactionsSummaryHeader.getData(indexing.maxLength);
    }
    return new Promise<summary>((resolve, reject) => {
        resolve({});
    });
}


function getDataRow(row: any): transactionsRow {
    let dataRow: transactionsRow = { timestamps: 0, transactionType: "DEPOSIT", token: "", nominal: 0 };
    try {
        dataRow.timestamps = parseInt(row[0]);
        dataRow.transactionType = row[1];
        dataRow.token = row[2];
        dataRow.nominal = parseFloat(row[3]);
        return dataRow;
    } catch (err) {
        throw Error("CSV is not suitable for transactions");
    }
}

function processRow(row: any, summary: summary, summaryDatasources: fs.WriteStream, transactionsSummaryHeader: TransactionsSummaryHeader) {
    let dataRow = getDataRow(row);

    if (summary[dataRow.token] == null) {
        summary[dataRow.token] = 0.0;
    }

    if (dataRow.transactionType == "WITHDRAWAL") {
        summary[dataRow.token] -= dataRow.nominal;
    } else if (dataRow.transactionType == "DEPOSIT") {
        summary[dataRow.token] += dataRow.nominal;
    }

    writeSummary(dataRow, summary, summaryDatasources, transactionsSummaryHeader);

}

function writeSummary(dataRow: transactionsRow, summary: summary, summaryDatasources: fs.WriteStream, transactionsSummaryHeader: TransactionsSummaryHeader) {
    let result = [];
    result[0] = transactionsSummaryHeader.timestamps.set(dataRow.timestamps);
    result[1] = transactionsSummaryHeader.summary.set(JSON.stringify(summary));
    let buf = Buffer.from(result.toString() + "\n");
    summaryDatasources.write(buf);
}

indexingSummary(process.env.FILEPATH!, process.env.FILEPATH_SUMMARY_DATASOURCES!, process.env.FILEPATH_INDEXING_DATASOURCES!);