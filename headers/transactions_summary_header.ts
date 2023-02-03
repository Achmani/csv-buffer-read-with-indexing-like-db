import * as dotenv from 'dotenv'
import { Numeric } from "../datatypes/numeric";
import { Varchar } from "../datatypes/varchar";
import { getStreamData } from '../filesystem';

dotenv.config();

export interface summary {
    [key: string]: number;
}

export interface indexesSummary {
    maxLength: number;
}

export interface row {
    [key: number]: summary;
}

export type transactionType = "WITHDRAWAL" | "DEPOSIT";

export class TransactionsSummaryHeader {

    private column = 2;

    private dataLength: number;

    public timestamps: Numeric;

    public summary: Varchar;

    private filepath = "";

    constructor() {
        this.timestamps = new Numeric(0, -1);
        this.summary = new Varchar(0, 255);
        this.filepath = process.env.FILEPATH_SUMMARY_DATASOURCES!;
        this.dataLength = this.timestamps.getLength() + this.summary.getLength() + this.column;
    }

    private constructTimestamps(chunk: string | Buffer): number {
        let timestamp: number = this.timestamps.get(chunk.slice(0, this.timestamps.getLength()).toString('utf-8'));
        return timestamp;
    }
    public async getTimestamps(row: number): Promise<number> {
        return this.constructTimestamps(await getStreamData(this.filepath, row, this.dataLength));
    }

    private constructData(chunk: string | Buffer): summary {
        let rawsummary: string = this.summary.get(chunk.slice(this.timestamps.getLength() + 1, this.summary.getLength()).toString('utf-8')) as string;
        let summary: summary = JSON.parse(rawsummary);
        return summary;
    }

    public async getData(row: number) {
        return this.constructData(await getStreamData(this.filepath, row, this.dataLength));
    }

    public getDataLength():number{
        return this.dataLength;
    }

}